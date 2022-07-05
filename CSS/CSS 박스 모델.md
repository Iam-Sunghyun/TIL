# CSS 박스 모델

HTML 문서를 출력할 때, 브라우저의 렌더링 엔진은 HTML 요소들을 하나의 박스로 표현한다.

즉, HTML 요소들은 박스 형태로 이루어져 있고 CSS는 박스의 크기, 위치, 속성(property)과 같은 출력 스타일을 결정하는데 이 박스 형태의 영역을 **박스 모델(box model)**이라고 한다. 

<img src="https://github.com/Iam-Sunghyun/TIL/blob/main/CSS/img/css-box-model.png" width="350" height="250">  

CSS 박스 모델의 구성과 제어하기 위한 속성은 다음과 같다.

+ 콘텐츠 박스 - ```width```, ```heigth```
+ 패딩 박스 - ```padding```
+ 테두리 박스 - ```border```
+ 여백 박스 - ```margin```

```
요소(elements)는 HTML 문서의 논리적 구성요소 관점의 용어이고, 태그(tag)는 문서 작성 관점에서, 박스(box)는 출력스타일(CSS) 관점에서 사용하는 용어로 모두 같은 대상에 대한 표현이다.
```

## 콘텐츠(Contents)

콘텐츠 박스의 가로는 ```Width```, 세로는 ```Height```으로 콘텐츠 영역의 크기를 조절한다.
```
div {
  width: 200px;
  height: 150px
}
```

## 테두리(Border)

```border``` 단축 속성을 통해 제어하며, 하위 속성으로는 ```border-width```, ```border-color```, ```border-style```이 있다. 이 3가지 하위 속성도 4면의 값을 설정 할 수 있는 단축 속성으로 예시는 링크 참조.
```
/* 너비(width) | 스타일(style) | 색(color) */
border: medium dashed green;

/* 전역 값 */
border: inherit;
border: initial;
border: unset;
```

테두리 너비(width)는 크기가 변동될 일이 별로 없기 때문에 설정 값으로 px을 자주 사용한다.

```border-style```을 명시하지 않으면 기본 값인 none이 적용 되어 테두리가 보이지 않는다.

### border-radius

테두리 박스 모서리에 곡률을 지정하기 위한 속성. ```border-radius``` 또한 단축 속성으로 4 꼭지점 설정을 한번에 설정하거나 '/'를 사용해 타원형으로 만들 수도 있다.

<br>

**[CSS border-radius]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/border-radius

**[CSS 테두리 박스 속성]** <br>

https://developer.mozilla.org/ko/docs/Web/CSS/border

## 패딩(Padding)

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

## 여백(Margin)

테두리 박스 밖 영역으로 다른 요소와의 공간을 말하며 `margin-top`, `margin-right`,`margin-bottom,` `margin-left`의 단축 속성이다.

양수, 음수 값을 설정 할 수 있는데 음수 값을 설정 할 경우 다른 요소와 겹칠 수 있다.


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
브라우저마다 `<body>` 자체에 기본 margin값이 있다.

## 여백 상쇄

여러 블록의 위쪽 및 아래쪽 바깥 여백(마진)은 경우에 따라 제일 큰 여백의 크기를 가진 단일 여백으로 결합(상쇄)되는데, 이것을 여백 상쇄라고 한다.

다만 플로팅 요소와 절대 위치를 지정한 요소의 경우 상쇄되지 않는다. 링크 참조.

<br>

**[여백 상쇄가 발생하는 경우]** <br>

https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing

<br>

**[포이마 웹 박스 모델]** <br>
https://poiemaweb.com/css3-box-model

**[MDN 박스 모델]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/The_box_model


# display 속성

`display` 속성은 `block`, `inline`, `block-inline`같은 키워드로 출력되는 요소의 박스 형식을 설정할 수 있는 레이아웃 정의에 중요한 속성이다.

다음은 자주 사용하는 속성 값들이다.

+ `block` - block 특성을 가지는 요소(block 레벨 요소)로 지정한다.
+ `inline` - inline 특성을 가지는 요소(inline 레벨 요소)로 지정한다.
+ `inline-block` - inline 특성을 가지는 요소(inline 레벨 요소)로 지정한다.
+ `none` - 해당 요소를 화면에 표시하지 않는다 (공간조차 사라진다).

<br>

**[CSS display 속성]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/display


## visibility 속성

`visibility` 속성은 문서의 레이아웃을 변경하지 않고 요소를 보이게 하거나 숨길 수 있다. `visibility`로 `<table>`의 행이나 열을 숨길 수도 있다.

```
/* visibility 값 */
visibility: visible;
visibility: hidden; // 레이아웃은 사라지지 않고 숨김.
visibility: collapse;
```

`display: none;`의 경우 레이아웃에서도 사라지지만 `visibility: hidden;`은 출력은 숨기지만 레이아웃은 유지된다.

## CSS 박스 유형

CSS에는 2가지 박스(인라인 박스, 블록 레벨 박스)가 있으며 다음과 같은 차이가 있다.

### 블록 레벨 박스(블록 레벨 요소의 박스 모델)

+ 박스의 너비는 상위 콘테이너 너비만큼 채워진다(콘텐츠 영역 크기를 줄여도 상위 요소 너비 만큼 여백(margin)이 채워진다).

+ 줄 바꿈이 발생해 항상 새 줄에서 시작한다.

+ width, height, padding, margin, border 속성이 적용된다.

+ padding, margin, border로 인해 다른 요소들이 박스로부터 밀려난다.
  
+ block 레벨 요소 내에 inline 레벨 요소를 포함할 수 있다.

+ ex) `<div>` `<h1~6>` `<p>` `<ol>` `<ul>` `<li>` `<hr>` `<table>` `<form>`

### 인라인 박스 (인라인 요소의 박스 모델)

+ content의 너비만큼 가로폭을 차지한다.

+ 박스는 줄 바꿈이 발생하지 않으며 그 줄에 포함된다.

+ width, height, margin-top, margin-bottom 프로퍼티를 지정할 수 없다. 상, 하 여백은 line-height로 지정한다.

+ padding, margin, border로 인해 다른 요소들이 밀려나지 않는다.

+ 요소 내에 block 레벨 요소를 포함 할 수 없다.

+ 요소 뒤에 공백(엔터, 스페이스 등)이 있는 경우, 정의하지 않은 space(4px)가 자동 지정된다.

+ ex) `<span>` `<a>` `<strong>` `<img>` `<br>` `<input>` `<select>` `<textarea>` `<button>`

display 속성으로 요소의 박스 유형을 설정할 수 있다. `<span>`의 경우 기본이 인라인 요소인데, `display: block;` 으로 블록 레벨 요소처럼 출력 되게 만들 수 있다.

주의 할 점은 **유형 자체를 변경하지는 않는다는 것**. 인라인 요소에 `display:block;` 적용해도 요소가 포함할 수 있는 요소와 요소가 포함될 수 있는 요소에는 영향을 주지 않는다(여전히 인라인은 블록 요소를 하위에 포함시키지 못함).


## inline-block 레벨 요소

인라인과 블록 레벨 요소의 특성을 모두 갖고 있는 요소. 특징은 다음과 같다.

+ content의 너비만큼 가로폭을 차지한다.

+ 박스는 줄 바꿈이 발생하지 않으며 그 줄에 포함된다.
  
+ width와 height 속성이 적용된다.

+ padding, margin, border로 인해 다른 요소들이 박스로부터 밀려난다.
  
+ inline 레벨 요소처럼 뒤에 공백(엔터, 스페이스 등)이 있는 경우, 정의하지 않은 space(4px)가 자동 지정된다.
  
<br>


**[inline 뒤 공백을 제거하는 법]** <br>
https://css-tricks.com/fighting-the-space-between-inline-block-elements/

<br>

## 표준 CSS 박스 모델, 대체 CSS 박스 모델

표준 박스 모델(CSS 박스 모델의 기본값 => content-box)에서 ```width```, ```height```는 콘텐츠 박스의 크기만 정의한다. 패딩과 테두리는 콘텐츠 박스 밖에 생성 된다.

```box-sizing: border-box;``` 속성을 사용할 경우 대체 박스 모델을 활성화할 수 있다.
```
div { 
  border-color: red;
  border-width: 5px;
  border-style: solid;
  box-sizing: border-box;
}
```
대체 박스 모델(border-box)은 ```width```, ```height```로 지정한 크기가 패딩과 테두리를 포함한다. 

모든 요소에 대체 박스 모델을 적용하고 싶다면 다음과 같이 선언하면 된다.
```
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
```
<br>

**[MDN box-sizing]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/box-sizing


**[CSS 박스 모델]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/The_box_model


# 박스 그림자 효과 box-shadow

box-shadow CSS 속성은 요소의 테두리를 감싼 그림자 효과를 추가한다.

사용 예시는 다음과 같다.

```
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
```
**[MDN box-shadow]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/box-shadow