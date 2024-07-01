import { main } from "@popperjs/core";
import {
  App,
  normalizePath, Notice, WorkspaceLeaf
} from "obsidian";
import { DEVICE } from "src/Constants";
import ExcalidrawPlugin from "../main";
import { checkAndCreateFolder, splitFolderAndFilename } from "./FileUtils";
import { isALT, isCTRL, isMETA, isSHIFT, KeyEvent, linkClickModifierType, ModifierKeys } from "./ModifierkeyHelper";

export const getParentOfClass = (element: HTMLElement, cssClass: string):HTMLElement | null => {
  let parent = element.parentElement;
  while (
    parent &&
    !(parent instanceof window.HTMLBodyElement) &&
    !parent.classList.contains(cssClass)
  ) {
    parent = parent.parentElement;
  }
  return parent?.classList?.contains(cssClass) ? parent : null;
};



export const getLeaf = (
  plugin: ExcalidrawPlugin,
  origo: WorkspaceLeaf,
  ev: ModifierKeys
) => {
  const newTab = ():WorkspaceLeaf => {
    if(!plugin.settings.openInMainWorkspace) return app.workspace.getLeaf('tab');
    const [leafLoc, mainLeavesIds] = getLeafLoc(origo);
    if(leafLoc === 'main') return app.workspace.getLeaf('tab');
    return getNewOrAdjacentLeaf(plugin,origo);
  }
  const newTabGroup = ():WorkspaceLeaf => getNewOrAdjacentLeaf(plugin,origo);
  const newWindow = ():WorkspaceLeaf => app.workspace.openPopoutLeaf();

  switch(linkClickModifierType(ev)) {
    case "active-pane": return origo;
    case "new-tab": return newTab();
    case "new-pane": return newTabGroup();
    case "popout-window": return newWindow();
    default: return newTab();
  }
}

const getLeafLoc = (leaf: WorkspaceLeaf): ["main" | "popout" | "left" | "right" | "hover",any] => {
  //@ts-ignore
  const leafId = leaf.id;
  const layout = app.workspace.getLayout();
  const getLeaves = (l:any)=> l.children
    .filter((c:any)=>c.type!=="leaf")
    .map((c:any)=>getLeaves(c))
    .flat()
    .concat(l.children.filter((c:any)=>c.type==="leaf").map((c:any)=>c.id))
  
  const mainLeavesIds = getLeaves(layout.main);

  return [
    layout.main && mainLeavesIds.contains(leafId)
    ? "main"
    : layout.floating && getLeaves(layout.floating).contains(leafId)
      ? "popout"
      : layout.left && getLeaves(layout.left).contains(leafId)
        ? "left"
        : layout.right && getLeaves(layout.right).contains(leafId)
          ? "right"
          : "hover",
     mainLeavesIds
  ];
}

/*
| Setting                 |                                       Originating Leaf                                                       |
|                         | Main Workspace                   | Hover Editor                           | Popout Window                    |
| ----------------------- | -------------------------------- | -------------------------------------- | -------------------------------- |
| InMain  && InAdjacent   | 1.1 Reuse Leaf in Main Workspace | 1.1 Reuse Leaf in Main Workspace       | 1.1 Reuse Leaf in Main Workspace |
| InMain  && !InAdjacent  | 1.2 New Leaf in Main Workspace   | 1.2 New Leaf in Main Workspace         | 1.2 New Leaf in Main Workspace   |
| !InMain && InAdjacent   | 1.1 Reuse Leaf in Main Workspace | 3   Reuse Leaf in Current Hover Editor | 4   Reuse Leaf in Current Popout |
| !InMain && !InAdjacent  | 1.2 New Leaf in Main Workspace   | 2   New Leaf in Current Hover Editor   | 2   New Leaf in Current Popout   |
*/
export const getNewOrAdjacentLeaf = (
  plugin: ExcalidrawPlugin,
  leaf: WorkspaceLeaf
): WorkspaceLeaf => {
  const [leafLoc, mainLeavesIds] = getLeafLoc(leaf);

  const getMainLeaf = ():WorkspaceLeaf => {
    let mainLeaf = app.workspace.getMostRecentLeaf();
    if(mainLeaf && mainLeaf !== leaf && mainLeaf.view?.containerEl.ownerDocument === document) {
      return mainLeaf;
    }
    mainLeaf = null;
    mainLeavesIds
      .forEach((id:any)=> {
        const l = app.workspace.getLeafById(id);
        if(mainLeaf ||
          !l.view?.navigation || 
          leaf === l
        ) return;
        mainLeaf = l;
    })
    return mainLeaf;
  }

  //1
  if(plugin.settings.openInMainWorkspace || ["main","left","right"].contains(leafLoc)) {
    //1.1
    if(!plugin.settings.openInAdjacentPane) {
      if(leafLoc === "main") {
        return app.workspace.createLeafBySplit(leaf);
      }
      const ml = getMainLeaf();
      return ml
        ? (ml.view.getViewType() === "empty" ? ml : app.workspace.createLeafBySplit(ml))
        : app.workspace.getLeaf(true);
    }

    //1.2
    const ml = getMainLeaf();
    return ml ?? app.workspace.getLeaf(true);
  }

  //2
  if(!plugin.settings.openInAdjacentPane) {
    return app.workspace.createLeafBySplit(leaf);
  }

  //3
  if(leafLoc === "hover") {
    const leaves = new Set<WorkspaceLeaf>();
    app.workspace.iterateAllLeaves(l=>{
      //@ts-ignore
      if(l!==leaf && leaf.containerEl.parentElement === l.containerEl.parentElement) leaves.add(l);
    })
    if(leaves.size === 0) {
      return plugin.app.workspace.createLeafBySplit(leaf);      
    }
    return Array.from(leaves)[0];  
  }

  //4
  if(leafLoc === "popout") {
    const popoutLeaves = new Set<WorkspaceLeaf>();  
    app.workspace.iterateAllLeaves(l=>{
      if(l !== leaf && l.view.navigation && l.view.containerEl.ownerDocument === leaf.view.containerEl.ownerDocument) {
        popoutLeaves.add(l);
      }
    });
    if(popoutLeaves.size === 0) {
      return app.workspace.createLeafBySplit(leaf);
    }
    return Array.from(popoutLeaves)[0];
  }

  return plugin.app.workspace.createLeafBySplit(leaf);
};

export const getAttachmentsFolderAndFilePath = async (
  app: App,
  activeViewFilePath: string,
  newFileName: string
): Promise<{ folder: string; filepath: string; }> => {
  let folder = app.vault.getConfig("attachmentFolderPath");
  // folder == null: save to vault root
  // folder == "./" save to same folder as current file
  // folder == "folder" save to specific folder in vault
  // folder == "./folder" save to specific subfolder of current active folder
  if (folder && folder.startsWith("./")) {
    // folder relative to current file
    const activeFileFolder = `${splitFolderAndFilename(activeViewFilePath).folderpath}/`;
    folder = normalizePath(activeFileFolder + folder.substring(2));
  }
  if (!folder || folder === "/") {
    folder = "";
  }
  await checkAndCreateFolder(folder);
  return {
    folder,
    filepath: normalizePath(
      folder === "" ? newFileName : `${folder}/${newFileName}`
    ),
  };
};

export const isObsidianThemeDark = () => document.body.classList.contains("theme-dark");
