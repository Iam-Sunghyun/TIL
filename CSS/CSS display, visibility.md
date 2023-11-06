# display, visibility 속성

## display 속성

`display` 속성은 `block`, `inline`, `block-inline`같은 키워드로 출력되는 요소의 박스 형식을 설정할 수 있는 레이아웃 정의에 중요한 속성이다.

다음은 자주 사용하는 속성 값들이다.

- `block` - block 특성을 가지는 요소(block 레벨 요소)로 지정한다.
- `inline` - inline 특성을 가지는 요소(inline 레벨 요소)로 지정한다.
- `inline-block` - inline, block 특성을 모두 가지는 요소로 지정한다.
- `none` - 해당 요소를 화면에 표시하지 않는다 (공간조차 사라진다).
- `grid`, `flex`

**[MDN CSS_layout]**

https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout

https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout/Introduction

## visibility 속성

`visibility` 속성은 문서의 레이아웃을 변경하지 않고 요소를 보이게 하거나 숨길 수 있다. `visibility`로 `<table>`의 행이나 열을 숨길 수도 있다.

```
/* visibility 값 */
visibility: visible;
visibility: hidden; // 레이아웃은 사라지지 않고 숨김.
visibility: collapse;
```

`display: none;`의 경우 레이아웃에서도 사라지지만 `visibility: hidden;`은 출력은 숨기지만 레이아웃은 유지된다.

**[CSS display, visibility 속성]** <br>
https://developer.mozilla.org/en-US/docs/Web/CSS/display

https://developer.mozilla.org/en-US/docs/Web/CSS/visibility
