<h2>목차</h2>

- [Redux에서 비동기 작업을 처리하는 방법](#redux에서-비동기-작업을-처리하는-방법)
  - [Redux-thunk](#redux-thunk)
- [Redux-thunk로 API 요청하기](#redux-thunk로-api-요청하기)
  - [Redux에 Redux-thunk 적용해주기(RTK 없이)](#redux에-redux-thunk-적용해주기rtk-없이)
  - [비동기 처리 함수(thunk 함수) `dispatch` 하기](#비동기-처리-함수thunk-함수-dispatch-하기)

# Redux에서 비동기 작업을 처리하는 방법

`redux`의 `reducer`를 순수하게 유지하기 위해, 또 상태 관리 로직 복잡도를 줄이기 위해(`reducer`에서 비동기 작업을 분리하여 상태 업데이트에만 집중하도록) `redux`에서는 부수효과를 내는 비동기 작업을 미들웨어를 사용해 따로 분리하여 처리한다. 미들웨어는 `dispatch`와 `store` 사이에서 동작하며 `action`을 `dispatch`하고 나서 `store`의 `reducer`에 도달하기 전 실행된다.

## Redux-thunk

리덕스의 부수효과를 내는 작업을 처리하기 위해 가장 많이 사용하는 써드 파티 라이브러리가 `redux-thunk`다.

`redux-thunk` 미들웨어 동작 흐름은 다음과 같다. 우선 함수를 `dispatch`하면 `redux-thunk`가 함수를 받는다. 그 후 필요한 작업(ex)서버에 데이터 요청)을 처리한 후 `payload`에 담아 `store`의 `reducer`에 전달하여 상태가 업데이트된다.

<div style="text-align: center">
  <img src="./img/ReduxAsyncDataFlowDiagramX.gif" width="350px"  style="margin: 0 auto"/>
</div>
</br>

# Redux-thunk로 API 요청하기

## Redux에 Redux-thunk 적용해주기(RTK 없이)

`Redux-thunk`를 사용하기 위해서 다음 3단계를 거친다.

1. `Redux-thunk` 설치
2. `store`에 적용
3. `action` 생성자 함수에서 함수 반환하여 `dispatch`

`redux`의 `createStore`로 `store`를 생성할 때, 첫 번째 인수로 결합한 리듀서를, 두 번째 인수로 `applyMiddleware(thunk)`를 전달해준다. 여기서 `thunk`는 `redux-thunk`에서 `import` 해준 것으로 예시 코드는 다음과 같다.

<!-- `applyMiddleware`로 `thunk` 적용 -->
<!-- `redux-devtools-extension`의 `composeWithDevTools`로 -->

```
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
```

## 비동기 처리 함수(thunk 함수) `dispatch` 하기

`thunk`가 비동기 작업을 처리하게 하려면 `store`에 액션을 디스패치할 때 액션 객체를 전달하는 것이 아닌 비동기 작업을 처리하는 `thunk` 함수를 전달해야 한다(액션 생성자 함수를 통해).

함수를 디스패치하면 `redux`는 해당 함수에 2개의 인수를 전달하여 호출하는데 첫 번째로 `dispatch` 함수와, `redux` `store`의 `state`에 접근할 수 있는 `getState` 함수이다. 이 두 함수를 내부에서 사용하여 비동기 처리 결과를 새롭게 `dispatch` 할 수 있다.

이런 식으로 비동기 작업을 `reducer` 로직과 분리하여 코드 복잡도를 줄일 수 있다.

```
// accountSlice.js
export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });

    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;

    dispatch({ type: "account/deposit", payload: converted });
  };
}
--------------------
// 컴포넌트
  function handleDeposit() {
    if (!depositAmount) return;

    dispatch(deposit(depositAmount, currency));
    setDepositAmount("");
    setCurrency("USD");
  }
```
