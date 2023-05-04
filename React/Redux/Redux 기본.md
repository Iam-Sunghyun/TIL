<h2>목차</h2>

- [Redux란?](#redux란)
  - [Redux 사용 이유?](#redux-사용-이유)
- [Redux 사용 방식](#redux-사용-방식)
  - [`store` 생성 및 `reducer` 함수 설정](#store-생성-및-reducer-함수-설정)
  - [`dispatch(action)` 함수로 상태 변경 요청](#dispatchaction-함수로-상태-변경-요청)
- [React-redux](#react-redux)
- [Redux toolkit](#redux-toolkit)
- [Redux DevTools](#redux-devtools)

# Redux란?

`Redux`는 오픈 소스 자바스크립트 라이브러리로 리액트 앱에서 가장 많이 사용하는 전역 상태 관리 라이브러리이다.

`Redux` 자체는 리액트에 종속된 라이브러리가 아니며 순수 자바스크립트, 혹은 `Vue.js`나 `Angular.js`와 같은 뷰 프레임워크와도 사용할 수 있다.

## Redux 사용 이유?

리액트의 내장 기능인 `Context API`가 있는데도 `Redux`를 사용하는 이유는 **`Context`의 단점 중 하나는 규모가 큰 애플리케이션에서 아래와 같이 매우 복잡해질 수 있다는 것**이다.

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

그렇다고 하나의 `Context`에 모든 것을 담기엔 너무 복잡해지고, 또 잦은 업데이트로 인해 불필요한 렌더링도 발생하게 된다(`Context`의 일부만 업데이트 해도 모든 컴포넌트가 리렌더링되는 성질 때문).

이러한 문제들의 대안으로 `Redux`를 사용한다.

말 그대로 대안이기 때문에 역할은 리액트의 `Context API`와 비슷하나 좀 더 편리하게 전역 상태를 사용, 업데이트하고 관리하기 위해 만들어졌다(리액트 앱에서는 리액트에서 더 쉽게 `Redux`를 사용할 수 있게 해주는 `React-redux`라는 라이브러리를 사용한다).

`Redux` 공식 문서에서는 `Redux`를 다음과 같이 설명하고있다.

```
Redux는 "액션"이라는 이벤트를 사용하여 애플리케이션 상태를 관리하고 업데이트하기 위한 패턴 및 라이브러리입니다.
상태가 예측 가능한 방식으로만 업데이트될 수 있도록 하는 규칙과 함께 전체 애플리케이션에서 사용해야 하는 상태에 대한 중앙 집중식 저장소 역할을 합니다.
```

`Redux`의 패턴과 도구를 사용하면 상태를 어디서, 언제, 왜, 어떻게 업데이트 되는지, 또 업데이트 로직의 동작을 쉽게 확인하고 관리할 수 있다. 

**결론적으로 `Redux`를 사용하는 이유는 여러 곳에서 사용하는 상태 값을 `Redux`의 방식으로 전역에서 관리하여 앱의 복잡도를 줄이고 예측하기 쉬운 코드를 작성하기 위한 것이다.**

먼저 `Redux`의 주요 개념과 순수 자바스크립트로 `Redux`를 사용해보고, 그 후 `react-redux`를 통해 리액트에 리덕스를 적용해볼 것이다.

# Redux 사용 방식

위에서 말한 중앙 저장소 역할을 하는 `Redux`의 핵심 요소가 `store`이다. 

하나의 `store`에 전역 `state`가 저장되고, `dispatch`, `subscribe`, `getState`와 같은 메서드로 값을 간접적으로 업데이트하거나 조회한다(직접적으로 접근하는 것은 원본이 변경될 가능성이 있기 때문).

리액트가 아닌 순수 자바스크립트 코드를 통해 `Redux` 사용 예시를 살펴본다.

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

`redux.createStore()`로 `store`을 초기화 해줄 때 `reducer`가 반환한 값이 곧 초기 값이 되는데(위에선 1) 이 때 매개변수 초기 값을 설정하여 `undefined`를 참조하는 일이 없도록 해준다.

그 후 `store`의 상태를 사용할 컴포넌트들은(`store.getState()`로 상태를 사용하는 함수들) `store.subscribe(component)` 메서드를 사용하여 저장소를 `subscribe` 해줘야 한다.  

`store`는 `dispatch`로 데이터가 변경될 때마다 `subscribe`한 컴포넌트를 호출하여 변경된 데이터를 전달하게 된다(데이터는 항상 단방향으로 `store` -> 컴포넌트로 흐른다).

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

`Redux`만의 강점이라고 할 수 있는 것은 브라우저의 `Redux DevTools` 확장 프로그램을 사용해 마치 버전 관리 시스템처럼 `store`에 저장된 `state`의 변경 히스토리를 확인하고, 또 원하는 지점으로 돌아갈 수 있다는 것!(공식 문서에서는 'time-travel debugging' 이라 표현한다).

<!-- -->

<!-- 전역 상태 업데이트 로직들을 store에 작성하므로 코드를 관리하기가 더 쉽다. 따라서 큰 프로젝트에선 거의 필수적으로 사용한다.

flux 패턴? -->

# React-redux

상태관리 도구 `Redux`를 `React`에서 쉽게 사용할 수 있도록 돕는 도구가 `react-redux`이다.

# Redux toolkit

`Redux Toolkit`은 `Redux` 논리를 작성하는 데 권장되는 접근 방식으로 `Redux` 앱을 빌드하는데 필요한 패키지와 기능이 포함되어 있는 도구이다(리액트 CRA와 같은 역할).

# Redux DevTools

`Redux DevTools Extension`은 시간 경과에 따른 `Redux` `store`의 상태 변경 기록을 보여준다. 불변성(immutability)을 지키며 상태를 업데이트 하는 것으로 이전 상태로 돌아가기 같은 복잡한 기능을 쉽게 사용할 수 있다.
