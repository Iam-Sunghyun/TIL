<h2>목차</h2>

- [useFetcher로 페이지 탐색 없이 데이터 fetch 하기](#usefetcher로-페이지-탐색-없이-데이터-fetch-하기)
- [페이지 탐색 없이 데이터 업데이트하기](#페이지-탐색-없이-데이터-업데이트하기)
- [`<Route>` 컴포넌트로 레이아웃 지정하기](#route-컴포넌트로-레이아웃-지정하기)

# useFetcher로 페이지 탐색 없이 데이터 fetch 하기

loader나 action처럼 라우트 탐색 없이(url 변경 없이) 즉, 페이지 전환 없이 loader나 action을 수동으로 호출할 수 있는 훅.

`fetcher.load(href, options)` 함수 호출로 가져온 데이터는 `fetch.data` 프로퍼티에 할당되며 페칭 상태는 `fetch.state`에 할당된다.

```
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu');
  }, [fetcher ]);

    .
    .
    .

<ul className="divide-y divide-stone-200 border-y">
        {cart.map((item) => (
          <OrderItem item={item} key={item.pizzaId}
          ingredients={fetcher.data?.find(pizza => item.pizzaId === pizza.id).ingredients}
          isLoadingIngredients={fetcher.state === 'loading'}
          />
        ))}
</ul>
-----------------------------------------
// App.jsx
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
      {
        path: '/order/new',
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        action: updateOrderAction,
        errorElement: <Error />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

`fetch.state` 프로퍼티 값으로 `idle`, `loading`, `submitting` 상태를 가질 수 있다.

https://reactrouter.com/en/main/hooks/use-fetcher

# 페이지 탐색 없이 데이터 업데이트하기

페이지 전환 없이 데이터 업데이트(`action` 호출) 하는데 사용.
`react-router`의 `Form` 컴포넌트와 기능은 동일하지만 페이지 전환(url 변경)이 일어나지 않음

다음 예시에서 버튼 클릭시 action 호출된다

```
import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';

function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right" >
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}
export default UpdateOrder;


export async function action({ request, params }){
  console.log('test')
  return null
}
-----------------------------------
import { action as updateOrderAction } from './features/order/UpdateOrder';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,

    children: [
            .
            .
            .
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        action: updateOrderAction,
        errorElement: <Error />,
      },
    ],
  },
]);
```

# `<Route>` 컴포넌트로 레이아웃 지정하기

경로 없이 최상위에 컴포넌트를 지정해주어 고정 렌더링되는 컴포넌트를 지정해준다. 중첩 컴포넌트들은 매칭되는 경로에 맞는 컴포넌트가 `<AppLayout />` 컴포넌트 내부의 `<Outlet />` 위치에 출력된다.

```
// App.jsx
function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Navigate to="/dashboard" replace={true} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
-------------------------------
// AppLayout.jsx
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <p>APP LAYOUT</p>
      <Outlet />
    </div>
  );
}
export default AppLayout;
```
