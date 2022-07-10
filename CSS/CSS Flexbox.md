# Flexbox

**웹 페이지 레이아웃을 지정하는데 매우 중요한 속성!**

말 그대로 컨테이너 안에 요소를 유연하게 배치하는데 사용. `display: flex`를 적용해준 요소를 '플렉스 컨테이너(flex container)'라 하고, 자식 요소들을 '플렉스 항목(flex item)'이라 한다. 

플렉스 컨테이너 안에는 **주축(main axis)** 과 **교차축(cross axis)** 2가지 축이 있는데 이 축을 기준으로 항목들이 배열된다.


<img src="https://github.com/Iam-Sunghyun/TIL/blob/main/CSS/img/flex-box.png" width="450" height="250"> 

# 속성(Property)

## flex-direction

주축과 방향을 결정하는 속성. 기본 값은 수평 좌->우 방향이며 `flex-direction` 속성으로 방향을 변경할 수 있다. 

아래는 flex-direction 속성 값들이다.
```
flex-direction: row(기본 값);    - 수평 기본 
flex-direction: row-reverse;    - 수평 반전(우->좌) 
flex-direction: column;         - 수직 기본
flex-direction: column-reverse; - 수직 반전(하->상)
```

# 하위 요소 정렬 속성

## justify-content

플렉스 컨테이너에서 주축을 기준으로 요소와 콘텐츠를 어떻게 배치할 지 결정한다. 

기본 값은 `flex-start`이다.
```
justify-content: flex-start;    - 주축의 시작점부터 배치 
justify-content: flex-end;      - 주축의 끝점부터 배치
justify-content: cetner;        - 주축 기준 중앙 정렬

/* 분산 정렬 */
justify-content: space-between; - 컨테이너 내에 고르게 분포하면서 시작과 끝 요소와 컨테이너 사이 공간은 없음
justify-content: space-around;  - 컨테이너 내에 고르게 분포하면서 시작과 끝 요소와 컨테이너 사이 빈 공간은 항목사이의 공간의 반으로 설정 
justify-content: space-evenly;  - 컨테이너 내에 고르게 분포하면서 시작과 끝 요소와 컨테이너 사이 빈 공간도 항목사이 공간과 동일하게 배치함 
```

## flex-wrap

플렉스 항목들이 한 줄에 표시되게 할 지, 플렉스 컨테이너를 넘어가지 않으면서 여러 줄에 표현할 것 인지 설정하는 속성. 

주축이 수평일 때 새로운 행을 만들어 정렬하고, 수직일 땐 새로운 열을 만들어 요소를 나열한다.

또한 교차축의 방향도 지정할 수 있다.

```
flex-wrap: nowrap(기본 값);  - 요소들을 한 줄에 배치 
flex-wrap: wrap;            - 여러 줄로 나눠 배치
flex-wrap: wrap-reverse;    - 여러 줄로 나누고, 교차축 반대 방향으로 배치
```

## align-items 

`justify-content`가 주축을 기준이었다면 `align-items`는 교차축에 따라 요소를 배치하는 방법을 지정한다. 

기본 값은 `flex-start`로 상-하 방향으로 배치한다.
```
align-items: flex-start(기본 값);   - 교차축 시작점부터 배치
align-items: flext-end;            - 교차축의 끝점부터 배치
align-items: center;               - 교차 축 중앙 정렬 
align-items: baseline;             - 텍스트의 밑줄에 맞춰 요소 정렬
```
## align-content

행이나 열이 **여러 개일 때** 교차축을 기준으로 요소 배치 방법을 지정하는 속성.

`flex-wrap: nowrap`과 같이 단일 행, 열의 경우 아무 효과가 없다.
```
align-content: flex-start(기본 값);
align-content: flex-end;

/* Baseline(글자 밑줄) 기준 정렬 */
align-content: baseline;
align-content: first baseline;
align-content: last baseline;

/* 분산 정렬 */
align-content: space-between;
align-content: space-around;
align-content: space-evenly;
```

# 플렉스 항목(Flex item)에서 사용할 수 있는 속성들

플렉스 컨테이너 자체에는 사용하지 않고, 개별 요소(플렉스 항목)에 사용하는 속성들이다.

## align-self

`align-items`와 매우 비슷하지만 플렉스 컨테이너 내에 교차축을 기준으로 개별 요소의 배치 방식을 지정한다. 

```
align-self: flex-start; 
align-self: flex-end;

/* Baseline(글자 밑줄)기준 정렬 */
align-self: baseline;
align-self: first baseline;
align-self: last baseline;
align-self: stretch;
```

## flex-grow 
컨테이너에 남은 공간이 있을 때 요소가 그 공간을 얼마나 차지할 지 비율을 결정한다.

```
/* <number> 단위 지정(음수는 불가능) */
flex-grow: 3;
flex-grow: 0.6;
flex-grow: 1;
```

## flex-shrink

컨테이너에 남은 공간이 없을 때(꽉 차있을 때) 요소들이 줄어드는 비율을 지정한다. 기본 값은 1이다.
```
/* <number> 단위 지정(음수는 불가능) */
flex-shrink: 2;
flex-shrink: 0.6;
```

## flex-basis
요소가 배치되기 전에 요소의 최초 크기를 결정. 주축에 따라(수평, 수직) 크기를 결정하기 때문에 너비도 되고 높이가 될 수도 있다.

```
/* 주축에 따른 너비(width) 지정 */
flex-basis: 10em;
flex-basis: 3px;
flex-basis: auto;

/* 원본 크기 키워드 */
flex-basis: fill;
flex-basis: max-content;
flex-basis: min-content;
flex-basis: fit-content;

/* 플렉스 아이템 내용 크기에 따라 조절 */
flex-basis: content;
```

## flex

앞서 본 앞서 본 `flex-grow`, `flex-shrink`, `flex-basis` 의 단축 속성(shortand)이다.
```
/* flex-grow | flex-shrink | flex-basis */
flex: 2 2 10%;
```

<br>

**[MDN Flexbox]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Flexible_Box_Layout

**[heropy.blog Flexbox]** <br>
https://heropy.blog/2018/11/24/css-flexible-box/

**이미지 출처** <br>
https://d2.naver.com/helloworld/8540176

