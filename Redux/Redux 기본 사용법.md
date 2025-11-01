- [Redux 사용 방식](#redux-사용-방식)
  - [`reducer` 함수 생성 및 `store` 생성](#reducer-함수-생성-및-store-생성)
  - [`dispatch(action)` 함수로 상태 변경 요청](#dispatchaction-함수로-상태-변경-요청)
  - [`action` 생성자 함수](#action-생성자-함수)

# Redux 사용 방식

`Redux` 공식 문서에서는 `Redux`를 다음과 같이 설명하고 있다.

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

## `reducer` 함수 생성 및 `store` 생성

우선 `store`를 생성하는데, 이때 상태 변경에 사용될 `reducer` 함수를 전달해준다.

`reducer`는 `useReducer` 훅처럼 상태를 업데이트하는 역할을 한다. 상태 업데이트를 수행하는 `ruducer` 함수를 정의하고 `store`에 등록한다.

리듀서가 여러 개인 경우 `redux`의 `combineReducers()` 함수로 결합을 해줘야 한다.

```
import {  combineReducers, createStore } from "redux";
import accountReducer from "./features/accounts/accountSlice";

// reducer 함수. 초기 값 설정 주의
const counterReducer = (state = { counter: 0 }, action) => {
  return {
    counter : state.counter + 1
  }
};

const rootReducer = combineReducers({
  account: accountReducer,
  counter: counterReducer,
});

// reducer 전달하여 store 생성
const store = createStore(rootReducer);

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

그러면 `redux`는 `store`의 데이터가 `dispatch`로 업데이트될 때마다 `subscribe`한 컴포넌트를 재호출한다. 여기서 알아야 할 것은 **데이터는 항상 단방향으로 `store` -> 컴포넌트로 흐른다는 것**. -> 이러한 방식으로 데이터 흐름을 단순화 한다.

## `dispatch(action)` 함수로 상태 변경 요청

`store.dispatch(action)` 메서드로 `reducer`를 호출하고 `action` 객체의 값에 따라 `reducer`에 작성된 로직을 실행한다. `reducer` 함수가 반환한 값으로 `state`를 업데이트하고 `subscribe()` 중인 컴포넌트를 호출하여 새 값을 전달한다.

```
import {  combineReducers, createStore } from "redux";

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

const store = createStore(counterReducer);

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

## `action` 생성자 함수

`action` 객체를 일일히 전달하는 것은 번거롭고 오타 가능성도 있기 때문에 다음과 같이 `action` 객체를 반환하는 함수를 정의하여 좀 더 편리하게 액션 객체를 `dispatch` 해줄 수 있다.

```
const counterReducer = (state = { counter: 0 }, action) => {
  switch (action.type) {
    case 'multiple':
      return {
        counter: state.counter * action.payload
      }
    case 'plus':
      return {
        counter: state.counter + action.payload
      }
    default:
      return {
        counter : state.counter + 1
      }
  }
};

const store = createStore(counterReducer);

function multiple(amount) {
  return { type: 'multiple', payload: amount };
}

function plus(amount) {
  return { type: 'plus', payload: amount };
}
store.dispatch(plus(10));
store.dispatch(multiple(5));

console.log(store.getState());
>> { counter: 50 }
```
