<h2>목차</h2>

- [리액트 라우터가 뭔지 역할, 필요 이유 및 장점](#리액트-라우터가-뭔지-역할-필요-이유-및-장점)
- [프로젝트 준비](#프로젝트-준비)
  - [vite 프로젝트 생성](#vite-프로젝트-생성)
  - [`vite`용 `eslint` 플러그인 설치](#vite용-eslint-플러그인-설치)
  - [`.eslintrc.json`, `vite.config.js` 파일 설정 및 실행](#eslintrcjson-viteconfigjs-파일-설정-및-실행)
  - [리액트 라우터: `react-router-dom` 설치](#리액트-라우터-react-router-dom-설치)
- [라우트(Route) 정의](#라우트route-정의)
- [네비게이션 바 생성 - 페이지 연결(linking) 하기](#네비게이션-바-생성---페이지-연결linking-하기)
  - [`<Link>` 컴포넌트](#link-컴포넌트)
  - [`<NavLink>` 컴포넌트](#navlink-컴포넌트)
- [활성화 된 `<NavLink>` 링크 스타일링하기](#활성화-된-navlink-링크-스타일링하기)
  - [인라인 스타일](#인라인-스타일)
  - [CSS modules 전역 클래스 사용](#css-modules-전역-클래스-사용)
- [Reference](#reference)

<!-- vite - 빌드 툴
webpack - 모듈 번들러
babel - 트랜스 파일러

create-react-app과 달리 Vite는 기본적으로 다양한 프레임워크(vue, react, preact, svelte 등)에 대한 몇 가지 템플릿을 포함하는 최신 빌드 도구에 가깝습니다. 따라서 다양한 프레임워크에서 사용할 수 있고 바닐라 JS로도 사용할 수 있다. -->

# 리액트 라우터가 뭔지 역할, 필요 이유 및 장점

리액트로 만들어진 SPA(Single Page Applicatino)은 클라이언트 사이드에서 동적으로 페이지를 변경하여 보여주기 때문에 화면 전환이 빨라 좋은 사용자 경험을 제공할 수 있다.

하지만 하나의 URL을 갖고 페이지가 서버에 요청하는 것이 아닌 클라이언트 사이드에서 자바스크립트를 통해 동적으로 변경되기 때문에 페이지가 변경돼도 URL은 변경되지 않게된다. 이것은 뒤로가기나, 특정 페이지를 URL로 요청할 수 없게 하여 제대로된 웹 사이트의 기능을 하지 못하게 한다(웹 애플리케이션은 다양한 URL 경로에 따라 다른 기능 또는 페이지를 제공할 수 있어야 한다).

이때 클라이언트 측 라우팅 기능을 사용하면 페이지마다 고유의 URL을 설정하여 클라이언트 측에서 링크 클릭으로 URL을 업데이트하고, 서버 요청 없이 URL에 대응되는 컴포넌트로 전환되게 만들 수 있다. 이로서 브라우저는 웹 사이트의 history를 기록할 수 있게 되고 뒤로 가기, 앞으로 가기와 같은 기능이 가능해지며 페이지마다 고유의 URL을 같기 때문에 북마크도 가능해진다. 제대로 된 SPA가 되는 셈이다.

대부분의 프런트 엔드 프레임워크에는 이러한 클라이언트 측 라우팅 기능이 프레임워크에 바로 포함되어 있다. 하지만 리액트는 라이브러리이기 때문에 써드 파티 라이브러리를 사용해줘야 하는데 이때 가장 많이 사용되는 클라이언트 측 라우팅 라이브러리가 `react-router`이다.

<!-- 사용자가 Router 링크를 클릭하여 URL이 변경되면 `react-router`는 DOM을 업데이트한다. -->

# 프로젝트 준비

`vite`, `react-router`, `css module`로 간단한 지도 검색 웹 애플리케이션을 만들어본다.

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

## 리액트 라우터: `react-router-dom` 설치

`react-router`에는 웹과 모바일을 위한 `react-router-dom`, `react-router-native`를 모두 포함하고 있다. 웹 프로젝트이므로 `react-router-dom`만 다운로드 받아준다.

```
npm i react-router-dom
```

# 라우트(Route) 정의

`React Router`의 라우트 정의에는 바닐라 자바스크립트와 `JSX`를 사용하는 방법이 있다.

<!-- ## `JSX` 컴포넌트 -->

`<BrowserRouter>` 컴포넌트로 감싼 내부에 `<Routes>`로 다시한번 감싸주고, 그 안에 `<Route>` 컴포넌트를 사용하여 라우트를 정의해준다. 리액트 라우터에서 아주 중요한 `<Route>` 컴포넌트는 URL을 컴포넌트 혹은 데이터 로딩, 데이터 변형 로직에 연결시켜주는 역할을 한다.

`path` props에 경로를 정의하고 대응되는 컴포넌트(리액트 엘리먼트)를 `element` props에 할당해준다.

<!-- 라우트는 특정 (요청)경로에 대응되는 로직, 응답 정도로 이해하자. -->

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

# 네비게이션 바 생성 - 페이지 연결(linking) 하기

## `<Link>` 컴포넌트

**`react-router-dom`의 `<Link>` 컴포넌트를 사용하면 새로고침 없이 다른 경로의 페이지로 전환하는 링크를 생성할 수 있다.** 다음과 같이 `to` props에 이동하고자 하는 페이지의 경로를 넣어주면 링크가 생성된다. **`<Link>` 컴포넌트는 `<a href='...'>`를 사용하여 만들어지는데** 클릭시 URL이 업데이트되고 해당 경로에 맞는 페이지로 전환된다(`<BrowserRouter>` 내부 영역에 정의해줘야 한다).

만약 클라이언트 측 라우팅이 아닌 새로고침 발생하는 일반적인 화면전환을 원한다면 `<Link reloadDocument>` 속성을 사용해주면 된다.

```
import { NavLink } from 'react-router-dom';

function Homepage() {
  return (
    <>
      <nav>
        <ul >
          <li>
            <NavLink to='/' reloadDocument>Home</NavLink>
          </li>
          <li>
            <NavLink to='/pricing'>Pricing</NavLink>
          </li>
          <li>
            <NavLink to='/products'>Products</NavLink>
          </li>
        </ul>
      </nav>
      <h1>HomePage</h1>
    </>
  );
}

export default Homepage;
```

## `<NavLink>` 컴포넌트

`<Link>` 컴포넌트와 비슷한 종류인 **`<NavLink>` 컴포넌트를 사용하면 해당 요소가 활성화(active), 보류(pending), 전환 중(transitioning) 상태인지를 식별할 수 있어 네비게이션 바를 생성할 때 유용하다.** `<NavLink>` 도 `<Link>` 컴포넌트와 마찬가지로 `<BrowserRouter>` 내부에 정의되어야 한다.

컴포넌트가 활성화되면 해당 컴포넌트의 여러 `props`에(`style`, `children`, `className` 등..) 활성 상태를 알리는 객체가 전달되어 다음과 같이 `props` 값을 동적으로 설정해줄 수 있다.

```
// className props 설정
<NavLink
  to="/messages"
  className={({ isActive, isPending, isTransitioning }) =>
    [
      isPending ? "pending" : "",
      isActive ? "active" : "",
      isTransitioning ? "transitioning" : "",
    ].join(" ")
  }
>
  Messages
</NavLink>
--------------------------------------
// style props 설정
<NavLink
  to="/messages"
  style={({ isActive, isPending, isTransitioning }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
      viewTransitionName: isTransitioning ? "slide" : "",
    };
  }}
>
  Messages
</NavLink>
---------------------------------------
// 자식 요소 영역에 상태 객체 전달
<NavLink to="/tasks">
  {({ isActive, isPending, isTransitioning }) => (
    <span className={isActive ? "active" : ""}>Tasks</span>
  )}
</NavLink>
```

또한 활성화된 컴포넌트에는 `class='active'` 속성이 자동으로 추가되어 스타일을 지정하기 용이하다. 참고로 vite로 생성한 리액트 프로젝트에선 `className`을 `class`로 작성할 경우 제대로 적용이 안되거나 에러가 발생한다.

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

# 활성화 된 `<NavLink>` 링크 스타일링하기

## 인라인 스타일

```
import { NavLink } from 'react-router-dom';
import style from './NavigationBar.module.css';

const isActive = ({ isActive, isPending, isTransitioning }) => {
  return {
    fontWeight: isActive ? 'bold' : '',
    color: isPending ? 'red' : 'black',
    viewTransitionName: isTransitioning ? 'slide' : '',
  };
};

function NavigationBar() {
  return (
    <nav className={style.nav}>
      <ul>
        <li>
          <NavLink to='/' style={isActive}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to='/pricing' style={isActive}>
            Pricing
          </NavLink>
        </li>
        <li>
          <NavLink to='/products' style={isActive}>
            Products
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;
```

## CSS modules 전역 클래스 사용

`:global()` 함수로 전역적으로 선언된 클래스는 기존의 CSS modules 클래스처럼 고유한 값으로 변환되는 것이 아닌 일반 CSS처럼 이름 그대로 전역에서 사용할 수 있게 된다.

아래 예시는 `.nav` 하위 컴포넌트 중 `active` 상태인 컴포넌트의 스타일을 지정하는 CSS이다. 여기서 `:global(.active)` 클래스를 사용하는 이유는 이 클래스를 HTML 문서에서 전역적으로 사용하기 위함이 아닌 `.active` 클래스가 고유한 형태로 변환되지 않게 하여 `.nav` 컴포넌트 하위의 활성화된 `<NavLink>`에 적용되도록 하기 위함이다.

```
.nav :global(.active) {
  font-weight: bold;
  color: red;
}
// 실행시 아래와 같이 변환
._nav_1urp0_1 .active {
  font-weight: bold;
  color: red;
}
--------------------------------
import style from './NavigationBar.module.css';

  <nav className={style.nav}>
    <ul>
      <li>
        <NavLink to='/'>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/pricing'>
          Pricing
        </NavLink>
      </li>
      <li>
        <NavLink to='/products'>
          Products
        </NavLink>
      </li>
    </ul>
  </nav>
```

# Reference

**[react-router]**

https://reactrouter.com/en/main/

**[npm install (plugin) --save와 --save-dev 차이점]**

https://ithub.tistory.com/165

**[vscode에서 자주 쓰는 코드 스니펫(조각) 설정하는 법]**

https://code.visualstudio.com/docs/editor/userdefinedsnippets

https://react.vlpt.us/basic/27-useful-tools.html
