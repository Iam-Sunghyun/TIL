<h2>목차</h2>

- [`RTK Query`란?](#rtk-query란)
  - [왜 `RTK Query`인가?](#왜-rtk-query인가)
    - [단점](#단점)
  - [서버 상태의 특징](#서버-상태의-특징)
  - [`RTK Query` APIs](#rtk-query-apis)
    - [**`createApi()`**](#createapi)
    - [**`fetchBaseQuery()`**](#fetchbasequery)
    - [`<ApiProvider />`](#apiprovider-)
    - [`setupListeners()`](#setuplisteners)
- [RTK Query 기본 사용법](#rtk-query-기본-사용법)
  - [1. `createApi()`로 API 슬라이스 정의하기](#1-createapi로-api-슬라이스-정의하기)
  - [`createApi()`의 기본 구조](#createapi의-기본-구조)
    - [그외 자주 사용되는 `createApi` 주요 프로퍼티](#그외-자주-사용되는-createapi-주요-프로퍼티)
  - [2. Redux store에 연결](#2-redux-store에-연결)
  - [3. 컴포넌트에서 사용하기](#3-컴포넌트에서-사용하기)
  - [Reference](#reference)

</br>

# `RTK Query`란?

`RTK Query(@reduxjs/toolkit/query)`는 `Redux Toolkit`에 내장된 **데이터 fetching 및 캐싱 라이브러리로 CRUD 요청, 로딩 상태 및 에러 관리, 캐싱, re-fetch, polling 등 서버에서 가져온 데이터 관리를 자동화해주는 도구다**(데이터 페칭 및 캐싱 로직은 `Redux Toolkit` `createSlice` 및 `createAsyncThunk` API를 기반으로 구축되었다).

`Redux Toolkit` v1.6부터 공식적으로 포함된 기능으로 `Redux Toolkit` 코어 패키지에 포함되어 있으며 **리액트가 아닌 환경에서도 사용할 수 있다.** 또한 공식 홈페이지에선 `RTK`를 사용한 애플리케이션이라면 서버 데이터 관리를 위해 사용할 것을 권장하고 있다(v2.10.1 기준).

## 왜 `RTK Query`인가?

`RTK Query`의 주요 특징은 다음과 같다.

| 기능                                 | 설명                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **자동 데이터 페칭 및 캐싱**         | API 엔드포인트 정의만으로 데이터 로딩/캐싱 로직 자동 처리. 동일 요청은 캐시에서 즉시 반환                                                                                 |
| **자동 React 훅 생성**               | `createApi`로 엔드포인트 정의 시 `useQuery`, `useMutation` 훅 자동 생성                                                                                                   |
| **자동 데이터 동기화**               | 컴포넌트 마운트/파라미터 변경, 웹 페이지 포커스 복귀, 네트워크 재연결 시 자동 re-fetching. 오래된 데이터 자동 무효화(`keepUnusedDataFor`로 캐시 유지 시간 지정) 및 재요청 |
| **캐시 무효화 (Cache Invalidation)** | 태그 기반 캐시 무효화로 mutation 후 관련 쿼리 자동 재요청                                                                                                                 |
| **서버 상태 관리**                   | `data`, `isLoading`, `isFetching`, `isSuccess`, `isError` 등 다양한 상태 자동 제공                                                                                        |
| **Redux Toolkit 통합**               | RTK에 기본 포함되어 별도 설치 불필요. `createApi`, `fetchBaseQuery` 즉시 사용 가능                                                                                        |
| **확장성**                           | `baseQuery` 커스터마이징으로 인증 토큰 갱신, 공통 헤더, 에러 핸들링, 재시도 로직 중앙화                                                                                   |
| **Optimistic Updates**               | 서버 응답 전 UI 즉시 업데이트하는 낙관적 업데이트 쉽게 구현                                                                                                               |
| **폴링 (Polling)**                   | 설정만으로 일정 간격마다 자동 데이터 갱신 가능 (`pollingInterval` 옵션)                                                                                                   |
| **코드 효율성**                      | 기존 Redux 대비 훨씬 적은 보일러플레이트 코드, 클라이언트와 서버 상태 관리의 분리로 효율성, 가독성 개선                                                                   |
| **엔드포인트 단위 구조화**           | API 요청을 명확한 엔드포인트 단위로 조직화하여 유지보수 용이                                                                                                              |
| **Redux DevTools 지원**              | 모든 요청/응답/캐시 상태를 Redux DevTools로 추적 및 디버깅 가능                                                                                                           |
| **TypeScript 완벽 지원**             | 자동 타입 추론으로 타입 안정성 확보 및 개발 경험 향상                                                                                                                     |
| **요청 중복 제거**                   | 동시에 발생하는 동일 요청을 자동으로 병합하여 불필요한 네트워크 요청 방지                                                                                                 |

### 단점

| 항목                     | 설명                                                           |
| ------------------------ | -------------------------------------------------------------- |
| 복잡한 커스터마이징 한계 | React Query보다 세밀한 캐시 제어나 리트라이 로직 구성은 제한적 |
| Redux 미사용 시 과함     | 단독 프로젝트에서는 React Query가 더 간단할 수 있음            |

<br>

## 서버 상태의 특징

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

## `RTK Query` APIs

### **`createApi()`**

**`RTK query` 기능의 핵심.**
API slice 정의 (엔드포인트, baseUrl, 캐시 정책 등 설정)

### **`fetchBaseQuery()`**

`fetch` API를 래핑한 기본 쿼리 함수. `fetch`와 유사한 방식으로 요청 헤더와 응답 파싱을 자동으로 처리 (`axios`로 대체 가능)

### `<ApiProvider />`

리덕스 `store`가 없는 경우 API 슬라이스 제공 용으로 사용할 수 있다. 다만 `store`와 함께 사용 시 충돌이 발생한다.

### `setupListeners()`

API 슬라이스 정의 시 `refetchOnFocus`, `refetchOnReconnect` 옵션을 활성화 하기 위해 사용한다. `setupListeners(store.dispatch)`과 같은 형태로 리덕스 `store`의 `dispatch` 메서드를 전달해줘야 한다.

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

## `createApi()`의 기본 구조

`createApi()`로 생성된 API 슬라이스를 중심으로 모든 `RTK Query` 로직이 설정된다. 즉, 엔드포인트 정의, `redux` 로직, 캐싱 정책, 훅 자동 생성까지 전부 여기서 이루어진다.

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
      providesTags: ['Posts],
    }),
    // Mutation (POST/PUT/DELETE)
    addPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Posts'],
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

2. **`baseQuery`** (필수)

   모든 요청의 기본 값을 설정하는 함수. 기본적으로 `RTK Query`에 포함되어 있으면서 `fetch()`를 래핑한 경량화된 헬퍼 함수 `fetchBaseQuery`를 사용하거나 사용자 정의 함수를 사용하는 방법도 있다.

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

3. **`endpoints`** (필수)

   API 요청(쿼리, 뮤테이션) 로직을 정의하는 함수. `builder`를 인자로 받아 엔드포인트를 정의할 수 있고 각 엔드포인트는 query(조회용), infiniteQuery 또는 mutation(변경용)으로 구분 된다.

   만약 `@reduxjs/toolkit/query/react`의 `createApi`를 사용한 경우 정의한 엔드포인트에 대한 리액트 훅이 자동으로 생성된다. 아래는 `endpoints`에 자주 사용되는 프로퍼티이다.

   | 함수                   | 용도                                                   |
   | ---------------------- | ------------------------------------------------------ |
   | **builder.query()**    | GET 등 조회 요청                                       |
   | **builder.mutation()** | POST/PUT/DELETE 등 변경 요청                           |
   | **providesTags**       | query 요청에 붙는 캐시 태그 선언                       |
   | **invalidatesTags**    | mutation 요청 성공 시 어떤 캐시 태그를 무효화할지 선언 |

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

   추가 옵션은 (https://redux-toolkit.js.org/rtk-query/api/createApi#endpoint-definition-parameters) 참고

### 그외 자주 사용되는 `createApi` 주요 프로퍼티

| 프로퍼티                   | 역할 / 특징                                              |
| -------------------------- | -------------------------------------------------------- |
| **tagTypes**               | 캐싱/자동 refetch에 사용되는 태그 명 선언                |
| **keepUnusedDataFor**      | 사용되지 않는 캐시 데이터를 유지할 시간 설정 (기본 60초) |
| **refetchOnFocus**         | 브라우저 창이 다시 focus되면 데이터를 자동 업데이트      |
| **refetchOnReconnect**     | 인터넷 연결이 돌아왔을 때 자동 refetch                   |
| **extractRehydrationInfo** | SSR(Hydration)에서 캐시 데이터를 복구할 때 사용          |
| **serializeQueryArgs**     | query key 생성 방식 커스터마이징                         |

## 2. Redux store에 연결

<!--  미들웨어에 대하여 -->

내부적으로 `createApi`는 `Redux Toolkit`의 `createSlice` API를 호출하여 가져온 데이터를 캐싱하는 로직을 갖춘 슬라이스 리듀서와 해당 액션 생성자를 생성한다. 또한 구독 횟수와 캐시 수명을 관리하는 커스텀 Redux 미들웨어도 자동으로 생성한다.

생성된 API 슬라이스 리듀서와 미들웨어는 모두 `configureStore`에 추가되어야 제대로 작동한다.

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

다음은 데이터를 가져오는 쿼리 훅(`useQuery`) 사용 예시이다.

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

## Reference

**[RTK Query 개요]**

https://redux-toolkit.js.org/rtk-query/overview
