<h2>목차</h2>

- [React-redux](#react-redux)
  - [리덕스 `store` 생성 및 제공](#리덕스-store-생성-및-제공)
  - [컴포넌트에서 `store` 데이터 사용하기](#컴포넌트에서-store-데이터-사용하기)
    - [`useSelector()` 훅](#useselector-훅)
- [Redux toolkit(RTK)](#redux-toolkitrtk)
- [Redux toolkit 사용하기](#redux-toolkit-사용하기)
  - [`createSlice()`로 `reducer` 생성](#createslice로-reducer-생성)
    - [slice란?](#slice란)
  - [`configureStore()`로 `store` 생성](#configurestore로-store-생성)
  - [`reducer` 로직 식별을 위한 `action` 객체 생성하기](#reducer-로직-식별을-위한-action-객체-생성하기)
  - [`action` `dispatch`하기](#action-dispatch하기)
  - [Reference](#reference)
- [Redux DevTools](#redux-devtools)

# React-redux

`React-redux`는 `redux`의 공식 리액트 바인딩으로 리액트 컴포넌트에서 리덕스 `store` 데이터를 읽거나 `dispatch` 하는 등 `redux` 기능을 쉽게 사용할 수 있게 만들어주는 공식 도구이다(함수 컴포넌트를 예로 들면 `useSelector`, `useDispatch`와 같은 훅으로 `store`의 `state`를 더 리액트 친화적으로 사용할 수 있다).

`React-redux`를 통해 리액트 앱에서 `redux`를 사용해본다.

`CRA`로 프로젝트를 생성하고 다음과 같이 `react-redux`를 다운로드 받아준다.

```
npm install react-redux
```

## 리덕스 `store` 생성 및 제공

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

**[react-redux `useSelector()`]**

https://react-redux.js.org/api/hooks#useselector

# Redux toolkit(RTK)

<!-- 내용보충 필 -->

앱의 규모가 커짐에 따라 생길 수 있는 redux의 문제점.

- 기본 boilerplate를 위한 구성이 필요함(action 생성자, reducer, 필요에 따라 추가적인 미들웨어(redux-thunk 같은) 설치 등)
- 상태 객체의 크기가 커질수록 불변성을 위해 복사 해야되는 양도 많아지고, `reducer`의 내용도 매우 길어짐.
- 액션 type 명 오타 및 충돌 가능성

이러한 일반적인 문제를 해결하기 위해 만들어 진 것이 `redux-toolkit` 이다.

`Redux Toolkit`은 `redux` 로직을 작성하는데 필요한 패키지와 기능이 포함되어 있는 리덕스 측에서 사용을 공식적으로 추천하는 도구이다(리액트 CRA와 같은 역할).

```
저희는 수동으로 작성하는 Redux 로직에서 "보일러 플레이트"를 제거하고, 흔한 실수를 방지하고, 기본적인 Redux 작업을 간단하게 만드는 API를 제공하기 위해 Redux Toolkit을 만들었습니다.
```

`Redux Toolkit` 패키지에서는 코어 `redux` 패키지에 추가로 필수적인 API 메서드와 모듈들을 포함하고 있으며 `store` 설정, 리듀서 생성 및 불변 수정 로직 작성, 상태 슬라이스 등과 같은 기능으로 `redux` 작업을 좀 더 단순화하고 실수를 방지하여 `redux` 코드 작성을 더 쉽게 만들어준다.

**[redux-toolkit 공식 사이트]**

https://redux-toolkit.js.org/introduction/getting-started

# Redux toolkit 사용하기

프로젝트에 `Redux Toolkit`과 `react-redux`를 추가해준다.

```
npm install @reduxjs/toolkit

// 리액트 환경이라면 +
npm install react-redux
```

`Redux Toolkit`에서 제공하는 `Redux` 앱에서 가장 일반적으로 하는 작업(`reducer` 정의, `store` 생성)을 간소화하는 두 가지 주요 API는 `createSlice`, `configureStore`이다.

## `createSlice()`로 `reducer` 생성

`createSlice`는 **내부적으로 `Immer` 라이브러리를 사용하는 불변 리듀서를 생성할 수 있게 해준다.** 이를 통해 `state.value = 123`과 같은 변형(mutating) JS 문법을 전개 연산자로 복사 없이도 불변성을 유지하며 업데이트할 수 있다(내부에서 `createReducer()`를 사용한다).

또한, **각 리듀서에 대한 `action` 생성자 함수를 자동으로 생성하고, 이 액션 생성자 함수는 리듀서 이름에 기반하여 내부적으로 고유의 액션 타입 문자열을 갖는 액션 객체를 생성한다**(내부에서 `createAction()`를 사용한다). 

추가로, `createSlice()`는 TypeScript와도 호환된다.

`createSlice()`의 인수는 하나의 객체를 받는다. 객체에 포함되어야 하는 프로퍼티는 다음 3가지 이다.

 + `name`- `slice`의 이름. 생성된 `action` 유형의 접두사로 사용된다 
 + `initialState` - 리듀서의 초기 상태
 + `reducers` - 리듀서 함수 로직을 담은 객체

```
// store.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    incrementByAmount(state, action) {
      state.counter += action.payload;
    },
    toggle(state) {
      state.show = !state.show;
    },
  },
});
```

`createSlice()`로 생성된 객체는 다음과 같은 형태를 띈다.

```
{
    name : string,
    reducer : ReducerFunction,
    actions : Record<string, ActionCreator>,
    caseReducers: Record<string, CaseReducer>.
    getInitialState: () => State
}
```

슬라이스의 `reducers`에 전달한 객체의 로직은 상태 객체를 직접 변경하는 것처럼 보이지만, 내부적으로 `Immer` 라이브러리를 사용하기 때문에 전개 연산자로 복사하여 새 객체를 생성하는 것과 같이 동작한다(따로 복사가 필요 없으므로 편리하다). 

**[redux-toolkit createSlice]**

https://redux-toolkit.js.org/api/createSlice

### slice란?

<!-- 이해 좀더 필요 -->
슬라이스(slice)란 `reducer` 논리와 특정 논리에 매칭되는 `action` 모음으로 단일 루트 리듀서를 이루는 조각 리듀서라 생각하면 된다. 보통 하나의 파일에 정의되며 슬라이스란 이름은 하나의 루트 `Redux` 상태 객체를 여러 조각(slice)로 분할 한다는 의미에서 유래한다.

```
import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '../features/users/usersSlice'
import postsReducer from '../features/posts/postsSlice'
import commentsReducer from '../features/comments/commentsSlice'

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
})
```

위 예시에서 `reducer`에 전달한 객체의 각 프로퍼티 이름은 슬라이스 리듀서에서 사용하고자 하는 상태의 조각을 의미한다. 하나의 큰 상태에서 `state.users`, `state.posts`, `state.comments`라는 조각을 `createSlice`로 생성한 각각의 슬라이스 리듀서에 전달하게 되고 해당 슬라이스의 로직으로 업데이트 된다.

결론적으로 슬라이스는 하나의 큰 상태의 일부를 사용하고 업데이트하는 서브 리듀서로 생각하면 될듯. 

## `configureStore()`로 `store` 생성

`configureStore`는 한 번의 호출로 `Redux` 스토어를 설정하며, 리듀서 조각을 결합하고 `thunk` 미들웨어를 추가하고, `Redux DevTools` 통합을 하는 등의 작업을 수행한다(`react-redux` 만으로는 일일히 해줘야 했던 것들). 또한, 이름이 있는 옵션 매개변수를 사용하기 때문에 `createStore`보다 구성이 간단하다.

다음은 `configureStroe()` 함수의 인수로 하나의 객체를 전달한다. 이 객체에는 `reducer`뿐 아니라 `middleware`, `devTools`, `preloadedState`, `enhancers`과 같은 추가 옵션을 설정할 수 있다. 우선 기본으로 슬라이스 리듀서만 전달하여 `store`를 생성해본다.

```
// store.js
// 슬라이스 생성
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    incrementByAmount(state, action) {
      state.counter += action.payload;
    },
    toggle(state) {
      state.show = !state.show;
    },
  },
});

// 객체의 reducer 프로퍼티에 슬라이스를 담은 객체를 전달(슬라이스가 하나이므로 객체에 담지 않고 직접 전달)
const store = configureStore({
  reducer: counterSlice.reducer
});

export default store;
```

`configureStore()` 함수로 스토어를 생성할 때 기본적으로 단일 루트 리듀서를 인수로 전달 해야한다. 만약 `configureStore()`에 전달되는 객체의 `reducer` 프로퍼티에 여러 슬라이스 리듀서가 전달될 경우 자동으로 `redux` 코어의 `combineReducers()` 함수를 사용해 단일 루트 리듀서로 결합하여 전달된다.

## `reducer` 로직 식별을 위한 `action` 객체 생성하기

`createSlice()`로 리듀서 슬라이스를 생성하면 `Redux Toolkit`에 의해 자동적으로 액션 객체를 생성하는 액션 생성자 함수를 갖게 된다(이것으로 개발자는 액션 생성자와, 액션 객체의 타입명 중복이나 `dispatch`시 액션 타입 오타 같은 사소한 문제를 신경쓰지 않아도 된다). 

`counterSlice.actions` 프로퍼티를 통해 액션 생성자 함수가 담긴 객체를 참조할 수 있다. 

```
console.log(counterSlice.actions);

>> {increment: ƒ, decrement: ƒ, incrementByAmount: ƒ, toggle: ƒ}
```

`counterSlice.actions` 객체에는 슬라이스 리듀서에 정의한 리듀서 함수와 동일한 이름의 프로퍼티가 존재하며 각 프로퍼티에는 액션 생성자 함수가 바인딩 되어있다. 액션 생성자 함수를 호출하면 해당되는 리듀서 함수를 식별하기 위한 액션 객체를 반환한다.

```
counterSlice.actions.increment();

// increment()를 식별하기 위한 액션 객체
>> {type: 'counter/increment', payload: undefined}
```

액션 타입은 슬라이스 리듀서의 이름이 접두사로 붙고 `'/'`를 구분자로 리듀서 함수 이름이 그 뒤에 붙는다.  

```
counterSlice.actions.increment();
{type: "counter/increment"}

counterSlice.actions.decrement();
{type: "counter/decrement"}

counterSlice.actions.incrementByAmount();
{type: "counter/incrementByAmount"}

counterSlice.actions.toggle();
{type: "counter/toggle"}
```

## `action` `dispatch`하기

다음은 액션 생성자로 액션 객체를 생성하고, 필요시 `payload`를 전달하여 `state`를 업데이트하는 코드이다.

```
import { useDispatch, useSelector } from 'react-redux/es/exports';
import classes from './Counter.module.css';
import { counterActions } from '../store/store';

const Counter = () => {
  const counter = useSelector(state => state.counter);
  const show = useSelector(state => state.show);
  const dispatch = useDispatch();
 

  const increseHandler = () => {
    dispatch(counterActions.increment());
  };

  const increseByAmountHandler = () => {
    dispatch(counterActions.incrementByAmount(5));
  };

  const decreseHandler = () => {
    dispatch(counterActions.decrement());
  };

  const toggleCounterHandler = () => {
    dispatch(counterActions.toggle());
  };

  return (
    <main className={ classes.counter }>
      <h1>Redux Counter</h1>
      {show && <div className={ classes.value }>{ counter }</div>}
      <div>
        <button onClick={ increseHandler }>증가</button>
        <button onClick={ decreseHandler }>감소</button>
        <button onClick={ increseByAmountHandler }>+5 증가</button>
      </div>
      <button onClick={ toggleCounterHandler }>Toggle Counter</button>
    </main>
  );
};

export default Counter;
```

`action`객체의 `payload`는 액션 생성자 함수의 인수로 전달할 수 있다. 


Redux Toolkit은 이 외에도, 다음과 같은 일반적인 Redux 작업을 수행할 수 있는 API를 제공합니다:

`createAsyncThunk`: "비동기 요청 전후에 액션을 디스패치"하는 표준 패턴을 추상화합니다

`createEntityAdapter`: 정규화된 상태에서 CRUD 작업을 수행하기 위한 미리 만들어진 리듀서와 셀렉터

`createSelector`: 메모이제이션된 셀렉터를 위한 표준 Reselect API 다시 내보내기(re-export)

`createListenerMiddleware`: 디스패치된 액션에 대한 응답으로 로직을 실행하기 위한 사이드 이펙트 미들웨어

## Reference

**[Redux Toolkit 앱 구조 - createSlice, configureStore 설명 등등]**

https://redux.js.org/tutorials/essentials/part-2-app-structure#creating-the-redux-store

**[Redux slice란]**

https://redux.js.org/tutorials/essentials/part-2-app-structure#redux-slices

**[Redux Toolkit이 오늘 날 Redux를 사용하는 방법인 이유 - Redux Toolkit은 Redux 코어 차이 등등]**

https://ko.redux.js.org/introduction/why-rtk-is-redux-today

# Redux DevTools

`Redux DevTools Extension`은 시간 경과에 따른 `Redux` `store`의 상태 변경 기록을 보여준다. 불변성(immutability)을 지키며 상태를 업데이트 하는 것으로 이전 상태로 돌아가기 같은 복잡한 기능을 쉽게 사용할 수 있다.
