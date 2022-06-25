# CSS 선택자(Selector)

## 전체, 범용 선택자(Universal selectors)

```
* { 
  background-color: black;
}
```
문서의 모든 요소를 선택한다.

## 타입, 태그, 요소 선택자(Type, Tag name, Elements selectors)

```
h1 {
  color: red;
 }
 ```

태그 이름으로 요소를 선택한다.

## 다중 선택자
```
h1, h2 {
  color: red;
 }
 ```
콤마(,)를 이용해 여러 요소를 선택한다.

## id 선택자(Id selectors)
```
#unique {
  font-weight: 900;
 }
```
HTML에서 id 속성은 특정 요소를 식별하기 위한 고유한 값이다.

예를 들어 모든 버튼 요소중에서 로그인, 회원가입 버튼만 다른 스타일을 적용하고 싶다면, id로 해당 요소만 고를 수 있다.

id는 문서에서 유일한 값이어야 하며 과하게 사용 할 경우 가독성이 떨어진다.

## 클래스 선택자
```
.box { 
  
}

li.spacious {    // class가 spacious인 모든 li 요소
  margin: 2em;
}
```
id와 비슷하게 요소를 식별하는 데 사용. 

클래스는 id와 달리 여러 요소에 사용해 그룹화 할 수 있다. 가장 자주 사용하는 듯.


## 자손 선택자 " " (Descendant selectors), 후손 선택자
```
article p {
  text-align: center;
}
```
두 선택자 사이 공백(" ") 자체를 자손 결합자(descendant combinator)라고 하고, 자손 결합자를 사용한 선택자를 자손 선택자, 후손 선택자라고 함.

첫 번째 선택자와 일치하는 조상 요소의 하위에서 두번째 선택자와 일치하는 모든 요소에게 스타일 적용됨.

## 자식 선택자 > (Child selectors)
```
div > ol {
  color: red;
} 

.post2 > h2 {  // 다른 선택자와 혼용
  background-color: red;
}
```
두 선택자 사이 > 기호를 자식 결합자(child combinator)라 하고, 첫 번째 선택자와 일치하는 요소의 '직계 자식'인 두 번째 선택자와 일치하는 요소만 적용한다.


## 인접 형제 선택자 + (Adjacent sibling selectors)
```
<ul>
  <li>One</li>
  <li>Two!</li>   // 선택자 적용 대상
  <li>Three</li>
</ul>

li:first-of-type + li {
  color: red;
}
```

인접 형제 결합자(+)는 앞에서 지정한 요소의 바로 다음에 위치하는 형제 요소만 선택한다. 

위의 경우 가상 클래스 li:first-of-type의 바로 다음 요소인 Two!만 빨강색이 적용된다.

## 일반 형제 선택자 ~ (General sibling selectors)
```
/* Paragraphs that are siblings of and
   subsequent to any image */
img ~ p {
  color: red;
}
```
형제 요소 중 첫번 째 선택자 요소 뒤에 오는 모든 두 번째 선택자 요소들을 선택한다.

+ ```" " > + ~``` 이 4개의 기호를 다른 선택자와 결합해서 사용하는 선택자라 해서 결합자(Combinator)라고 한다

## 가상 클래스, 의사 클래스 (Pseudo class)

선택자 뒤에 붙여 상태를 특정하는 키워드. 즉 특정한 상태일 때 적용되는 스타일이다.
```
button:hover {  
  color: blue;
}
```
### 자주 쓰이는 가상 클래스 몇 가지

```:hover``` - 마우스 오버 시 적용.

```:active``` - 요소가 활성화 됐을 때.

```:nth-of-type(n)``` - 형제 그룹 내에서 위치에 따라 선택.

<br>

**[가상 클래스 목록]** 
+ https://developer.mozilla.org/ko/docs/Web/CSS/Pseudo-classes
  

## 가상 요소, 유사 요소(Pseudo element)
```
// 모든 p요소의 첫 번째 줄에 적용.
p::first-line {
  color: blue;
  text-transform: uppercase;
}
```
특정 요소의 일부분에만 스타일을 적용하기 위한 키워드.

## 속성 선택자(Attribute selctors)
```
input[type="text"] {
    width: 300px;
    color: yellow;
}
```
특정 속성을 가진 요소를 선택한다. type속성 값이 다양한 input 요소에 주로 쓰인다.

이 외에도 다양한 문법이 있는데 사용 빈도는 낮은 듯. 아래 링크 참고 할 것.

<br>

**[Attribute selectors]** 
+ https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors


**[CSS 선택자 ]**
+ https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Selectors



# CSS 우선 순위(Specificity)

CSS Specificity란 서로 충돌하는(동일한 속성) 스타일이 같은 요소에 적용됐을 때 우선 순위를 제어하는 규칙, 방법이다.

중요도를 순서대로 나열한 것은 다음과 같다.

1. Importance

2. 우선 순위

3. 소스 순서

## 소스 순서와 우선 순위(specificity)

CSS의 C는 Cascade인데, 계단식, 폭포를 의미한다. speicificity가 동일한 선택자의 경우 마지막에 선언된 선택자의 스타일이 적용된다.

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

특정 CSS 속성을 우선적으로 적용하게 만드는 키워드.!important의 대상은 위에서 봤던 specificity 계산 값을 무시하며 최우선으로 적용된다.
```   
.better {
    background-color: gray;
    border: none !important;  <--
}
```
!important 키워드가 외부 라이브러리를 사용한다거나, 의미적으로 편리한 경우도 있지만 계단식 CSS 스타일 적용 방식을 따르지 않기 때문에 혼란을 주기 쉽다.

따라서 정말 필요한 경우가 아니면 사용하지 않도록 하자.


## CSS 상속(Inheritance)

흔히 아는 상속의 개념과 다를 것이 없다. 하위 요소에 상위 요소의 특성이 적용 되는 것을 말한다.

가까이 있는 부모 요소의 속성을 우선적으로 상속 받는다. 

상속되지 않는 속성도 있고, 일부 요소는 부모의 속성을 상속받지 않는 경우도 있다.

상속을 제어하기 위한 값에 대한 것은 아래 링크 참고.

<br>

**[CSS 상속 이해하기]**
+ https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#%EC%83%81%EC%86%8D_%EC%A0%9C%EC%96%B4%ED%95%98%EA%B8%B0

## CSS 위치의 영향

지정된 스타일 시트에 따라 우선 순위가 나뉜다. 다음은 적용 되는 순서를 나타낸다(뒤로 갈 수록 우선 순위 높음).

1. 사용자 에이전트 스타일 시트의 선언 (예: 다른 스타일이 설정되지 않은 경우 사용되는 브라우저의 기본 스타일).
2. 사용자 스타일 시트의 일반 선언 (사용자가 설정한 사용자 정의 스타일).
3. 작성자 스타일 시트의 일반적인 선언 (웹 개발자가 설정한 스타일).
4. 작성자 스타일 목록에서 중요한 선언(!important)
5. 사용자 스타일 시트의 중요한 선언(!important)

사용자 스타일 시트는 말 그대로 사용자(클라이언트)가 설정한 스타일 시트를 말한다.

<br>

**[계단식(Cascade) 및 상속(Inheritence)]**
+ https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance