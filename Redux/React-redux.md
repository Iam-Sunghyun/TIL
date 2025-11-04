<h2>목차</h2>

- [React-redux 사용하기](#react-redux-사용하기)
- [리덕스 `store` 생성 및 제공](#리덕스-store-생성-및-제공)
- [컴포넌트에서 `store` 데이터 사용하기](#컴포넌트에서-store-데이터-사용하기)
  - [`useSelector()`, `useDispatch()` 훅](#useselector-usedispatch-훅)
  - [`dispatch` 함수에 대한 추가 내용](#dispatch-함수에-대한-추가-내용)
  - [Reference](#reference)

# React-redux 사용하기

`React-redux`는 `redux`의 공식 리액트 바인딩으로 리액트 컴포넌트에서 리덕스 `store` 데이터를 읽거나 `dispatch` 하는 등 `redux` 기능을 쉽게 사용할 수 있게 만들어주는 공식 도구이다(함수 컴포넌트를 예로 들면 `useSelector`, `useDispatch`와 같은 훅으로 `store`의 `state`를 더 리액트 친화적으로 사용할 수 있다).

`React-redux`를 통해 리액트 앱에서 `redux`를 사용해본다.

`CRA`로 프로젝트를 생성하고 다음과 같이 `react-redux`를 다운로드 받아준다. 참고로 공식 홈페이지에선 React 및 Redux로 새 앱을 시작하는 방법으로 Vite용 공식 Redux+TS 템플릿을 사용하거나 Next with-redux 템플릿을 사용하여 새 Next.js 프로젝트를 만드는 것을 권장하고 있다.

```
npm install react-redux
```

# 리덕스 `store` 생성 및 제공

`redux`의 `createStore` 메서드에 리듀서를 전달하여 `store`를 생성해준다. 그 다음 `react-redux`에서 제공하는 `<Provider />` 컴포넌트로 `store`를 제공할 수 있다.

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

const store = createStore(reducer);

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

# 컴포넌트에서 `store` 데이터 사용하기

## `useSelector()`, `useDispatch()` 훅

`useSelector()` 훅을 사용하여 리액트 컴포넌트 내부에서 `store`의 `state`를 사용할 수 있다(`useStore` 함수로도 `store` 데이터 사용. 클래스 컴포넌트에선 `connect API` 사용).

`useSelector()`의 인수로는 함수를 전달하는데 이 함수를 선택기 함수라고 하며 순수해야 한다. `selector` 함수는 컴포넌트가 렌더링될 때마다 인수로 `store`의 상태를 전달받아 호출되며 이 선택기 함수의 반환 값이 곧 `useSelector()`의 반환 값이 된다.

**`useSelector()`를 사용하면 자동으로 `store`에 `subscribe` 되어** 사용 중인 `state`의 값이 변경될 때마다 컴포넌트가 리렌더링 되며 컴포넌트가 언마운트 되면 자동으로 `subscribe`가 해제된다.

또 `useSelector()`는 `action`이 `dispatch` 될 때마다 선택기 함수를 호출하는데 **이때 선택기 함수의 이전 반환 값과 `dispatch` 후 새 반환 값을 비교하여(`===`사용)** 값이 다른 경우 컴포넌트를 리렌더링 하고, 같을 경우 리렌더링 하지 않는다(최적화 일환).

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

## `dispatch` 함수에 대한 추가 내용

`dispatch` 함수는 동기적으로 동작하며 `<Provider>` 컴포넌트로 제공되는 `store`가 변경되지 않는 이상 계속 유지된다(일반적으로 애플리케이션 내에서 `store` 객체는 변경되지 않음). 즉, 렌더링마다 새롭게 생성되는 것이 아닌 동일한 객체를 참조한다.

그러나 `react`에 맞게 설정된 `lint`는 이러한 사실을 모른다. 따라서 `useEffect`와 같은 곳에 `dispatch` 함수가 사용된다면 의존성 모듈에 추가하라고 알림이 뜬다.

```
export const Todos = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTodos())
    // 의존성 배열에 넣어도 useEffect가 호출될 일은 없다(안전하다)
  }, [dispatch])
}
```

위와 같이 의존성 배열에 `dispatch` 함수를 넣어줘도, `store`가 바뀌지 않는 이상 렌더링마다 디스패치 함수가 생성되는 것이 아니기 때문에 안전하다.

## Reference

**[Redux slice란]**

https://redux.js.org/tutorials/essentials/part-2-app-structure#redux-slices
