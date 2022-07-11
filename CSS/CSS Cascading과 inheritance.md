# CSS Cascading

CSS Cascading이란 CSS 스타일 적용 우선 순위를 제어하는 규칙, 방법이다.

우선 순위에 영향을 주는 요소들을 중요도 순서대로 나열한 것은 다음과 같다.

1. Importance - CSS가 선언된 위치에 따라서 우선순위가 달라진다.(순서와 다름)

2. Specificity (우선 순위, 명시도, 특이도) - 구체적일수록(브라우저가 계산한 값에 따라) 우선 순위가 높다.
3. 소스 순서 - 선언된 순서에 따라 우선 순위가 적용된다. 즉, 나중에 선언된 스타일이 우선 적용된다.

## 소스 순서와 Specificity(명시도, 특이도)

CSS의 C는 Cascading인데, 계단식, 폭포를 의미한다. specificity가 동일한 선택자의 경우 마지막에 선언된 선택자의 스타일이 적용된다.

동일한 요소에 대해 더 이전에 선언된 스타일이 적용되는 경우도 있는데 사용된 선택자에 따라 specificity가 더 높게 계산될 수 있기 때문이다. 

specificity란 명시도, 특이도로 해석이 되며 CSS 선언의 가중치라고 보면 된다. 

브라우저는 선택자의 specificity를 4개의 자릿 수 값을 통해 계산한다. 다음은 선택자에 따른 점수를 나타낸 것 이다.

+ 1000 - style="" 속성을 통한 인라인 스타일(사용 지양)

+ 0100 - id 선택자 (#)

+ 0010 - 클래스 선택자(.), 속성 선택자(input[type=""]), 가상 클래스(:hover)
+ 0001 - 요소 선택자, 가상 요소(::first-line)

여기서 알아야 할 것은 각 선택자는 고유의 우선 순위가 있다는 것. 이해를 돕기 위해 위와 같이 표현 한 것이지 실제로 10진수처럼 계산 되진 않는다.

따라서 더 낮은 우선 순위의 선택자를 수백개 사용한다고 더 상위에 있는 선택자의 우선 순위보다 높아지진 않는다.

우선 순위 계산 예시는 아래 링크 참조.

<br>

**[CSS Specificity 계산]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#%EC%9A%B0%EC%84%A0_%EC%88%9C%EC%9C%84_specificity_2


**[Specificity 계산기]** <br>
https://specificity.keegan.st/

## !important 키워드

특정 CSS 선언을 최우선적으로 적용하게 만드는 키워드.```!important```의 대상은 위에서 봤던 specificity 계산 값을 무시하며 최우선으로 적용된다.
```   
.better {
    background-color: gray;
    border: none !important;  <--
}
```
```!important``` 키워드가 외부 라이브러리를 사용한다거나, 의미적으로 편리한 경우도 있지만 계단식 CSS 스타일 적용 방식을 따르지 않기 때문에 혼란을 주기 쉽다.

따라서 정말 필요한 경우가 아니면 사용하지 않도록 하자.


## CSS 위치에 따른 중요도(Importance)

지정된 스타일 시트에 따라 우선 순위가 나뉜다. 다음은 적용 되는 순서를 나타낸다(뒤로 갈 수록 우선 순위 높음).

1. 사용자 에이전트(브라우저) 스타일 시트의 선언 (다른 스타일이 설정되지 않은 경우 사용되는 브라우저의 기본 스타일).
2. 사용자 스타일 시트의 일반 선언 (사용자가 설정한 사용자 정의 스타일).
3. 작성자 스타일 시트의 일반 선언 (웹 개발자가 설정한 스타일).
4. CSS @keyframe animations
5. 작성자 스타일 목록에서 중요한 선언(!important)
6. 사용자 스타일 시트의 중요한 선언(!important)
7. 사용자 에이전트 스타일 시트의 중요한 선언(!important)
8. CSS transitions

사용자 스타일 시트는 말 그대로 사용자(클라이언트)가 설정한 스타일 시트를 말한다.

**[W3C Cascade Sorting Order]**<br>
https://www.w3.org/TR/css-cascade-4/#cascade-sort

## CSS 상속(Inheritance)

흔히 아는 상속의 개념과 다를 것이 없다. 부모 요소의 특성이 자식 요소에 적용 되는 것을 말한다.

가까이 있는 부모 요소의 속성이 우선 순위가 높다. 

상속되지 않는 속성도 있고, 일부 요소는 부모의 속성을 상속받지 않는 경우도 있다.

예를 들어 `color`는 상속되는 속성으로 자식 요소는 물론 자손 요소까지 적용된다. 하지만 `button ` 요소는 `color` 속성을 상속 받지 않는다.

## 상속 제어 값

`initial` - 해당 속성 값을 초기 값(default)으로 설정 한다.

`inherit` - 해당 속성 값을 상위 요소의 속성 값과 동일하게 설정한다. 즉 부모 요소 속성을 상속 받는다.

`unset` - 상속받는 속성이면 `inherit`하고 그렇지 않으면 `initial`처럼 작동한다.

`revert` - 스타일 선언의 위치(순서와 다름)에 따라 달라진다.
  
  + 사용자 에이전트(브라우저) 스타일 선언 - `unset`과 동일하게 작동.
  + 사용자 스타일 선언 - 브라우저의 default 스타일로 되돌린다.
  + 작성자(개발자) 스타일 선언 - 사용자가 지정한 스타일로 롤백.


<br>


**[CSS 상속 제어하기]**<br>
https://www.w3.org/TR/css-cascade-4/#defaulting-keywords <br>

**[계단식(Cascade) 및 상속(Inheritence)]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance

**[자주 사용하는 속성 상속 여부]** <br>
https://poiemaweb.com/css3-inheritance-cascading