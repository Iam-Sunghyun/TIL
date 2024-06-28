<h2>목차</h2>

- [로더 함수에서 동적 세그먼트(경로 매개변수) 받아오기](#로더-함수에서-동적-세그먼트경로-매개변수-받아오기)
- [`<Form>` 컴포넌트와 `action`으로 데이터 작성 및 변형하기](#form-컴포넌트와-action으로-데이터-작성-및-변형하기)
  - [input type='hidden' 사용하여](#input-typehidden-사용하여)

# 로더 함수에서 동적 세그먼트(경로 매개변수) 받아오기

경로상에 `:`로 시작되는 부분은 동적 세그먼트(경로 매개변수)로 취급된다. `react-router`의 `useParams` 훅을 사용하면 컴포넌트 내부에서 경로 매개변수를 참조할 수 있지만 로더 함수는 컴포넌트가 아니므로 `useParams` 훅을 사용할 수 없다.

이를위해 로더 함수는 호출시 객체를 매개변수로 받는데 이 객체는 `params` 객체와 `request` 객체를 프로퍼티로 갖고 있다. `params` 객체는 경로 매개변수 정보를 갖고있고, `request` 객체는 말 그대로 `fetch` 요청 객체를 의미한다.
<!-- request 객체는 뭐지? -->
이 매개변수를 이용해 동적 세그먼트를 로더 함수 내에서 사용해줄 수 있다.

```
// Order.jsx
  .
  .
// 로더 함수
export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  console.log(params);
  return order
}

export default Order;
------------------------------
>> 
{request: Request, params: {…}, context: undefined}
context: undefined
params: {orderId: '123'}
request: Request {method: 'GET', url: 'http://localhost:5173/order/123', headers: Headers, destination: '', referrer: 'about:client', …}
[[Prototype]]: Object
------------------------------
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder /> },
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
      },
    ],
  },
]);
```

# `<Form>` 컴포넌트와 `action`으로 데이터 작성 및 변형하기

`loader` 함수는 데이터를 읽어오는데 사용되지만 `action`은 데이터를 쓰거나 변형하는데 사용된다.

함께 사용되는 `<Form>` 컴포넌트는 클라이언트 측 라우팅 및 데이터 변형을 위해 일반 HTML 폼을 둘러싼 래퍼 컴포넌트이다. 기본 `method`는 `get`이며 `get` 및 `post` 외에 `put`, `patch` 및 `delete`도 지원한다는 점을 제외하면 일반 HTML 양식 메소드와 동일하다.

또한 `action` 함수의 사용 방법은 `loader` 함수 사용 방식과 유사하다.

`react-router`는 `Form` 컴포넌트의 요청을 `action` 함수가 가로채 동작을 수행한다. 즉, `Form`이 `submit`되면 리액트 라우터는 `action` 함수를 호출하고 제출된 요청 객체를 함수에 전달한다(`loader`와 동일한 인수 전달하는듯({ params, request ..})).

다음과 같이 액션 함수를 사용할 컴포넌트 파일 내에 정의해주고(관례) `Form`을 `submit`할 컴포넌트의 라우트에 연결시켜 준다.

```
// CreateOrder.jsx
  .
  .
  .
export async function action({ request }) {
  const formData = await request.formData(); // request 객체의 요청 body를 FormData 형태로 이행하는 프로미스 반환
  const data = Object.fromEntries(formData); // Object.fromEntires() => 키/값 쌍의 목록을 객체로 변환
  console.log(data);

  return formData
}

export default CreateOrder;

---------------------------------
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder />, action: createOrderAction }, // 액션 함수 전달.
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
      },
    ],
  },
]);
```

이렇게 하면 액션 함수가 전달된 라우트의 컴포넌트에서 `Form` `submit`이 발생할 때마다 액션 함수가 호출된다.

## input type='hidden' 사용하여

**[React router Form]**

https://reactrouter.com/en/main/components/form

**[MDN FormData]**

https://developer.mozilla.org/ko/docs/Web/API/FormData