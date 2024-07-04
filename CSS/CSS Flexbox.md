<h2>목차</h2>

- [Flexbox](#flexbox)
- [플렉스 컨테이너 속성(Property)](#플렉스-컨테이너-속성property)
  - [flex-direction](#flex-direction)
  - [flex-wrap](#flex-wrap)
  - [flex-flow](#flex-flow)
  - [justify-content](#justify-content)
    - [기본 값 참고 사항](#기본-값-참고-사항)
  - [align-items](#align-items)
  - [align-content](#align-content)
- [플렉스 항목(Flex item)에서 사용할 수 있는 속성들](#플렉스-항목flex-item에서-사용할-수-있는-속성들)
  - [order](#order)
  - [align-self](#align-self)
  - [flex-grow](#flex-grow)
  - [flex-shrink](#flex-shrink)
  - [flex-basis](#flex-basis)
  - [flex](#flex)

# Flexbox

**웹 페이지 레이아웃을 지정하는데 매우 중요한 속성!**

말 그대로 컨테이너 안에 요소를 유연하게 배치하는데 사용. 주축과 교차축을 기준으로 요소를 배치하는 레이아웃 구성 방식이다. `display: flex`, `display: inline-flex`를 적용해준 요소를 '플렉스 컨테이너(flex container)'라 하고, 자식 요소들을 '플렉스 항목(flex item)'이라 한다.

`display: flex`로 설정된 요소의 외부 디스플레이 유형은 `block` 박스가 적용되며 `display: inline-flex`의 경우는 `inline` 박스가 적용된다.

플렉스 컨테이너 안에는 **주축(main axis)** 과 **교차 축(cross axis)** 2가지 축이 있는데 이 축을 기준으로 항목들이 배열된다.

<img src="./img/flex-box.png" width="450" height="250">

# 플렉스 컨테이너 속성(Property)

## flex-direction

주축의 축과 방향을 결정하는 속성. 기본 값은 수평, 좌->우 방향이며 아래 값에 따라 다르게 적용된다.

아래는 `flex-direction` 속성 값들이다.

```
flex-direction: row(기본 값);    - 수평 기본
flex-direction: row-reverse;    - 수평 반전(우->좌)
flex-direction: column;         - 수직 기본
flex-direction: column-reverse; - 수직 반전(하->상)
```

## flex-wrap

플렉스 항목들이 한 줄에 표시되게 할지, 플렉스 컨테이너를 넘어가지 않으면서 여러 줄에 표현할 것 인지(줄 바꿈 여부) 설정하는 속성.

주축이 수평일 때 새로운 행을 만들어 정렬하고, 수직일 땐 새로운 열을 만들어 요소를 나열한다.

```
flex-wrap: nowrap(기본 값);  - 요소들을 한 줄에 배치
flex-wrap: wrap;            - 여러 줄로 나눠 배치
flex-wrap: wrap-reverse;    - 여러 줄로 나누고, 시작점과 끝점을 반대로 배치
```

## flex-flow

`flex-direction`과 `flex-wrap`의 단축 속성.

```
/* 'flex-direction'만 설정하는 경우 */
flex-flow: row;
flex-flow: row-reverse;
flex-flow: column;
flex-flow: column-reverse;

/* 'flex-wrap'만 설정하는 경우 */
flex-flow: nowrap;
flex-flow: wrap;
flex-flow: wrap-reverse;

/* 'flex-direction', 'flex-wrap' 둘 다 설정하는 경우 */
flex-flow: row nowrap;
flex-flow: column wrap;
flex-flow: column-reverse wrap-reverse;
```

## justify-content

플렉스 컨테이너에서 주축을 기준으로, 그리드 컨테이너에서는 인라인 축을 기준으로 어떻게 정렬할 것인지를 정의한다.

기본 값은 `flex-start`이다.

```
justify-content: flex-start;    - 주축의 시작점부터 배치
justify-content: flex-end;      - 주축의 끝점부터 배치
justify-content: center;        - 주축 기준 중앙 정렬

/* 분산 정렬 */
justify-content: space-between; - 컨테이너 내에 고르게 분포하면서 시작과 끝 요소와 컨테이너 사이 공간은 없음
justify-content: space-around;  - 컨테이너 내에 고르게 분포하면서 시작과 끝 요소와 컨테이너 사이 빈 공간은 항목사이의 공간의 반으로 설정
justify-content: space-evenly;  - 컨테이너 내에 고르게 분포하면서 시작과 끝 요소와 컨테이너 사이 빈 공간도 항목사이 공간과 동일하게 배치함
```

### 기본 값 참고 사항

```
모든 기본 값은 w3c 2022 latest stable CSS 기준이며(글쓴 시점 최신) MDN에는 더 낮은 표준 제정 단계(Working Draft)의 값까지 포함해 기록되어있다. 물론 WD에 명시된 값도 최신 브라우저에서는 동작에 문제가 없다.
css w3c 표준과 표준 제정 단계에 따른 브라우저 지원 여부를 확인하려면 아래 링크 참조.
```

**[w3c 2022 snapshot]**

https://www.w3.org/TR/css-2022/

**[caniuse.com]**

https://caniuse.com/?search=justify-content

## align-items

`justify-content`가 주축이 기준이었다면 `align-items`는 교차 축에 따라 플렉스 항목 배치 방법을 지정한다. 그리드 레이아웃에서는 그리드 영역 내 블록 축의 항목 정렬을 제어한다.

주의할 점은 `flex-wrap`이 설정되어 플렉스 항목들이 여러 줄(2줄 이상)일 경우에는 `align-content` 속성이 우선된다.

기본 값은 `normal`이다.

```
align-items: stretch;              - flex items를 늘려서 플렉스 컨테이너 교차 축을 채움
align-items: flex-start;           - 교차 축 시작점부터 배치
align-items: flext-end;            - 교차 축의 끝점부터 배치
align-items: center;               - 교차 축 중앙 정렬
align-items: baseline;             - 텍스트의 밑줄에 맞춰 요소 정렬
```

## align-content

행이나 열이 **여러 개일 때** 교차 축을 기준으로 요소 배치 방법을 지정하는 속성.

`flex-wrap: nowrap`과 같이 단일 행, 열의 경우 아무 효과가 없다.

```
align-content: stretch;(기본 값)
align-content: flex-start;
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

## order

플렉스 항목의 순서를 설정한다(`z-index`처럼 쌓임 순서가 아닌 정렬 순서를 말함).

큰 값일수록 뒤로 밀려나며 `<integer>` 값을 사용할 수 있다.

```
order: 5;
order: -5;
```

## align-self

플렉스 컨테이너 내에 교차 축을 기준으로 개별 플렉스 항목의 배치 방식을 지정한다.

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

플렉스 항목이 컨테이너 내에서 차지하는 비율을 설정한다. 값을 설정하면 항목들이 컨테이너 너비만큼 채워진다.

```
/* <number> 단위 지정(음수는 불가능) */
flex-grow: 3;
flex-grow: 0.6;
flex-grow: 1;
```

## flex-shrink

컨테이너에 남은 공간이 없을 때(꽉 차있을 때) 혹은 플렉스 항목이 컨테이너보다 더 클때 요소들이 줄어드는 비율을 지정한다. 기본 값은 1이다.

```
/* <number> 단위 지정(음수는 불가능) */
flex-shrink: 2;
flex-shrink: 0.6;
```

## flex-basis

플렉스 컨테이너 내부에서 주축을 기준으로 플렉스 아이템의 크기를 설정한다. 주축의 기준선에 따라(수평, 수직) 너비도 되고 높이가 될 수도 있다. `box-sizing`을 따로 지정하지 않는다면 콘텐츠 박스의 크기를 변경한다.

플렉스 항목에 `auto` 값을 가지지 않은 `flex-basis`와 `width`(`flex-direction: column`인 경우 `height`) 값이 동시에 설정된 경우 `flex-basis`가 우선 적용된다.

`<length>`, 플렉스 컨테이너의 크기에 상대적인 `<percentage>`, `auto` 키워드 중 하나를 설정할 수 있으며 음수 값은 유효하지 않다.

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

**[codepen.io flexbox playground]**

https://codepen.io/enxaneta/pen/adLPwv

**[MDN Flexbox]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Flexible_Box_Layout

**[heropy.blog Flexbox]** <br>
https://heropy.blog/2018/11/24/css-flexible-box/

**이미지 출처** <br>
https://d2.naver.com/helloworld/8540176
