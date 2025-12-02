<h2>목차</h2>

- [`RTK Query`란?](#rtk-query란)
  - [서버 상태의 특징?](#서버-상태의-특징)
  - [RTK Query APIs](#rtk-query-apis)
- [RTK Query 기본 사용법](#rtk-query-기본-사용법)
  - [1. `createApi()`로 API 슬라이스 정의하기](#1-createapi로-api-슬라이스-정의하기)
    - [`createApi()`의 주요 기능 및 특징](#createapi의-주요-기능-및-특징)
  - [API 슬라이스가 하나만 있어야 되는 이유?](#api-슬라이스가-하나만-있어야-되는-이유)
    - [1. 일관되지 않은 캐시](#1-일관되지-않은-캐시)
    - [2. Tag 기반 캐시 무효화 작동 안 됨](#2-tag-기반-캐시-무효화-작동-안-됨)
    - [3. 미들웨어 중복 등록 및 성능 저하](#3-미들웨어-중복-등록-및-성능-저하)
    - [4. 자동 refetch 이벤트가 API 슬라이스마다 독립적으로 동작](#4-자동-refetch-이벤트가-api-슬라이스마다-독립적으로-동작)
  - [`createApi()`의 기본 구조](#createapi의-기본-구조)
    - [그외 자주 사용되는 주요 프로퍼티](#그외-자주-사용되는-주요-프로퍼티)
  - [2. Redux store에 연결](#2-redux-store에-연결)
  - [3. 컴포넌트에서 사용하기](#3-컴포넌트에서-사용하기)
- [RTK Query의 장단점](#rtk-query의-장단점)
  - [Reference](#reference)

</br>

# `RTK Query`란?

`RTK Query(@reduxjs/toolkit/query)`는 `Redux Toolkit`에 내장된 **데이터 fetching 및 캐싱 라이브러리로 CRUD 요청, 로딩 상태 및 에러 관리, 캐싱, re-fetch, polling 등 서버에서 가져온 데이터 관리를 자동화해주는 도구다**(데이터 페칭 및 캐싱 로직은 Redux Toolkit `createSlice` 및 `createAsyncThunk` API를 기반으로 구축되었다).

`Redux Toolkit` v1.6부터 공식적으로 포함된 기능으로 `Redux Toolkit` 코어 패키지에 포함되어 있으며 리액트가 아닌 환경에서도 사용할 수 있다. 또한 공식 홈페이지에선 `RTK`를 사용한 애플리케이션이라면 서버 데이터 관리를 위해 사용할 것을 권장하고 있다(v2.10.1 기준).

`RTK Query`의 주요 특징은 다음과 같다.

<!-- -->
<!--
- 데이터 페칭 및 캐싱 간소화: 데이터 로딩 및 캐싱 로직을 직접 작성하는 대신, API 엔드포인트를 정의하기만 하면 됩니다. RTK Query는 createApi 함수를 사용하여 API 슬라이스를 생성하고, 자동으로 React 훅을 만들어 데이터 요청 및 처리를 캡슐화합니다.
- 자동 데이터 동기화: 컴포넌트가 마운트될 때 자동으로 데이터를 가져오고, 파라미터가 변경되면 데이터를 다시 가져옵니다. 이를 통해 항상 최신 데이터를 사용자에게 제공할 수 있습니다.
- 서버 상태 관리: React-Query와 유사하게 서버 상태 관리를 수행합니다. data, isFetching과 같은 응답 값을 제공하여 로딩 상태를 쉽게 확인할 수 있습니다.
- Redux Toolkit 기본 제공: Redux Toolkit의 일부이므로, 별도의 설치 없이 createApi와 fetchBaseQuery를 가져와 바로 사용할 수 있습니다.
- 효율적인 코드 작성: 기존의 Redux에 비해 훨씬 적은 코드로 상태 관리가 가능합니다. -->

| 기능                     | 설명                                                                   |
| ------------------------ | ---------------------------------------------------------------------- |
| **자동 캐싱 (Caching)**  | 동일한 요청은 한 번만 fetch 후 캐시에 저장. 필요 시 캐시에서 즉시 반환 |
| **자동 re-fetching**     | 데이터가 오래되었거나 invalidated 되었을 때 자동으로 다시 요청         |
| **로딩/에러 상태 관리**  | `isLoading`, `isSuccess`, `isError` 같은 상태를 자동 제공              |
| **Optimistic Updates**   | 낙관적 업데이트를 쉽게 구현 가능                                       |
| **엔드포인트 단위 관리** | API 요청을 “엔드포인트” 단위로 구조화                                  |
| **Redux DevTools 통합**  | 상태 추적 및 디버깅 용이                                               |

</br>

## 서버 상태의 특징?

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

<!-- 구조적 공유? -->

</br>

<!-- # RTK Query의 특징 -->

## RTK Query APIs

<!--  -->

- **`createApi()`**

  **`RTK query` 기능의 핵심.**
  API slice 정의 (엔드포인트, baseUrl, 캐시 정책 등 설정)

- **`fetchBaseQuery()`**

  `fetch` API를 래핑한 기본 쿼리 함수. `fetch`와 유사한 방식으로 요청 헤더와 응답 파싱을 자동으로 처리 (axios로 대체 가능)

- `<ApiProvider />`
- `setupListeners()`

</br>

# RTK Query 기본 사용법

## 1. `createApi()`로 API 슬라이스 정의하기

`createApi()`는 `RTK Query`의 핵심 기능으로 **API 슬라이스**를 생성하는 함수다.

`RTK Query`의 API 슬라이스란 웹 애플리케이션에서 **서버와의 데이터 통신(API 호출, 캐싱, 데이터 관리)에 필요한 모든 Redux 로직을 하나로 묶어 놓은 단위**를 의미하며 서버 통신과 관련된 모든 복잡한 로직을 캡슐화하고 자동화해주는 **API 전용 슬라이스**라고 할 수 있다. 이를 통해 개발자는 데이터 페칭에 드는 상용구 코드를 최소화하고 비즈니스 로직에 집중할 수 있다.

`createApi()`는 아래와 같이 두 가지 방식으로 `import` 해줄 수 있다.

```
// UI 독립적인 진입점
import { createApi } from '@reduxjs/toolkit/query'

// 정의된 엔드포인트에 따른 hook을 자동 생성하는 React 전용 진입점
import { createApi } from '@reduxjs/toolkit/query/react'
```

### `createApi()`의 주요 기능 및 특징

<!-- Redux Toolkit 데이터 페칭 및 캐싱 로직은  createSlice 및 createAsyncThunkAPI를 기반으로 구축되었습니다.
 -->

`createApi()`로 생성된 API 슬라이스를 중심으로 모든 `RTK Query` 로직이 설정된다. 즉, 엔드포인트 정의, `redux` 로직, 캐싱 정책, 훅 자동 생성까지 전부 여기서 이루어진다.

다음은 `createApi`의 주요 기능과 API 슬라이스의 역할을 요약한 표다.

| 구분                              | 기능                                        | 설명                                                           |
| --------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| **1️⃣ API Slice 생성**             | API 상태 전용 slice 생성                    | 서버 상태 관리 전용 slice를 자동으로 생성해 Redux store에 통합 |
| **2️⃣ 자동 캐싱 (Caching)**        | 동일 요청 결과를 저장                       | 동일한 `query` 호출 시 네트워크 요청 없이 캐시 데이터 사용     |
| **3️⃣ 캐시 무효화 (Invalidation)** | 데이터 변경 시 자동 refetch                 | `providesTags` / `invalidatesTags`로 관련 데이터 자동 갱신     |
| **4️⃣ 자동 상태 관리**             | 로딩 / 성공 / 실패 상태 자동 제공           | `isLoading`, `isFetching`, `isError`, `isSuccess` 등 상태 제공 |
| **5️⃣ React Hook 자동 생성**       | 쿼리/뮤테이션용 훅 자동 생성                | `useGetPostsQuery`, `useAddPostMutation` 등 생성               |
| **6️⃣ 자동 리패칭 (Re-fetching)**  | focus / reconnect 시 자동 refetch           | 브라우저 포커스나 네트워크 복구 시 데이터 자동 최신화          |
| **7️⃣ 데이터 유지시간 관리**       | 캐시 TTL(Time To Live) 설정                 | `keepUnusedDataFor`로 캐시 유지 시간 지정                      |
| **8️⃣ 미들웨어 자동 추가**         | Redux middleware 자동 통합                  | 캐싱, refetch, invalidation을 위한 미들웨어 자동 등록          |
| **9️⃣ 쿼리/뮤테이션 분리**         | Query(GET) / Mutation(POST·PUT·DELETE) 구분 | 데이터 읽기와 쓰기를 명확히 분리하여 관리                      |
| **🔟 확장성**                     | axios 등 커스텀 baseQuery 지원              | 기본 `fetchBaseQuery` 외에 axios 등 자유롭게 사용 가능         |

## API 슬라이스가 하나만 있어야 되는 이유?

`RTK Query`를 사용하면 캐시된 데이터를 관리하는 로직이 단일 "API 슬라이스"로 중앙 집중화 되며 **일반적으로 애플리케이션이 통신해야 하는 베이스 URL(Base URL) 당 하나의 API 슬라이스만 있어야 하는데** 그 이유는 **캐시 일관성 및 데이터 동기화 기능 때문이다.**

만약 한 URL에 여러 API 슬라이스를 사용하게 되면 발생하는 문제는 다음과 같다.

```
// 모두 /api 같은 URL인데 slice를 따로 만든 상황
authApi = createApi({ baseUrl: "/api" })
userApi = createApi({ baseUrl: "/api" })
postApi = createApi({ baseUrl: "/api" })
```

<!-- *** -->

### 1. 일관되지 않은 캐시

캐시가 슬라이스 별로 분리되어 중복 저장되거나

- RTK Query는 기본적으로 **엔드포인트(endpoint)**와 **쿼리 매개변수(query parameters)**를 조합하여 고유한 캐시 키를 생성합니다.

- 만약 여러 API 슬라이스가 동일한 URL(또는 엔드포인트 경로)을 관리하게 되면, 데이터가 중복 저장되거나, 서로 다른 슬라이스가 동일한 캐시 키를 덮어쓰거나 무효화(invalidate)하는 충돌이 발생할 수 있습니다.

- 하나의 URL (자원) 당 하나의 슬라이스 원칙은 이 자원의 상태를 관리하는 **단일 진실 공급원(Single Source of Truth)**을 보장하여, 캐시 무효화 및 데이터 업데이트가 예측 가능하게 이루어지도록 합니다.

### 2. Tag 기반 캐시 무효화 작동 안 됨

우선 자동 태그 무효화(캐싱 및 무효화)는 단일 API 슬라이스 내에서만 작동하는데 API 슬라이스가 여러 개인 경우 자동 무효화는 여러 슬라이스에서 작동하지 않는다.

RTK Query의 강력한 기능 중 하나는 **providesTags**와 **invalidatesTags**를 사용하여 데이터 변경 시 관련 쿼리들을 자동으로 다시 불러오게(refetch) 하는 것입니다.

특정 URL/자원에 대한 API 슬라이스가 하나일 때, 이 슬라이스가 제공하는 태그는 해당 자원에 대한 모든 쿼리를 명확하게 나타냅니다.

만약 두 개의 슬라이스가 같은 자원을 관리한다면, 한 슬라이스에서 발생한 뮤테이션(mutation)이 다른 슬라이스의 캐시를 무효화해야 할지 결정하기가 복잡해지며, 태그 시스템의 의도된 자동화 이점이 상실될 수 있습니다.

### 3. 미들웨어 중복 등록 및 성능 저하

또한 모든 `createApi` 호출은 자체 미들웨어를 생성하며, 저장소에 추가된 각 미들웨어는 전달된 모든 작업에 대해 검사를 실행하기 때문에 성능 비용이 누적된다. 즉, `createApi`를 10번 호출하고 저장소에 10개의 개별 API 미들웨어를 추가하면 성능이 눈에 띄게 저하되게 된다.

### 4. 자동 refetch 이벤트가 API 슬라이스마다 독립적으로 동작

유지 관리를 위해 엔드포인트 정의를 여러 파일로 분할하여도(코드 분할) API 슬라이스의 `api.injectEndpoints()` 함수를 통해 모든 엔드포인트를 포함하는 단일 API 슬라이스를 유지하는 것이 가능하다. 만약 앱이 여러 서버에서 데이터를 가져오는 경우 각 엔드포인트에 전체 URL을 지정하거나, 필요한 경우 각 서버에 대해 별도의 API 슬라이스를 만들 수 있다.

## `createApi()`의 기본 구조

```
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  // 1. 🔑 reducerPath (필수): 스토어의 키
  reducerPath: 'api',

  // 2. 🔑 baseQuery (필수): 모든 요청의 기본 설정
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),

  // 캐시 태그 정의 (선택 사항)
  tagTypes: ['Posts', 'Users'],

  // 3. 🔑 endpoints (필수): API가 제공하는 작업 정의
  endpoints: (builder) => ({
    // Query (GET 요청) 자동 캐싱 / 자동 re-fetch
    getPosts: builder.query({
      query: () => '/posts',
    }),
    // Mutation (POST/PUT/DELETE)
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
  useAddPostMutation,
} = api
```

`createApi()`를 호출할 때 인수로 객체를 전달해줘야 하는데, 이때 필수로 포함시켜줘야 하는 프로퍼티가 있다.

1. **`reducerPath`**

   리덕스 `store`에 저장될 고유 키(API 슬라이스 이름). 지정하지 않는 경우 'api'로 설정된다(`state.api`).

<!--  -->

2. **`baseQuery`**

   모든 요청의 기본 값을 설정하는 함수. 기본적으로 `RTK Query`에 포함되어 있으면서 `fetch()`를 래핑한 경량화된 헬퍼 함수 `fetchBaseQuery`를 사용하거나 `Axios`로 사용자 정의 로직을 사용해줄 수도 있다.

```
// Axios 사용한 커스텀 baseQuery
import axios from 'axios'

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({ url: baseUrl + url, method, data, params })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError
      return { error: { status: err.response?.status, data: err.response?.data } }
    }
  }

export const api = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({}),
})
```

3. **`endpoints`**

   API 요청(쿼리, 뮤테이션) 로직을 정의하는 함수. `builder`를 인자로 받아 각 endpoint를 정의할 수 있고 각 엔드포인트는 query(조회용), infiniteQuery 또는 mutation(변경용)으로 구분 된다. 또한 `RTK Query`에서 제공되는 리액트용 `createApi`를 사용한 경우 정의한 엔드포인트에 대한 리액트 훅이 자동으로 생성된다.

   | 함수                   | 용도                                                     |
   | ---------------------- | -------------------------------------------------------- |
   | **builder.query()**    | GET 등 조회 요청                                         |
   | **builder.mutation()** | POST/PUT/DELETE 등 변경 요청                             |
   | **providesTags**       | 이 요청이 어떤 데이터 태그를 제공하는지 선언 → 캐시 사용 |
   | **invalidatesTags**    | 이 요청이 성공 시 어떤 태그 캐시를 무효화할지 선언       |

```
endpoints: (builder) => ({
  getUser: builder.query({
    query: () => '/user',
    providesTags: ['User']
  }),
  updateUser: builder.mutation({
    query: (body) => ({
      url: '/user',
      method: 'PUT',
      body,
    }),
    invalidatesTags: ['User']
  })
})
// 훅 자동 생성
-> { useGetUserQuery,
     useUpdateUserMutation }
```

### 그외 자주 사용되는 주요 프로퍼티

| 프로퍼티                   | 역할 / 특징                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- |
| **tagTypes**               | 캐싱/자동 refetch에 사용되는 태그 종류를 선언                                     |
| **keepUnusedDataFor**      | 사용되지 않는 캐시 데이터를 유지할 시간 설정 (기본 60초)                          |
| **refetchOnFocus**         | 브라우저 창이 다시 focus되면 데이터를 자동 업데이트                               |
| **refetchOnReconnect**     | 인터넷 연결이 돌아왔을 때 자동 refetch                                            |
| **extractRehydrationInfo** | SSR(Hydration)에서 캐시 데이터를 복구할 때 사용                                   |
| **serializeQueryArgs**     | query key 생성 방식 커스터마이징                                                  |
| **endpoints** 내부 설정    | 요청 및 캐싱 로직 핵심(`query`, `mutation`, `providesTags`, `invalidatesTags` 등) |

<!-- 이 코드 한 줄로 RTK Query는 자동으로 다음을 해준다:
✅ Redux slice 생성
✅ API 요청에 맞는 action, reducer, middleware 생성
✅ React hook 자동 생성 (useGetPostsQuery, useAddPostMutation) -->

## 2. Redux store에 연결

<!--  -->

내부적으로 `createApi`는 `Redux Toolkit`의 createSlice API를 호출하여 가져온 데이터를 캐싱하는 로직을 갖춘 슬라이스 리듀서와 해당 액션 생성자를 생성한다. 또한 구독 횟수와 캐시 수명을 관리하는 커스텀 Redux 미들웨어도 자동으로 생성한다.

생성된 슬라이스 리듀서와 미들웨어는 모두 configureStore에서 Redux 스토어 설정에 추가되어야 제대로 작동한다.

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

</br>

<!-- # 기존 비동기 로직(`createAsyncThunk` + `createSlice`) RTK Query로 마이그레이션 예시 -->

<!--  -->

# RTK Query의 장단점

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

## Reference

**[RTK Query 개요]**

https://redux-toolkit.js.org/rtk-query/overview
