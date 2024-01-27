# Redux DevTools

`Redux DevTools Extension`은 시간 경과에 따른 `Redux` `store`의 상태 변경 기록을 확인하며 디버깅할 수 있게 해주는 크롬 확장 프로그램이다. 불변성(immutability)을 지키며 상태를 업데이트 하는 것으로 이전 상태로 돌아가기 같은 복잡한 기능을 쉽게 사용할 수 있다.

우선 크롬 확장 프로그램을 다운로드 받아주고, `npm`으로 `redux-devtools-extension` 패키지를 다운로드 받아준다.

```
npm i redux-devtools-extension
```

그런 다음 `store` 생성시 다음과 같이 `composeWithDevTools()`에 추가할 미들웨어를 적용한 함수(`applyMiddleware`)를 인수로 전달하여 `createStore()`에 전달해주면 개발자 도구에서 `Redux` 탭이 추가되어 `Redux DevTools`를 사용할 수 있다.

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
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
```

개발자 도구에서 `Redux` 탭을 켜면 `dispatch`한 액션들을 확인할 수 있고, 그때 마다 업데이트된 `store`의 상태를 확인할 수 있다. 또 특정 액션이 `dispatch`된 시점으로 이동하면서(특정 상태로 이동) 즉, `store` 업데이트에 따른 화면 변화를 확인할 수 있기 때문에 복잡한 상태 변화를 관찰하며 디버깅하기 매우 유용하다. 또 `>_` 아이콘을 클릭하면 직접 `dispatch`를 할 수도 있다.