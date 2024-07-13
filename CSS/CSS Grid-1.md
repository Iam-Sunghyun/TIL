<h2>목차</h2>

- [`Grid`란?](#grid)
- [열과 행 정의하기](#-)
  - [`fr`(fraction) 단위를 사용한 가변 그리드](#frfraction-)
  - [`repeat()` 함수로 행과 열 반복하기](#repeat-)
  - [`minmax()` 함수로 최소, 최대 값 설정하기](#minmax-)
- [`fit-content()`로 셀(트랙) 크기 설정하기](#fit-content-)
- [그리드 아이템 여러 셀에 표시되게 하기](#--1)
  - [`span` 키워드로 차지할 셀 명시하기](#span-)
- [줄 번호 이름 명명하기](#--2)
  - [`repeat()` 함수와 함께 이름 줄 번호 명명하기](#repeat--1)
  - [암시적 그리드, 명시적 그리드](#--3)
- [행과 열 사이 간격 설정](#--4)

# `Grid`란?

테이블과 마찬가지로 **행과 열을 기준으로 요소를 배치하는 레이아웃 구성 방식이다.** 하지만 테이블과 달리 그리드는 다양한 레이아웃을 더 유연하고 간단하게 구현할 수 있다.

하나의 **그리드는 `rows`, `columns`으로 구성되며,** 각 행과 열 사이에 공백이 있는데, 이를 일컬어 gutters라고 부른다.

**`grid`는 `display` 속성에 `grid` 값을 사용해 지정한다.** 이로써 `Flexbox`와 마찬가지로 그리드 레이아웃으로 전환하며, 컨테이너의 **직계 자식** 전체가 그리드 아이템이 된다.

# 열과 행 정의하기

그리드 컨테이너에 `grid-template-columns` 또는 `grid-template-rows`을 사용하여 열과 행을 생성할 수 있으며 플렉스 박스와 다르게 지정 즉시 레이아웃의 변화가 일어나지 않아 보일 수 있다.

변화를 주려면 그리드에 행 혹은 열을 추가해야 된다(기본 값은 하나의 열, 자식 요소만큼 행 생성). `<length>`, `<percentage>`, `fr` 단위를 사용해 행과 열을 생성해줄 수 있다. 또한 `auto` 값을 사용할 수도 있는데 이는 콘텐츠가 차지하는 공간만큼 혹은 남은 공간만큼(마지막 행,열) 행 혹은 열이 차지하여 생성된다.

다음 예시는 3개의 열을 생성하고 각각 `200px`, `100px`, 그리드 컨테이너의 `20%`로 설정한 예시이다.

```
.container {
  display: grid;
  grid-template-columns: 200px 100px 20%;
}
```

## `fr`(fraction) 단위를 사용한 가변 그리드

`<length>`나 `<percentage>`를 사용하는 것 외에 `fr`이란 단위를 사용해 그리드의 행과 열 크기를 조정할 수 있다. `fr`은 그리드 컨테이너 내에 그리드 아이템이 차지하는 비율을 설정한다.

```
// 그리드 아이템 열 2:1:1 비율로 배치
.container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
}
```

`fr` 단위와 나머지 단위를 혼합하여 사용할 수 있는데 이때 그리드 컨테이너 너비에서 지정한 모든 너비 만큼 제외한 공간에서 비율이 설정된다.

## `min-content`, `max-content`

- `min-content` : 그리드 아이템이 포함하는 내용(Contents)의 최소 크기를 의미한다.
  콘텐츠에 한글을 사용할 경우 단어가 묶여있어 아이템의 영역을 벗어날 때는 `word-break: keep-all;`을 선언하여 단어를 쪼개 줄바꿈 할 수 있게 설정하면 정상적으로 작동한다.

- `max-content` : 그리드 아이템이 포함하는 내용(Contents)의 최대 크기를 의미한다.

```

<style>
  .container {
    display: grid;
    grid-template-columns: min-content 1fr;
  }
</style>

<div class="container">
  <div class="item">내용의 최소 크기</div>
  <!-- ··· -->
</div>
------------------------------

.container {
  display: grid;
  grid-template-columns: max-content 1fr;
}

/*
  그리드 함수들과 같이 더 유용하게 활용할 수 있다.
  다음 예제는 총 3컬럼 그리드를 생성하며 각 열(Track)은 최대 1fr 크기를 가지지만,
  max-content를 통해 포함된 그리드 아이템의 내용보다 작아질 수 없다.
*/
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(max-content, 1fr));
}
```

## `repeat()` 함수로 행과 열 반복하기

CSS `repeat(반복 횟수, 패턴)` 함수로 행이나 열을 동일한 크기로 여러 개 추가할 수 있다.

```
// 1fr 크기의 열 3개 생성
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
// 25% 3개 열을 4번 생성(12열)
.container {
  display: grid;
  grid-template-columns: repeat(4, 25% 25% 25%);
  grid-gap: 20px;
}
```

## `minmax()` 함수로 최소, 최대 값 설정하기

`minmax(최소, 최대)` 함수를 사용하면 행의 경우 높이, 열의 경우 너비의 최소, 최대 값 범위를 설정할 수 있다.

`grid-template-rows`, `grid-template-columns`,` grid-auto-rows`, `grid-auto-columns`에서 사용된다.

```
// 4번 열의 너비 -> 그리드 컨테이너 15% ~ 45% 범위로 설정
.container {
    display: grid;
    height: 500px;
    grid-template-columns: 100px 200px 300px minmax(15%, 45%);
    grid-template-rows: 100px ;
    gap: 5px;
}
// auto를 최대로 설정한 경우 -> 너비 15% 이상 ~ 차지할 수 있는 공간만큼
.container {
    display: grid;
    height: 500px;
    grid-template-columns: 100px 200px 300px minmax(15%, auto);
    grid-template-rows: 100px ;
    gap: 5px;
}
```

# `fit-content()`로 셀(트랙) 크기 설정하기

`fit-content()` 함수는 행/열(Track)의 크기를 그리드 아이템(Item)이 포함하는 내용(Contents) 크기에 맞춘다.

인수로 전달하는 값은 콘텐츠의 최대 크기이며 `minmax(auto, max-content)`와 유사하다.

```
.container {
  grid-template-columns: fit-content(300px) fit-content(300px);
}
```

# 그리드 아이템 줄 번호로 여러 셀에 표시되게 하기

그리드 아이템에 `grid-*-start`, `grid-*-end`속성으로 그리드 컨테이너 자식 요소의 셀 차지 범위를 줄 번호로 설정할 수 있다(여러 셀에 걸쳐 표시 되게할 수 있다). 축약 표현은 `grid-*`이며 `시작/끝` 형태로 값을 넣어주면 된다.

다음은 3번 그리드 아이템을 3번 열에서 4번 열까지 걸쳐 표시되게 하는 예시이다.

```
<div class="container">
    <div class="el1">e1</div>
    <div class="el2">e2</div>
    <div class="el3">e3</div>
    <div class="el4">e4</div>
</div>
----------------------------
.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 200px ;
    gap: 5px;
}

// 3번 줄에서 5번 줄까지 표시되게 설정
.container .el3 {
    grid-column-start: 3;
    grid-column-end: 5;
    // 축약 표현 => grid-column: 3 / 5;
}
```

개발자 도구 `layout` 탭에서 그리드의 줄 번호를 표시할 수 있는데 `grid-column-start`와 `grid-column-end`의 값은 표시되는 줄의 번호를 의미한다. 이때 음수를 지정하여 뒷 줄 번호 부터 세어 명시해줄 수도 있다(개발자 도구 참조).

덮어씌워진 자리의 요소는 다음 그리드 셀로 밀려난다(다음 예시에서 `.el4` 요소는 2행 1열로 밀려남).

`grid-row-start`, `grid-column-start` 와 `grid-row-end`, `grid-column-end` 모두를 포함한 단축 속성은 `grid-area`이며 나열한 순서대로 값을 `/`로 구분지어 전달해주면 된다.

```
.el3 {
    grid-column-start: 2;
    grid-column-end: span 3;
    grid-row-start: row-1-start;
    grid-row-end: row-2-end;
    =
    grid-area: row-1-start / 2 / row-2-end / span 3;
}
```

```
그리드의 요소는 중첩될 수 있다!
```

## `span` 키워드로 차지할 셀 명시하기

다음과 같이 차지할 셀을 `span` 키워드를 사용해 지정할 수도 있다.

```
<div class="container">
    <div class="el1">e1</div>
    <div class="el2">e2</div>
    <div class="el3">e3</div>
    <div class="el4">e4</div>
</div>
----------------------------
.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 200px ;
    gap: 5px;
}

// 열 3번 줄부터 그리드 셀 2 칸을 차지하도록 설정
.container .el3 {
    grid-column-start: 3;
    grid-column-end: span 2;
}
```

# 그리드 셀 영역(area)에 이름 지정하여 사용하기

그리드 컨테이너에 `grid-template-areas` 속성을 사용해 그리드 셀에 이름을 지을 수 있다(개발자 도구 layout 탭에서 확인 가능).

다음 예시는 3행 4열의 총 12셀을 갖는 그리드에서 `grid-template-areas`를 사용해 각 셀에 이름을 지어준 예시이다.

명명된 이름은 그리드 아이템에서 `grid-area` 속성으로 사용할 수 있으며 이름을 지정하고 싶지 않은 영역은 마침표(`.`)로 두면 된다. **이때 그리드 아이템 수만큼 반드시 이름을 지정해줘야 한다.**

```
// 3행 4열 그리드에서 각 영역에 이름 짓기
.container {
    display: grid;
    height: 500px;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: [row-1]100px [row-2] minmax(15%, 25%) [row-3];
    gap: 5px;
    grid-template-areas: "header header header header"
                         ". . main main"
                         "footer footer footer footer";
}

.container .el3 {
    /* grid-column: 3/-1;
    grid-row-start: row-1;
    grid-row-end: row-3; */
    grid-area: header;
}

.container .el4 {
    grid-area: footer;
}
```

1행 전체(4칸)를 `header`로 명명한 다음 그리드 아이템(`.el3`)의 영역을 `grid-area: header`로 지정해줌으로서 `.el3`는 1행 전체 칸을 차지하게 된다(참고로 `grid-area`는 `grid-*-start, grid-*-end`의 단축 속성이었다).

또한 `.el4`의 경우 3행 전체를 차지하게 된다.

이로서 `grid-*-start`, `grid-*-end` 혹은 `grid-area`에서 줄 번호를 통해 그리드 아이템의 범위를 지정하지 않고 더 간단하게 그리드 아이템의 영역을 지정해줄 수 있다.

## `grid-template` 속성

`grid-template-xxx`의 단축 속성으로 `grid-template-{rows, columns, areas}`을 축약하여 사용할 수 있다.

```
.container {
 grid-template: none | grid-template-rows | grid-template-columns | grid-template-areas;
}
```

# 줄 번호 이름 명명하기

`grid-template-columns`, `grid-template-rows`로 행, 열 생성 시 셀 사이 줄 번호에 이름을 설정할 수 있다. 각 행 또는 열 크기 앞에 `[이름]`과 같이 대괄호로 묶어서 이름을 설정할 수 있고 공백을 구분자로 여러 값을 설정할 수도 있다.

```
<div class="container">
    <div class="el1">e1</div>
    <div class="el2">e2</div>
    <div class="el3">e3</div>
    <div class="el4">e4</div>
</div>
----------------------------
.container {
    display: grid;
    grid-template-columns: [column-1-start] 100px [column-1-end column-2-start] 200px [column-2-end column-3-start] 30% [column-3-end column-4-start] minmax(10%, auto) [column-4-end];
    grid-template-rows: 200px ;
    gap: 5px;
}

// 열 3번 줄부터 그리드 셀 2 칸을 차지하도록 설정
.container .el3 {
    grid-column-start: column-3-start;
    grid-column-end: span 2;
}
```

## `repeat()` 함수와 함께 이름 줄 번호 명명하기

`repeat()` 함수를 사용해 그리드를 생성해주고 또 동시에 각 줄에 이름을 설정해 줄 수 있다. 이때 하나의 이름으로 모든 줄이 지정될텐데 다음과 같이 반복되는 수 만큼 번호로 지정하여 라인을 지정해줄 수도 있다.

```
.container {
    display: grid;
    height: 500px;
    grid-template-columns: repeat(4, [col-start] 25% [col-end]);
    grid-template-rows: [row-1]100px [row-2] minmax(15%, 25%) [row-3];
    gap: 5px;
}

// 2번째 열 라인 ~ 3번째 열 라인
.container .el1 {
    grid-column: col-start 2 / col-end 2;
}
```

다음과 같이 명명할 이름을 양 끝에 추가하여 `repeat()` 함수 밖에서도 줄 이름을 명명해줄 수도 있다. 다음의 경우 1번 열과 마지막 열에 `[header-start]`, `[header-end]`가 추가된다.

```
.container {
    display: grid;
    height: 500px;
    grid-template-columns: [header-start] repeat(4, [col-start] 25% [col-end]) [header-end];
    grid-template-rows: [row-1]100px [row-2] minmax(15%, 25%) [row-3];
    gap: 5px;
}
```

# 암시적 그리드, 명시적 그리드

- 명시적 그리드(Explicit Grids): `grid-template-columns`, `grid-template-rows`, `grid-template-areas`를 명시하여 행과 열을 생성한 그리드를 말한다.

- 암시적 그리드(Implicit Grids): 그리드에 셀보다 많은 그리드 항목이 있거나 그리드 항목이 명시적 그리드 외부에 배치 될 때 그리드 컨테이너는 그리드에 그리드 선을 추가하여 그리드 트랙을 자동으로 생성하는데 이를 암시적 그리드라고 한다.

개발자 도구로 그리드를 확인하면 명시적으로 설정한 행과 열의 끝은 실선으로 표시되고, 암시적으로 확장될 수 있는 부분은 점선으로 표시된다.

<!-- 명시적으로 크기를 정의한 부분을 넘어선 요소는 요소의 기본 값이 적용된다. -->

# 행과 열 사이 간격 설정

다음 속성으로 그리드 아이템 사이 간격(gutter 너비)을 설정할 수 있다. 이러한 간격은 길이(`<length>`) 단위 또는 백분율(`<percentage>`)이 될 수 있지만, `fr` 단위는 될 수 없다.

- `column-gap`: 열 사이의 간격
- `row-gap`: 행 사이의 간격
- `gap`: 열과 행 모두(행, 열 순서로 따로 지정도 가능)

```
.container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
}
```

**[grid]**

https://uxkm.io/publishing/css/04-cssAdvanced/05-css_grid_part1#gsc.tab=0

**[CSS grid 기본 개념]**

https://developer.mozilla.org/ko/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout
