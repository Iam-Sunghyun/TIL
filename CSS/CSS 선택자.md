# CSS 선택자(selector)
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


## 자손 선택자(descendant selectors), 후손 선택자
```
article p {
  text-align: center;
}
```
두 선택자 사이 공백 자체를 자손 결합자(descendant combinator)라고 하고, 자손 결합자를 사용한 선택자를 자손 선택자, 후손 선택자라고 함.

첫 번째 선택자와 일치하는 조상 요소의 하위에서 두번째 선택자와 일치하는 모든 요소에게 스타일 적용됨.

## 자식 선택자(child selectors)
```
div > ol {
  color: red;
} 

.post2 > h2 {  // 다른 선택자와 혼용
  background-color: red;
}
```
두 선택자 사이 > 기호를 자식 결합자(child combinator)라 하고, 첫 번째 선택자와 일치하는 요소의 '직계 자식'인 두 번째 선택자와 일치하는 요소만 적용한다.

## 전체, 범용 선택자(Universal selectors)

```
* { 
  background-color: black;
}
```
문서의 모든 요소를 선택한다.


---

인접 선택자

가상 클래스, 가상 요소 선택자

속성 선택자



*선택자 적용 우선순위



[CSS 선택자 ] https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Selectors