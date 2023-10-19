<h2>목차</h2>

- [리액트 라우터가 뭔지 역할, 필요 이유 및 장점](#리액트-라우터가-뭔지-역할-필요-이유-및-장점)
- [프로젝트 준비](#프로젝트-준비)
  - [vite 프로젝트 생성](#vite-프로젝트-생성)
  - [`vite`용 `eslint` 플러그인 설치](#vite용-eslint-플러그인-설치)
  - [`.eslintrc.json`, `vite.config.js` 파일 설정 및 실행](#eslintrcjson-viteconfigjs-파일-설정-및-실행)
  - [`react-router-dom` 설치](#react-router-dom-설치)
- [라우트(Route) 정의](#라우트route-정의)
- [페이지 연걸(linking) 하기](#페이지-연걸linking-하기)
  - [`<Link>` 컴포넌트](#link-컴포넌트)
  - [`<NavLink>` 컴포넌트](#navlink-컴포넌트)
- [Reference](#reference)

<!-- vite - 빌드 툴
webpack - 모듈 번들러
babel - 트랜스 파일러

create-react-app과 달리 Vite는 기본적으로 다양한 프레임워크(vue, react, preact, svelte 등)에 대한 몇 가지 템플릿을 포함하는 최신 빌드 도구에 가깝습니다. 따라서 다양한 프레임워크에서 사용할 수 있고 바닐라 JS로도 사용할 수 있다. -->

# 리액트 라우터가 뭔지 역할, 필요 이유 및 장점

리액트로 만들어진 SPA(Single Page Applicatino)은 클라이언트 사이드에서 동적으로 페이지를 변경하여 보여주기 때문에 화면 전환이 빨라 좋은 사용자 경험을 제공할 수 있다. 다만 리액트만을 사용하여 만들어진 경우 하나의 URL을 갖고 페이지가 클라이언트 사이드에서 자바스크립트를 통해 동적으로 변경되기 때문에 페이지가 변경돼도 URL이 유지되게 된다. 이것은 뒤로가기나, 특정 페이지를 URL로 요청할 수 없게 하고 제대로된 웹 사이트의 기능을 하지 못하게 한다(웹 애플리케이션은 다양한 URL 경로에 따라 다른 기능 또는 페이지를 제공할 수 있어야 한다).

<!-- 확인 필요 -->

이때 라우팅 기능을 사용하면 페이지마다 그에 상응하는 Route를 설정하여 각각 다른 URL을 갖게할 수 있다. 즉, URL이 변경되면 그에 맞는 컴포넌트가 렌더링되게 만들 수 있다. 이로서 웹 페이지 history를 기록할 수 있게 되고 뒤로 가기, 앞으로 가기 기능을 가능해진다. 또 URL에 따라 다른 페이지를 보여줄 수 있으며 페이지 북마크도 가능해진다. 즉, 제대로 된 SPA가 되는 셈이다.

대부분의 프런트 엔드 프레임워크에는 이러한 클라이언트 측 라우팅 기능이 프레임워크에 바로 포함되어 있다. 하지만 리액트는 라이브러리이기 때문에 써드 파티 라이브러리를 사용해줘야 하는데 이때 가장 많이 사용되는 라우팅 라이브러리가 `react-router`이다.

사용자가 Router 링크를 클릭하여 URL이 변경되면 `react-router`는 DOM을 업데이트한다.

# 프로젝트 준비

## vite 프로젝트 생성

`npm create vite@버전`으로 버전명을 명시하여 `vite` 프로젝트를 생성한다.

```
// vite 최신 버전으로 프로젝트 생성
npm create vite@latest
```

## `vite`용 `eslint` 플러그인 설치

```
// eslint 및 설정 플러그인 설치
npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev
```

`eslint-config-react-app`는 `create-react-app`에 기본으로 포함 되어있는 리액트 앱용 `eslint` 설정 패키지로 `vite`에는 기본으로 포함되어있지 않기 때문에 다운 받아준다.

<h2>npm install (plugin) --save</h2>

패키지(plugin)를 `./node_moduels` 디렉터리에 설치하고 `./package.json` 파일의 `dependencies` 항목에 플러그인 정보가 저장 된다. `--production` 빌드시 해당 플러그인이 포함된다.

<h2>npm install (plugin) --save-dev</h2>

패키지(plugin)를 `./node_moduels` 디렉터리에 설치하고 `./package.json` 파일의 `devDependencies` 항목에 플러그인 정보가 저장 된다. `--production` 빌드시 해당 플러그인이 포함되지 않는다.

## `.eslintrc.json`, `vite.config.js` 파일 설정 및 실행

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

플러그인 추가가 완료되면 아래의 명령어로 애플리케이션을 실행한다.

```
// vite 애플리케이션 실행
npm run dev
```

## `react-router-dom` 설치

`react-router`에는 웹과 모바일을 위한 `react-router-dom`, `react-router-native`를 모두 포함하고 있다. 웹 프로젝트이므로 `react-router-dom`만 다운로드 받아준다.

```
npm i react-router-dom
```

# 라우트(Route) 정의

크게 2가지 방법이 존재,

`<BrowserRouter>` 컴포넌트로 감싼 내부에 다음과 같이 라우트를 정의해준다. `path` prop에 경로를 정의하고 `element` prop에 대응되는 컴포넌트(리액트 엘리먼트)를 할당해준다.

```
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import Pricing from './pages/Pricing';
import Product from './pages/Products';

function App() {
  return (
      /* react-router의 전통적인 라우트 정의 방법 */
      <BrowserRouter>
        <Routes>
          {/* path="요청 경로", element="컴포넌트가 반환하는 리액트 엘리먼트"   */}
          {/* 요청시 특정 path에 대응되는 컴포넌트가 화면에 렌더링되고 나머지는 무시된다*/}
          <Route path='/' element={<Homepage />} />
          <Route path='product' element={<Product />} />
          <Route path='pricing' element={ <Pricing /> } />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
```

각각의 경로로 요청하면 그에 대응되는 컴포넌트가 화면에 출력되는 것을 확인할 수 있다. 하지만 이대로면 페이지가 변경 시 리로드가 발생하여 SPA의 부드러운 화면 전환이 아니게 된다. 이럴 땐 `<Link>` 컴포넌트를 사용하여 새로고침 없이 페이지를 전환할 수 있다. 

# 페이지 연걸(linking) 하기

## `<Link>` 컴포넌트

**`react-router-dom`의 `<Link>` 컴포넌트를 사용하면 새로고침 없이 경로와 대응되는 페이지로 전환할 수 있다.** 다음과 같이 `to` prop에 이동하고자 하는 페이지의 경로를 넣어주면 링크가 생섣된다. **생성된 링크를 클릭하면 링크의 경로에 맞는 페이지로 전환된다.**

`<Link>` 컴포넌트는 `<a href='...'>`를 사용하여 만들어진다.

```
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div>
      <h1>HomePage</h1>
      <Link to='/pricing'>pricing</Link>
    </div>
  );
}

export default Homepage;
```

## `<NavLink>` 컴포넌트

`<Link>` 컴포넌트 대신 **`<NavLink>` 컴포넌트를 사용하면 해당 요소가 활성화(active) 혹은 보류(pending) 상태인지를 식별할 수 있어 네비게이션 바를 생성할 때 유용하다.** 

컴포넌트가 활성화되면 해당 컴포넌트의 여러 `props`에(`style`, `children`, `class` 등..) 활성 상태를 알리는 객체가 전달되어 다음과 같이 `props` 값을 동적으로 설정해줄 수 있다. 

```
import { NavLink } from "react-router-dom";

<NavLink
  to="/messages"
  className={({ isActive, isPending }) =>
    isPending ? "pending" : isActive ? "active" : ""
  }
>
  Messages
</NavLink>;
```

또한 활성화된 컴포넌트에는 `class='active'` 속성이 자동으로 추가되어 스타일을 지정하기 용이하다. 참고로 vite로 생성한 리액트 프로젝트에선 className을 class로 작성할 경우 제대로 적용이 안되거나 에러가 발생한다.

```
import { NavLink } from 'react-router-dom';
import './test.css';

function NavigationBar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/pricing'>Pricing</NavLink>
        </li>
        <li>
          <NavLink to='/products'>Products</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;
-----------------------------------
// test.css 
a.active {
  color: red;
}

li::marker {
  content: '✝ ';
}
```

**이때 `<NavLink>`는 `<BrowserRouter>` 내부에 정의되어야 한다.**

```
import NavigationBar from "../components/NavigationBar";

function Homepage() {
  return (
    <div>
      <NavigationBar />  // <NavLink>가 정의된 컴포넌트
      <h1>HomePage</h1>
    </div>
  );
}

export default Homepage;
-----------------------------------
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
```


# Reference

**[react-router]**

https://reactrouter.com/en/main/

**[npm install (plugin) --save와 --save-dev 차이점]**

https://ithub.tistory.com/165

**[vscode에서 자주 쓰는 코드 스니펫(조각) 설정하는 법]**

https://code.visualstudio.com/docs/editor/userdefinedsnippets

https://react.vlpt.us/basic/27-useful-tools.html