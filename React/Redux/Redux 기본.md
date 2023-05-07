<h2>목차</h2>

- [Redux란?](#redux란)
  - [Context API 대신 Redux 사용 이유?](#context-api-대신-redux-사용-이유)
- [Redux 사용 방식](#redux-사용-방식)
  - [`store` 생성 및 `reducer` 함수 설정](#store-생성-및-reducer-함수-설정)
  - [`dispatch(action)` 함수로 상태 변경 요청](#dispatchaction-함수로-상태-변경-요청)
- [React-redux](#react-redux)
  - [리덕스 `store` 생성 및 제공](#리덕스-store-생성-및-제공)
  - [컴포넌트에서 `store` 데이터 사용하기](#컴포넌트에서-store-데이터-사용하기)
    - [`useSelector()` 훅](#useselector-훅)
- [Redux toolkit](#redux-toolkit)
- [Redux DevTools](#redux-devtools)

# Redux란?

`Redux`는 오픈 소스 자바스크립트 라이브러리로 리액트 앱에서 가장 많이 사용하는 전역 상태 관리 라이브러리이다.

`Redux` 자체는 리액트에 종속된 라이브러리가 아니며 순수 자바스크립트, 혹은 `Vue.js`나 `Angular.js`와 같은 뷰 프레임워크와도 사용할 수 있다.

<!-- mvc -> flux -> redux 리덕스를 쓰는 이유, 만들어진 이유 내용 추가 필 -->

## Context API 대신 Redux 사용 이유?

리액트의 내장 기능인 `Context API`가 있는데도 `Redux`를 사용하는 이유는 `Context`의 단점 중 하나가 규모가 큰 애플리케이션에서 아래와 같이 매우 복잡해질 수 있다는 것이다.

```
return (
  <AuthContextProvider>
    <ThemeContextProvider>
      <UIINteractionContextProvider>
        <MultiStepFormContextProvider>
          <UserRegistration />
        </MultiStepFormContextProvider>
      </UIINteractionContextProvider>
    </ThemeContextProvider>
  </AuthContextProvider>
)
```

그렇다고 하나의 `Context`에 모든 상태를 담기엔 너무 복잡해지고 잦은 업데이트로 인해 불필요한 렌더링도 발생하게 된다. `Context`의 일부만 업데이트 해도 `Context`를 사용하는 모든 컴포넌트가 리렌더링되는 성질 때문(업데이트한 값을 사용하지 않더라도).

`React Redux`는 내부적으로 많은 성능 최적화를 구현하므로 컴포넌트가 사용하는 상태가 변경되었을 때만 다시 렌더링된다.

이러한 문제들의 대안으로 애플리케이션의 규모가 커지게 될수록 `Redux` 사용을 고려해볼 수 있다.

<!-- Context API 대신 Redux 사용 이유, 차이점 어렴풋이 이해하는 중. 내용 수정 필 -->
`Redux`는 상태를 하나의 중앙 저장소에 저장하여 관리하기 때문에 데이터 흐름을 이해하기 쉽고 디버깅도 용이하다. `Redux`는 MVC 패턴의 양방향 데이터 흐름으로 인한 복잡성을 해결하기 위해 만들어진 flux 패턴에 `reducer` 개념을 도입하여 만들어졌다(리액트 앱에서는 리액트에서 더 쉽게 `Redux`를 사용할 수 있게 해주는 `Redux-toolkit`이라는 라이브러리를 사용한다).

**결론적으로 `Redux`를 사용하는 이유는 여러 곳에서 사용하는 상태 값을 하나의 중앙 저장소에서 저장하여, 단방향 데이터 흐름을 통해 앱의 복잡도를 줄이고 예기치 못한 변경을 방지해 예측하기 쉬운 코드를 작성하기 위한 것이다.**

먼저 `Redux`의 주요 개념과 순수 자바스크립트로 `Redux`를 사용해보고, 그 후 `react-redux`를 통해 리액트에 리덕스를 적용해볼 것이다.

**[redux 쓰는 이유?]**

https://wooder2050.medium.com/%EB%A6%AC%EB%8D%95%EC%8A%A4-redux-%EB%8A%94-%EC%99%9C-%EC%93%B0%EB%8A%94-%EA%B1%B4%EB%8D%B0-2eaafce30f27

https://devlog-h.tistory.com/26

**[Redux / Context API 장단점]**

https://likims.com/blog/context-vs-redux-pros-and-cons

# Redux 사용 방식

`Redux` 공식 문서에서는 `Redux`를 다음과 같이 설명하고있다.

```
Redux는 "액션"이라는 이벤트를 사용하여 애플리케이션 상태를 관리하고 업데이트하기 위한 패턴 및 라이브러리입니다.
상태가 예측 가능한 방식으로만 업데이트될 수 있도록 하는 규칙과 함께 전체 애플리케이션에서 사용해야 하는 상태에 대한 중앙 집중식 저장소 역할을 합니다.
```

위에서 말한 **중앙 저장소 역할**을 하는 `Redux`의 핵심 요소가 `store`이다. 

하나의 `store`에 전역 `state`가 저장되고, `dispatch`, `subscribe`, `getState`와 같은 메서드로 값을 간접적으로 업데이트하거나 조회한다(직접적으로 접근하는 것은 원본이 변경될 가능성이 있기 때문).

리액트가 아닌 순수 자바스크립트 코드를 통해 `Redux` 사용 예시를 살펴본다.

우선 npm에서 `redux`를 다운 받아준다.

```
npm install redux
```

## `store` 생성 및 `reducer` 함수 설정

우선 `store`를 생성하는데, 이때 상태 변경에 사용될 `reducer` 함수를 전달해준다.  
 
`reducer`는 `useReducer` 훅처럼 상태를 업데이트하는 역할을 한다. 상태 업데이트를 수행하는 `ruducer` 함수를 정의하고 `store`에 등록한다. 

```
import redux from 'redux';

// reducer 함수. 초기 값 설정 주의
const counterReducer = (state = { counter: 0 }, action) => {
  return {
    counter : state.counter + 1
  }
};

// reducer 전달하여 store 생성
const store = redux.createStore(counterReducer);

// 임시 컴포넌트
const counterSubscriber = () => {
  const latestsState = store.getState();
  return latestsState;
}

// store의 데이터를 사용 할 컴포넌트 subscribe
store.subscribe(counterSubscriber);
console.log(counterSubscriber());
```

`redux.createStore()`로 `store`을 초기화 해줄 때 `reducer`가 반환한 값이 곧 초기 값이 되는데(위에선 1) 이때 매개변수 초기 값을 설정하여 `undefined`를 참조하는 일이 없도록 해준다.

그 후 `store`의 상태를 사용할 컴포넌트들은(`store.getState()`로 상태를 사용하는 함수들) `store.subscribe(component)` 메서드를 사용하여 저장소를 `subscribe` 해줘야 한다.  

그러면 `redux`는 `store`의 데이터가 `dispatch`로 업데이트될 때마다 `subscribe`한 컴포넌트를 재호출한다. 여기서 알아야 할 것은 **데이터는 항상 단방향으로 `store` -> 컴포넌트로 흐른다는 것**. -> 이러한 방식으로 예기치 못한 변경을 방지한다.

## `dispatch(action)` 함수로 상태 변경 요청

`store.dispatch(action)` 메서드로 `reducer`를 호출하고 `action` 객체의 값에 따라 `reducer`에 작성된 로직을 실행한다. `reducer`가 반환한 값으로 `state`를 업데이트하고 `subscribe()` 중인 컴포넌트를 호출하여 새 값을 전달한다.

```
import redux from 'redux';

const counterReducer = (state = { counter: 0 }, action) => {

  switch (action.type) {
    case 'multiple':
      return {
        counter: state.counter * action.payload
      }
    default:
      return {
        counter : state.counter + 1
      }
  }
};

const store = redux.createStore(counterReducer);

const counterSubscriber = () => {
  const latestsState = store.getState();
  console.log(latestsState);
}

store.subscribe(counterSubscriber);
store.dispatch({ type: 'multiple', payload: 5 });
store.dispatch({ type: 'multiple', payload: 10 });

>> { counter: 5 }
   { counter: 50 }
```


위와 같은 매커니즘으로 공통적으로 사용되는 값을 하나의 `store`에서 관리해 로직을 간단하게 만들 수 있다.

여기까지는 다른 여타 상태 관리 라이브러리와 크게 다를 바가 없다.

`Redux`만의 강점이라고 할 수 있는 것은 브라우저의 `Redux DevTools` 확장 프로그램을 사용해 마치 버전 관리 시스템처럼 `store`에 저장된 `state`의 변경 히스토리를 확인하고, 또 원하는 지점으로 돌아갈 수 있다는 것!(공식 문서에서는 **'time-travel debugging'** 이라 표현한다).

여기서 **상태가 변경되는 것을 제대로 기록하기 위해서는 `reducer`는 순수 함수로 작성되어야 한다.**

**[Redux 홈 페이지]**

https://ko.redux.js.org/introduction/getting-started

# React-redux

`React-redux`는 `redux`의 공식 리액트 바인딩으로 리액트 컴포넌트에서 리덕스 `store` 데이터를 읽거나 `dispatch` 하는 등 `redux` 기능을 쉽게 사용할 수 있게 만들어주는 공식 도구이다(함수 컴포넌트를 예로 들면 `useSelector`, `useDispatch`와 같은 훅으로 `store`의 `state`를 더 리액트 친화적으로 사용할 수 있다).  

`React-redux`를 통해 리액트 앱에서 `redux`를 사용해본다.

`CRA`로 프로젝트를 생성하고 다음과 같이 `react-redux`를 다운로드 받아준다.

```
npm install react-redux
```

## 리덕스 `store` 생성 및 제공

`redux`의 `createStore` 메서에 리듀서를 전달하여 `store`를 생성해준다. 그 다음
`react-redux`에서 제공하는 `<Provider />` 컴포넌트로 `store`를 제공할 수 있다.

`<Provider />` 컴포넌트의 사용 방식은 `Context API`와 비슷하다. 상태를 공유할 하위 컴포넌트들을 포함하는 부모 컴포넌트를 감싸주어 `store` `prop`으로 전달해주면 된다. 

아래의 예시는 최상위 컴포넌트인 `<App />`을 감싸주었기 떄문에 모든 컴포넌트들이 `store`를 사용할 수 있다.

```
// /src/store/index.js
// redux 로직 저장 파일
import { createStore } from 'redux';

const reducer = (state = { counter: 0, show: true }, action) => {
  switch (action.type) {
    case 'increase':
      return {
        counter: state.counter + action.payload,
        show: state.show
      };
    case 'decrease':
      return {
        counter: state.counter - action.payload,
        show: state.show
      };
    case 'toggle':
      return {
        counter: state.counter,
        show: !state.show
      };
    default:
      return {
        counter: state.counter,
        show: state.show
      };
  }
};

const store = redux.createStore(reducer);

export default store;
----------------------------------------------
// App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/index';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

## 컴포넌트에서 `store` 데이터 사용하기

### `useSelector()` 훅

`useSelector()` 훅을 사용하여 리액트 컴포넌트 내부에서 `store`의 `state`를 사용할 수 있다(`useStore` 함수로도 `store` 데이터 사용. 클래스 컴포넌트에선 `connect API` 사용).

`useSelector()`를 사용하면 자동으로 `store`에 `subscribe` 되며 사용 중인 `state`가 변경될 때마다 컴포넌트가 렌더링된다. 또 컴포넌트가 언마운트 되면 자동으로 `subscribe`가 해제된다.

`useSelector()`의 인수로는 함수(선택기 함수라고 함)를 전달하는데, 이 함수는 컴포넌트가 렌더링될 때마다 인수로 `store`의 상태를 전달받아 호출되며 이 선택기 함수의 반환 값이 곧 `useSelector()`의 반환 값이 된다. 

`useSelector()`는 `action`이 `dispatch` 될 때마다 선택기 함수를 호출한다. 이때 선택기 함수의 이전 반환 값과 `dispatch` 후 새 반환 값을 비교하여(`===`사용) 값이 다른 경우 컴포넌트를 리렌더링 하고, 같을 경우 리렌더링 하지 않는다(따라서 상태가 객체인 경우에 다른 참조를 갖는 새 객체로 교체해줘야(불변성을 지켜야) 변경을 추적할 수 있다 -> `reducer`가 객체인 상태를 직접 변경하지 않는 순수함수이어야 하는 이유).

아래 코드는 `store`의 `state`를 가져오고, `dispatch`로 새 값을 전달받는 간단한 예제이다.

```
// counter.js
import { useDispatch, useSelector } from 'react-redux/es/exports';
import classes from './Counter.module.css';

const Counter = () => {
  // 선택기 함수 전달
  const counter = useSelector(state => state.counter);
  const dispatch = useDispatch();

  const increseHandler = () => {
    dispatch({ type: 'increase' });
  };

  const decreseHandler = () => {
    dispatch({ type: 'decrease' });
  };

  const toggleCounterHandler = () => { 
    dispatch({ type: 'toggle' });
  };

  return (
    <main className={ classes.counter }>
      <h1>Redux Counter</h1>
      <div className={ classes.value }>{ counter }</div>
      <div>
        <button onClick={increseHandler}>증가</button>
        <button onClick={decreseHandler}>감소</button>
      </div>
      <button onClick={ toggleCounterHandler }>Toggle Counter</button>
    </main>
  );
};

export default Counter;
```

**[reacr-redux `useSelector()`]**

https://react-redux.js.org/api/hooks#useselector

# Redux toolkit

<!-- 내용보충 필 -->
앱의 규모가 커짐에 따라 생길 수 있는 redux의 문제점.

1. 액션 type 명 충돌 가능성
2. 상태 객체의 크기가 커질수록 매번 복사 해야되는 양도 많아지고, reducer의 내용도 매우 길어짐
3. 결국 store을 사용하기 위한 파일들, 내용들이 복잡해지게 된다.

이러한 일반적인 문제를 해결하기 위해 만들어 진 것이 `Redux-toolkit` 이다.

`Redux Toolkit`은 `Redux` 논리를 작성하는데 권장되는 접근 방식으로 `Redux` 앱을 빌드하는데 필요한 패키지와 기능이 포함되어 있는 도구이다(리액트 CRA와 같은 역할).

**[Redux / Context API 장단점]**

https://likims.com/blog/context-vs-redux-pros-and-cons

# Redux DevTools

`Redux DevTools Extension`은 시간 경과에 따른 `Redux` `store`의 상태 변경 기록을 보여준다. 불변성(immutability)을 지키며 상태를 업데이트 하는 것으로 이전 상태로 돌아가기 같은 복잡한 기능을 쉽게 사용할 수 있다.
