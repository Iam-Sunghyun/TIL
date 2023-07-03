<h2>목차</h2>

- [React 가상 DOM, 재조정 (Reconciliation)](#react-가상-dom-재조정-reconciliation)
- [컴포넌트 렌더링 과정](#컴포넌트-렌더링-과정)
  - [1. 렌더링 트리거](#1-렌더링-트리거)
  - [2. 렌더 단계(Render Phase)](#2-렌더-단계render-phase)
    - [재조정(reconciliation)이란?](#재조정reconciliation이란)
    - [Fiber의 동작](#fiber의-동작)
  - [3 .커밋 단계(Commit Phase)](#3-커밋-단계commit-phase)
  - [브라우저 리페인팅](#브라우저-리페인팅)
  - [Diifing 알고리즘](#diifing-알고리즘)
  - [추가 내용](#추가-내용)
    - [리액트 엘리먼트 `$$type` 프로퍼티](#리액트-엘리먼트-type-프로퍼티)
    - [컴포넌트를 직접 호출하게 되면?](#컴포넌트를-직접-호출하게-되면)
  - [Reference](#reference)


# React 가상 DOM, 재조정 (Reconciliation)

React는 실제 DOM의 경량 사본과 같은 가상 DOM(DOM의 가상 표현)을 사용하며 원래 DOM에 존재하는 모든 개체에 대해 React Virtual DOM에 해당 개체가 있다.

리액트 앱에서 상태가 변경될 때마다 업데이트된 새로운 가상 DOM 트리가 생성되며(re-render) React는 이전의 가상 DOM과 새로운 DOM을 비교하여 변경 사항을 기록한다(React는 2개의 가상 DOM을 유지한다고 한다).

```
 가상 DOM은 단순히 컴포넌트가 반환하는 리액트 엘리먼트로 이루어진 트리로 자바스크립트 객체이다(특별한 개념이 아니므로 현재 최신 공식문서에선 가상 DOM이라는 용어가 사라졌다).
```

-> 리액트에서 2개의 트리를 비교할 때 사용하는 알고리즘을 비교 알고리즘 (Diffing Algorithm)이라 하며 비교 알고리즘으로 변경된 내용을 적용하기 위한 최소한의 연산을 결정하고, 실제 DOM을 업데이트하는 과정을 재조정 (Reconciliation)이라고 한다.

DOM 트리를 비교할 때 개발자는 배열에 저장된 컴포넌트의 경우 key prop을 통해 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다-> 렌더링 List and Keys.md 참고.

<!-- 브라우저 DOM을 생성하거나 변경된 경우 **변경된 곳만을 동기화**하여 브라우저 출력을 업데이트하한다(즉 React는 렌더링 간에 차이가 있는 경우에만 DOM 노드를 변경한다),  -->

<!--  -->

# 컴포넌트 렌더링 과정

## 1. 렌더링 트리거

다음과 같은 경우 렌더링이 일어난다.

<H3>초기 렌더링(애플리케이션 시작)</h3> - 애플리케이션 시작 시 초기 렌더링이 일어나는데 이때 컴포넌트 인스턴스로 이루어진 컴포넌트 트리를 만들고, 루트 컴포넌트부터 호출하여 가상 DOM을 생성한다. 아래와 같이 `react-dom`의 `createRoot` 메서드로 타겟 DOM 요소를 지정하고 `render` 메서드에 루트 컴포넌트(최상위 컴포넌트)를 전달하여 초기 렌더링이 일어난다. 

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

<h3>컴포넌트(혹은 조상 컴포넌트)의 상태 업데이트(리렌더링)</h3> - 컴포넌트의 상태가 업데이트 되면 렌더링이 트리거 된다. 초기 렌더링과 차이점은 루트 컴포넌트부터 모두 호출하는 것이 아닌 렌더링을 트리거한 컴포넌트를 호출한다. 그리고 해당 컴포넌트가 반환하는 하위 컴포넌트까지 재귀적으로 리렌더링된다.

## 2. 렌더 단계(Render Phase)

렌더 단계에서는 컴포넌트가 렌더링되어 새 가상 DOM이 생성되고 가상 DOM을 기반으로 **Reconciliation**이 일어난다.

### 재조정(reconciliation)이란?

리액트는 상태 업데이트시 실제 DOM 전체를 다시 그리는 것이 아닌 가상 DOM을 이용해 변경 내용을 확인하고, 변경된 부분이 있을 시에만 실제 DOM을 업데이트한다.

이때 가상 DOM을 통해 변경된 부분을 확인하고 어떤 업데이트가 필요한지 결정하는 작업을 **재조정(Reconciliatioin)** 이라고 한다.

Reconciliation은 **Fiber**라고 하는**리액트 Reconciliatioin 엔진**에 의해 이루어지며(Fiber는 리액트 v16에 도입된 새 reconciliation 엔진으로 reconciler 라고도 한다) Fiber는 실제 DOM을 직접 조작하진 않고 리액트에게 다음 UI의 모습이 어떻게 보여야하는지 알려준다.

<!-- 리플로우 리페인트 다시봐야 할듯, dom 변경이 있을 때마다 전체 DOM을 다시그렸나? -->
가상 DOM을 통한 Reconciliation의 이유는 효율 때문이다. 컴포넌트 렌더링이 일어날 때마다 실제 DOM을 매번 다시 그리는 것보다 가상 DOM을 통해 필요한 작업만 계산하여 적용하는 것이 훨신 효율적이고 빠르다. 게다가 가상 DOM은 단순한 자바스크립트 객체이므로 매번 생성하고 조작하는 것에 큰 비용이 들지 않는다.

<!-- 수정 필 -->
그 후 현재 fiber 트리(기존 가상 DOM?)와 새 가상 DOM을 비교하여(diffing) 변경사항을 확인하고 fiber 트리를 업데이트 하는데 이 과정을 reconciliation이라 한다. -> 업데이트된 fiber 트리를 바탕으로 실제 DOM이 업데이트된다.



### Fiber의 동작


## 3 .커밋 단계(Commit Phase)

## 브라우저 리페인팅


## Diifing 알고리즘


## 추가 내용

<!-- # 리액트 UI 업데이트 과정 요약

구체적인 확인 좀 더 필요
1. 렌더링 트리거
2. React가 컴포넌트 트리 생성 및 호출
3. React-dom이 컴포넌트 트리가 반환한 `JSX`를 babel을 통해 `react.createElement()`로 변환
4. `react.createElement()`가 반환하는 리액트 엘리먼트들로 virtual DOM 생성
5. 가상 돔을 기반으로 실제 DOM을 생성하고 브라우저에 렌더링 -->

### 리액트 엘리먼트 `$$type` 프로퍼티
<!-- 내용 보완 react 엘리먼트 $$typeof-->
컴포넌트가 반환하는 객체는 리액트 엘리먼트(자바스크립트 객체)이다. 리액트 엘리먼트의 `$$type` 프로퍼티는 보안을 위해 `Symbol` 값을 갖고 있다. 

`Symbol` 값은 외부로 노출되지 않는 특성 때문에 `JSON`으로 전송할 수 없으며 API 호출로 가져올 수 없기 때문에 XSS(Cross Site Scripting)과 같은 보안 공격을 방지하기 위하여 사용된다.
<!-- 
공격자가 API의 응답으로 가짜 리액트 엘리먼트를 전송하려 한다해도 `Symbol`값은 `JSON`으로 변환, 전송이 안되기 때문에 리액트는 `$$type`을 확인하여 가짜 엘리먼트를 걸러낸다? 이런느낌 ..... -->

### 컴포넌트를 직접 호출하게 되면?

컴포넌트를 직접 호출하게 되면 리액트는 컴포넌트로 인식하지 않는다. 화면에 출력은 되나 직접 호출한 컴포넌트의 상태는 직접 호출된 위치의 컴포넌트에 바인딩된다. 

따라서 상태 업데이트시 상위 컴포넌트부터 불필요한 렌더링이 발생하기도 하고, hook 규칙도 위반하기 때문에 직접 호출하는 것은 해선 안되며 `JSX` 혹은 `createElement()`를 사용해야 한다.


## Reference

**[understand-how-rendering-works-react]**

https://www.telerik.com/blogs/understand-how-rendering-works-react

https://velog.io/@superlipbalm/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior

**[React 함수 컴포넌트의 수명 주기, re-renders 발생하는 경우 등등]**

https://shash68i.hashnode.dev/lifecycle-of-react-functional-components#heading-stages-in-a-components-lifecycle

**[리액트 렌더링 및 재조정 과정, 리렌더링 발생하는 경우]**

https://dev.to/teo_garcia/understanding-rendering-in-react-i5i

**[What Is The Virtual DOM and How Does It Work, + 장점]**

https://vegibit.com/what-is-the-virtual-dom-and-how-does-it-work/

**[How does React’s Reconciliation Algorithm work? fiber 장점]**

https://upmostly.com/tutorials/how-does-reconciliation-in-react-work


**[React 구버전 docs - Diffing Algorithm]**

https://ko.legacy.reactjs.org/docs/reconciliation.html#the-diffing-algorithm