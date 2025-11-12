- [RTK Query란?](#rtk-query란)
- [서버 상태의 특징?](#서버-상태의-특징)
- [RTK Query의 특징](#rtk-query의-특징)
  - [RTK Query APIs](#rtk-query-apis)
- [RTK Query 기본 메커니즘](#rtk-query-기본-메커니즘)
  - [1. `createApi()`로 API 슬라이스 정의하기](#1-createapi로-api-슬라이스-정의하기)
    - [`createApi()` 필수 매개 변수](#createapi-필수-매개-변수)
    - [엔드포인트 정의와 훅 `export`](#엔드포인트-정의와-훅-export)
  - [2. Redux store에 연결](#2-redux-store에-연결)
  - [3. 컴포넌트에서 사용하기](#3-컴포넌트에서-사용하기)
  - [쿼리 훅의 반환 객체](#쿼리-훅의-반환-객체)
- [기존 비동기 로직 RTK Query로 마이그레이션 예시](#기존-비동기-로직-rtk-query로-마이그레이션-예시)
- [RTK Queryd의 장단점](#rtk-queryd의-장단점)

# RTK Query란?

`RTK Query(@reduxjs/toolkit/query)`는 `Redux Toolkit`에 내장된 데이터 fetching 및 캐싱 라이브러리로 **CRUD 요청, 로딩 상태 및 에러 관리, 캐싱, re-fetch, polling** 등을 자동화해주는 서버 데이터 관리 도구다.

`Redux Toolkit` v1.6부터 공식적으로 포함된 기능이며 `RTK`를 사용한 애플리케이션이라면 서버 데이터 관리를 위해 사용할 것을 권장하고 있다(v2.10.1 기준). `RTK Query`의 주요 기능과 API는 다음과 같다.

<!-- 표 좀 더 내용 필요 -->

| 기능                     | 설명                                                                   |
| ------------------------ | ---------------------------------------------------------------------- |
| **자동 캐싱 (Caching)**  | 동일한 요청은 한 번만 fetch 후 캐시에 저장. 필요 시 캐시에서 즉시 반환 |
| **자동 re-fetching**     | 데이터가 오래되었거나 invalidated 되었을 때 자동으로 다시 요청         |
| **로딩/에러 상태 관리**  | `isLoading`, `isSuccess`, `isError` 같은 상태를 자동 제공              |
| **Optimistic Updates**   | 낙관적 업데이트를 쉽게 구현 가능                                       |
| **엔드포인트 단위 관리** | API 요청을 “엔드포인트” 단위로 구조화                                  |
| **Redux DevTools 통합**  | 상태 추적 및 디버깅 용이                                               |

</br>

# 서버 상태의 특징?

클라이언트의 상태와, 서버 상태에는 그 차이가 분명하며 대부분의 클라이언트 상태 관리 라이브러리로는 서버 상태 처리에 적합하지 않다. [Tanstack Query(React Query) "Motivation" 문서 페이지](https://tanstack.com/query/latest/docs/framework/react/overview)에서 설명하는 서버 상태의 특징은 다음과 같다.

- 사용자가 통제하거나 소유할 수 없는 서버에 위치한다.
- 데이터 페치나 업데이트를 위해 비동기 API(`fetch`, `Axios` 등)가 필요하다.
- 소유권이 공유될 수 있으며, 사용자가 모르는 사이 변경될 수 있다.
- 잠재적으로 오래된 상태가 될 수 있다.

이러한 과제를 해결하기 위해선 생각보다 더 많은 작업이 필요하게 된다.

- 데이터 캐싱
- 동일한 데이터에 대한 여러 요청을 단일 요청으로 중복 제거
- 오래된 데이터 업데이트와 오래된 시점을 아는 방법
- 페이지네이션, 게으른 로딩과 같은 성능 최적화
- 서버 상태에 대한 가비지 컬렉션, 메모리 관리
- 구조적 공유를 통한 쿼리 결과 메모이제이션

</br>

# RTK Query의 특징

<!--  -->

## RTK Query APIs

<!--  -->

- **`createApi()`**

  **`RTK query` 기능의 핵심.**
  API slice 정의 (엔드포인트, baseUrl, 캐시 정책 등 설정)

- **`fetchBaseQuery()`**

  `fetch` API를 래핑한 기본 쿼리 함수 (axios 대체 가능)

- `<ApiProvider />`
- `setupListeners()`

</br>

# RTK Query 기본 메커니즘

## 1. `createApi()`로 API 슬라이스 정의하기

`RTK query`는 `Redux Toolkit` 코어 패키지에 포함되어 있으며 두 가지 방식으로 `createApi()`를 `import` 해줄 수 있다.

```
import { createApi } from '@reduxjs/toolkit/query'

/* 정의된 엔드포인트에 따른 hook을 자동 생성하는 React 전용 진입점 */
import { createApi } from '@reduxjs/toolkit/query/react'
```

### `createApi()` 필수 매개 변수

`baseQuery`, `endpoints`

<!--  -->

### 엔드포인트 정의와 훅 `export`

<!--  -->

```
// src/services/postsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const postsApi = createApi({
  reducerPath: 'postsApi', // slice 이름
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
    }),
    getPostById: builder.query({
      query: (id) => `/posts/${id}`,
    }),
    addPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
    }),
  }),
})

// 자동 생성되는 hooks
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
} = postsApi
```

## 2. Redux store에 연결

```
// store.ts
import { configureStore } from '@reduxjs/toolkit'
import { postsApi } from './services/postsApi'

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeneres(store.dispatch)
```

## 3. 컴포넌트에서 사용하기

```
import { useGetPostsQuery } from '../services/postsApi'

export function PostsList() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPostsQuery()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error occurred</p>

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## 쿼리 훅의 반환 객체

<!--  -->

# 기존 비동기 로직 RTK Query로 마이그레이션 예시

# RTK Queryd의 장단점

✅ 서버 상태 관리 자동화

✅ Redux와 완벽히 통합 (Redux DevTools, middleware, store 등)

✅ React Query 수준의 데이터 캐싱 기능

✅ 불필요한 re-render 최소화

✅ API 계층 분리로 코드 구조 명확

| 항목                     | 설명                                                           |
| ------------------------ | -------------------------------------------------------------- |
| 복잡한 커스터마이징 한계 | React Query보다 세밀한 캐시 제어나 리트라이 로직 구성은 제한적 |
| Redux 미사용 시 과함     | 단독 프로젝트에서는 React Query가 더 간단할 수 있음            |
| 서버 상태만 관리         | 클라이언트 로컬 상태는 여전히 별도의 slice로 관리 필요         |
