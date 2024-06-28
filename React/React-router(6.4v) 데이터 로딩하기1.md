<h2>목차</h2>

- [프로젝트 생성](#프로젝트-생성)
  - [`vite` + `React` 전용 `eslint` 플러그인 설치](#vite--react-전용-eslint-플러그인-설치)
  - [`.eslintrc.json`, `vite.config.js` 파일 설정](#eslintrcjson-viteconfigjs-파일-설정)
  - [리액트 라우터: `react-router-dom` 설치](#리액트-라우터-react-router-dom-설치)
- [`createBrowserRouter()`로 라우트 정의하기(6.4v 새 방식)](#createbrowserrouter로-라우트-정의하기64v-새-방식)
- [레이아웃 생성하기](#레이아웃-생성하기)
- [loader로 데이터 로드하기](#loader로-데이터-로드하기)
  - [1. 로더 함수 생성](#1-로더-함수-생성)
  - [2. 로더 제공](#2-로더-제공)
  - [3. `useLodaerData` 훅으로 로더 반환 데이터 사용하기](#3-uselodaerdata-훅으로-로더-반환-데이터-사용하기)
- [`useNavigation`로 로딩 확인하기](#usenavigation로-로딩-확인하기)
- [에러 처리하기](#에러-처리하기)

# 프로젝트 생성

`npm create vite@version` 으로 `vite` 프로젝트를 생성해주면 `node_module` 폴더가 없기 때문에 `npm i`로 의존성 패키지를 다운로드 해준다(안그러면 `npm run dev` 동작 안함).

```
npm create vite@4 // 4 버전 프로젝트 생성
npm install
npm run dev
```

## `vite` + `React` 전용 `eslint` 플러그인 설치

```
// eslint 및 설정 플러그인 설치
npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev
```

`eslint-config-react-app`는 `create-react-app`에 기본으로 포함 되어있는 리액트 앱용 `eslint` 설정 패키지로 `vite`에는 기본으로 포함되어있지 않기 때문에 다운 받아준다.

## `.eslintrc.json`, `vite.config.js` 파일 설정

```
// .eslintrc.json
module.exports = {
     .
     .
 extends: [
    'react-app',  // extend 프로퍼티에 react-app 추가
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
     .
     .
  "no-unused-vars": "warn",  // 사용되지 않은 변수 존재 시 에러를 발생시키던 것을 경고 메시지로 변경
};
----------------------------------
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],  // eslint() -> vite eslint 플러그인 추가
});
```

## 리액트 라우터: `react-router-dom` 설치

`react-router`는 `react-router-dom`, `react-router-native`에 필요한 코어 패키지이다. 웹 프로젝트이므로 `react-router-dom`를 다운받아 주는데 이때 의존성으로 `react-router`가 다운 받아진다.

```
npm i react-router-dom
```

# `createBrowserRouter()`로 라우트 정의하기(6.4v 새 방식)

`createBrowserRouter`는 `React Router v6`에서 새롭게 도입된 API 중 하나로, 라우터 객체를 생성하는 데 사용된다. 이 함수는 라우터 구성을 **객체 형태로** 만들 수 있게 해주며, 생성한 라우트를 `<RouterProvider>` 컴포넌트에 전달하여 라우팅을 설정한다.

<!-- 보완 필요 -->

이전의 `<BrowserRouter>`에 `<Routes>`와 `<Route>`를 중첩시켜 라우트를 정의하던 방법으로는 6.4v에서부터 데이터 API(`loader`, `actions`, `fetchers` 등)를 사용할 수 없다(6.4v부터 데이터 로드 기능은 `createBrowserRouter()` 함수로 라우터를 생성할 때만 사용할 수 있다).

사용 시 `createBrowserRouter(RouteObject[], opt?)`에 인수를 전달하여 라우트 객체를 생성하는데, 이때 전달하는 인수는 `children` 프로퍼티에 `Route` 중첩 라우팅을 위한 중첩 객체를 갖는 `Route` 객체 배열이다.

`react-router-dom`에서 `createBrowserRouter`를 `import` 해주고 다음과 같이 인수를 전달하여 호출해 라우트를 생성해준다.

```
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  { // 라우트
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [  // 중첩 라우트
      {
        path: "events/:id",
        element: <Event />,
        loader: eventLoader,
      },
    ],
  },
]);
```

생성한 라우터 객체를 `<RouterProvider>` 컴포넌트의 `router` 속성에 전달하여 라우트를 구성할 수 있다.

```
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './ui/Home'
import Menu from './features/menu/Menu'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    // loader:,
    // children: [{
    // }]
  },
  {
    path: '/menu',
    element: <Menu/>,
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App;
```

**[React router - createBrowserRouter]**
https://reactrouter.com/en/main/routers/create-browser-router#createbrowserrouter

https://reactrouter.com/en/main/routers/picking-a-router

# 레이아웃 생성하기

다음과 같이 기본적으로 렌더링 될 레이아웃을 경로 없이 `createBrowserRouter`에 전달하고 `children` 프로퍼티에 하위 라우트를 전달하여 준다.

```
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './ui/Home';
import Menu from './features/menu/Menu';
import CreateOrder from './features/order/CreateOrder';
import Order from './features/order/Order';
import Cart from './features/cart/Cart';
import AppLayout from './ui/AppLayout';

const router = createBrowserRouter([
  {
    element: <AppLayout />, // 경로 없이 전달
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
      },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder /> },
      { path: '/order/:orderId', element: <Order /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
-------------------------------
// AppLayout.jsx
import { Outlet } from 'react-router-dom';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header';

function AppLayout() {
  return (
    <div>
      <Header />  // 고정 렌더링되는 컴포넌트 1
      <main>
        <Outlet /> // 하위 라우트의 컴포넌트가 렌더링될 위치
      </main>
      <CartOverview /> // 고정 렌더링되는 컴포넌트 2
    </div>
  );
}

export default AppLayout;
```

# loader로 데이터 로드하기

`react-router` 라우트 `loader`의 기능은 API로부터 데이터를 가져오는 함수를 생성하는 것이다. 절차는 다음과 같다.

1. 로더 함수 생성
2. 로더 프로퍼티에 로더 함수 전달
3. 컴포넌트에서 데이터 참조

데이터를 로드하고자 하는 컴포넌트 내에 로더를 작성해준다.

## 1. 로더 함수 생성

우선 API로부터 데이터를 받아오고 반환하는 로더 함수를 정의한다. 데이터를 사용하고자 하는 컴포넌트 내에 로더를 작성하는 것이 일반적인 관례이다.

```
import { getMenu } from "../../services/apiRestaurant";

function Menu() {
  return <h1>Menu</h1>;
}

// 데이터를 불러오고 반환하는 로더 함수
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
------------------------
// ../../services/apiRestaurant.js
// 재사용 고려하여 데이터 로드 로직을 따로 분리하여 관리
const API_URL = 'https://react-fast-pizza-api.onrender.com/api';

export async function getMenu() {
  const res = await fetch(`${API_URL}/menu`);
  if (!res.ok) throw Error('Failed getting menu');

  const { data } = await res.json();
  return data;
}
```

## 2. 로더 제공

다음과 같이 렌더링 될 때 데이터를 불러올 컴포넌트(라우트)의 `loader` 프로퍼티에 로더 함수를 전달해준다.

```
  .
  .
import Menu, { loader as menuLoader } from './features/menu/Menu'; // loader 재사용을 고려하여 이름을 구별지어준다.

// App.js
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader // 로더 제공
      },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder /> },
      { path: '/order/:orderId', element: <Order /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

## 3. `useLodaerData` 훅으로 로더 반환 데이터 사용하기

컴포넌트 내에서 `useLodaerData` 훅을 사용해 로더 함수가 반환하는 데이터를 사용할 수 있다.

```
import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";

function Menu() {
  const menu = useLoaderData();
  console.log(menu);

  return <h1>Menu</h1>;
}


export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
------------------------
>> 0: {id: 1, name: 'Margherita', unitPrice: 12, imageUrl: 'https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-1.jpg', ingredients: Array(3), …}
   1: {id: 2, name: 'Capricciosa', unitPrice: 14, imageUrl: 'https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-2.jpg', ingredients: Array(5), …}
     .
     .
     .
```

로더 함수의 특징은 `useEffect`로 페치하는 것과 다르게 렌더링과 동시에 일어난다는 점이다. 그리고 라우터 정의에 로더 함수를 모아서 볼 수 있다는 장점이 있다.

# `useNavigation`로 로딩 확인하기

`useNavigation` 훅으로 페이지가 로드 중일때를 식별할 수 있다(프로그래매틱 네비게이션의 `useNavigate` 훅과 다르다).

`useNavigation` 훅이 반환하는 객체의 `state` 프로퍼티를 통해 페이지가 `idle`, `submitting`(폼 작업 로딩), `loading` 상태인지 확인할 수 있으며 이때 `useNavigation`이 반환하는 객체의 상태는 한 페이지에만 적용되는 것이 아니라 라우터 전체에 대해(애플리케이션 전체 페이지) 적용된다.

라우트의 로더가 호출중일 때 `loading` 상태가 되며 이를 통해 로딩 여부를 식별하여 화면에 표시 해줄 수 있다.

```
import { Outlet, useNavigation } from 'react-router-dom';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div>
      <Header />
      <main>
        { isLoading ? 로딩 컴포넌트 : <Outlet /> }
      </main>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
```

**[react-router useNavigation]**

https://reactrouter.com/en/main/hooks/use-navigation

# 에러 처리하기

에러가 발생하면 에러 객체가 해당 컴포넌트부터 부모 컴포넌트로 버블링된다. 따라서 다음과 같이 에러가 발생한 컴포넌트 자체에서 처리해주거나, 상위 컴포넌트에서 처리해줄 수 있다.

에러 객체를 참조하기 위해선 컴포넌트 내부에서 `useRouterError` 훅을 사용해준다.

```
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />, // 에러 발생 시 <AppLayout /> 대신 렌더링 된다.
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />, // /menu 라우트의 컴포넌트에서 에러 발생시 <Menu /> 컴포넌트 대신 렌더링 될 컴포넌트. 중첩 라우트이므로 부모 컴포넌트의 <Outlet />에 출력된다.
      },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder /> },
      { path: '/order/:orderId', element: <Order /> },
    ],
  },
]);
-------------------------
// Error.jsx 에러 객체를 참조할 에러 컴포넌트
import { useNavigate, useRouteError } from 'react-router-dom';

function Error() {
  const navigate = useNavigate();
  const error = useRouteError(); // 에러 객체 참조 훅

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message}</p>
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

export default Error;
```
