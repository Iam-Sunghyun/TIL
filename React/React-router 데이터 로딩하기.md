<h2>목차</h2>

- [프로젝트 생성](#프로젝트-생성)
  - [`vite` + `React` 전용 `eslint` 플러그인 설치](#vite--react-전용-eslint-플러그인-설치)
  - [`.eslintrc.json`, `vite.config.js` 파일 설정](#eslintrcjson-viteconfigjs-파일-설정)
  - [리액트 라우터: `react-router-dom` 설치](#리액트-라우터-react-router-dom-설치)
- [`createBrowserRouter()`로 라우트 정의하기(6.4v 새 방식)](#createbrowserrouter로-라우트-정의하기64v-새-방식)

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
  {
    path: "/",
    element: <Root />, // 라우트
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
