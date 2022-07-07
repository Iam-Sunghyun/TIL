# CSS란?

CSS(Cascading Style Sheets)란  글꼴, 글자 크기, 애니메이션, 색상 등 웹 페이지의 스타일이나 레이아웃에 사용되는 **스타일 시트 언어**를 말한다. 스타일 시트는 스타일을 정의해 놓은 것을 의미한다.

보통 HTML 요소의 스타일을 결정하지만, XML(XML의 방언인 SVG, XHTML 포함)로 작성된 문서의 스타일을 설정하는데도 사용할 수 있다.

## 문법 예
하나의 CSS 선언은 선택자에 연결된 속성 세트로 구성된다.
```
// h1 -> 선택자. 스타일을 적용할 HTML 요소를 말한다.
h1 {
    color: red;  
    font-size: 5em;  // 속성들
}
```
css 스타일의 속성을 2개 이상 지정 할 경우 반드시 세미콜론(;)으로 구분지어야 한다. 

그렇지 않으면 적용되지 않는다.

<br>

**[MDN CSS]**  <br>
https://developer.mozilla.org/ko/docs/Learn/CSS

# CSS 적용 방식

## 외부 스타일시트

외부에 별도의 .css 파일을 생성해 css스타일을 선언하는 방식. 

```<head>``` 내부에 ```<link>``` 태그를 통해 불러 올 수 있다. 

여러 웹 페이지에 css를 적용하기 쉽고 유지 보수에도 좋다.
```
<head>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>This is my first CSS example</p>
</body>
```

## 내부 스타일시트

```<head>```태그 안에 ```<style>``` 태그를 이용해 css스타일을 선언하는 방식.

```<style>```태그는 ```<head>``` 태그 내부에 선언되어야 한다.

웹 페이지가 여러 개인 웹 사이트의 경우 효율이 떨어진다. 

여러 웹 페이지에서 동일한 스타일을 보여주기 위해선 외부 스타일시트를 이용하는 것이 좋다.
```
<head>
    <style>
      h1 {
        color: blue;
        background-color: yellow;
        border: 1px solid black;
      }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
</body>
```

## 인라인 스타일

HTML 요소의 style 속성에 직접 css을 선언하는 방식. 

간단하지만 단일 요소에만 적용되므로 같은 요소를 사용 할 때 마다 매번 스타일을 지정해줘야 하며 웹 페이지 스타일 일관성 유지, 코드 가독성, 유지 보수 모든 면에서 좋지 않다.
```
<p style="color:red;">This is my first CSS example</p>
```
<br>

# 단축 속성(Shorthand properties)

단축 속성은 관련된 서로 다른 여러 가지 CSS 속성의 값을 지정할 수 있는 CSS 속성을 말한다.

CSS 속성 중에는 같은 주제를 가진 여러 공통 속성을 묶기 위한 단축 속성을 정의한다. 

예를 들어 CSS ```background``` 속성은 ```background-color```, ```background-image```, ```background-repeat```, ```background-position``` 값을 정의할 수 있는 단축 속성이다.

단축 속성의 예외상황 및 자세한 것은 아래 링크 참고.

<br>

**[CSS 단축 속성]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/Shorthand_properties


## 자주 사용하는 CSS 속성 몇 가지

CSS는 어렵지 않지만, 사용 할 수 있는 속성들이 매우 방대하다.

다음은 자주 사용되는 몇 가지 속성들이다.(극히 일부)

## 색 및 배경색 속성

```color``` - 텍스트 색상 변경.

```background``` - background 관련 속성들의 단축 속성 색상, 이미지, 원점, 크기, 반복 등 여러 배경 스타일을 한 번에 지정할 수 있다.

```background-color``` - 배경색만을 변경하기 위한 background의 하위 속성.

단축 속성을 통해 값을 지정할 경우 요소 배경이미지 크기를 설정하는 `background-size` 속성은 `/`문자를 구분자로 `background-position` 뒤에 위치해야 적용된다(ex) center/80% , center/cover) 

이외에도 `background`속성은 다양한 하위 속성이 있고, 실제로 많이 쓰이는 것도 있으므로 링크를 참조할 것. 

**[MDN background]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/background

# CSS 색상 지정하는 방식

CSS에서 색상을 지정하는 방식은 다음과 같다.

+ 브라우저에 명명된 색상 키워드(140가지)
+ RGB 3원색 표현법 (rgb(), rgba(), #16진수 코드 표현)
+ HSL 실린더형 좌표계 사용 (hsl(), hsla()의 함수형 표기법)

## RGB 색 표현

빛의 3원색 (빨강, 초록, 파랑)을 적절하게 섞어 색을 표현하는 방법.

선택적으로 알파(a)채널을 추가해 다음과 같이 투명도를 표현 할 수도 있다.

16진수 표현과 함수형 표현이 있다.

## 16진수 색 표현

```
color: #ffff00;  // 요소 콘텐츠 색상 설정 속성
color: #ffff00aa;(==#ff0a)  // a는 투명도를 나타내는 16진수
```
16진수 표기법의 경우 왼쪽부터 2자리씩 빨강, 초록, 파랑을 의미한다. 십진수 0~255 범위를 16진수 0~ff로 표현한 것이다.

각 색상 2자리가 같은 값일 경우 1자리로 생략하여 표현할 수 있다.

## 함수형 색 표현

```
color: rgb(R, G, B, A) , rgba(R, G, B, A)
```
각 색상을 0~255 정수로, 알파 채널은 0~1사이 소수로 지정할 수 있다.

<br>

**[CSS color]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/color_value


## Opacity와 알파 채널

```
background-color: rgb(15, 15, 15, 0.2) , rgba(R, G, B, A)
```

함수형 색 표현(`rgb()`, `rgba()`), 16진수 표현(`#ffff00aa`)으로 특정 속성의 알파 채널 값, 즉 투명도를 설정할 수 있다.

`opacity` 역시 투명도를 설정하는 속성으로 0~1사이 값으로 설정한다. 이 값을 지정할 경우 해당 요소뿐 아니라 자손 요소 모두 영향을 받는다(상속은 되지 않는다).

자세한 것은 아래 링크를 참조하자.

<br>

**[MDN Opacity 속성]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/opacity

**[CSS 속성 참고서]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/Reference


# 자주 사용하는 텍스트 관련 속성

```text-align``` - 블록 요소나 표의 칸 상자 내부 콘텐츠의 가로 정렬을 설정한다.

```font-weight``` - 글자 굵기 설정. 몇몇 폰트들은 normal(400)이나 bold(700)만 가능하다.

```text-decoration``` - 텍스트에 장식용 선을 추가한다. ```text-decoration-line```, ```text-decoration-color```, ```text-decoration-style```, ```text-decoration-thickness```의 단축 속성이다.

```line-height``` - 줄 간격을 조절한다.

```letter-spacing``` - 글자간 간격을 조절한다.

## font-family 글꼴 집합 
```
p {
  font-family: "Trebuchet MS", Verdana, sans-serif;
}
```
텍스트의 글꼴을 지정하는 속성. 폰트 이름에 공백이 있는 경우 따옴표로 묶는다.

클라이언트 컴퓨터에서 사용 할 수 있는 폰트의 경우 적용되며 그렇지 않은 경우 브라우저 기본 폰트가 적용된다.

예시에서 여러 폰트를 지정했는데 이것을 글꼴 스택 (font stack)이라 한다. 왼쪽부터 폰트를 적용 할 수 없는 경우 순차적으로 폰트 적용을 시도한다.

따라서 마지막에 지정하는 폰트는 대부분의 OS에 기본적으로 설치되어 있는 일반 글꼴 모음, generic-font-family(Serif, Sans-serif, Mono space, cursive, fantasy)를 지정하는 것이 일반적이다(cursive, fantasy 글꼴은 없을 가능성이 있다).


### 웹 안전 글꼴?

대부분의 운영체제(윈도우, 맥, 가장 일반적인 리눅스 배포판, 안드로이드 및 iOS)에서 지원 되는 폰트를 말한다. 

generic-font-family 하위에서 몇 가지를 특정한 것 인듯.

<br>
자세한 것은 아래 링크 참조하자.

<br>

**[웹 안전 글꼴 리스트]** <br>
https://www.cssfontstack.com/

**[poiemaweb 폰트와 텍스트]** <br>
https://poiemaweb.com/css3-font-text

**[CSS 텍스트 스타일링]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Styling_text

