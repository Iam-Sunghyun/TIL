# CSS 우선 순위(Specificity)

CSS Specificity란 서로 충돌하는(동일한 속성) 스타일이 같은 요소에 적용됐을 때 우선 순위를 제어하는 규칙, 방법이다.

중요도를 순서대로 나열한 것은 다음과 같다.

1. Importance - CSS가 선언된 위치에 따라서 우선순위가 달라진다.(순서와 다름)

2. 우선 순위 (Specificity, 명시도, 특이도 등등) - 구체적 일수록(브라우저가 계산한 값에 따라)
 우선 순위가 높다.
3. 소스 순서 - 선언된 순서에 따라 우선 순위가 적용된다. 즉, 나중에 선언된 스타일이 우선 적용된다.

## 소스 순서와 우선 순위(specificity)

CSS의 C는 Cascading인데, 계단식, 폭포를 의미한다. speicificity가 동일한 선택자의 경우 마지막에 선언된 선택자의 스타일이 적용된다.

하지만 어떤 경우는 더 이전에 선언된 스타일이 적용되는 경우도 있다. 사용된 선택자에 따라 specificity가 더 높게 계산되는 경우가 있기 때문이다. 

브라우저는 선택자의 specificity를 4개의 자릿 수 값을 통해 계산한다. 다음은 선택자에 따른 점수를 나타낸 것 이다.

+ 1000 - style="" 속성을 통한 인라인 스타일(사용 지양)

+ 0100 - id 선택자 (#)

+ 0010 - 클래스 선택자(.), 속성 선택자(input[type=""]), 가상 클래스(:hover)
+ 0001 - 요소 선택자, 가상 요소(::first-line)

여기서 알아야 할 것은 각 선택자는 고유의 우선 순위가 있다는 것. 이해를 돕기 위해 각 자릿 수라고 표현 한 것이지 실제로 10진수처럼 계산 되진 않는다.

따라서 더 낮은 우선 순위의 선택자를 수백개 사용한다고 더 상위에 있는 선택자의 우선 순위보다 높아지진 않는다.

우선 순위 계산 예시는 아래 링크 참조.

<br>

**[CSS Specificity 계산]**
+ https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#%EC%9A%B0%EC%84%A0_%EC%88%9C%EC%9C%84_specificity_2


**[Specificity 계산기]** 
+ https://specificity.keegan.st/

## !important 키워드

특정 CSS 속성을 우선적으로 적용하게 만드는 키워드.```!important```의 대상은 위에서 봤던 specificity 계산 값을 무시하며 최우선으로 적용된다.
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

1. 사용자 에이전트(브라우저) 스타일 시트의 선언 (브라우저에는 모든 문서에 기본 스타일을 제공하는 기본 스타일 시트).
2. 사용자 스타일 시트의 일반 선언 (사용자가 설정한 사용자 정의 스타일).
3. 작성자 스타일 시트의 일반 선언 (웹 개발자가 설정한 스타일).
4. CSS @keyframe animations
5. 작성자 스타일 목록에서 중요한 선언(!important)
6. 사용자 스타일 시트의 중요한 선언(!important)
7. 사용자 에이전트 스타일 시트의 중요한 선언(!important)
8. CSS transitions

사용자 스타일 시트는 말 그대로 사용자(클라이언트)가 설정한 스타일 시트를 말한다.


## CSS 상속(Inheritance)

흔히 아는 상속의 개념과 다를 것이 없다. 부모 요소의 특성이 자식 요소에 적용 되는 것을 말한다.

가까이 있는 부모 요소의 속성이 우선 순위가 높다. 

상속되지 않는 속성도 있고, 일부 요소는 부모의 속성을 상속받지 않는 경우도 있다.

상속을 제어하기 위한 속성 값에 대한 것은 아래 링크 참고.

<br>

**[자주 사용하는 속성 상속 여부]** <br>

https://poiemaweb.com/css3-inheritance-cascading

**[CSS 상속 이해하기]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#%EC%83%81%EC%86%8D_%EC%A0%9C%EC%96%B4%ED%95%98%EA%B8%B0


**[계단식(Cascade) 및 상속(Inheritence)]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance

