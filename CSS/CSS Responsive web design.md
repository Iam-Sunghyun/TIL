**목차**

- [반응형 웹 디자인이란?](#반응형-웹-디자인이란)
- [하드웨어 픽셀(물리적 픽셀)과 소프트웨어 픽셀(css 픽셀) 차이](#하드웨어-픽셀물리적-픽셀과-소프트웨어-픽셀css-픽셀-차이)
- [HTML 뷰포트 `<meta>` 태그](#html-뷰포트-meta-태그)
- [미디어 쿼리(media query)](#미디어-쿼리media-query)
  - [미디어 유형(media types)](#미디어-유형media-types)
  - [미디어 특성(media features)](#미디어-특성media-features)
  - [여러 쿼리 결합하기](#여러-쿼리-결합하기)
    - [`and`](#and)
    - [`not`](#not)
    - [`','`  (논리합)](#--논리합)
    - [`only`](#only)
  - [미디어 쿼리 작업 시 유의할 점](#미디어-쿼리-작업-시-유의할-점)
    - [미디어 쿼리 순서](#미디어-쿼리-순서)
    - [적절한 분기점(break points) 찾기](#적절한-분기점break-points-찾기)
    - [미디어 쿼리 작성 위치](#미디어-쿼리-작성-위치)

# 반응형 웹 디자인이란?

출력 화면 크기, 기기에 따라 웹 페이지 레이아웃이 조정되는 웹 디자인 방식을 말한다.

반응형 디자인을 위한 기법은 한 가지가 아니며 대표적으로 3가지 개념이 있다.

백분율 같은 상대 단위를 이용해 요소나 이미지를 표현하는 **유동 격자(fluid grid, 가변 격자)**, **유동 이미지(fluid image)**와 가장 핵심이며 웹 사이트가 표시되는 장치의 유형, 특성에 따라 다른 레이아웃을 설정하는 **미디어 쿼리(media query)**가 있다.

```
다중 열 레이아웃(Multiple-column layout), flexbox, grid 같은 것들은 기본적으로 응답형이며 
유동 격자(fluid grid, 가변 격자)구현을 가정한 레이아웃이다.
```

**[MDN responsive web design]**

https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout/Responsive_Design#%EB%B0%98%EC%9D%91%ED%98%95_%EC%9D%B4%EB%AF%B8%EC%A7%80

**[The 3 Major Principles of Responsive Design]**

https://www.interaction-design.org/literature/article/responsive-design-let-the-device-do-the-work

**[wekipedia responsive web design]**

https://en.wikipedia.org/wiki/Responsive_web_design

**[poiemaweb 반응형 웹 디자인]** 

https://poiemaweb.com/css3-responsive-web-design


# 하드웨어 픽셀(물리적 픽셀)과 소프트웨어 픽셀(css 픽셀) 차이

상대 단위를 사용한 반응형 웹 페이지를 띄워놓고 브라우저 크기를 줄이면 그에 맞게 요소들이 줄어든다. 

반면 모바일 기기에 웹 페이지를 띄워보면 기기의 크기가 작은데도 웹 페이지가 줄어들지 않고 마치 전체 페이지가 축소된 형태 그대로 표시되는 경우가 있는데 이는 모바일 기기의 물리적 픽셀이 밀도가 높아 css 픽셀 값과 다르기 때문이다.<br>(ex) 아이폰 a8의 화면 크기는 css 픽셀 값으로는 375x667인데 실제 하드웨어 픽셀은 750x1334)

그렇기 때문에 데스크톱 브라우저 뷰포트의 375x667 크기에서 보이는 웹 페이지 형태가 아이폰 a8(css 픽셀 375x667)에서 나타나지 않았던 것.

따라서 반응형 페이지를 제대로 출력하기 위해서는 해당 모바일 기기의 너비를(css 픽셀 너비)를 브라우저 뷰포트 너비로 지정해야 하는데, 이때 사용하는 태그가 뷰포트 메타 태그(`<meta name="viewport" ... >`)이다. 


**[mydevice.io 물리적 픽셀, css 픽셀 값 비교]**

https://www.mydevice.io/

**[모바일에서 웹 사이트 출력 확인]**

https://www.webmobilefirst.com/en/

https://www.browserstack.com/responsive

# HTML 뷰포트 `<meta>` 태그

뷰포트 메타 태그를 사용하여 현재 사용 중인 모바일 기기의 너비(css 픽셀 너비)를 뷰포트로 지정한다

설정하지 않은 경우 모바일 기기의 물리적 픽셀 너비를 따르기 때문에 원하는 페이지가 출력되지 않을 수 있다(전체 페이지가 축소된 형태).

따라서 모바일을 고려한 반응형 웹 페이지를 위해선 반드시 추가해야되는 태그이다.

<!--  -->
```
// 일반적인 뷰포트 메타 태그
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

+ `name="veiwport"` - 웹 사이트가 보여지는 영역을 뷰포트로 설정

+ `content="width=device-width"` - 뷰포트의 너비를 기기의 화면 너비로 지정

+ `initial-scale=1` - 초기 화면 배율(줌 수준) 설정

**[MDN Viewport meta tag]**

https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag

# 미디어 쿼리(media query)

미디어 쿼리란 반응형 웹 디자인의 핵심이 되는 CSS3 기능으로 기기 유형, 출력 화면 크기 등 조건에 따라 스타일을 다르게 적용할 수 있게 한다.

`@media` 키워드와 **미디어의 유형(media types)**, **미디어 특성(media features)** 을 지정하고 적용할 스타일이 선언한다.

**미디어 특성(아래 media-feature-rule 부분)** 은 스타일이 적용 될 조건을 말하는데, 가장 많이 쓰이는 값은 `min-`,`max-` 접두사를 이용한 범위 지정 특성이다.

(ex) `min-width: 800px` -> 뷰 포트 너비가 800px 이상일 경우 적용).

```
@media media-type and (media-feature-rule) {

    .sidebar {
        display: none;
    }

   .main {
        width: 80%;
    }

}
```

미디어 쿼리가 도입되는 지점을 **분기점(breakpoints, 중단점)** 이라고 한다.

개발자 도구(dev tools)를 통해 인기 있는 기기들의 해상도를 확인하거나 직접 크기를 변경하면서 쿼리가 적용되는 지점을 확인할 수 있다.

<br>

**[MDN 미디어 쿼리]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/Media_Queries/Using_media_queries

## 미디어 유형(media types)

미디어 장치의 유형을 말한다. 값을 지정하지 않으면 `all`로 적용되며 `not`이나 `only` 연산자를 사용하는 경우 아니면 자주 사용하지 않는 듯.

```
@media all - 모든 장치 대상
@media print - 인쇄 결과물, 출력 미리보기 화면에 표시 중인 문서 대상
@media screen - 일반 화면 대상
@media speech - 음성 합성장치 대상
```

## 미디어 특성(media features)

출력 장치나 환경의 특정 특성을 지정한다.

다음은 가장 많이 사용하는 특성들이다. 이 외에도 매우 많은 특성들이 있으니 아래 링크 참조할 것.

```
@media (min-width: 800px)      - 화면 너비 800px 이상일 경우 적용
        max-width: 500px       - 화면 너비 500px 이하일 경우 적용
        orientation: landscape - 화면 가로모드(너비가 높이보다 클 때)인 경우 적용
```

## 여러 쿼리 결합하기

논리 연산자(`and`, `not`, `','`)나 `only`, 연산자로 서로 다른 쿼리들을 결합할 수도 있다.

### `and`

논리곱 연산자로 조합한 쿼리가 모두 일치하는 경우를 말한다.

```
// 화면 너비가 400px 이상이면서 너비가 높이보다 클 때
@media screen and (min-width: 400px) and (orientation: landscape) {
    body {
        color: blue;
    }
}
```
### `not`

부정 연산으로 전체 쿼리를 반전시킬 때 사용한다. 즉, 가장 마지막에 적용되어 조합된 개별 쿼리에 적용할 수 없고 쿼리 전체에 적용된다. 

`not` 연산자를 사용할 경우 미디어 유형도 명시해줘야 한다.

```
@media not all and (monochrome) { ... }
            ↓
 // 아래와 같이 평가된다           
@media not (all and (monochrome)) { ... }
```

### `','`  (논리합)

논리합(`or`) 연산자로 쿼리 중 하나라도 참일 경우 적용된다.

```
// 너비가 400px인 화면 장치이거나 너비가 높이보다 큰 화면 장치의 경우 
@media screen and (min-width: 400px), screen and (orientation: landscape) {
    body {
        color: blue;
    }
}
```

### `only`

전체 쿼리가 일치할 때만 스타일을 적용시킨다. 오래 된 브라우저가 스타일을 잘못 적용하지 못하도록 방지할 때 사용한다고 한다. 

`only` 연산자를 사용할 경우 `not`과 마찬가지로 미디어 유형도 명시해줘야 한다.

```
// 구형 브라우저에서는 아래와 같은 쿼리를 screen만 읽어 들이고 뒷부분을 무시한 채 스타일을 적용시켜 버린다.
@media screen and (max-width: 500px) { ... }

// 따라서 아래처럼 작성해줘야 한다. 
@media only screen and (max-width: 500px) { ... }
```


## 미디어 쿼리 작업 시 유의할 점

### 미디어 쿼리 순서

아래 미디어 쿼리의 적용 조건은 화면 장치에서만, 그리고 너비가 `380px` 이상일 때와 `620px` 이상일 때 각각 적용되는 스타일이다.

```
@media only screen and (min-width: 380px ) {
  #product-overview {
    height: 40vh;
  } 
}

@media only screen and (min-width: 620px ) {
  #product-overview {
    height: 55vh;
  }
}
```

위 조건은 동작하는데 문제가 없으나 다음과 같이 더 작은 값을 아래에 작성할 경우 css 규칙에 따라 미디어 쿼리 조건이 덮어쓰기 될 수 있다.

```
// 이 쿼리는 적용되지 않음
@media only screen and (min-width: 620px ) {
  #product-overview {
    height: 55vh;
  }
}

@media only screen and (min-width: 380px ) {
  #product-overview {
    height: 40vh;
  } 
}
```

따라서 `min-`, `max-` 접두사가 붙는 조건처럼 범위를 지정하는 쿼리는 덮어씌워지지 않게 순서를 고려하여 작성해줘야 한다. 


### 적절한 분기점(break points) 찾기

웹 사이트를 만들 때 적절한 분기점을 설정하는 것이 중요한데 mydevice.io에서 많이 사용하는 모바일, 태블릿의 css 픽셀 값을 참고할 수 있다.

참고로 가장 많이 쓰이는 주 분기점 3가지는 너비 기준 480/768/1024 이다.

**[mydevice.io]**

https://www.mydevice.io/

**[poiemaweb responsive-web-design]**

https://poiemaweb.com/css3-responsive-web-design

### 미디어 쿼리 작성 위치 

가독성을 위해 미디어 쿼리 작성을 css 스타일과 구분지어 맨 아래에 두는 것이 일반적이다.

```
#product-overview {
  background: linear-gradient(to top, rgba(80, 68, 18, 0.6) 10%, transparent),
    url("images/freedom.jpg") left 10% bottom 70%/cover no-repeat border-box,
    #ff1b68;
  width: 100vw;
  height: 33vh;
  margin-top: 2.75rem;
  position: relative;
}

#product-overview h1 {
  color: white;
}
    .
    .
    .
    .
@media only screen and (max-width: 380px ) {
  #product-overview {
    height: 40vh;
  }
}

@media only screen and (max-width: 620px ) {
  #product-overview {
    height: 55vh;
  }
}
```

