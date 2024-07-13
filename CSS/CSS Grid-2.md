<h2>목차</h2>

[그리드 컨테이너 정렬 속성](#-)

- [`justify-items`](#justify-items)
- [`align-items`](#align-items)
- [`place-items`](#place-items)
- [`justify-content`](#justify-content)
- [`align-content`](#align-content)
- [`place-content`](#place-content)

* [그리드 아이템 속성](#--1)
  - [`order`](#order)
  - [`z-index`](#z-index)
  - [`align-self`](#align-self)
  - [`justify-self`](#justify-self)
  - [`place-self`](#place-self)
* [암시적 그리드 속성](#--2)
  - [`grid-auto-rows`, `grid-auto-columns`,](#grid-auto-rows-grid-auto-columns)
  - [`grid-auto-flow`](#grid-auto-flow)
* [`repeat()` 함수 `auto-fill`과 `auto-fit`](#repeat-auto-fill-auto-fit)
  - [`auto-fill`](#auto-fill)
  - [`auto-fit`](#auto-fit)
* [flexbox vs grid](#flexbox-vs-grid)

# 그리드 컨테이너 정렬 속성

그리드 컨테이너에 지정하여 트랙을 정렬할 수 있는 속성이다.

## `justify-items`

그리드 아이템 내부 콘텐츠를 수평 축을 기준으로 정렬한다.

```
.container {
  display: grid;
  justify-items: start | end | center | stretch;
}
```

## `align-items`

그리드 아이템 내부 콘텐츠를 수직 축을 기준으로 정렬한다.

```
.container {
  display: grid;
  align-items: start | end | center | stretch;
}
```

## `place-items`

`align-items`와 `justify-items`의 단축 속성.
첫 번째 값은 `align-items` 속성 값이고 두 번째 값은 `justify-items` 속성 값이 되며 첫 번째 값만 지정되면 두 번째 값도 해당 값으로 지정된다.

```
/* 키워드 값 */
place-items: center auto;
place-items: normal start;

/* 위치 정렬 */
place-items: center normal;
place-items: start legacy;
place-items: end normal;
place-items: self-start legacy;
place-items: self-end normal;
place-items: flex-start legacy;
place-items: flex-end normal;

/* 기준선 정렬 */
place-items: baseline normal;
place-items: first baseline legacy;
place-items: last baseline normal;
place-items: stretch legacy;
```

## `justify-content`

그리드 트랙을 수평 축 기준으로 정렬한다.

```
.container {
  display: grid;
  justify-content: start | end | center | stretch | space-between | space-around | space-evenly;
}
```

## `align-content`

그리드 트랙을 수직 축 기준으로 정렬한다.

```
.container {
  display: grid;
  align-content : start | center | end | stretch | space-between | space-around | space-evenly;
}
```

## `place-content`

`align-content`, `justify-content` 의 단축 속성 첫 번째 값이 `align-content`이고 두 번째 값이 `justify-content`의 값이 된다. 첫 번째 값만 지정되면 두 번째 값도 해당 값으로 지정된다.

```
/* 위치 정렬 */
/* align-content 속성은 left 혹은 right 값을 사용하지 않습니다. */
place-content: center start;
place-content: start center;
place-content: end left;
place-content: flex-start center;
place-content: flex-end center;

/* 기준선 정렬 */
/* justify-content 속성은 기준선 값을 사용하지 않습니다.*/
place-content: baseline center;
place-content: first baseline space-evenly;
place-content: last baseline right;

/* 분산 정렬 */
place-content: space-between space-evenly;
place-content: space-around space-evenly;
place-content: space-evenly stretch;
place-content: stretch space-evenly;
```

# 그리드 아이템 속성

개별 그리드 아이템에 지정하여 위치를 정렬할 수 있는 속성이다.

## `order`

플렉스 또는 그리드 컨테이너 안에서 현재 요소의 배치 순서를 지정한다. 기본값은 0이며, 숫자가 작을수록 앞쪽에 클수록 뒤쪽에 배치되고, 같은 값일 경우 소스 코드의 순서대로 정렬된다.

## `z-index`

그리드 아이템의 쌓임 순서를 지정한다.

## `align-self`

단일 그리드 아이템을 수직(열 축) 정렬.
열 축을 따라 그리드 아이템 내부 콘텐츠를 정렬한다.

```
.item {
    align-self: start | center | end | stretch;
    }
```

## `justify-self`

단일 그리드 아이템을 수평(행 축) 정렬한다.
행 축을 따라 그리드 아이템 내부 콘텐츠를 정렬한다.

```
.item {
    justify-self: start | center | end | stretch;
    }
```

## `place-self`

`align-self`, `justify-self`의 단축 속성. 나열된 순서로 값을 지정하고 두 번째 값을 생략하면 첫 번째 값이 두 속성에 모두 할당된다.

```
/* 키워드 값 */
place-self: auto center;
place-self: normal start;

/* 위치 정렬 */
place-self: center normal;
place-self: start auto;
place-self: end normal;
place-self: self-start auto;
place-self: self-end normal;
place-self: flex-start auto;
place-self: flex-end normal;

/* 기준선 정렬 */
place-self: baseline normal;
place-self: first baseline auto;
place-self: last baseline normal;
place-self: stretch auto;
```

# 암시적 그리드 속성

<!-- 사용 예 추가 -->

## `grid-auto-rows`, `grid-auto-columns`,

암시적으로 추가되는 행, 열의 크기를 설정할 수 있다.

## `grid-auto-flow`

명시적 그리드 셀을 초과하여 암시적으로 추가되는 새 요소가 어디로 추가될 지(행, 열) 설정할 수 있다. 기본 값은 `row`이다.

```
.container {
  display: grid;
  grid-template-columns: repeat(4, 15%);
  grid-template-rows: [row-1]100px [row-2] minmax(15%, 25%) [row-3] 100px;
  grid-template-areas:
    "header header header header"
    "side side main main"
    "footer footer footer footer";
  grid-auto-flow: column;
}
```

`dense`를 추가 값으로 사용할 수도 있는데 이는 작은 항목이 나중에 나오면 그리드의 공백을 빈 곳 없이 채운다. 즉, 더 큰 항목에 의해 남겨진 구멍을 채우게 된다. 이런 경우 항목이 순서 없이 나타날 수 있으므로 주의.

```
.container {
  display: grid;
  grid-auto-flow: row | column | row dense | column dense;
}
```

# `repeat()` 함수 `auto-fill`과 `auto-fit`

행 또는 열에 표시될 아이템 개수를 알 수 없을 때 사용하여 최대한 많은 개수로 채우거나, 너비로 채우는 속성이다.

`repeat()` 함수와 같이 사용하며, 행/열과 아이템(Item) 개수가 명확할 필요가 없거나 명확하지 않은 경우 유용하다.(반응형 그리드)

## `auto-fill`

현재 행을 최대한 많은 항목으로 채운 다음 줄바꿈 하도록 설정한다.

다음 예시 코드의 경우 `grid-template-columns: repeat(auto-fill, 15%);`으로 설정하여 15% 너비의 셀 6개가 열로 설정된다

```
.container {
  display: grid;
  min-width: 360px;
  grid-template-columns: repeat(auto-fill, 15%);
  grid-template-rows: [row-1]110px [row-2] minmax(15%, 45%) [row-3] 100px;
  gap: 5px;
  grid-template-areas:
    "header header header header"
    "side side main main"
    "footer footer footer footer";

  grid-auto-rows: 100px;
}
```

## `auto-fit`

<!-- 수정 필요 -->

맞춤(fit)은 채움과 유사하게 작동하지만, 그리드 내부에 빈 트랙이 존재할 경우 반복 횟수만큼 반복된 트랙(셀)을 빈 트랙 공간을 나눠 핏팅(fitting)한다.

```
.container {
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(80px, auto));
}
```

**[auto-fill, auto-fit]**

https://www.heropy.dev/p/c6ROLZ#h3_autofill_autofit

**[grid]**

https://uxkm.io/publishing/css/04-cssAdvanced/05-css_grid_part1#gsc.tab=0

# flexbox vs grid

요소를 행으로만, 혹은 열로만 나란히 배치할 땐 `flexbox`가 적절할 수 있고, 행, 열을 모두 사용해 좀 더 세밀하게 배치하고자 한다면 `grid`가 적절할 수 있다.
