**목차**

- [Position 프로퍼티](#position-프로퍼티)
- [Position 프로퍼티 값](#position-프로퍼티-값)
  - [`static`](#static)
  - [`relative(상대 위치)`](#relative상대-위치)
  - [`absolute(절대 위치)`](#absolute절대-위치)
  - [`fixed(고정 위치)`](#fixed고정-위치)
  - [`sticky`](#sticky)
- [컨테이닝 블록(containing block)이란?](#컨테이닝-블록containing-block이란)
  - [컨테이닝 블록의 식별](#컨테이닝-블록의-식별)
  - [`absolute`, `fixed`의 컨테이닝 블록이 변경되는 경우](#absolute-fixed의-컨테이닝-블록이-변경되는-경우)
  - [초기 컨테이닝 블록?](#초기-컨테이닝-블록)
- [z-index](#z-index)
- [overflow 프로퍼티](#overflow-프로퍼티)
- [쌓임 맥락(stacking-context)](#쌓임-맥락stacking-context)
  - [쌓임 맥락의 핵심 내용](#쌓임-맥락의-핵심-내용)

# Position 프로퍼티

문서 내에서 요소의 위치를 설정하기 위한 프로퍼티.

`position` 프로퍼티 값과, 추가로 `top`, `left`, `right`, `bottom` 좌표 값을 설정해 최종 위치를 지정한다.

# Position 프로퍼티 값

Postion 프로퍼티의 값으로는 아래 5가지가 있다.

## `static` 

**문서 흐름대로 배치**한다(normal-flow). `position`의 기본 값으로 모든 요소에 적용되어 있다. 위치 지정이 안 된 것으로 취급되며 `top`, `left`, `right`, `bottom`, `z-index` 값의 영향을 받지 않는다.

## `relative(상대 위치)` 

요소를 **일반적인 문서 흐름에 따라 배치**하고 **자기 자신 위치(static으로 지정되었을 때의 위치)를 기준으로 이동**한다.

## `absolute(절대 위치)` 

**문서 흐름에서 제거**되어 페이지에서 공간도 차지하지 않게 되며 가장 가까운 **조상 요소 중 위치 지정 요소(`position` 프로퍼티가 `static`이 아닌 요소)가 있다면 해당 조상 요소의 `padding` 박스를 기준으로 배치**한다. 

만약 조상 중 위치 지정 요소가 없다면 초기 컨테이닝 블록(`<html>`의 컨테이닝 블록)을 기준으로 배치한다.


## `fixed(고정 위치)` 

`absolute`처럼 요소를 **일반적인 문서 흐름에서 제거**되어 페이지 레이아웃에 공간이 배정되지 않는다. **브라우저의 viewport를 기준으로** 좌표 프로퍼티(top, bottom, left, right)을 사용하여 위치를 이동시킨다. 

**즉, 해당 요소가 항상 페이지의 같은 위치에 출력**되게 된다(네비게이션 바 구현할 때 사용). 

```
※ position: absolute나 fixed 선언 시, block 요소의 width는 inline 요소와 같이 content에 맞게 변화되므로 필요에 따라 적절한 width를 지정해 주도록 하자.

※ 또한 절대 위치 지정 요소(absolute, fixed)의 바깥 여백은 서로 상쇄되지 않는다.
```

## `sticky` 

**가장 가까이에 있는 스크롤되는 조상 요소, 혹은 표 관련 요소를 포함한 컨테이닝 블록(가장 가까운 블록 레벨 조상)을 기준으로** `top`, `right`, `bottom`, `left`의 값에 따라 오프셋을 적용해 위치시킨다.

```
오프셋(offset)-> 상대적인 위치 차이, 변위차. (분야나 상황별로 여러 가지로 해석됨)
```

**[CSS position: stikcy]**

https://tech.lezhin.com/2019/03/20/css-sticky

**[poienmaweb 요소의 위치 정의]** 

https://poiemaweb.com/css3-position

**[MDN Position]**

https://developer.mozilla.org/ko/docs/Web/CSS/position

  
# 컨테이닝 블록(containing block)이란?

말 그대로 어떤 요소가 담겨있는 사각형의 영역을 말하며 해당 요소의 크기, 위치 값을 설정할 때 기준이 된다.

보통 가장 가까이 있는 블록 레벨 조상의 콘텐츠 영역(블록 레벨 부모 요소 콘텐츠 영역)이지만, `position: fixed;` 같이 그렇지 않은 경우도 있다.


## 컨테이닝 블록의 식별

컨테이닝 블록의 식별은 다음 상황에 맞게 달라진다.

+ `position` 프로퍼티가 `static`, `relative`, `sticky` 중 하나라면 가장 가까운 조상 요소 중 블록 레벨 요소(`inline-block`, `block`, `list-item` 등) 혹은 내부에 블록 영역을 만들어내는 조상 요소(`table`, `flex`, `grid`, 블록 컨테이너 자기 자신)의 콘텐츠 박스 영역의 경계를 기준으로 형성된다. -> 결국 `fixed`, `absolute`가 아니라면 부모 요소 콘텐츠 박스가 곧 컨테이닝 블록이 됨.

+ `position` 프로퍼티가 `absolute`, `fixed`의 경우 위 내용 참조.

## `absolute`, `fixed`의 컨테이닝 블록이 변경되는 경우

`position`이 `absolute`인 경우 가장 가까운 조상 요소 중 `position`이 `static`이 아닌 요소가 있다면 해당 조상 요소가, 그렇지 않다면 초기 컨테이닝 블록(루트 요소인 `<html>`의 컨테이닝 블록)이 컨테이닝 블록이 됐었고 `fixed`의 경우는 viewport를 컨테이닝 블록으로 위치가 결정됐었다.

위 두가지 `position`에서 컨테이닝 블록이 변경되는 경우가 있는데, 요소의 조상 중 다음을 만족하는 요소가 있는 경우 컨테이닝 블록이 해당 조상 요소의 `padding` 박스로 변경된다.

+ `transform`, `perspective` 속성이 `none`이 아닌 경우
+ `filter` 프로퍼티가 `none`인 경우 
+ `will-change` 프로퍼티가 `transform`, `perspective`인 경우
+ `contain` 프로퍼티 값이 `paint`인 경우


## 초기 컨테이닝 블록?
```
초기 컨테이닝 블록은 루트 요소(`<html>`)의 컨테이닝 블록을 말하는데 이는 뷰포트 또는 (페이지로 나뉘는 매체에선) 페이지 영역의 크기와 같다.
```
**[MDN containing block]**

https://developer.mozilla.org/ko/docs/Web/CSS/Containing_block

# z-index

요소의 z축 값을 설정하는 프로퍼티로 **`position` 프로퍼티가 `static` 이외인 요소에만 적용되며** 요소 출력 우선순위를 결정한다.

웹 페이지의 모든 요소는 기본적으로 `auto` 값을 가지며 이는 0과 같다.

프로퍼티 값으로는 `<integer>`, `auto` 값을 갖는다.
```
z-index: auto;

/* <integer> */
z-index: 0;
z-index: 3;
z-index: 289;
z-index: -1; 
```

**[MDN z-index]**

https://developer.mozilla.org/en-US/docs/Web/CSS/z-index



# overflow 프로퍼티

`overflow` 단축 속성은 부모 요소를 넘어서는 콘텐츠를 처리하는 방법을 설정한다.

잘라내기, 스크롤 바 등 여러 가지 설정을 사용할 수 있다.

```
/* 키워드 값 */
overflow: visible;
overflow: hidden;
overflow: clip;
overflow: scroll;
overflow: auto;
overflow: hidden visible;
```

# 쌓임 맥락(stacking-context)

요소 출력 순서를 나타내기 위해 사용자 시점에서 z축을 추가하여 웹 페이지를 3차원으로 개념화한 것을 **쌓임 맥락(stacking-context)**이라 한다.

다음 조건을 만족하는 요소에서 쌓임 맥락이 생성된다.

+ 문서의 루트 요소. (`<html>`)

+ `position`이 `absolute` 또는 `relative`이고, `z-index`가 `auto`가 아닌 요소.
  
+ `position`이 `fixed` 또는 `sticky`인 요소. (`sticky`는 모든 모바일 + 브라우저에서는 해당하지만 구형 데스크톱 브라우저에서는 해당하지 않음)
  
+ 플렉스(`flexbox`) 컨테이너의 자식 중 `z-index`가 `auto`가 아닌 요소.
  
+ 그리드(`grid`) 컨테이너의 자식 중 `z-index`가 `auto`가 아닌 요소.
  
+ `opacity`가 1보다 작은 요소. (불투명도 명세 참고)
  
+ `mix-blend-mode`가 `normal`이 아닌 요소.
  
+ 다음 속성 중 하나라도 `none`이 아닌 값을 가진 요소.
  + `transform`
  + `filter`
  + `perspective` 
  + `clip-path`
  + `mask` / `mask-image` / `mask-border`
  
+ `isolation`이 `isolate`인 요소.
  
+ `-webkit-overflow-scrolling`이 `touch`인 요소.
  
+ `will-change`의 값으로, 초깃값이 아닐 때 새로운 쌓임 맥락을 생성하는 속성을 지정한 요소.
  
+ `contain`이 `layout`, `paint`, 또는 둘 중 하나를 포함하는 값(`strict`, `content` 등)인 요소.

<br>

## 쌓임 맥락의 핵심 내용

MDN에서 가져온 쌓임 맥락의 핵심 내용은 다음과 같다.

+ 쌓임 맥락은 다른 쌓임 맥락에 포함될 수 있으며 함께 쌓임 맥락의 계층을 만들어낸다.
  
+ 각 쌓임 맥락은 형제 요소와 완전히 독립적이며 쌓임을 처리할 땐 자손 요소만 고려한다. 즉, A 요소 내부의 `z-index` 값에 따른 쌓임 맥락은 A 외부에 영향을 끼치지 않는다. 
  
+ 각 쌓임 맥락은 독립적이다. 요소의 내용이 스택된 후 전체 요소는 부모 요소의 쌓임 맥락에 포함된다.

**[MDN stacking-context]**

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context