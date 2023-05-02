<h2>목차</h2>

- [Redux란? - `Context API`의 대안](#redux란---context-api의-대안)
  - [Redux 사용 이유?](#redux-사용-이유)
- [Redux 사용 방식 개괄](#redux-사용-방식-개괄)
  - [Redux 사용 예제](#redux-사용-예제)
- [React-redux](#react-redux)
- [Redux toolkit](#redux-toolkit)
- [Redux DevTools](#redux-devtools)

# Redux란? - `Context API`의 대안

`Redux`는 오픈 소스 자바스크립트 라이브러리로 리액트 앱에서 가장 많이 사용하는 상태 관리 라이브러리이다.

`Redux` 자체는 리액트에 종속된 라이브러리가 아니며 순수 자바스크립트, 혹은 `Vue.js`나 `Angular.js`와 같은 뷰 프레임워크와도 사용할 수 있다.

## Redux 사용 이유?

큰 역할은 리액트의 `Context API`와 비슷하나 좀 더 편리하게 전역 상태를 사용, 업데이트하고 관리하기 위한 도구가 `Redux`라고 보면 된다(리액트 앱에서는 리액트에서 더 쉽게 `Redux`를 사용할 수 있게 해주는 `React-redux`라는 라이브러리를 사용하긴 한다).

`Redux` 공식 문서에서는 `Redux`를 다음과 같이 설명하고있다.

```
Redux는 "액션"이라는 이벤트를 사용하여 애플리케이션 상태를 관리하고 업데이트하기 위한 패턴 및 라이브러리입니다.
상태가 예측 가능한 방식으로만 업데이트될 수 있도록 하는 규칙과 함께 전체 애플리케이션에서 사용해야 하는 상태에 대한 중앙 집중식 저장소 역할을 합니다.
```

`Redux`의 패턴과 도구를 사용하면 상태를 어디서, 언제, 왜, 어떻게 업데이트 되는지, 또 업데이트 로직의 동작을 쉽게 확인하고 관리할 수 있다. 

결론적으로 `Redux`는 여러 곳에서 사용하는 상태 값을 전역에서 관리하여 앱의 복잡도를 줄이고 예측하기 쉽게 하기위해 사용하는 것.

먼저 `Redux`의 주요 개념과 순수 자바스크립트로 `Redux`를 사용해보고, 그 후 `react-redux`를 통해 리액트에 리덕스를 적용해볼 것이다.

# Redux 사용 방식 개괄

위에서 중앙 저장소 역할을 하는 중요한 요소가 `store`이다. 이곳에 `state`가 저장되고, `dispatch`, `subscribe`, `getState`와 같은 메서드로 값을 간접적으로 업데이트하거나 조회한다(직접적으로 접근하는 것은 원본이 변경될 가능성이 있기 때문).

`state`를 업데이트하는 것은 리액트의 `useReducer` 훅과 매우 흡사하다(거의 동일). 
`store.dispatch(action)`를 통해 `reducer`를 호출하고 `action` 객체의 값에 따라 `reducer`에 작성된 로직을 실행해 반환된 값으로 `state`를 업데이트한다.

그 후 `store.subcribe()`로 등록한 UI를 반환하는 모든 `render` 함수를 재호출하여 새롭게 값이 업데이트된 UI를 반환하게 한다. 이러한 매커니즘으로 공통적으로 사용되는 값을 전역 값으로 관리해 로직을 간단하게 만든다.

여기까지는 다른 여타 상태 관리 라이브러리와 크게 다를 바가 없다.

`Redux`만의 강점은 브라우저의 `Redux DevTools` 확장 프로그램을 사용해 마치 버전 관리 시스템처럼 `store`에 저장된 `state`의 변경 히스토리를 확인하고, 또 원하는 지점으로 돌아갈 수 있다는 것!(공식 문서에서는 'time-travel debugging' 이라 표현한다).

코드를 작성해보면서 `Redux`를 살펴본다.

<!-- `render` 함수를 사용해 브라우저에 출력될 `UI`를 만들어내고, 이 함수를 `store.subscribe(render)`에 전달하여 등록한다.

`store`에 저장한 상태를 `reducer`에 정의한 로직을 사용하여 상태 업데이트 하듯 하위 컴포넌트에서 `action`을 전달하여 업데이트 요청할 수 있다. -->

<!-- 전역 상태 업데이트 로직들을 store에 작성하므로 코드를 관리하기가 더 쉽다. 따라서 큰 프로젝트에선 거의 필수적으로 사용한다.

flux 패턴? -->

## Redux 사용 예제

# React-redux

상태관리 도구 `Redux`를 `React`에서 쉽게 사용할 수 있도록 돕는 도구가 `react-redux`이다.

# Redux toolkit

`Redux Toolkit`은 `Redux` 논리를 작성하는 데 권장되는 접근 방식으로 `Redux` 앱을 빌드하는데 필요한 패키지와 기능이 포함되어 있는 도구이다(리액트 CRA와 같은 역할).

# Redux DevTools

`Redux DevTools Extension`은 시간 경과에 따른 `Redux` `store`의 상태 변경 기록을 보여준다. 불변성(immutability)을 지키며 상태를 업데이트 하는 것으로 이전 상태로 돌아가기 같은 복잡한 기능을 쉽게 사용할 수 있다.
