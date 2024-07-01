# 循环

`for(int i = a; i < b; i++)`：范围是 $[a, b - 1]$，总数是 $b-a$。

`for(int i = a; i <= b; i++)`：范围是 $[a, b]$，总数是 $b - a + 1$。

## 数组

Arrays.sort() 返回值为 void

```Java
// 索引位置左闭右开
int[] arr = new int[]{1, 3, 4, -1};
Arrays.sort(arr, 0, 5);
```

`Arrays.sort()` 实现 `Comparator` 接口

```Java
Arrays.sort(arr2, new Comparator<int[]>() {
	@Override
	public int compare(int[] o1, int[] o2) {
		return o1[0] - o2[0];
	}
});
```

Lambda 表达式，形参类型确定，实现方法体中只有一句话，但是不能这样返回，如果 o1[0] - o2[0] < Integer.MIN_VALUE ？越界异常，排序就会异常。

```Java
Arrays.sort(arr2, (o1,o2) -> o1[0] - o2[0]);
```

这样写就可以了

```Java
Arrays.sort(arr2, (o1,o2) -> Integer.compare(o1[0], o2[0]));
```

## 字符串

`charAt()`

`toCharArray()`

`equals()`

`substring()`

### StringBuffer/StringBuilder

`append()`

`delete(int start, int end)` （左闭右开）

`deleteCharAt(int index)`

`insert()`

`setCharAt(int index)`

## List

toArray() 方法，但是要注意，int 不能作为泛型，int[] 可以作为泛型

```java
List.toArray(T[] t);
```



数组转成 List 集合，引用类型是 List

```java
List<Integer> list = Arrays.asList(Integer... t)
```

## Character

常用方法：
- `Character.isLowerCase(char ch)`
- `Character.isUpperCase(char ch)`
- `Character.isLetter(char ch)`
- `Character.isDigit(char ch)`
- `Character.toLowerCase(char ch)`
- `Character.toUpperCase(char ch)`

## 边界条件

数组里面取最大值要初始化为 `Integer.MIN_VALUE`。

易错点：整形包装类用 `equals()` 比较大小
```java
@Test
public void testInteger() {
    Integer a = 100000;
    Integer b = 100000;
    System.out.println(a == b); // false
    System.out.println(a.equals(b)); // true
}
```

对 `(int) (1e9 + 7)` 取模的数组都定义为 `long`，防止数值越界。