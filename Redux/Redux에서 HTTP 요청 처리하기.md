<h2>목차</h2>

- [Redux Toolkit(RTK)에서 HTTP 요청 처리하는 방법](#redux-toolkitrtk에서-http-요청-처리하는-방법)
- [`createAsyncThunk`를 사용한 방법](#createasyncthunk를-사용한-방법)
  - [RTK API `createAsyncThunk`?](#rtk-api-createasyncthunk)

# Redux Toolkit(RTK)에서 HTTP 요청 처리하는 방법

리듀서에서 HTTP 요청과 같은 작업을 어디에서 처리해야 할까?

리듀서 내부에서 부수 효과를 내는 HTTP 요청을 처리할 경우 순수하지 않은 함수가 되고 동일한 입력에도 다른 결과가 나올 수 있게 된다. 이러한 코드는 애플리케이션이 커짐에 따라 복잡성이 증가하고 예측하기 어려워져 유지 보수에 좋지 않다.

또한 상태 업데이트가 목적인 리듀서에 HTTP 요청 같은 비동기 작업이 포함되면 코드가 혼잡해질 수 있다. 따라서 부수 효과를 내는 작업들을 가독성이나 유지 보수를 위해 따로 분리하는 것이 좋다.

분리하는 패턴으로는 크게 다음과 같은 방식이 있다.

1. `createAsyncThunk` (전통적인 `thunk` 방식)

2. `RTK Query (@reduxjs/toolkit/query)` — 서버 상태 관리 전용(최신 권장 방식 v2.10.1)

# `createAsyncThunk`를 사용한 방법

## RTK API `createAsyncThunk`?

`createAsyncThunk`는 비동기 처리를 위한 RTK의 API로 `Redux-thunk`에 전달할 비동기 함수(thunk)를 호출할 액션 객체를 생성하기 위한 생성자 함수를 생성하기 위해 사용한다.

즉, `createAsyncThunk`은 비동기 작업을 처리하는 `action` 객체를 생성하는 action creator를 반환하는데 `createAsyncThunk`로 생성한 액션 생성자를 호출하여 `action` 객체를 생성해주고, `dispatch` 해주면 비동기 작업이 처리된다.

`createAsyncThunk`는 3가지 인수를 받는다. 첫 번째는 액션 타입명과 두 번째로 리듀서에 대한 페이로드를 반환하는(비동기 처리 로직을 담은) 비동기 함수를, 세 번째로 필요에 따라 옵션 객체를 전달해준다. 이때 두 번째 인수는 프로미스를 반환해야 한다.

다음은 간단한 사용 예시이다.

```
<button onClick={() => {
    dispatch(asyncUpFetch());
}}>+ async Thunk </button>
-------------------------
const asyncUpFetch = createAsyncThunk('counterSlice/asynUpFetch', async () => {
    const response = await fetch('https://~~)
    const data = await response.json()
    return data.value
})
```

비동기 처리 상태로는 프로미스와 마찬가지로 3가지가 있는데 `creator.pending`, `creator.fulfilled`, `creator.rejected`가 있다.

이 3가지 상태에 대한 처리 로직은 다음과 같이 `createSlice`의 `extraReducers` 프로퍼티에 전달되는 함수 인수(`builder`)의 `addCase()`로 전달해줘야 한다.

```
const counterSlice = createSlice({
    name: 'counterSlice',
    initialState: {
        value: 0,
        status: 'test',
        error: '',
    },
    extraReducers: (builder) => {
        builder.addCase(asyncUpFetch.pending, (state, action) => {   // pending 일때 동작
            state.status = 'Loading';
        })
        builder.addCase(asyncUpFetch.fulfilled, (state, action) => { // fulfilled 일때 동작
            state.value = action.payload;   // action.payload에는 createAsyncThunk 로 액션 생성자 함수를 생성할 때 2번째 인수로 전달한 비동기 처리 로직의 반환 값이 담긴다.
            state.status = 'complete';
        })
        builder.addCase(asyncUpFetch.rejected, (state, action) => {  // rejected 일때 동작
            state.error = action.error.message
            state.status = 'fail';
        })
    }
})
```

비동기 함수가 성공적으로 `resolve` 하여 `fulfilled` 일때 프로미스 값은 `action.payload`에 담기고 `rejected` 일때 `action.error.message`에 담긴다(에러를 `resolve`한 경우 `action.payload`에 담긴다).

**[RTK createAsyncThunk]**

https://redux-toolkit.js.org/api/createAsyncThunk

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
      {/* <Test /> */ }
    </Layout>
  );
}

export default App;
-----------------------------------------------------
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
