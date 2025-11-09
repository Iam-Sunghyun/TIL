<h2>목차</h2>

- [Redux Toolkit(RTK)에서 HTTP 요청 처리하는 방법](#redux-toolkitrtk에서-http-요청-처리하는-방법)
- [`createAsyncThunk`를 사용한 방법](#createasyncthunk를-사용한-방법)
  - [RTK `createAsyncThunk`?](#rtk-createasyncthunk)
  - [비동기 로직 반환 값 처리하기](#비동기-로직-반환-값-처리하기)
  - [추가 예시](#추가-예시)
  - [`createAsyncThunk`의 장점](#createasyncthunk의-장점)

# Redux Toolkit(RTK)에서 HTTP 요청 처리하는 방법

리듀서에서 HTTP 요청과 같은 작업을 어디에서 처리해야 할까?

리듀서 내부에서 부수 효과를 내는 HTTP 요청을 처리할 경우 순수하지 않은 함수가 되고 동일한 입력에도 다른 결과가 나올 수 있게 된다. 이러한 코드는 애플리케이션이 커짐에 따라 복잡성이 증가하고 예측하기 어려워져 유지 보수에 좋지 않다.

또한 상태 업데이트가 목적인 리듀서에 HTTP 요청 같은 비동기 작업이 포함되면 코드가 혼잡해질 수 있다. 따라서 부수 효과를 내는 작업들을 가독성이나 유지 보수를 위해 따로 분리하는 것이 좋다.

분리하는 패턴으로는 크게 다음과 같은 방식이 있다.

1. `createAsyncThunk` (전통적인 `thunk` 방식)

2. `RTK Query (@reduxjs/toolkit/query)` — 서버 상태 관리 전용(최신 권장 방식 v2.10.1)

# `createAsyncThunk`를 사용한 방법

## RTK `createAsyncThunk`?

`createAsyncThunk`는 비동기 처리를 위한 RTK의 API로, 비동기 함수(thunk)를 호출할 액션 객체 생성자 함수를 반환한다. 반환 받은 액션 생성자 함수를 호출하여 `dispatch` 해주면 비동기 작업이 처리되며 간단한 비동기 작업(특정 액션 → API 호출 → 결과를 `slice`에서 처리)에 적합하며 로딩/성공/실패 상태를 직접 관리해야 할 때 유용하다.

`createAsyncThunk(actionType, payloadCreator, options)`는 다음과 같이 3가지 인수를 받는다.

```
const asyncUpFetch = createAsyncThunk(
  'counterSlice/asynUpFetch',
   async (arg, thunkAPI) => {
    const response = await fetch('https://~~)
    const data = await response.json()
    return data.value
  }, options)
```

## 비동기 로직 반환 값 처리하기

비동기 작업의 결과를 처리하기 위한 로직은 `createSlice`로 슬라이스를 생성할 때 인수로 전달하는 객체의 `extraReducers` 프로퍼티에 등록해줄 수 있다. 이 프로퍼티는 `createSlice`로 생성한 슬라이스가 기본으로 갖고 있지 않은 액션 타입에 대한 리듀서를 정의하기 위해 사용한다.

`extraReducers` 프로퍼티에는 함수가 전달 되는데 이 함수는 `createReducer`의 두 번째 인수에 전달되는 함수와 유사하며 특정 액션 타입에 대한 핸들러를 정의할 수 있다. `extraReducers`에 전달되는 함수의 인수 `builder`는 다음과 같은 메서드를 갖는다.

- `builder.addCase(actionCreator, reducer)`

  특정 액션 타입에 대한 리듀서를 등록한다. `addMatcher`와 `addDefaultCase` 메서드 이전에 호출되어야 한다. 액션 생성자를 호출이 아닌 그대로 전달하는 것 주의.

- `builder.addMatcher(matcherFn, reducer)`

  함수를 사용해 액션 타입을 필터링하여 리듀서에 매치시킬 수 있다.

- `builder.addDefaultCase(reducer)`

  매치되는 액션 타입이 없는 경우 기본으로 실행되는 리듀서를 등록한다.

위 메서드로 등록하는 리듀서는 역시 `Immer`로 래핑되어 상태를 직접 변형하는 구문을 사용해도 안전하다. 만약 슬라이스 내 `reducers`와 `extraReducers`에 동일한 이름의 액션 타입이 있는 경우 `reducers`에 등록한 리듀서가 호출된다.

```
const counterSlice = createSlice({
    name: 'counterSlice',
    initialState: {
        value: 0,
        status: 'test',
        error: '',
      },
    extraReducers: (builder) => {
      builder
        .addCase(asyncUpFetch.pending, (state, action) => { // pending 일때 동작
          state.status = 'Loading';
        })
        .addCase(asyncUpFetch.fulfilled, (state, action) => { // fulfilled 일때 동작
          state.value = action.payload; // action.payload에는 createAsyncThunk 로 액션 생성자 함수를 생성할 때 2번째 인수로 전달한 비동기 처리 로직의 반환 값이 담긴다.
          state.status = 'complete';
        })
        .addCase(asyncUpFetch.rejected, (state, action) => { // rejected 일때 동작
          state.error = action.error.message
          state.status = 'fail';
        })
        .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state[action.meta.requestId] = 'fulfilled'
        })
        .addDefaultCase((state, action) => {
          state.otherActions++
        })
      }
  })
```

비동기 함수가 성공적으로 `resolve` 하여 `fulfilled` 일때 프로미스 값은 `action.payload`에 담기고 `rejected` 일때 `action.error.message`에 담긴다(에러를 `resolve`한 경우 `action.payload`에 담긴다).

## 추가 예시

```
// api.js (예: axios 인스턴스)
import axios from 'axios';
export const api = axios.create({ baseURL: '/api' });
-------------------------------------------------
// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './api';

// thunk 생성: payloadCreator는 async 함수
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue, signal }) => {
    try {
      // signal을 axios에 연결하려면 AbortController 처리 필요 (fetch는 기본으로 지원)
      const res = await api.get(`/users/${userId}`);
      return res.data; // fulfilled payload
    } catch (err) {
      // 서버 에러 메시지를 그대로 넘기고 싶을 때
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default userSlice.reducer;
```

<h3>컴포넌트</h3>

```
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './userSlice';

function Profile({ userId }) {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector(state => state.user);

  // effect에서 distpatch
  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (status === 'loading') return <p>로딩...</p>;
  if (error) return <p>에러: {error}</p>;
  return <div>{user && <h1>{user.name}</h1>}</div>;
}
```

## `createAsyncThunk`의 장점

- 단순하고 이해하기 쉬움.
- `rejectWithValue`로 커스텀 에러 페이로드 전달 가능.
- signal(`AbortSignal`)을 사용해 취소 처리 가능 (`fetch` 사용 시 자연스럽게, `axios`는 `AbortController`로 연결 필요).
- 복잡한 비즈니스 로직(여러 액션 연쇄, 로컬 상태 동기화)이 있을 때 유용.

<!--
1. 컴포넌트(useEffect)

2. 리듀서

3. 사용자 정의 액션 생성자 함수 사용

4. 미들웨어 사용

# 1. 특정 컴포넌트에 HTTP 요청(부수효과 로직) 집어넣기

장바구니에 특정 상품을 추가하면 리덕스 `store`의 `state.myCart.cartList`가 업데이트 된다. 그러면 `useSelector()`로 상태를 사용 하고 있는 `cartButton.js` 컴포넌트가 리렌더링 되고, `cartList`를 의존성으로 사용 중인 `useEffect()`가 변경을 감지하여 실행되는데 이때 파이어베이스 실시간 DB에 `PUT`요청을 전송하여 데이터가 추가된다.

즉, 장바구니에 추가할 때마다 `cartButton.js`가 리렌더링 되고, `useEffect()`로 백엔드에 데이터를 추가하는 것.

`async/await`과 `try/catch`로 에러를 처리해주었다.

코드 문제 있음. useEffect() 처리 순서에 따른 백엔드 데이터 날라감 문제

```

// App.js
// 애플리케이션 시작 시 백엔드에서 장바구니 목록 가져와 cartList 상태 변수에 저장
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { myCartActions } from './store/slices/myCartSlice';

function App() {
const showCartList = useSelector(state => state.myCart.showCartList);
// const cartList = useSelector(state => state.myCart.cartList)
const dispatch = useDispatch();

useEffect(() => {
async function fetchCart() {
try {
const cartList = await fetch('https://udemy-e6977-default-rtdb.firebaseio.com/cart.json');
// console.log(cartList)
if (cartList.ok) {
const data = await cartList.json();
console.log(data)
dispatch(myCartActions.fetchCartList(data));
} else {
throw new Error(`${cartList.status} ${cartList.statusText}`);
}
} catch (e) {
console.log(e);
}
}
fetchCart();
// dispatch(myCartActions.fetchCartList(fetchedCartData));
}, [showCartList]);

return (
<Layout>
{ showCartList ? <Cart /> : false }
<Products />
{/_ <Test /> _/ }
</Layout>
);
}

## export default App;

// cartButton.js
// 특정 상품을 추가 할 경우 useEffect()로 백엔드에 PUT 요청
import classes from './CartButton.module.css';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { myCartActions } from '../../store/slices/myCartSlice';
import { useCallback, useEffect } from 'react';

const CartButton = (props) => {
const cartList = useSelector(state => state.myCart.cartList);
const newItemAlert = useSelector(state => state.myCart.newItemAlert);
const dispatch = useDispatch();

const cartButtonClickHandler = useCallback(() => {
dispatch(myCartActions.newItemAlertCheck());
dispatch(myCartActions.showCartList());
}, [dispatch]);

useEffect(() => {
async function addCart() {
try {
const result = await fetch('https://udemy-e6977-default-rtdb.firebaseio.com/cart.json', {
method: 'PUT',
body: JSON.stringify(cartList)
});
if (!result.ok) {
throw new Error(`${result.status} ${result.statusText}`);
}
} catch (e) {
console.log(e);
}
}
addCart();
}, [cartList]);

return (
<button className={ classes.button } onClick={ cartButtonClickHandler }>
{ newItemAlert && <div className={ classes.alert } ></div> }
<span>My Cart</span>
<span className={ classes.badge }>{ cartList.length }</span>
</button>
);
};

export default CartButton;

```

## 에러 발생(`useEffect()` 순서 문제)

위 코드대로 실행했을 경우 제대로 작동하는 것 같지만 새로고침을 거듭하면 일정 확률로 파이어베이스 실시간 db가 날아가는 문제 발생한다.

-> 이는 최상위 컴포넌트 `App.js`에서 백엔드 데이터를 가져오는 `useEffect()`가 하위 컴포넌트인 `cartButton.js`의 백엔드에 데이터를 저장하는 `useEffect()` 보다 늦게 처리되어 서버에서 장바구니 데이터를 가져오기 전에(`cartList`가 빈 배열일 때) 백엔드에 한번 저장해버리게 되면 기존의 데이터가 빈 배열로 덮어 씌워지게 된다.

-> 백엔드에 데이터를 저장하는 `effect`의 실행을 좀 더 제한할 필요가 있다.

```

Effects에서 직접 데이터 가져오기를 작성하는 것은 반복적이며 나중에 캐싱 및 서버 렌더링과 같은 최적화를 추가하기 어렵게 만듭니다. 자신의 것이든 커뮤니티에서 유지 관리하는 사용자 지정 Hook을 사용하는 것이 더 쉽습니다.

```

참고로 `useEffect()`에 전달되는 `setup` 함수의 반환 값은 `cleanup` 함수만 가능하기 때문에, 항상 프로미스를 반환하는 `async` 함수의 경우 내부함수로 정의해줘야 한다. -->

**[`Effect`로 데이터 `Fetch`하기]**

https://react.dev/reference/react/useEffect#fetching-data-with-effects

**[`Effect`에서 데이터 `Fetch`에 대한 좋은 대안은?]**

https://react.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects
