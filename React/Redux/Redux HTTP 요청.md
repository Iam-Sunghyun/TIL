<h2>목차</h2>

- [리덕스 리듀서에서 HTTP 요청 처리](#리덕스-리듀서에서-http-요청-처리)
- [1. 특정 컴포넌트에 HTTP 요청(부수효과 로직) 집어넣기](#1-특정-컴포넌트에-http-요청부수효과-로직-집어넣기)
- [2. 리덕스 리듀서에서 HTTP 요청 처리하기](#2-리덕스-리듀서에서-http-요청-처리하기)
- [3. 사용자 정의 액션 생성자 함수](#3-사용자-정의-액션-생성자-함수)
- [4. 미들웨어(redux-thunk, redux-saga ...)](#4-미들웨어redux-thunk-redux-saga-)

# 리덕스 리듀서에서 HTTP 요청 처리

리듀서에서 HTTP 요청과 같은 작업을 어디에서 처리해야 할까?

리듀서 내부에서 부수효과를 내는 HTTP 요청을 처리할 경우 순수하지 않은 함수가 되고 동일한 입력에도 다른 결과가 나올 수 있게 된다. 이러한 코드는 애플리케이션이 커짐에 따라 복잡성이 증가하고 예측하기 어려워져 유지보수에 좋지 않다.

또한 상태 업데이트가 목적인 리듀서에 HTTP 요청 같은 비동기 작업이 포함되면 코드가 혼잡해질 수 있다. 따라서 부수효과를 내는 작업들을 가독성이나 유지보수를 위해 따로 분리하는 것이 좋다.

분리하는 패턴으로는 크게 다음과 같은 것들이 있다.

1. 컴포넌트(useEffect)

2. 리듀서

3. 사용자 정의 액션 생성자 함수 사용

4. 미들웨어 사용


# 1. 특정 컴포넌트에 HTTP 요청(부수효과 로직) 집어넣기

장바구니에 특정 상품을 추가하면 리덕스 `store`의 `state.myCart.cartList`가 업데이트 된다. 그러면 `useSelector()`로 상태를 사용 하고 있는 `cartButton.js` 컴포넌트가 리렌더링 되고, `cartList`를 의존성으로 사용 중인 `useEffect()`가 변경을 감지하여 실행되는데 이때 파이어베이스 실시간 DB에 `PUT`요청을 전송하여 데이터가 추가된다.

즉, 장바구니에 추가할 때마다 `cartButton.js`가 리렌더링 되고, `useEffect()`로 백엔드에 데이터를 추가하는 것.

`async/await`과 `try/catch`로 에러를 처리해주었다.

```
// cartButton.js
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

참고로 `useEffect()`에 전달되는 `setup` 함수의 반환 값은 `cleanup` 함수만 가능하기 때문에, 항상 프로미스를 반환하는 `async` 함수의 경우 내부함수로 정의해줘야 한다.

# 2. 리덕스 리듀서에서 HTTP 요청 처리하기


# 3. 사용자 정의 액션 생성자 함수

# 4. 미들웨어(redux-thunk, redux-saga ...)
