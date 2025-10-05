<h2>목차</h2>

- [React Element Tree(가상 DOM)과 재조정 (Reconciliation) 요약](#react-element-tree가상-dom과-재조정-reconciliation-요약)
  - [리액트 엘리먼트(React element) 구조](#리액트-엘리먼트react-element-구조)
  - [컴포넌트를 직접 호출하게 되면?](#컴포넌트를-직접-호출하게-되면)
- [컴포넌트 렌더링 과정](#컴포넌트-렌더링-과정)
- [1. 렌더링 트리거](#1-렌더링-트리거)
  - [초기 렌더링(애플리케이션 시작)](#초기-렌더링애플리케이션-시작)
  - [컴포넌트(혹은 조상 컴포넌트)의 상태 업데이트(리렌더링)](#컴포넌트혹은-조상-컴포넌트의-상태-업데이트리렌더링)
- [2. 렌더링 단계(Render Phase)](#2-렌더링-단계render-phase)
  - [재조정(reconciliation)이란?](#재조정reconciliation이란)
- [재조정(Reconciliatioin) 과정](#재조정reconciliatioin-과정)
  - [1. 초기 렌더링 - 가상 DOM과 Fiber 트리 생성](#1-초기-렌더링---가상-dom과-fiber-트리-생성)
    - [Fiber 트리와 가상 DOM, Fiber 엔진의 특성](#fiber-트리와-가상-dom-fiber-엔진의-특성)
  - [2. 컴포넌트 리렌더링 - 새 가상 DOM 생성, diffing 및 reconciliation](#2-컴포넌트-리렌더링---새-가상-dom-생성-diffing-및-reconciliation)
- [3. 커밋 단계(Commit Phase)](#3-커밋-단계commit-phase)
  - [Diifing 알고리즘](#diifing-알고리즘)
- [재조정(Reconciliation)의 효율에 대해](#재조정reconciliation의-효율에-대해)
  - [왜 리액트가 가상 DOM을 쓰는가?](#왜-리액트가-가상-dom을-쓰는가)
    - [결론](#결론)
  - [Reference](#reference)

# React Element Tree(가상 DOM)과 재조정 (Reconciliation) 요약

React는 실제 DOM의 경량 사본과 같은 **가상 DOM(DOM의 가상 표현으로 신 공식 문서에선 리액트 엘리먼트 트리, UI 트리라고 부른다)** 을 사용하며 React Virtual DOM에는 실제 DOM에 존재하는 모든 개체에 대해 대응되는 개체가 있다.

리액트 앱에서 상태가 변경될 때마다 업데이트된 새로운 가상 DOM 트리가 생성되며 React는 현재의 가상 DOM과 새로운 DOM을 비교하여 변경 사항을 확인한다.

<!-- (리액트는 항상 2개의 가상 DOM을 유지한다고 한다). -->

리액트에서 2개의 트리를 비교할 때 사용하는 알고리즘을 비교 알고리즘 (Diffing Algorithm)이라 하고 비교 알고리즘으로 변경된 내용을 적용하기 위한 최소한의 연산을 결정하는 과정을 **재조정(Reconciliation)** 이라고 한다.

```
가상 DOM은 단순히 컴포넌트가 반환하는 리액트 엘리먼트로 이루어진 트리로 자바스크립트 객체이다(React 웹 애플리케이션에 한정된 용어이므로 현재 최신 공식문서에선 가상 DOM이라는 용어가 사라졌다).
```

## 리액트 엘리먼트(React element) 구조

리액트 엘리먼트는 가상 DOM을 구성하는 노드로 `createElement(type, props, ...children)`가 반환하는 자바스크립트 객체이다. 다음과 같은 형태를 하고 있다.

```
console.log(React.createElement('h1', { test: 'test' }, 'Hello'));

>> _$$typeof: Symbol(react.element)
  key: null
  props: {test: 'test', children: 'Hello'}
  ref: null
  type: "h1"
  _owner: null
  _store: {validated: false}
  _self: null
  _source: null
  [[Prototype]]: Object
```

**[ReactElement.js]**

https://github.com/facebook/react/blob/b53ea6ca05d2ccb9950b40b33f74dfee0421d872/packages/react/src/ReactElement.js#L111

<!-- ### 리액트 엘리먼트 `$$type` 프로퍼티 -->

<!-- 내용 보완 react 엘리먼트 $$typeof-->

<!-- 컴포넌트가 반환하는 객체는 리액트 엘리먼트(자바스크립트 객체)이다. 리액트 엘리먼트의 `$$type` 프로퍼티는 보안을 위해(리액트 엘리먼트라는 것을 식별하기 위한 고유 값) `Symbol` 값을 갖고 있다.

`Symbol` 값은 외부로 노출되지 않는 특성 때문에 `JSON`으로 전송할 수 없으며 API 호출로 가져올 수 없기 때문에 XSS(Cross Site Scripting)과 같은 보안 공격을 방지하기 위하여 사용된다. -->

<!--
공격자가 API의 응답으로 가짜 리액트 엘리먼트를 전송하려 한다해도 `Symbol`값은 `JSON`으로 변환, 전송이 안되기 때문에 리액트는 `$$type`을 확인하여 가짜 엘리먼트를 걸러낸다? 이런느낌 ..... -->

## 컴포넌트를 직접 호출하게 되면?

컴포넌트를 직접 호출하게 되면 리액트는 컴포넌트로 인식하지 않는다. 화면에 출력은 되나 직접 호출한 컴포넌트의 상태는 직접 호출된 위치의 컴포넌트에 바인딩된다.

따라서 상태 업데이트시 상위 컴포넌트부터 불필요한 렌더링이 발생하기도 하고, hook 규칙도 위반하기 때문에 직접 호출하는 것은 해선 안되며 `JSX` 혹은 `createElement()`를 사용해야 한다.

# 컴포넌트 렌더링 과정

# 1. 렌더링 트리거

다음과 같은 경우 렌더링을 일으킨다.

### 초기 렌더링(애플리케이션 시작)

애플리케이션 시작 시 초기 렌더링이 일어나는데 이때 컴포넌트 인스턴스로 이루어진 컴포넌트 트리가 생성되고, 루트 컴포넌트부터 렌더링(호출)한다. 각 컴포넌트가 반환하는 `JSX`는 `createElement()`로 변환되고(17버전 이후 부터 `_jsx(), _jsxs()`로 변경), 이 함수가 반환하는 리액트 엘리먼트를 기반으로 리액트 엘리먼트 트리(가상 DOM)을 생성한다.

<!-- 아래와 같이 `react-dom`의 `createRoot` 메서드로 타겟 DOM 요소를 지정하고 `render` 메서드에 루트 컴포넌트(최상위 컴포넌트)를 전달하여 호출하면 초기 렌더링이 일어난다.  -->

<!-- render 메서드의 결과로 리액트 엘리먼트 트리가 생성되는듯 -->

```
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

// REACT 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 컴포넌트(혹은 조상 컴포넌트)의 상태 업데이트(리렌더링)

컴포넌트의 상태가 업데이트 되면 렌더링이 트리거 된다(이때 `Object.is()` 메서드로 이전 상태와 새 상태를 비교하여 값이 변경된 경우 렌더링된다). 초기 렌더링과 차이점은 루트 컴포넌트부터 모두 호출하는 것이 아닌 렌더링을 트리거한 컴포넌트를 호출한다. 그리고 해당 컴포넌트가 반환하는 하위 컴포넌트까지 재귀적으로 리렌더링된다.

<!-- ### Context 업데이트 -->

# 2. 렌더링 단계(Render Phase)

렌더링 단계에서는 컴포넌트가 렌더링되어 업데이트된 새 가상 DOM이 생성되고 가상 DOM을 기반으로 **Reconciliation**이 일어난다(**DOM 업데이트가 일어나는 단계가 아니다**).

## 재조정(reconciliation)이란?

리액트는 상태 업데이트로 인해 렌더링이 일어나면 실제 DOM 전체를 다시 그리는 것이 아닌 가상 DOM을 이용해 변경 내용을 확인하고, **변경된 부분이 있을 시에만 실제 DOM을 업데이트한다.**

이때 가상 DOM을 통해 변경된 부분을 확인하고 어떤 업데이트가 필요한지 확인하는 작업을 **재조정(Reconciliatioin)** 이라고 한다.

Reconciliation은 **Fiber**라고 하는 **리액트 Reconciliation 엔진(혹은 알고리즘, 아키텍처)** 에 의해 이루어지며(Fiber는 리액트 v16에 도입된 새 reconciliation 엔진으로 reconciler 라고도 한다) Fiber는 실제 DOM을 직접 조작하진 않고 리액트에게 다음 UI의 모습이 어떻게 보여야하는지 알려준다.

**가상 DOM을 통한 Reconciliation의 목적은 효율이다.** 컴포넌트 렌더링이 일어날 때마다 실제 DOM을 매번 다시 그리는 것보다 가상 DOM을 통해 필요한 작업만 계산하여 실제 DOM에 적용하는 것이 훨신 효율적이고 빠르다. 게다가 가상 DOM은 단순한 자바스크립트 객체이므로 매번 생성하고 조작하는 것에 큰 비용이 들지 않는다.

# 재조정(Reconciliatioin) 과정

## 1. 초기 렌더링 - 가상 DOM과 Fiber 트리 생성

우선 Fiber 엔진은 초기 렌더링이 일어난 후 만들어진 리액트 엘리먼트 트리(가상 DOM)을 기반으로 내부적으로 **Fiber 트리**를 만든다. **Fiber 트리는 각 컴포넌트 인스턴스 및 DOM 요소(리액트 내장 브라우저 컴포넌트)에 대응되는 'Fiber'라고 하는 객체로 이루어진 트리이다.**

Fiber 트리를 구성하는 Fiber 노드 객체에는 컴포넌트의 `state`, `props`, `effect`, 사용된 `hook` 같은 것들이 저장되어 있고, 또 `state`, `refs`, DOM 업데이트, 등록된 `effect` 호출과 같은 작업이 푸시되는 큐도 포함되어 있다(이런 이유로 Fiber 노드 객체는 '작업 단위'로 정의되기도 한다).

<br>

<div style="text-align: center">
  <img src="./img/the reconciliation.png" width="650px" heigth="550px" style="margin: 0 auto"/>
  <p style="color: gray">(https://www.udemy.com/course/the-ultimate-react-course/)</p>
</div>

**[ReactFiber.js - FiberNode()]**

https://github.com/facebook/react/blob/b53ea6ca05d2ccb9950b40b33f74dfee0421d872/packages/react-reconciler/src/ReactFiber.js#L255C2-L255C2

**[Fiber node structure]**

https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react#fiber-node-structure

### Fiber 트리와 가상 DOM, Fiber 엔진의 특성

Fiber 트리와 리액트 엘리먼트 트리(가상 DOM)의 차이는 **Fiber 트리는 매 렌더링마다 새롭게 생성되지 않고 유지되며, 업데이트되는 형태로 계속해서 사용된다는 것이다**. 따라서 상태를 추적, 유지하기 좋다.

<!-- Fiber 트리 자체는 불변 자료구조인듯. -> 리액트 앨리먼트 트리가 불변 -->

또 Fiber 트리는 순회할 때의 효율을 위해 일반적인 트리 형태가 아닌 **연결 리스트 형태로 구현 되어있다.** Fiber 트리의 자식 노드들 중 첫 번째 노드가 부모 노드에 연결되어 있고 형제 노드는 첫 번째 노드에 연결 리스트로 형태로 연결 되어있다.

<div style="text-align: center">
  <img src="./img/fiber tree.png" width="650px" heigth="550px" style="margin: 0 auto"/>
  <p style="color: gray">(https://www.alibabacloud.com/blog/a-closer-look-at-react-fiber_598138/)</p>
</div>

**Fiber 엔진의 매우 중요한 특성 중 하나는 렌더링 작업을 비동기적으로 처리할 수 있다는 것이다**(15v 에선 동기식, 16.6 버전에서 비동기 로딩(Suspense API)을 제공하고 18버전에서 동시성 기능을 통해 비동기 렌더링 기능이 크게 확장되었다). 즉, Fiber가 수행하는 렌더링 프로세스를 청크로 분할할 수 있고, 일부 **작업을 다른 작업보다 우선적으로 처리할 수 있으며 작업을 일시 중지하거나, 혹은 재사용하거나 더 이상 유효하지 않은 경우 폐기할 수도 있다.**

이러한 비동기 렌더링은 React 18의 Suspense, transition과 같은 동시성을 지원하는 기능을 가능하게 하며 렌더링 시간이 긴 경우 일시중지 했다가 나중에 재개하는 식으로 **자바스크립트 엔진이 블록킹되는 것을 막을 수 있다.**

## 2. 컴포넌트 리렌더링 - 새 가상 DOM 생성, diffing 및 reconciliation

컴포넌트의 상태가 업데이트 되면 루트 컴포넌트부터 타고 내려가 렌더링을 트리거한 컴포넌트부터 하위 컴포넌트까지 재귀적으로 호출하여 **새로운 가상 DOM을 생성한다.**

그런 다음 `current` Fiber 트리와 새롭게 만들어진 리액트 엘리먼트 트리(가상 DOM)의 요소를 diffing 알고리즘으로 하나하나 비교하면서 변경 사항을 반영하여 `current` Fiber 트리를 새롭게 업데이트 하는데 이때 만들어진 새 Fiber 트리를 **`workInProgress` 트리** 라고 한다.

변경된 내용은 `workInProgress` 트리의 각 Fiber 노드에 기록되고, DOM 조작에 필요한 모든 작업은 'Effects list'에 담겨 commit 단계에서 실행된다.

<!-- workLoop 함수를 통해 workInProgress 트리를 순회하고 작업 리스트를 생성하는듯-->

<div style="text-align: center">
  <img src="./img/reconciliation process.JPG" width="650px" heigth="550px" style="margin: 0 auto"/>

  <p style="color: gray">(https://www.udemy.com/course/the-ultimate-react-course/)</p>
</div>

<h2>렌더링 페이즈 요약</h2>

<div style="text-align: center">
  <img src="./img/render phase.JPG" width="650px" heigth="550px" style="margin: 0 auto"/>
  <p style="color: gray">(https://www.udemy.com/course/the-ultimate-react-course/)</p>
</div>

# 3. 커밋 단계(Commit Phase)

<!-- 생성된 `workInProgress` 트리를 기반으로? -->

커밋 페이즈에서는 렌더링 페이즈 완료 후 실제 DOM을 업데이트(삽입, 삭제, 업데이트 등)하고 브라우저는 리페인팅한다. **렌더링 페이즈와 달리 커밋 페이즈의 DOM 업데이트 작업은 한번에 동기적으로 이루어지기 때문에** 렌더링 페이즈처럼 중단, 재개, 취소 등이 불가능하다(DOM이 부분적으로만 완료된 상태로 출력되는 것을 막기 위함).

**이때(커밋 페이즈) 실제 DOM 업데이트를 담당하는 것은 'React-DOM' 라이브러리**이다(렌더링까지 작업은 React가 담당한다).

이렇게 렌더링과 커밋을 담당하는 라이브러리가 분리되어있는 이유는 **여러 플랫폼에 적용하기 위함이다.** 이말은, **React는 렌더링을 통해 화면을 구성하는 요소를 어떻게 업데이트해야 하는지 계산하는 역할**이고(reconciler) 환경(IOS, Android, Windows, 동영상, 문서까지..)에 따라 커밋 단계를 담당하는 라이브러리는 웹의 경우 React-Dom, 모바일은 React-Native, 동영상 제작은 Remotion 등 각각 다르다(커밋 페이즈를 담당하는 라이브러리들을 'renderer' 라고 한다).

즉, 웹 개발 맥락에서는 렌더링 페이즈의 결과물이 'DOM' 업데이트 방법인 것이지만 엄밀히는 화면 구성요소를 어떻게 업데이트 해야하는지를 계산하는 역할인 것이다. 따라서 새 React 공식 홈페이지에선 가상 DOM이라는 용어는 없고 리액트 엘리먼트 트리, 리액트 트리, UI 트리와 같은 용어를 사용하고 있다.

<div style="text-align: center">
  <img src="./img/commit phase.JPG" width="650px" heigth="550px" style="margin: 0 auto"/>
  <p style="color: gray">(https://www.udemy.com/course/the-ultimate-react-course/)</p>
</div>

커밋 단계가 완료되면 `workInProgress` 트리가 곧 다음 렌더링에서 `current` 트리가 된다.

<h2> 커밋 페이즈 요약</h2>
<div style="text-align: center">
  <img src="./img/rendering process recap.JPG" width="650px" heigth="550px" style="margin: 0 auto"/>
  <p style="color: gray">(https://www.udemy.com/course/the-ultimate-react-course/)</p>
</div>

## Diifing 알고리즘

Diffing은 컴포넌트 리렌더링 시 `current` 트리(현재 DOM 형태)와 새로운 엘리먼트 트리(가상 DOM)를 비교하는 알고리즘으로 루트요소부터 같은 위치에 있는 요소들을 하나하나 비교한다. Diffing은 기본적으로 다음 2가지를 가정에 기반하여 O(n<sup>3</sup>)였던 복잡도를 O(n)로 가능하게 하였다.

1. 요소를 비교 할 때 `current` 트리와 새 엘리먼트 트리(가상 DOM) **요소의 타입이 다르면 해당 요소의 부모 요소부터 새로운 트리를 생성한다.** -> 상태도 리셋된다.
2. 컴포넌트에 고유한 `Key` prop을 설정하여 다음 렌더링때 변경되지 않아도 될 요소를 표시해줄 수 있다. -> 렌더링 List and Keys.md 참고

diffing 시 같은 타입의 요소의 경우 요소의 어트리뷰트만 확인하여 동일한 부분은 유지하고 변경된 부분을 갱신한다.

```
// className 어트리뷰트 값만 수정한다.
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

같은 타입의 요소라도 `Key` 값이 변경되면 기존 요소를 버리고 새 요소를 생성한다. 이 경우 당연히 `state`가 초기화되게 되는데 이것을 목적으로 의도적으로 `key`를 변경하는 경우도 있다.

**[Diffing 알고리즘]**

https://ko.legacy.reactjs.org/docs/reconciliation.html#the-diffing-algorithm

# 재조정(Reconciliation)의 효율에 대해

리액트의 가상 DOM을 통한 DOM 업데이트 과정이 직접 DOM을 조작 하는 것보다 빠른 건 아니다.

오히려 작은 규모의 DOM 조작은 개발자가 직접 `document.querySelector` → `.innerHTML` 같은 방식으로 다루는 게 더 빠를 수 있다. 하지만 애플리케이션 규모가 커지고 상태 변화가 복잡해질수록 리액트의 가상 DOM + 재조정(Reconciliation) 방식이 더 효율적이고 예측 가능한 성능을 보장하는 것 뿐이다.

## 왜 리액트가 가상 DOM을 쓰는가?

<h3>1. 직접 DOM을 조작하는 것을 비싸다</h3>

DOM은 브라우저의 렌더링 엔진(예: Blink, Gecko) 내부에 있는 무거운 객체라, 매번 조작하면 reflow/repaint 비용이 크다. 만약 여러 군데 값이 동시에 바뀌면 개발자가 최적화(배치 업데이트)를 직접 해줘야 한다.

<h3>2. 리액트는 DOM 조작을 알아서 최적화 한다</h3>

리액트는 메모리 안에서 가상 DOM 트리를 계산하고 재조정 과정을 거쳐 바뀐 부분만 실제 DOM에 반영한다.

이때 필요한 최소 변경만 DOM에 반영하기 때문에 자동으로 최적화가 되는 셈. 따라서 개발자가 DOM 작업 최적화를 직접 관리하지 않아도 성능이 보장된다.

<h3>3. 앱 규모에 따른 차이는 있을 수 있다</h3>

작은 앱의 경우 직접 DOM 조작이 더 빠를 수 있다(중간에 가상 DOM diff 과정이 오히려 오버헤드).

규모가 큰 앱의 경우 가상 DOM이 성능 손실을 줄여주고, 개발자가 실수 없이 안정적으로 UI를 관리할 수 있다.

### 결론

리액트의 강점은 "항상 더 빠르다"가 아니라 "규모가 커져도 성능 저하 없이 안정적으로 관리할 수 있다"는 데 있다.

<!-- # 리액트 UI 업데이트 과정 요약

구체적인 확인 좀 더 필요

1. 렌더링 트리거
2. React(리액트돔?)가 컴포넌트 트리 생성 및 호출
3. React-dom이 컴포넌트 트리가 반환한 `JSX`를 babel을 통해 `react.createElement()`로 변환
4. `react.createElement()`가 반환하는 리액트 엘리먼트들로 virtual DOM 생성
5. 가상 돔을 기반으로 실제 DOM을 생성하고 브라우저에 렌더링 -->

## Reference

**[Inside Fiber: in-depth overview of the new reconciliation algorithm in React]**

https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react

**[react-fiber-algorithm]** https://www.velotio.com/engineering-blog/react-fiber-algorithm

**[understand-how-rendering-works-react]** https://www.telerik.com/blogs/understand-how-rendering-works-react

**[(번역) 블로그 답변: React 렌더링 동작에 대한 (거의) 완벽한 가이드]**

https://velog.io/@superlipbalm/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior

**[React 함수 컴포넌트의 수명 주기, re-renders 발생하는 경우 등등]**

https://shash68i.hashnode.dev/lifecycle-of-react-functional-components#heading-stages-in-a-components-lifecycle

**[What Is The Virtual DOM and How Does It Work, + 장점]**

https://vegibit.com/what-is-the-virtual-dom-and-how-does-it-work/

**[How does React’s Reconciliation Algorithm work? fiber 장점]**

https://upmostly.com/tutorials/how-does-reconciliation-in-react-work

**[React 구버전 docs - Diffing Algorithm]**

https://ko.legacy.reactjs.org/docs/reconciliation.html#the-diffing-algorithm
