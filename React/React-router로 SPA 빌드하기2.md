<h2>목차</h2>

- [중첩 라우트(Nested Route)](#중첩-라우트nested-route)
- [Index Route](#index-route)

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

**[React Router - Index Routes]**

https://reactrouter.com/en/main/start/concepts#index-routes


