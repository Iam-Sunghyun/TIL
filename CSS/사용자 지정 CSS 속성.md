<h2>목차</h2>

- [사용자 지정 CSS 속성이란?](#사용자-지정-css-속성이란)
  - [사용법](#사용법)
- [사용자 지정 속성의 상속](#사용자-지정-속성의-상속)
- [사용자 지정 속성 대체 값](#사용자-지정-속성-대체-값)
- [유효하지 않은 값을 사용했을 때](#유효하지-않은-값을-사용했을-때)
  - [Reference](#reference)

# 사용자 지정 CSS 속성이란?

사용자 지정 속성(CSS 변수, 종속 변수)은 CSS 저작자가 정의하는 속성으로, 반복해서 사용되는 값을 변수처럼 선언하여 문서 전반에서 재사용하기 위한 속성이다.

## 사용법

사용자 지정 속성은 다음과 같이 2개의 붙임표(하이픈)을 속성이름 앞에 붙여(`--example`) 선언하며 `var()` 함수를 사용해 접근할 수 있다. 사용자 지정 속성의 이름은 대소문자를 구분한다.

```
:root {
  --color-brand--1: #ffb545;
  --color-brand--2: #00c46a;

  --color-dark--0: #242a2e;
  --color-dark--1: #2d3439;
  --color-dark--2: #42484d;
  --color-light--1: #aaa;
  --color-light--2: #ececec;
  --color-light--3: #d6dee0;
}

body {
  font-family: "Manrope", sans-serif;
  color: var(--color-light--2);
  font-weight: 400;
  line-height: 1.6;
}
```

**선택자는 곧 사용자 지정 속성의 유효 범위를 의미한다.** 위 예시처럼 `:root`(`html` 타입 선택자와 동일) 선택자에 선언된 사용자 지정 속성은 `html`요소 **하위 요소에서 모두 사용할 수 있게된다.** 즉, HTML 문서 전체에서 전역변수처럼 사용할 수 있다.

# 사용자 지정 속성의 상속

용자 지정 속성은 종속(cascade) 대상이며 부모로부터 상속된다. 특정 요소에 사용자 지정 속성을 설정하지 않았다면 해당 요소의 조상 요소의 사용자 지정 속성을 사용한다.

```
<div class="zero">
  <div class="one">
    <div class="two">
      <div class="three"></div>
      <div class="four"></div>
    </div>
  </div>
</div>
------------------------------
.zero {
    font-size: var(--test);
}

.one {
  --test: 50px;
}

.one {
  --test: 10px;
  font-size: var(--test);
}

.two {
  font-size: var(--test);
}

.three {
  --test: 2em;
  font-size: var(--test);
}

.four {
  font-size: var(--test);
}
```

위 예시의 `font-size` 결과는 다음과 같다.

- `class="two"` 요소: 10px
- `class="three"` 요소: 2em
- `class="four"` 요소: 10px (부모(`class="one"`)로부터 상속)
- `class="one"` 요소: 10px
- `class="zero"` 요소: 유효하지 않음. 모든 사용자 지정 속성의 기본값.

사용자 지정 속성은 종속(cascade)이 적용되기 때문에 `class="one"`의 `--test` 값은 나중에 선언된 `10px`이 적용된다.

# 사용자 지정 속성 대체 값

사용자 지정 속성을 사용할 때 선언되지 않은 값을 참조한 경우를 대비해 대체 값을 설정할 수 있다.

```
.two {
  color: var(--my-var, red); /* --my-var가 정의되지 않았을 경우 red로 표시됨 */
}

.three {
  background-color: var(
    --my-var,
    var(--my-background, pink)
  ); /* my-var와 --my-background가 정의되지 않았을 경우 pink로 표시됨 */
}

.three {
  background-color: var(
    --my-var,
    --my-background,
    pink
  ); /* 유효하지 않음: "--my-background, pink" */
}
```

# 유효하지 않은 값을 사용했을 때

`var()` 구문에서 유효하지 않은 값을 사용하면 해당 속성은 초기 값이나 상속된 값이 사용된다.

```
<p>This paragraph is initial black.</p>
----------------------------------
:root {
  --text-color: 16px;
}
p {
  color: blue;
}
p {
  color: var(--text-color);
}
```

위와 같은 경우 나중에 정의된 `color: var(--text-color)`가 적용된다. 하지만 `16px`은 `color` 속성에 유효하지 않은 값이기 때문에 브라우저는 우선 상속된 `color` 값이 있는지 확인한다. 위 예시의 경우 `color`가 지정된 부모 요소가 없기 떄문에 해당 속성의 디폴트 값(`black`)이 값으로 설정된다.

## Reference

**[MDN 사용자 지정 CSS 속성 사용하기 (변수)]**

https://developer.mozilla.org/ko/docs/Web/CSS/Using_CSS_custom_properties
