<h2>목차</h2>

- [API 슬라이스가 URL 당 하나만 있어야 되는 이유?](#api-슬라이스가-url-당-하나만-있어야-되는-이유)
  - [1. 일관되지 않은 캐시](#1-일관되지-않은-캐시)
  - [2. Tag 기반 캐시 무효화 작동 안 됨](#2-tag-기반-캐시-무효화-작동-안-됨)
  - [3. Redux store 복잡도 증가](#3-redux-store-복잡도-증가)
  - [4. 메모리 사용량 증가](#4-메모리-사용량-증가)
- [올바른 구조: URL 당 하나의 API 슬라이스](#올바른-구조-url-당-하나의-api-슬라이스)
  - [코드 분할(code splitting)이 필요한 경우](#코드-분할code-splitting이-필요한-경우)

<br>

# API 슬라이스가 URL 당 하나만 있어야 되는 이유?

`RTK Query`를 사용하면 캐시된 데이터를 관리하는 로직이 단일 "API 슬라이스"로 중앙 집중화 되며 **일반적으로 애플리케이션이 통신해야 하는 베이스 URL(Base URL) 당 하나의 API 슬라이스만 있어야 하는데** 그 이유는 **캐시 일관성 및 데이터 동기화 기능 때문이다.**

만약 한 URL에 여러 API 슬라이스를 사용하게 되면 발생하는 문제는 다음과 같다.

## 1. 일관되지 않은 캐시

```
// ❌ 나쁜 예: 같은 베이스 URL로 여러 API 슬라이스 생성
const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com' }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/users/${id}`,
    }),
  }),
});

const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com' }),
  endpoints: (builder) => ({
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
    }),
  }),
});
```

각 API 슬라이스는 독립적인 캐시 저장소를 갖는다. 즉, 같은 엔드포인트를 호출해도 각 슬라이스의 캐시는 서로 알지 못한다. 따라서 `https://api.example.com/users/1`을 `userApi`와 `postsApi` 양쪽에서 호출하면 중복 네트워크 요청이 발생하게 될 것.

## 2. Tag 기반 캐시 무효화 작동 안 됨

```
// userApi에서 사용자 정보 가져오기
const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
  }),
});

// postsApi에서 사용자 정보 업데이트
const postsApi = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['User'],
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['User'], // ❌ userApi의 캐시를 무효화하지 못함!
    }),
  }),
});
```

우선 자동 태그 무효화(캐싱 및 무효화)는 단일 API 슬라이스 내에서만 작동하며 API 슬라이스 간에 완전히 독립적이다.

위 예시를 보면 `postsApi`에서 `mutation`을 통해 사용자를 업데이트 해도 `userApi`의 캐시는 무효화되지 않는다. 또한 자동 refetch가 발생하지 않아 서버/클라이언트 간에 데이터 동기화가 깨지고 **stale data**(오래된 데이터) 문제가 발생하게 된다.

## 3. Redux store 복잡도 증가

```
// store 설정이 복잡해짐
const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    // ... 계속 증가
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(postsApi.middleware)
      .concat(commentsApi.middleware),
      // ... 계속 증가
});
```

생성한 API 슬라이스만큼 `store`에 리듀서, 미들웨어를 등록해줘야 하기 때문에 불필요하게 `store`가 커지고 복잡해지게 된다. 또한 자동 생성되는 훅도 분산되어 디버깅 시 추적해야 되는 리듀서가 많아지게되고 결국 유지 보수가 매우 어려워진다.

## 4. 메모리 사용량 증가

<!-- subscription..? -->

각 API 슬라이스는 독립적인 캐시 저장소, 구독(subscription) 관리, query 상태 관리를 수행하기 때문에 데이터가 불필요하게 여러 슬라이스에 중복 혹은 나누어 저장되게 된다.

또한 모든 `createApi` 호출은 자체 미들웨어를 생성하고, 저장소에 추가된 각 미들웨어는 전달된 모든 작업에 대해 검사를 실행하기 때문에 성능 비용이 누적된다. 즉, `createApi`를 10번 호출하고 저장소에 10개의 개별 API 미들웨어를 추가하면 여러 작업들이 불필요하게 중복되어 처리되기 때문에(로그 중복 등) 성능이 눈에 띄게 저하되게 된다.

# 올바른 구조: URL 당 하나의 API 슬라이스

하나의 base URL(동일한 API 서버) 이라면 다음과 같이 `endpoints`에서 나우는 것이 바람직하다.

```
// ✅ 하나의 API 슬라이스에 모든 엔드포인트
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com' }),
  tagTypes: ['User', 'Post', 'Comment'],
  endpoints: (builder) => ({
    // User 관련 엔드포인트
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // Post 관련 엔드포인트
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Post', id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    createPost: builder.mutation({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    // Comment 관련 엔드포인트
    getComments: builder.query({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: (result, error, postId) => [
        { type: 'Comment', id: postId }
      ],
    }),
  }),
});
```

## 코드 분할(code splitting)이 필요한 경우

유지 관리를 위해 엔드포인트 정의를 여러 파일로 분할하여도(코드 분할) API 슬라이스의 `api.injectEndpoints()` 함수를 통해 단일 API 슬라이스를 유지하는 것이 가능하다.

만약 앱이 여러 서버에서 데이터를 가져오는 경우 각 엔드포인트에 전체 URL을 지정하거나, 필요한 경우 각 서버에 대해(다른 베이스 URL) 별도의 API 슬라이스를 만들 수 있다.

<!-- injectEndpoints 추가 속성 -> overrideExisting, enhanceEndpoints -->

```
// api/baseApi.js - 기본 API 설정
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com' }),
  tagTypes: ['User', 'Post', 'Comment'],
  endpoints: () => ({}), // 빈 엔드포인트로 시작
});

// api/userApi.js - 엔드포인트 주입
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
  }),
});

// api/postApi.js - 엔드포인트 주입
export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
  }),
});
```

<br>

**[RTK Query - Code splitting]**

https://redux-toolkit.js.org/rtk-query/usage/code-splitting
