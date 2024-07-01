import { DataURL } from "@zsviczian/excalidraw/types/types";
import { loadPdfJs, normalizePath, Notice, requestUrl, RequestUrlResponse, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import { URLFETCHTIMEOUT } from "src/Constants";
import { MimeType } from "src/EmbeddedFileLoader";
import { ExcalidrawSettings } from "src/settings";
import { errorlog, getDataURL } from "./Utils";

/**
 * Splits a full path including a folderpath and a filename into separate folderpath and filename components
 * @param filepath
 */

export function splitFolderAndFilename(filepath: string): {
  folderpath: string;
  filename: string;
  basename: string;
} {
  const lastIndex = filepath.lastIndexOf("/");
  const filename = lastIndex == -1 ? filepath : filepath.substring(lastIndex + 1);
  return {
    folderpath: normalizePath(filepath.substring(0, lastIndex)),
    filename,
    basename: filename.replace(/\.[^/.]+$/, ""),
  };
}

/**
 * Download data as file from Obsidian, to store on local device
 * @param encoding
 * @param data
 * @param filename
 */
 export const download = (encoding: string, data: any, filename: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", (encoding ? `${encoding},` : "") + data);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Generates the image filename based on the excalidraw filename
 * @param excalidrawPath - Full filepath of ExclidrawFile
 * @param newExtension - extension of IMG file in ".extension" format
 * @returns
 */
/*export function getIMGPathFromExcalidrawFile(
  excalidrawPath: string,
  newExtension: string,
): string {
  const isLegacyFile: boolean = excalidrawPath.endsWith(".excalidraw");
  const replaceExtension: string = isLegacyFile ? ".excalidraw" : ".md";
  return (
    excalidrawPath.substring(0, excalidrawPath.lastIndexOf(replaceExtension)) +
    newExtension
  );
}*/

/**
 * Generates the image filename based on the excalidraw filename
 * @param path - path to the excalidraw file
 * @param extension - extension without the preceeding "."
 * @returns 
 */
export function getIMGFilename(path: string, extension: string): string {
  return `${path.substring(0, path.lastIndexOf("."))}.${extension}`;
}

/**
 * Create new file, if file already exists find first unique filename by adding a number to the end of the filename
 * @param filename
 * @param folderpath
 * @returns
 */
export function getNewUniqueFilepath(
  vault: Vault,
  filename: string,
  folderpath: string,
): string {
  let fname = normalizePath(`${folderpath}/${filename}`);
  let file: TAbstractFile = vault.getAbstractFileByPath(fname);
  let i = 0;
  const extension = filename.endsWith(".excalidraw.md")
    ? ".excalidraw.md"
    : filename.slice(filename.lastIndexOf("."));
  while (file) {
    fname = normalizePath(
      `${folderpath}/${filename.slice(
        0,
        filename.lastIndexOf(extension),
      )}_${i}${extension}`,
    );
    i++;
    file = vault.getAbstractFileByPath(fname);
  }
  return fname;
}

export function getDrawingFilename(settings: ExcalidrawSettings): string {
  return (
    settings.drawingFilenamePrefix +
    (settings.drawingFilenameDateTime !== ""
      ? window.moment().format(settings.drawingFilenameDateTime)
      : "") +
    (settings.compatibilityMode
      ? ".excalidraw"
      : settings.useExcalidrawExtension
      ? ".excalidraw.md"
      : ".md")
  );
}

export function getEmbedFilename(
  notename: string,
  settings: ExcalidrawSettings,
): string {
  return (
    (settings.drawingEmbedPrefixWithFilename ? notename : "") +
    settings.drawingFilnameEmbedPostfix +
    (settings.drawingFilenameDateTime !== ""
      ? window.moment().format(settings.drawingFilenameDateTime)
      : "") +
    (settings.compatibilityMode
      ? ".excalidraw"
      : settings.useExcalidrawExtension
      ? ".excalidraw.md"
      : ".md")
  );
}

/**
 * Open or create a folderpath if it does not exist
 * @param folderpath
 */
export async function checkAndCreateFolder(folderpath: string) {
  const vault = app.vault;
  folderpath = normalizePath(folderpath);
  //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/658
  //@ts-ignore
  const folder = vault.getAbstractFileByPathInsensitive(folderpath);
  if (folder && folder instanceof TFolder) {
    return;
  }
  if (folder && folder instanceof TFile) {
    new Notice(`The folder cannot be created because it already exists as a file: ${folderpath}.`)
  }
  await vault.createFolder(folderpath);
}

export const getURLImageExtension = (url: string):string => {
  const corelink = url.split("?")[0];
  return corelink.substring(corelink.lastIndexOf(".")+1);
} 

export const getMimeType = (extension: string):MimeType => {
  switch (extension) {
    case "png":  return "image/png";
    case "jpeg": return "image/jpeg";
    case "jpg":  return "image/jpeg";
    case "gif":  return "image/gif";
    case "webp": return "image/webp";
    case "bmp":  return "image/bmp";
    case "ico":  return "image/x-icon";
    case "svg":  return "image/svg+xml"; 
    case "md":   return "image/svg+xml";
    default:     return "application/octet-stream";
  }
}

const getFileFromURL = async (url: string, mimeType: MimeType, timeout: number = URLFETCHTIMEOUT):Promise<RequestUrlResponse> => {
  try {
    return await Promise.race([
      (async () => new Promise<RequestUrlResponse>((resolve) => setTimeout(()=>resolve(null), timeout)))(),
      requestUrl({url: url, method: "get", contentType: mimeType, throw: false })
    ])
  } catch (e) {
    errorlog({where: getFileFromURL, message: `URL did not load within timeout period of ${timeout}ms`, url: url});
    return undefined;
  }
}

export const getDataURLFromURL = async (url: string, mimeType: MimeType, timeout: number = URLFETCHTIMEOUT):Promise<DataURL> => {
  const response = await getFileFromURL(url, mimeType, timeout);
  return response && response.status === 200
    ? await getDataURL(response.arrayBuffer, mimeType)
    : url as DataURL;
}

export const blobToBase64 = async (blob: Blob): Promise<string> => {
  const arrayBuffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  var binary = '';
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const getPDFDoc = async (f: TFile): Promise<any> => {
  //@ts-ignore
  if(typeof window.pdfjsLib === "undefined") await loadPdfJs();
  //@ts-ignore
  return await window.pdfjsLib.getDocument(app.vault.getResourcePath(f)).promise;
}