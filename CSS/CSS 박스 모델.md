**목차**

- [CSS 박스 모델](#css-박스-모델)
  - [콘텐츠(Contents)](#콘텐츠contents)
  - [테두리(Border)](#테두리border)
    - [border-radius](#border-radius)
  - [패딩(Padding, 안쪽 여백)](#패딩padding-안쪽-여백)
  - [여백(Margin, 바깥쪽 여백)](#여백margin-바깥쪽-여백)
  - [margin: auto;](#margin-auto)
- [CSS 박스 유형](#css-박스-유형)
  - [블록 레벨 박스(블록 레벨 요소의 박스 모델)](#블록-레벨-박스블록-레벨-요소의-박스-모델)
  - [인라인 박스 (인라인 요소의 박스 모델)](#인라인-박스-인라인-요소의-박스-모델)
  - [inline-block 레벨 요소](#inline-block-레벨-요소)
- [내부 및 외부 디스플레이 유형](#내부-및-외부-디스플레이-유형)
- [표준 CSS 박스 모델, 대체 CSS 박스 모델](#표준-css-박스-모델-대체-css-박스-모델)
- [박스 그림자 효과 box-shadow](#박스-그림자-효과-box-shadow)

# CSS 박스 모델

HTML 문서를 출력할 때, 브라우저의 렌더링 엔진은 HTML 요소들을 하나의 박스로 표현한다.

즉, HTML 요소들은 박스 형태로 이루어져 있고 CSS는 박스의 크기, 위치, 속성(property)과 같은 출력 스타일을 결정하는데 이 박스 형태의 영역을 **박스 모델(box model)** 이라고 한다.

<img src="./img/css-box-model.png" width="350" height="250">

CSS 박스 모델의 구성과 제어하기 위한 속성은 다음과 같다.

- 콘텐츠 박스 - `width`, `heigth`
- 패딩 박스 - `padding`
- 테두리 박스 - `border`
- 여백 박스 - `margin`

```
요소(elements)는 HTML 문서의 논리적 구성요소 관점의 용어이고, 태그(tag)는 문서 작성 관점에서, 박스(box)는 출력스타일(CSS) 관점에서 사용하는 용어로 모두 같은 대상에 대한 표현이다.
```

**[MDN 박스 모델]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/The_box_model

**[포이마 웹 박스 모델]** <br>
https://poiemaweb.com/css3-box-model

## 콘텐츠(Contents)

콘텐츠 박스의 가로는 `Width`, 세로는 `Height`으로 콘텐츠 영역의 크기를 조절한다.

```
div {
  width: 200px;
  height: 150px
}
```

## 테두리(Border)

`border` 단축 속성을 통해 제어하며, 하위 속성으로는 `border-width`, `border-color`, `border-style`이 있다. 이 3가지 하위 속성도 4면의 값을 설정 할 수 있는 단축 속성으로 예시는 링크 참조.

```
/* 너비(width) | 스타일(style) | 색(color) */
border: medium dashed green;

/* 전역 값 */
border: inherit;
border: initial;
border: unset;
```

테두리 너비(width)는 크기가 변동될 일이 별로 없기 때문에 설정 값으로 px을 자주 사용한다.

`border-style`을 명시하지 않으면 기본 값인 none이 적용 되어 테두리가 보이지 않는다.

### border-radius

테두리 박스 모서리에 곡률을 지정하기 위한 속성. `border-radius` 또한 단축 속성으로 4 꼭지점 설정을 한번에 설정하거나 선택적으로 "/" 이후에 한 개에서 네 개의 `<length>` 또는 `<percentage>` 값을 사용해 추가 반지름을 설정해서 타원형 꼭짓점을 만들 수 있다.

**[CSS border-radius]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/border-radius

**[CSS 테두리 박스 속성]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/border

## 패딩(Padding, 안쪽 여백)

콘텐츠와 테두리 사이 공간을 패딩(padding)이라고 한다.

`padding` 속성은 `padding-top`, `padding-right`, `padding-bottom`, `padding-left`의 단축 속성이다.

```
/* 네 면 모두 적용 */  자주 사용
padding: 1em;

/* 세로방향 | 가로방향 */
padding: 5% 10%;

/* 위 | 가로방향 | 아래 */
padding: 1em 2em 2em;

/* 위 | 오른쪽 | 아래 | 왼쪽 */   자주 사용
padding: 5px 1em 0 2em;

/* 전역 값 */
padding: inherit;
padding: initial;
padding: unset;
```

## 여백(Margin, 바깥쪽 여백)

테두리 박스 밖 영역으로 다른 요소와의 공간을 말하며 `margin-top`, `margin-right`,`margin-bottom,` `margin-left`의 단축 속성이다. 양수, 음수 값을 설정 할 수 있는데 음수 값을 설정 할 경우 다른 요소와 겹칠 수 있다.

브라우저마다 `<body>` 자체에 기본 `margin`값이 있다.

```
/* 네 면 모두 적용 */
margin: 1em;
margin: -3px;

/* 세로방향 | 가로방향 */
margin: 5% auto;

/* 위 | 가로방향 | 아래 */
margin: 1em auto 2em;

/* 위 | 오른쪽 | 아래 | 왼쪽 */
margin: 2px 1em 0 auto;

/* 전역 값 */
margin: inherit;
margin: initial;
margin: unset;
```

## margin: auto;

브라우저가 적절한 바깥 여백(margin) 값을 설정하여 요소를 중앙 정렬할 때 사용한다.
주의할 것은 `width`가 명시된 블록 레벨 요소에서만 적용된다는 것!

# CSS 박스 유형

CSS에는 크게 2가지 박스(인라인 박스, 블록 레벨 박스)가 있으며 다음과 같은 차이가 있다.

## 블록 레벨 박스(블록 레벨 요소의 박스 모델)

- 박스의 너비는 상위 콘테이너 너비만큼 채워진다.
  
 <!-- (콘텐츠 영역 크기를 줄여도 상위 요소 너비 만큼 여백(margin)이 채워진다). -->

- 줄 바꿈이 발생해 항상 새 줄에서 시작한다.

- width, height 속성이 적용된다.

- padding, margin, border로 인해 다른 요소들이 박스로부터 밀려난다.
- block 레벨 요소 내에 block, inline 레벨 요소를 포함할 수 있다.

- ex) `<div>` `<h1~6>` `<p>` `<ol>` `<ul>` `<li>` `<hr>` `<table>` `<form>`

**[MDN 블록 레벨 요소 종류]**

https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements

## 인라인 박스 (인라인 요소의 박스 모델)

- content의 너비만큼 가로폭을 차지한다.

- 박스는 줄 바꿈이 발생하지 않으며 그 줄에 포함된다.

- width, height 속성이 적용되지 않는다.
- margin, padding, border - top/bottom은 적용되나 주변 요소를 밀어내지 않는다. 인라인 요소의 높이는 line-height로 지정한다.

<!-- margin-top, margin-bottom 속성이 적용되지 않는다(개발자 도구 Computed 상에선 입력이 된걸로 뜨나 출력엔 적용 안됨). 잘못 알고 있었는듯 -->

- 수평 padding, margin, border 속성은 적용되며 다른 인라인 요소들이 밀려난다.

- 요소 내에 block 레벨 요소를 포함할 수 없다.

- 요소 뒤에 공백(엔터, 스페이스 등)이 있는 경우, 정의하지 않은 space(4px)가 자동 지정된다.

- ex) `<span>` `<a>` `<strong>` `<img>` `<br>` `<input>` `<select>` `<textarea>` `<button>`

display 속성으로 요소의 박스 유형을 설정할 수 있다. `<span>`의 경우 기본이 인라인 요소인데, `display: block;` 으로 블록 레벨 요소처럼 출력 되게 만들 수 있다.

**[MDN 인라인 요소 종류]**

https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements

## inline-block 레벨 요소

인라인과 블록 레벨 요소의 특성을 모두 갖고 있는 요소. 특징은 다음과 같다.

- content의 너비만큼 가로폭을 차지한다.

- 박스는 줄 바꿈이 발생하지 않으며 그 줄에 포함된다.
- width와 height 속성이 적용된다.

- padding, margin, border 속성이 적용되며 다른 요소들이 박스로부터 밀려난다.

- block 레벨 요소 내에 block, inline 레벨 요소를 포함할 수 있다.
- inline 레벨 요소처럼 뒤에 공백(엔터, 스페이스 등)이 있는 경우, 정의하지 않은 space(4px)가 자동 지정된다.

**[inline 뒤 공백을 제거하는 법]** <br>
https://css-tricks.com/fighting-the-space-between-inline-block-elements/

# 내부 및 외부 디스플레이 유형

블록 레벨 박스, 인라인 박스는 모두 외부 디스플레이 유형으로 박스 외부에 영향을 끼치는 방식을 결정하는 요소들이다.

CSS에는 내부 디스플레이 유형도 있는데 이는 말 그대로 박스 내부의 요소가 배치되는 방식을 결정한다.

HTML 요소의 내부 디스플레이 유형은 기본적으로 `normal flow`가 적용되며 그 외에 `flex`, `grid`같은 `display` 값을 사용해 내부 디스플레이 유형(박스 내부의 배치 유형)을 설정할 수 있다.

`normal flow`는 해당 요소 유형의 특성(블록, 인라인)을 그대로 따른다.

# 표준 CSS 박스 모델, 대체 CSS 박스 모델

표준 CSS 박스 모델, 대체 CSS 박스 모델은 박스의 `width`와 `height` 크기를 계산하는 방법을 설정하기 위한 것으로 `box-sizing` 속성을 통해 설정한다.

표준 박스 모델(CSS 박스 모델의 기본값 => content-box)에서 `width`, `height`는 콘텐츠 박스의 크기만 정의한다. 패딩과 테두리는 콘텐츠 박스 밖에 생성된다.

`box-sizing: border-box;` 속성을 사용할 경우 대체 박스 모델을 활성화할 수 있다.

```
div {
  border-color: red;
  border-width: 5px;
  border-style: solid;
  box-sizing: border-box;
}
```

대체 박스 모델(border-box)은 `width`, `height`로 지정한 크기가 패딩과 테두리를 포함한다.

모든 요소에 대체 박스 모델을 적용하고 싶다면 다음과 같이 선언하면 된다.

```
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
```

**[MDN box-sizing]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/box-sizing

# 박스 그림자 효과 box-shadow

box-shadow CSS 속성은 요소의 테두리를 감싼 그림자 효과를 추가한다.

사용 예시는 다음과 같다.

```
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
```

**[MDN box-shadow]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/box-shadow
