<h2>목차</h2>

- [Redux 등장 배경 및 사용이유](#redux-등장-배경-및-사용이유)
  - [MVC(Model-View-Controller) 패턴](#mvcmodel-view-controller-패턴)
  - [Flux 패턴](#flux-패턴)
  - [Redux](#redux)
    - [`reducer`란?](#reducer란)
  - [Flux와 Redux 차이](#flux와-redux-차이)
  - [Reference](#reference)
- [Redux 사용 방식](#redux-사용-방식)
  - [`reducer` 함수 생성 및 `store` 생성](#reducer-함수-생성-및-store-생성)
  - [`dispatch(action)` 함수로 상태 변경 요청](#dispatchaction-함수로-상태-변경-요청)
  - [`action` 생성자 함수](#action-생성자-함수)

# Redux 등장 배경 및 사용이유

## MVC(Model-View-Controller) 패턴

MVC 패턴은 1970년대에 'Smalltalk-76'이라는 언어에 도입되어 지금까지 사용되는 소프트웨어 디자인 패턴 중 하나로 3가지 개념(Model, View, Controller)으로 애플리케이션을 구조화 한다.

+ `Model` : 데이터를 저장 및 관리 담당
+ `View` : 화면에 출력 할 UI를 정의
+ `Controller` : 모델과 뷰 사이에서 통신을 담당
  
<!-- Model에 데이터를 저장하고, 변경 시 뷰에게 알린다().
Controller를 사용해 Model의 데이터를 관리하며 변경된 데이터를 View에 출력한다. -->

MVC는 애플리케이션을 간단한 형태로 구조화하여 이해하기 쉽게 만든다. 또 내부 로직과 데이터, UI를 분리하여 관리하기 쉽게 만든다는 장점이 있다(소프트웨어의 비즈니스 로직과 화면을 구분하는데 중점을 두고 있다).

<div style="text-align: center">
  <img src="./img/500px-MVC-Process.svg.png" width="300px" heigth="550px" style="margin: 0 auto"/>
  <p style="color: gray">[위키피디아](https://ko.wikipedia.org/wiki/모델-뷰-컨트롤러)</p>
</div>

</br>
위 그림처럼 본질적인 MVC 패턴의 데이터 흐름은 단방향이다. 하지만 이는 엄격한 것이 아닌 하나의 추상적인 개념이므로 실제 웹 애플리케이션에선 아래와 같은 구조가 일반화되어 사용된다(데이터 흐름에 있어서는 일관되지 않고 구현에 따라 약간씩 달랐다).
</br>


<div style="text-align: center">
  <img src="./img/300px-Router-MVC-DB.svg.png" width="320px" height="250px" style="margin: 0 auto"/>
  <p style="color: gray">[위키피디아](https://ko.wikipedia.org/wiki/모델-뷰-컨트롤러)</p>
</div>

</br>
<!-- 양방향 바인딩 깊은 이해 부족, 이미지 변경 고려-->
MVC의 특징으로는 양방향으로 데이터가 흐를 수 있다는 것이다. Model의 데이터가 변경되면 View도 변경되고, 또 View를 통해 데이터를 입력받아 직접 Model을 업데이트할 수도 있다. 규모가 커질수록 많은 Model과 View가 생성되게 되고 다대다로 의존하게 된다면 데이터의 흐름이 복잡해지고 일부의 변경이 연쇄적인 변경을 일으켜 예측하기 어렵게 만들 수 있다.

이러한 문제로 애플리케이션을 확장하는데 한계가 있다고 판단한 Meta(전 Facebook)는 2014년 Flux라는 새로운 소프트웨어 아키텍처를 제안했고 이 패턴과 React를 통해 좀 더 예측하기 쉬운 형태로 코드를 구조화할 수 있을 것이라고 말한다.

## Flux 패턴 

Flux 패턴은 크게 4가지 개념(Store, Dispatcher, Action(Action 생성자), View)으로 구성되어 있다. 

+ store
+ Dispatcher
+ Action
+ View

<!-- 수정 -->
애플리케이션의 사용자 상호작용을 기반으로 Action을 생성하고, 이를 Dispatcher에 전달하면 Dispatcher가 등록된 콜백 함수로 Store의 데이터를 업데이트한 뒤 View에 반영하는 식의 **단방향의 데이터 흐름을 가지는 소프트웨어 아키텍처**이다.

</br>

<div style="text-align: center">
  <img src="./img/flux_pattern.png" width="450px"  style="margin: 0 auto"/>
  <p style="color: gray">https://github.com/facebookarchive/flux</p>
</div>
</br>

**[Flux]**

https://haruair.github.io/flux/docs/overview.html
<!-- **https://github.com/facebookarchive/flux 플럭스 깃헙 문서** -->

Flux 패턴은 데이터 흐름을 단방향으로 강제하기 때문에 흐름을 파악하기가 용이하고, 그 결과를 쉽게 예측할 수 있다는 장점이 있다.

하지만 일부에서는 Flux 패턴도 본질적으로 MVC와 크게 다를 바가 없으며 약간 개선된 형태에 새로운 이름을 붙인 것이라고 하기도 한다. 즉, Flux의 등장 배경은 페이스북 측에서 MVC를 잘못 사용한 것 때문이지, 순수 MVC의 한계 때문이 아니라는 것.

## Redux

Flux 패턴에 Dan Abramov이라는 개발자가 `reducer`를 결합하여 좀 더 단순화하여 만든 라이브러리가 바로 `Redux`이다. `Redux`는 구체적인 부분에서 Flux와 약간 다르게 동작하는데 Dispatcher가 존재하지 않고 action을 Dispatch하면 `reducer`가 상태를 업데이트한다(상태는 store에 저장된다).  

`Redux`는 오픈 소스 자바스크립트 라이브러리이며 리액트 앱에서 가장 많이 사용하는 전역 상태 관리 라이브러리이다. `Redux`는 리액트에 종속된 라이브러리가 아니므로 순수 자바스크립트, 혹은 `Vue.js`나 `Angular.js`와 같은 뷰 프레임워크와도 사용할 수 있다.

`Redux`는 상태를 하나의 중앙 저장소(store)에 저장하여 관리하고 Flux와 마찬가지로 데이터 흐름이 단방향이기 때문에 이해하고 예측하기 쉬우며 디버깅도 용이하다.
</br>

<div style="text-align: center">
  <img src="./img/redux.gif" width="450px"  style="margin: 0 auto"/>
</div>
</br>

### `reducer`란? 

리듀서(감속기, 감속기 함수)란 누적 값과 새 값을 받아 새로운 누적 값을 반환하는 함수를 말한다. 여러 값을 하나의 값으로 줄이는데 사용된다.

감속기는 `Redux`에만 있는 것이 아니라 함수형 프로그래밍에서 사용되는 일반적인 개념으로 부수 효과(side effect)가 없으며 동기적으로 동작하는 순수함수를 말한다. 자바스크립트 배열 내장 메서드(`Array.prototype.reduce()`)에서도 볼 수 있다.

`Redux`에서 누적된 값은 이전 상태(state) 객체이고, 새 값은 `action`이다. 리듀서는 이전 상태와 `action`을 통해 새 누적 상태를 계산해 반환한다. 이때 `reducer` 함수는 순수해야한다! 

**[Redux.js - reducer란]** https://redux.js.org/understanding/thinking-in-redux/glossary#reducer

**[부수효과와 순수함수]** https://maxkim-j.github.io/posts/js-pure-function/

## Flux와 Redux 차이

다음은 Flux와 `Redux`의 차이점이다. 

+ Flux는 아키텍처 패턴이고 `Redux`는 Flux 패턴의 구현이다.

+ `Redux`는 일반적으로 단일 저장소(store)를 사용하고 Flux 패턴은 여러 개의 저장소를 사용한다.
  + 여러 저장소마다 개별적인 처리 로직이 필요하기 때문에 내용 추적이 좀 더 까다로울 수 있다.
   
<!-- + 디스패치 프로세스? -->
+ Flux 패턴에는 싱글톤 객체인 단일 Dispather가 있으며 action을 전달하여 상태를 업데이트 한다. `Redux`에는 디스패처가 따로 없으며 `reducer`를 통해 상태 업데이트가 이루어진다(store 내부에 디스패치 프로세스가 내장 되어있다).

+ Flux 패턴에서 상태 업데이트 로직은 각각의 store에 저장되며 `Redux`에선 `reducer`에 저장된다(`reducer`없이 `store`을 정의할 수 없다).

<!-- + Flux 불변성 x redux 불변성 o -->

## Reference

**[Flux Redux 차이]**

https://medium.com/edge-coders/the-difference-between-flux-and-redux-71d31b118c1

https://sunscrapers.com/blog/flux-and-redux-differences/

https://baeharam.netlify.app/posts/architecture/flux-redux (이미지 참고용)

**[Flux 패턴에 대하여]** 

http://fluxxor.com/what-is-flux.html

https://www.freecodecamp.org/news/an-introduction-to-the-flux-architectural-pattern-674ea74775c9/

**[페이스북의 결정: MVC는 확장에 용이하지 않다. 그렇다면 Flux다.]**

https://blog.coderifleman.com/2015/06/19/mvc-does-not-scale-use-flux-instead/

**[MVC vs. Flux ? Bidirectional vs. Unidirectional?]** 

https://stackoverflow.com/questions/33447710/mvc-vs-flux-bidirectional-vs-unidirectional

**[Redux 쓰는 이유?]** 

https://wooder2050.medium.com/%EB%A6%AC%EB%8D%95%EC%8A%A4-redux-%EB%8A%94-%EC%99%9C-%EC%93%B0%EB%8A%94-%EA%B1%B4%EB%8D%B0-2eaafce30f27

**[MERN을 통한 MVC 예시]** https://www.freecodecamp.org/news/mvc-architecture-what-is-a-model-view-controller-framework/

**[MVx 아키텍처]** https://www.clariontech.com/blog/evaluating-design-patterns-for-mobile-development

**[프론트엔드 아키텍처의 가장 최근 트렌드는?]**

https://yozm.wishket.com/magazine/detail/1663/

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
const store = createStore(counterReducer);

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

`store.dispatch(action)` 메서드로 `reducer`를 호출하고 `action` 객체의 값에 따라 `reducer`에 작성된 로직을 실행한다. `reducer`가 반환한 값으로 `state`를 업데이트하고 `subscribe()` 중인 컴포넌트를 호출하여 새 값을 전달한다.

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

