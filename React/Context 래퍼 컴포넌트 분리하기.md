<h2>목차</h2>

- [래퍼 컴포넌트로 컨텍스트 분리하기](#래퍼-컴포넌트로-컨텍스트-분리하기)
- [컨텍스트로 객체를 전달할 시 주의할 점](#컨텍스트로-객체를-전달할-시-주의할-점)
  - [주의할 점](#주의할-점)

# 래퍼 컴포넌트로 컨텍스트 분리하기

다음은 `Context`를 반환하는 래퍼 컴포넌트를 정의한 코드로 컨텍스트 공급시 흔히 사용되는 패턴이다.

우선 `createContext()`로 `PostContext`를 생성하고 컨텍스트를 반환하는 래퍼 컴포넌트 `<PostProvider />`를 정의한다. `<PostProvider />`에서는 `PostContext`로 공급할 함수, 상태들을 정의하여 공급한다. `<PostProvider />`의 하위 컴포넌트들은 `children`을 통해 내부에 포함되어 컨텍스트 데이터를 공급받을 수 있다.

이렇게 컴포넌트 합성을 통해 컨텍스트 공급을 위한 내용들을 따로 래퍼 컴포넌트로 분리하여 가독성 저하를 방지할 수 있다. 추가로 `PostContext`를 참조하기 위한 `usePost()` 커스텀 훅을 정의하여 주었는데, 컨텍스트 공급 범위를 벗어난 곳에서 참조하는 경우를 좀 더 식별하기 쉽게 간단한 에러 객체를 `throw` 해주었다.

```
import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1) 컨텍스트 생성
const PostContext = createContext();

// 2) 컨텍스트를 반환하는 컴포넌트 정의
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);

  return (
    // 3) children prop을 포함하는 PostContext.provider 반환
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

// PostContext를 참조하는 커스텀 훅
function usePosts() {
  const Context = useContext(PostContext);

  // ContextProvider 범위 밖에서 참조할 경우 좀 더 가독성있는 메시지로 에러처리
  if (Context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return Context;
}

export { PostProvider, usePosts };
----------------------------------------
// App.js -> PostContext를 공급하는 컴포넌트
import { PostProvider } from "./PostContext";

function App() {
        .
        .
        .
  return (
    <section>
      // 하위 컴포넌트에서 PostProvider에 정의된 내용들을 참조할 수 있다.
      <PostProvider>
        <Header />
        <Main />
        <Archive />
        <Footer />
      </PostProvider>
    </section>
  );
}

export default App;
```

# 컨텍스트로 객체를 전달할 시 주의할 점

다음은 `context.Provider`를 반환하는 래퍼 컴포넌트이다.

```
// PostContext.js
const PostContext = createContext();

function PostProvider({ children }) {
        .
        .
        .
  return (
    <PostContext.Provider value={{
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    }}>{children}</PostContext.Provider>
  );
}
```

위와 같이 컨텍스트의 `value`에 객체를 직접 전달하게 되면 래퍼 컴포넌트(`PostContext`)에 리렌더링이 발생했을 경우 `value`에 전달한 객체도 재생성되기 때문에 컨텍스트를 사용하고 있는 컴포넌트에 불필요한 렌더링이 발생할 수 있다.

따라서 혹시나 있을수 있는 불필요한 렌더링을 피하기 위해 다음과 같이 `useMemo()`를 사용하며 따로 객체를 생성하여 전달하는 것이 좋다.

```
// PostProvider.js
const PostContext = createContext();

function PostProvider({ children }) {
        .
        .
        .

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);

  return (
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}
```

### 주의할 점

```
useContext() 는 항상 호출하는 컴포넌트 상위에서 가장 가까운 provider를 찾는다. 즉, 조상 범위에서의 컨텍스트만을 참조하고 컴포넌트 안의 provider는 고려하지 않는다.
```
