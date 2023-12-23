<h2>목차</h2>

- [중첩 라우트(Nested Route)](#중첩-라우트nested-route)
- [Index Route](#index-route)
- [경로 매개변수(path parameter)와 쿼리 스트링(query string)으로 동적 라우팅](#경로-매개변수path-parameter와-쿼리-스트링query-string으로-동적-라우팅)
  - [경로 매개변수(path params, URL params) 참조](#경로-매개변수path-params-url-params-참조)
  - [쿼리스트링 참조](#쿼리스트링-참조)
- [프로그래매틱 네비게이션(Programmatic navigation)](#프로그래매틱-네비게이션programmatic-navigation)
  - [`useNavigate()` 훅](#usenavigate-훅)
  - [`<Navigate />` 컴포넌트](#navigate--컴포넌트)

# 중첩 라우트(Nested Route)

중첩 라우트는 **부모 라우트 하위에 자식 라우트를 중첩시켜 부모 컴포넌트 내부에서 요청 경로에 따라 자식 컴포넌트를 변경하여 화면에 렌더링 해주고자 할 때** 사용하는 기능이다. **요청 경로는 상위 라우트의 경로를 기반으로 결정된다.**

중첩 라우트를 사용하는 방법은 부모 `<Routes />` 하위에 자식 `<Routes />`를 정의해주고 부모 컴포넌트 내부에 경로와 매칭되는 자식 컴포넌트가 출력됐으면 하는 위치를 `<Outlet />` 컴포넌트를 사용하여 지정해준다.

아래 예시 코드에선 `/app/cities`, `/app/countries`가 각각 `<Cities />`, `<Countries />` 컴포넌트를 반환하는 라우트와 매칭되고 해당 컴포넌트는 `SideBar.jsx`의 `<AppNav />` 컴포넌트 아래에 위치하게 된다.

```
// App.jsx
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/products' element={<Product />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/app' element={<AppLayout />}>
            <Route path='cities' element={<Cities />} />
            <Route path='countries' element={<Countries />} />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
---------------------------
// AppLayout.jsx
function AppLayout() {
  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
    </div>
  );
}

export default AppLayout;
---------------------------
// SideBar.jsx
function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />   // 부모 라우트 하위에서 요청 경로와 매칭되는 중첩 라우트의 컴포넌트가 출력되는 위치
      <Footer />
    </div>
  );
}

export default SideBar;
```

매치되는 경로가 없는 경우 아무것도 렌더링되지 않기 때문에 다음과 같이 `index` 라우트를 통해 기본 라우트를 설정해주거나 `*` 경로를 사용해 지정되지 않은 모든 경로에 대한 요청을 처리해줄 수 있다.

```
// App.jsx
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/products' element={<Product />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/app' element={<AppLayout />}>
            <Route path='cities' element={<Cities />} />
            <Route path='countries' element={<Countries />} />
            <Route path="*" element={<NoMatch />} /> // 경로 외 라우트
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
```

**[React Router 6: Nested Routes]**

https://www.robinwieruch.de/react-router-nested-routes/

# Index Route

라우트에 `index` 속성을 설정하여 부모 컴포넌트 내에서 기본으로 표시 될 자식 컴포넌트를 지정해줄 수 있다.

`index` 라우트에는 `path`를 지정하지 않아야 부모 컴포넌트 내에서 기본으로 렌더링된다. 아래 예시는 `/app`으로 요청 시 `<AppLayout />`의 내부의 `<Outlet />` 컴포넌트 위치에 `<Profile />` 컴포넌트가 기본으로 렌더링된다.

```
// App.jsx
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/products' element={<Product />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/app' element={<AppLayout />}>
            <Route index element={<Profile />} /> // Index 라우트
            <Route path='cities' element={<Cities />} />
            <Route path='countries' element={<Countries />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
```

# 경로 매개변수(path parameter)와 쿼리 스트링(query string)으로 동적 라우팅

리액트 라우터를 사용하는 리액트 애플리케이션에서 URL에 경로 매개변수와 쿼리스트링을 통해 데이터를 전달하는 데에는 다음과 같은 이점이 있다.

1. 컴포넌트 트리의 어떤 위치에 있더라도 현재 URL을 통해 상태에 접근할 수 있다.
2. 별도의 저장 없이 다른 페이지로 상태 전달이 쉽다.
3. 북마크 시 웹 페이지의 URL에 데이터가 포함되기 때문에 디테일한 상태의 웹 페이지를 저장할 수 있다.

## 경로 매개변수(path params, URL params) 참조

경로 매개변수는 라우트의 `path` 내에서 `:example` 형태로 선언하여 사용할 수 있으며 `<Link>, <NavLink>` 링크로 연결한 URL상에서 대응되는 값이 할당된다.

```
  <BrowserRouter>
    <Routes>
      <Route path='/app' element={<AppLayout />}>
        <Route index element={<CityList cities={cities} isLoading={isLoading} />} />
        <Route path='cities' element={<CityList cities={cities} isLoading={isLoading} />} />      <Route path='cities/:id' element={<City />} />  // id 경로 매개변수 선언
      </Route>
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
```

`useParams()` 훅을 사용하여 현재 URL 상의 경로 매개변수를 담은 객체를 참조할 수 있다.

```
// City.jsx
function City() {
  const { id } = useParams();

  return (
    <div className={styles.city}>
          .
          .
          .
    </div>
  );
}
```

## 쿼리스트링 참조

`<Link>, <NavLink>`의 URL에 다음과 같이 `?`를 경계로 쿼리스트링 값들을 전달할 수 있다.

```
<NavLink to={`/app/cities/${id}?lat=${position.lat}&lng=${position.lng}`} >
    .
    .
<NavLink/>
```

컴포넌트 내부에서 현재 URL 상의 쿼리스트링에 접근하려면 `useSearchParams()` 훅을 사용한다.

`useSearchParams()`는 `useState()` 훅처럼 [`URLSearchParams` 객체, `set`함수] 두 요소를 값으로 갖는 배열을 반환한다.

반환받은 `URLSearchParams` 객체의 `get()` 메서드를 통해 쿼리스트링에 접근할 수 있다. `useSearchParams()` 훅이 반환하는 `set` 함수를 통해 쿼리스트링 값을 업데이트하면 그에 맞게 URL이 변경되고 `useSearchParams()`로 쿼리스트링을 참조하고 있던 모든 컴포넌트가 리렌더링된다.

<!-- 그럼 set함수 존재이유? -->

```
function City() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return (
    <div className={styles.city}>
        .
        .
        .
    </div>
  );
}

export default City;
```

**[React Router]**

https://reactrouter.com/en/main/start/concepts#index-routes

https://reactrouter.com/en/main/hooks/use-params

https://reactrouter.com/en/main/hooks/use-search-params

**[MDN URLSearchParams]**

https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

# 프로그래매틱 네비게이션(Programmatic navigation)

프로그래매틱 네비게이션이란 링크 클릭 없이 코드 단에서 새 URL(페이지)로 이동하는 것을 말한다.

대표적으로 로그인과 같이 HTML 양식(Form) 제출 후 다른 페이지로 리디렉션하는 경우가 있으며 `react-router`에서 제공되는 `useNavigate()` 훅, `<Navigate />` 컴포넌트를 통해 이와 같은 기능을 사용할 수 있다.

## `useNavigate()` 훅

`useNavigate(URL, option)`는 함수를 반환하는데 이 함수에 2개의 인수를 전달하여 원하는 URL로 이동할 수 있다.

```
navigate("/new-route", { state: { key: "value" } });
```

다음과 같이 숫자를 전달하여 history 스택을 이동할 수 있다.

```
navigate(-1); // 뒤로가기
navigate(2);  // 앞으로 2번
```

## `<Navigate />` 컴포넌트

`react-router`의 `<Navigate />` 컴포넌트를 사용해 좀 더 선언적으로 프로그래매틱 네비게이션을 구현할 수 있다. `useNavigate()` 훅에 비해 자주 사용되진 않으나, 중첩 라우트 내부에서 유용하게 쓸 수 있다.

다음 코드의 경우 `/app`으로 요청 시 `<AppLayout />` 컴포넌트가 화면에 렌더링된다. 그 후 하위에 `index` 라우트의 `<Navigate />` 컴포넌트와 매핑되는데 이때 `<Navigate />`는 `to`에 지정한 경로로 이동한다. 즉, `<Navigate />` 렌더링 될 때 지정한 경로로 이동시키는 기능을 한다.

또한 `replace` 속성을 `true`로 설정하면 `<Navigate />`가 리다이렉션하는 URL이 history 스택에 push 되는 것이 아닌 현재 항목을 대체한다.

```
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/app' element={<AppLayout />}>
            <Route index element={<Navigate replace={ true }to='cities' /> } />
            <Route path='cities' element={<CityList cities={cities} isLoading={isLoading} />} />
            <Route path='cities/:id' element={<City />} />
      </BrowserRouter>
    </>
  );
}

export default App;
```

**[React router - useNavigate(), <Navigate />]**

https://reactrouter.com/en/main/hooks/use-navigate

https://reactrouter.com/en/main/components/navigate
