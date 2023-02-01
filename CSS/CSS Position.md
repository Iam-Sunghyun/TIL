**목차**

- [Position 프로퍼티](#position-프로퍼티)
  - [Position 프로퍼티 값](#position-프로퍼티-값)
    - [`static`](#static)
    - [`relative(상대 위치)`](#relative상대-위치)
    - [`absolute(절대 위치)`](#absolute절대-위치)
    - [`fixed(고정 위치)`](#fixed고정-위치)
    - [`sticky`](#sticky)
- [z-index](#z-index)
- [overflow 프로퍼티](#overflow-프로퍼티)
- [stacking-context(쌓임 맥락)](#stacking-context쌓임-맥락)

# Position 프로퍼티

문서 내에서 요소의 위치를 설정하기 위한 프로퍼티.

`position` 프로퍼티 값과, 추가로 `top`, `left`, `right`, `bottom` 좌표 값을 설정해 최종 위치를 지정한다.

## Position 프로퍼티 값

Postion 프로퍼티의 값으로는 아래 5가지가 있다.

### `static` 

**문서 흐름대로 배치**한다(normal-flow). `position`의 기본 값으로 위치 지정이 안 된 것으로 취급되며 `top`, `left`, `right`, `bottom`, `z-index` 값의 영향을 받지 않는다.

### `relative(상대 위치)` 

요소를 **일반적인 문서 흐름에 따라 배치**하고 **자기 자신 위치(static으로 지정되었을 때의 위치)를 기준으로 이동**한다.

### `absolute(절대 위치)` 

**문서 흐름에서 제거**되어 페이지에서 공간도 차지하지 않게 되며 가장 가까운 **조상 요소 중 위치 지정 요소(`position` 프로퍼티가 `static`이 아닌 요소)가 있다면 해당 조상 요소를 기준으로 배치**한다. 

만약 조상 중 위치 지정 요소가 없다면 초기 컨테이닝 블록(`<html>`)을 기준으로 배치한다.

### `fixed(고정 위치)` 

`absolute`처럼 요소를 **일반적인 문서 흐름에서 제거**되어 페이지 레이아웃에 공간이 배정되지 않는다. **브라우저의 viewport를 기준으로** 좌표 프로퍼티(top, bottom, left, right)을 사용하여 위치를 이동시킨다. 

**즉, 해당 요소가 항상 페이지의 같은 위치에 출력**되게 된다(네비게이션 바 구현할 때 사용). 단, 요소의 조상 중 `transform`, `perspective`, `filter` 프로퍼티 중 어느 하나라도 `none`이 아니라면 viewport가 아닌 그 조상 요소를 기준으로 이동한다.

```
※ fixed 선언 시, block 요소의 width는 inline 요소와 같이 content에 맞게 변화되므로 필요에 따라 적절한 width를 지정해 주도록 하자.
```

### `sticky` 

**가장 가까이에 있는 스크롤되는 조상 요소와 표 관련 요소를 포함한 컨테이닝 블록(가장 가까운 블록 레벨 조상)을 기준으로** `top`, `right`, `bottom`, `left`의 값에 따라 오프셋을 적용해 위치시킨다.

```
오프셋(offset)-> 상대적인 위치 차이, 변위차. (분야나 상황별로 여러 가지로 해석됨)
```

**[poienmaweb 요소의 위치 정의]** 

https://poiemaweb.com/css3-position

**[MDN Position]**

https://developer.mozilla.org/ko/docs/Web/CSS/position


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

# stacking-context(쌓임 맥락)

사용자 시점에서의 웹 페이지를 3차원으로 개념화한 것을 **stacking-context, 쌓임 맥락**이라 한다.


MDN에서 가져온 쌓임 맥락의 핵심 내용은 다음과 같다.

+ 쌓임 맥락은 다른 쌓임 맥락에 포함될 수 있으며 함께 쌓임 맥락의 계층을 만들어낸다.
  
+ 각 쌓임 맥락은 형제 요소와 완전히 독립적이다. 쌓임을 처리할 땐 자손 요소만 고려한다. -> A 요소 내부의 `z-index` 값에 따른 쌓임 맥락은 A 외부에 영향을 끼치지 않는다. 
  
+ 각 쌓임 맥락은 독립적입니다. 요소의 내용이 스택된 후 전체 요소는 상위 쌓임 맥락의 스택 순서로 간주된다. 

**[MDN stacking-context]**

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context