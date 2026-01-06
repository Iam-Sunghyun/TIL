<h2>목차</h2>

- [`RTK Query` 기본 쿼리 커스터마이징하기](#rtk-query-기본-쿼리-커스터마이징하기)
- [`baseQuery` 커스터마이징](#basequery-커스터마이징)
  - [`baseQuery` 커스텀 함수 시그니처](#basequery-커스텀-함수-시그니처)
  - [1. 커스텀 `baseQuery` 함수 사용하기](#1-커스텀-basequery-함수-사용하기)
  - [2. `fetchBaseQuery` 래핑한 함수 사용하기](#2-fetchbasequery-래핑한-함수-사용하기)
- [추가 커스텀 속성이 필요할 땐?](#추가-커스텀-속성이-필요할-땐)

<br>

# `RTK Query` 기본 쿼리 커스터마이징하기

다음과 같은 2가지 방법 존재.

1. `baseQuery` 사용자 정의 함수 할당
   1. **새롭게 `baseQuery`를 정의하여 사용**
   2. **`fetchBaseQuery`를 래핑(wrapper)한 함수 작성**
2. `endpoints` 내부 `queryFn` 정의

# `baseQuery` 커스터마이징

기본 `fetchBaseQuery`가 충분치 않다고 느껴질 때, 다음과 같은 방법으로 로직을 보완해줄 수 있다.

- `baseQuery` 커스터마이징 방식

1. **새롭게 `baseQuery`를 정의하여 사용**
2. **`fetchBaseQuery`를 래핑(wrapper)한 함수 작성**

- `queryFn` 커스터마이징 방식

## `baseQuery` 커스텀 함수 시그니처

`baseQuery`에 커스텀 함수를 정의하는 경우 다음과 같은 타입을 갖는다. 참고로 `api`와 `extraOptions`는 커스텀 `baseQuery`를 직접 구현할 때만 접근할 수 있는 인자들이다.

또한 정해진 `query` 반환 값만 허용됐던 `fetchBaseQuery`와 달리 첫 번째 인수로 모든 값이 가능하다. 하지만 `RTK Query`는 이 `args`를 기반으로 캐시 키를 만들기 때문에 **직렬화 가능한 구조의 값만 가능하다(함수, 클래스 객체, 순환 참조 객체 불가능).**

<!-- 일반 객체와 달리 함수, 클래스, 순환 참조 객체는 왜 JSON 직렬화 안됐지? -->

<!--  -->

```
export type BaseQueryFn<
  Args = any,
  Result = unknown,
  Error = unknown,
  DefinitionExtraOptions = {},
  Meta = {},
> = (
  args: Args,   // fetchBaseQuery와 달리 아무 값이나 가능
  api: BaseQueryApi,
  extraOptions: DefinitionExtraOptions,
) => MaybePromise<QueryReturnValue<Result, Error, Meta>>

export interface BaseQueryApi {
  signal: AbortSignal
  abort: (reason?: string) => void
  dispatch: ThunkDispatch<any, any, any>
  getState: () => unknown
  extra: unknown
  endpoint: string
  type: 'query' | 'mutation'
  forced?: boolean
  queryCacheKey: string         // 캐시 키
}

export type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
  | {
      error: E
      data?: undefined
      meta?: M
    }
  | {
      error?: undefined
      data: T
      meta?: M
    }
```

<!--  -->

| 인자             | 설명                                                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **args**         | `endpoints`의 `query()`가 반환한 값 그대로                                                                                                                                                                  |
| **api**          | `RTK Query` 내부 도구(아래는 속성 일부)<br>• `signal`: 요청 취소용 `AbortSignal`<br>• `dispatch`: Redux 액션 디스패치 가능<br>• `getState`: Redux store 접근<br>• `extra`: middleware extraArgument 등 <br> |
| **extraOptions** | `endpoints`에서 지정한 `extraOptions`가 있으면 이게 전달됨                                                                                                                                                  |

<br>

## 1. 커스텀 `baseQuery` 함수 사용하기

<!--  -->

```
// ✅ 커스텀 baseQuery에서는 직접 접근 가능
const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  // api 객체 사용 가능!
  const state = api.getState()
  const dispatch = api.dispatch
  const signal = api.signal

  // extraOptions 사용 가능!
  console.log(extraOptions)

  try {
    const result = await fetch(/* ... */)
    return { data: result }
  } catch (error) {
    return { error }
  }
}
```

여기서 `getState`를 통해 현재 `Redux` 상태를 읽고, `dispatch`로 액션을 디스패치할 수 있다.

반드시 에러를 throw 하지 말고, 아래와 같이 성공 시엔 `{ data: … }`, 실패 시엔 `{ error: … }` 형태의 객체를 반환해야 한다(또는 이 객체를 감싼 `Promise`를 반환해야 한다).

```
// 성공 시 반환
return { data: YourData }

// 실패 시 반환
return { error: YourError }
```

이 형식을 지켜야만 `RTK Query`가 올바르게 타입을 추론하고 요청 상태를 관리할 수 있다. 만약 에러를 throw 하거나 반환 형식을 어기면, 내부 캐시/상태 관리가 올바르게 동작하지 않을 수 있다.

<!-- ## 예: `axios` 기반 커스텀 `baseQuery`



```
const axiosBaseQuery = ({ baseUrl }) => async ({ url, method, data, params, headers }) => {
  try {
    const result = await axios({ url: baseUrl + url, method, data, params, headers });
    return { data: result.data };
  } catch (err) {
    return { error: { status: err.response?.status, data: err.response?.data || err.message } };
  }
}
```

```
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
``` -->

## 2. `fetchBaseQuery` 래핑한 함수 사용하기

아래는 `fetchBaseQuery` 함수 시그니처

```
type FetchBaseQuery = (
  args: FetchBaseQueryArgs,
) => (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: ExtraOptions,
) => FetchBaseQueryResult

type FetchBaseQueryArgs = {
  baseUrl?: string
  prepareHeaders?: (
    headers: Headers,
    api: Pick<
      BaseQueryApi,
      'getState' | 'extra' | 'endpoint' | 'type' | 'forced'
    > & { arg: string | FetchArgs },
  ) => MaybePromise<Headers | void>
  fetchFn?: (
    input: RequestInfo,
    init?: RequestInit | undefined,
  ) => Promise<Response>
  paramsSerializer?: (params: Record<string, any>) => string
  isJsonContentType?: (headers: Headers) => boolean
  jsonContentType?: string
  timeout?: number
} & RequestInit   ----> fetch API의 RequestInit 상속

// 반환 값
type FetchBaseQueryResult = Promise<
  | {
      data: any
      error?: undefined
      meta?: { request: Request; response: Response }
    }
  | {
      error: FetchBaseQueryError // 공식 문서 참조
      data?: undefined
      meta?: { request: Request; response: Response }
    }
>
```

```
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

// fetchBaseQuery를 래핑하여 api, extraOptions 활용
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.example.com'
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // ✅ 여기서 api 활용 가능!
  console.log('현재 엔드포인트:', api.endpoint)
  console.log('요청 타입:', api.type)

  // ✅ extraOptions 활용 가능!
  console.log('추가 옵션:', extraOptions)

  let result = await baseQuery(args, api, extraOptions)

  // ✅ api.dispatch로 액션 디스패치 가능
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      '/auth/refresh',
      api,
      extraOptions
    )

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  // ✅ api.signal로 요청 취소 감지
  if (api.signal.aborted) {
    console.log('요청이 취소되었습니다')
  }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithReauth,  // 래핑한 버전 사용
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      // extraOptions를 전달할 수 있음
      extraOptions: { maxRetries: 3 }
    })
  })
})
```

# 추가 커스텀 속성이 필요할 땐?

방법 1: extraOptions 사용
방법 2: 커스텀 FetchArgs 타입 확장 -> ?
방법 3: 메타데이터로 관리 transformResponse
