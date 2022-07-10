# 반응형 웹사이트란?

출력 화면 크기, 기기에 따라 웹 페이지 레이아웃이 조정되는 웹 사이트를 말한다.

# 미디어 쿼리?
미디어 쿼리란 반응형 웹 디자인의 핵심이 되는 CSS3 기능으로 기기 유형, 출력 화면 크기 등 조건에 따라 스타일을 다르게 적용할 수 있게 한다.

`@media` 키워드와 미디어의 유형, 미디어 특성을 지정하고 적용할 스타일이 선언한다.

미디어 특성(media-feature-rule)은 스타일이 적용 될 조건을 말하는데, 가장 많이 쓰이는 값은 `min-`,`max-` 접두사를 이용한 범위 지정 특성이다(ex) min-width: 800px -> 뷰 포트 너비가 800px 이상일 경우 적용).

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

+ 미디어 쿼리가 도입되는 지점을 **분기점(breakpoints)** 이라고 하는데, 개발자 도구(dev tools)를 통해 인기 있는 기기들의 해상도를 확인하거나 직접 크기를 변경하면서 쿼리가 적용되는 지점을 확인할 수 있다.
  
# 미디어 유형

미디어 장치의 유형을 말한다. 값을 지정하지 않으면 `all`로 적용되며 `not`이나 `only` 연산자를 사용하는 경우 아니면 자주 사용하지 않는 듯.
```
@media all - 모든 장치 대상 
@media print - 인쇄 결과물, 출력 미리보기 화면에 표시 중인 문서 대상
@media screen - 일반 화면 대상 
@media speech - 음성 합성장치 대상 
```

# 미디어 특성

다음은 가장 많이 사용하는 특징들 몇가지이다. 이 외에도 매우 많은 특성들이 있으니 아래 링크 참조할 것.
```
min-width: 800px       - 화면 너비 800px 이상일 경우 적용
max-width: 500px       - 화면 너비 500px 이하일 경우 적용
orientation: landscape - 화면 가로모드(너비가 높이보다 클 때)인 경우 적용
```

# 여러 쿼리 결합하기

논리 연산자(and, not, ',')나 only, 연산자로 서로 다른 쿼리들을 결합할 수도 있다.

콤마(',')는 논리합에 해당된다.

```
and - 논리곱 연산자로 조합한 쿼리가 모두 일치하는 경우를 말한다
not - 쿼리가 거짓일때만 해당. not 연산자를 사용할 경우 미디어 유형도 명시해줘야 한다!
 ,  - 논리합 연산자로 여러 쿼리를 조합
only - 쿼리가 일치할 때만 해당

/* 사용 예 */
@media screen and (min-width: 400px) and (orientation: landscape) {
    body {
        color: blue;
    }
}

@media screen and (min-width: 400px), screen and (orientation: landscape) {
    body {
        color: blue;
    }
}
```

<br>

**[@media feature]** <br>

https://poiemaweb.com/css3-responsive-web-design

**[@media 사용 방법, features]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/Media_Queries/Using_media_queries

