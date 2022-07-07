# CSS 값과 단위

CSS 에서 사용 할 수 있는 숫자 값(Numeric data type)은 다음과 같다.

`<integer>` - 말 그대로 정수 값을 뜻한다.<br>
`<number>` - 정수와 소수를 모두 포함한다.<br>
`<dimension>` - px와 같은 단위가 붙는 값을 말한다. 단위 유형에는 `<length>`, `<angle>`, `<time>`, `<frequency>`, `<resolution>`가 있다.<br>
`<percentage>` - 백분율을 말한다. 백분율은 항상 다른 값을 기준으로 계산 된다.<br>

<br>

**[w3c Numeric Data Types]** <br>
https://www.w3.org/TR/css-values-3/#numeric-types

# 절대 길이(`<length>`)단위

가장 자주 사용되는 `<length>`단위들이다. 그 중에서도 px을 가장 많이 사용한다.

px 외에 값들은 실제 인쇄물에 주로 사용한다고 함.

|단위|이름|설명|
|:---:|:---:|:---:|
|`px`|픽셀|1/96 of 1in|
|`cm`|센티미터|96px / 2.54|
|`mm`|밀리미터|1/10 of 1cm|
|`Q`|4분의 1 밀리미터|1/40 of 1cm|
|`in`|인치|1in = 2.54cm = 96px|
|`pt`|포인트|1/72 of 1in|
|`pc`|Picas|1/6 of 1in|


# 상대 길이 단위

다른 요소와 상대적인 값의 단위. 화면이나 다른 요소와 비례해서 크기를 변경하고자 할 떄 유용하다.

자주 사용하는 상대 길이 단위는 다음과 같다.

|단위|이름|설명|
|:---:|:---:|:---:|
|`em`|엠|배수 단위. 요소에 지정된 font-size에 상대적인 사이즈를 설정한다. font-size 속성에 사용 할 경우 "부모 요소의 font-size x배" 를 의미한다. <br>사용 예로 버튼의 border-radius를 em으로 값을 지정하면 폰트 크기를 키워도 동일한 곡률을 표현할 수 있어서 유용하다. <br> 하지만 자식 요소에 상속이 누적되어 의도치 않게 크기가 커지거나 작아 질 수 있다.| 
|`rem`|렘(root em)| rem 단위는 "루트 요소(<html>)의 글꼴 크기(16px) x배" 를 의미한다. 즉 하나의 글꼴 크기 기준으로 값을 계산하기 때문에 em보다 예측하기 쉽다.
|


## 백분율(`<Percentage>`)

|단위|이름|설명|
|:---:|:---:|:---:|
|% |퍼센트|부모 요소의 비율을 따르거나 몇몇 요소는 요소 자체의 값에 기반하여 비율을 계산한다. <br> 예를 들면 line-height 경우 해당 요소의 폰트 크기에 대한 비율로 계산한다.|

그 외에 단위들은 링크 참조.

<br>

**[MDN CSS 값과 단위]** <br>
https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Values_and_units#%EC%88%AB%EC%9E%90_%EA%B8%B8%EC%9D%B4_%EB%B0%8F_%EB%B0%B1%EB%B6%84%EC%9C%A8

**[w3c values and units]** <br>
https://www.w3.org/TR/css-values-3/