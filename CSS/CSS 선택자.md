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
HTML에서 `id`속성은 특정 요소를 식별하기 위한 고유한 값이다.

예를 들어 모든 버튼 요소중에서 로그인, 회원가입 버튼만 다른 스타일을 적용하고 싶다면, `id`로 해당 요소만 고를 수 있다.

`id`는 문서에서 유일한 값이어야 하며 과하게 사용 할 경우 가독성이 떨어진다.

## 클래스 선택자
```
.box { 
  
}

li.spacious {    // class가 spacious인 모든 li 요소
  margin: 2em;
}
```
```id```와 비슷하게 요소를 식별하는 데 사용. 

클래스는 ```id```와 달리 여러 요소에 사용해 그룹화할 수 있다. 가장 자주 사용하는 듯.


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

위의 경우 가상 클래스``` li:first-of-type```의 바로 다음 요소인 Two!만 빨강색이 적용된다.

## 일반 형제 선택자 ~ (General sibling selectors)
```
/* Paragraphs that are siblings of and
   subsequent to any image */
img ~ p {
  color: red;
}
```
형제 요소 중 첫번 째 선택자 요소 뒤에 오는 모든 두 번째 선택자 요소들을 선택한다.

+ ```" " > + ~``` 이 4개의 기호를 다른 선택자와 결합해서 사용하는 선택자라 해서 결합자(Combinator)라고 한다.

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

**[가상 클래스 목록]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/Pseudo-classes
  

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
특정 속성을 가진 요소를 선택한다. type 속성 값이 다양한 ```input``` 요소에 주로 쓰인다.

이 외에도 다양한 문법이 있는데 사용 빈도는 낮은 듯. 아래 링크 참고 할 것.

<br>

**[Attribute selectors]** <br>
https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors


**[CSS 선택자 ]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Selectors

