<h2>목차</h2>

- [`createApi`의 `baseQuery`란?](#createapi의-basequery란)
- [자주 사용되는 `baseQuery` 구현: `fetchBaseQuery`](#자주-사용되는-basequery-구현-fetchbasequery)
  - [`fetchBaseQuery` 함수 시그니처](#fetchbasequery-함수-시그니처)
  - [`fetchBaseQuery`를 사용하는 이유?](#fetchbasequery를-사용하는-이유)
  - [일반 `fetch API`와 `fetchBaseQuery` 비교 예제](#일반-fetch-api와-fetchbasequery-비교-예제)
- [`fetchBaseQuery` 호출 옵션](#fetchbasequery-호출-옵션)
  - [`FetchBaseQueryArgs` : 전역 설정 객체](#fetchbasequeryargs--전역-설정-객체)
    - [`prepareHeaders` 속성의 `api` 객체](#prepareheaders-속성의-api-객체)
  - [`FetchArgs` : 엔드포인트 개별 요청 설정 객체](#fetchargs--엔드포인트-개별-요청-설정-객체)
    - [`responseHandler` 옵션 상세](#responsehandler-옵션-상세)
- [`FetchBaseQueryArgs` vs `FetchArgs` 비교](#fetchbasequeryargs-vs-fetchargs-비교)
  - [`FetchBaseQueryArgs` 활용 예제](#fetchbasequeryargs-활용-예제)
  - [`FetchArgs` 활용 예제](#fetchargs-활용-예제)
  - [속성 적용 우선순위](#속성-적용-우선순위)
    - [예시](#예시)
  - [주의사항](#주의사항)
    - [1. body 자동 직렬화](#1-body-자동-직렬화)
    - [2. params 처리](#2-params-처리)
    - [3. timeout](#3-timeout)
    - [4. credentials](#4-credentials)

</br>

# `createApi`의 `baseQuery`란?

`baseQuery`는 **`RTK Query`가 모든 `endpoints` 요청을 실행할 때 사용되는 “공통 요청 처리 함수”** 다. `endpoints`에 `queryFn`이 따로 정의되지 않은 경우 모든 요청은 `baseQuery`를 호출하도록 되어 있다.

즉, `endpoints`의 `query` 옵션은 단순히 '어떤 요청을 할지(예: URL, method, body, headers 등 요청 정보)'를 기술할 뿐이고 `query`의 결과를 받아 실제 HTTP 요청 또는 기타 비동기 로직을 실행하는 것은 `baseQuery`다.

<!-- 일반적으로는 HTTP 요청이지만, 구조적으로는 어떤 비동기 작업도 가능하다  -->

보통 `RTK Query`에서 제공되는 `fetchBaseQuery`(`fetch API`을 감싼 경량 유틸)를 사용하며, 일반적인 REST API 호출에는 보통 이걸 바로 사용해도 충분하지만 필요에 따라 `axios`같은 라이브러리를 사용해 커스터마이징하여 확장할 수도 있다(실무에선 커스터마이징도 자주 사용되는 듯).

</br>

# 자주 사용되는 `baseQuery` 구현: `fetchBaseQuery`

`RTK Query`는 기본 통신을 위해 `fetch API`를 활용하는 `fetchBaseQuery` 유틸리티 함수를 제공하는데 대부분의 경우 이 함수를 사용하여 `baseQuery`를 정의하는 것이 가장 간단하고 강력하다.

```
// fetchBaseQuery 사용 예시
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'myApi',
  // ⭐️ baseQuery 속성 정의
  baseQuery: fetchBaseQuery({
    // 1. 기본 URL 설정
    baseUrl: 'https://api.myapp.com/v1/',

    // 2. 요청 헤더 준비 (공통 인증 로직 구현)
    prepareHeaders: (headers, { getState }) => {
      // Redux 스토어에서 인증 토큰을 가져옵니다.
      const token = getState().auth.token;

      if (token) {
        // 모든 요청에 Authorization 헤더를 추가합니다.
        headers.set('Authorization', `Bearer ${token}`);
      }
      // 준비된 헤더 객체를 반환해야 합니다.
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 엔드포인트 정의...
  }),
});
```

## `fetchBaseQuery` 함수 시그니처

아래는 `fetchBaseQuery`의 타입이고, `FetchBaseQuery`의 `BaseQueryApi`와 `ExtraOptions`는 커스텀 `baseQuery`를 직접 구현할 때만 접근할 수 있는 인자들이다.

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

## `fetchBaseQuery`를 사용하는 이유?

다음은 일반 `fetch API`가 아닌 `fetchBaseQuery`를 사용했을 때 주요 장점들을 나열한 것이다.

<h3>1. RTK Query 에코시스템과의 통합</h3>

<!--  -->

```
// fetch는 이렇게 반환
const response = await fetch(url)
const data = await response.json()
-------------------------------------
// fetchBaseQuery는 이렇게 반환 (RTK Query 형식)
// 성공 시
{
  data: any,
  error?: undefined,
  meta?: { request, response }
}
// 실패 시
{
  data?: undefined,
  error: FetchBaseQueryError,
  meta?: { request, response }
}
```

이 형식을 지켜야만 `RTK Query`가 올바르게 타입을 추론하고 요청 상태를 관리할 수 있다. 만약 에러를 throw 하거나 반환 형식을 어기면, 내부 캐시/상태 관리가 올바르게 동작하지 않을 수 있다.

<h3>2. 자동 JSON 처리</h3>

`fetchBaseQuery`를 사용하여 요청을 생성하는 경우 자동으로 적절한 헤더 설정과 함께 body 필드도 `JSON` 직렬화된다. 응답도 자동으로 `JSON` 파싱되며 body가 없는 경우 `null`로 처리된다.

```
// 일반 fetch - 매번 수동으로 처리
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)  // 수동 직렬화
})
const result = await response.json()  // 수동 파싱

// fetchBaseQuery - 자동 처리
query: (data) => ({
  url: '/users',
  method: 'POST',
  body: data  // 자동으로 JSON.stringify() + 헤더 설정
})
```

<h3>3. 통일된 에러 처리</h3>

<!-- validateStatus? -->

일반 `fetch API`의 경우 상태 코드가 200~299가 아니어도 에러를 throw 하지 않는 반면 `fetchBaseQuery`는 응답 상태 코드가 200~299 외인 경우 `error`를 `reject` 한다.

```
// 일반 fetch - 200-299가 아니어도 에러를 throw하지 않음
const response = await fetch(url)
if (!response.ok) {  // 매번 체크 필요
  throw new Error('Request failed')
}

// fetchBaseQuery - 자동으로 에러 형식 표준화
{
  error: {
    status: 404,
    data: { message: 'Not found' }
  }
}
// 또는
{
  error: {
    status: 'FETCH_ERROR',
    error: 'Network error'
  }
}
```

<h3>4. Redux 스토어 접근</h3>

일반 `fetch API`와 다르게 `fetchBaseQuery`는 `prepareHeaders` 프로퍼티를 통해 `Redux` 스토어에 접근할 수 있다.

```
// 일반 fetch - 스토어 접근 불가능..
const token = fetch(url, {
  headers: { authorization: `Bearer ${token}` }
})

// fetchBaseQuery - prepareHeaders로 스토어 접근 가능
prepareHeaders: (headers, { getState }) => {
  const token = getState().auth.token  // Redux 스토어에서 바로 가져옴
  if (token) {
    headers.set('authorization', `Bearer ${token}`)
  }
  return headers
}
```

<h3>5. baseUrl 자동 결합</h3>

```
// 일반 fetch - 매번 전체 URL 작성
fetch('https://api.example.com/users')
fetch('https://api.example.com/posts')
fetch('https://api.example.com/comments')

// fetchBaseQuery - baseUrl 한 번만 설정
fetchBaseQuery({ baseUrl: 'https://api.example.com' })

// 엔드포인트에서는 경로만 작성
query: () => '/users'
query: () => '/posts'
query: () => '/comments'
```

<h3>6. 타임아웃 기능 간소화</h3>

```
// 일반 fetch - 타임아웃 구현 복잡
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000)

try {
  const response = await fetch(url, { signal: controller.signal })
} finally {
  clearTimeout(timeoutId)
}

// fetchBaseQuery - 간단하게 설정
fetchBaseQuery({
  baseUrl: '/api',
  timeout: 5000  // 끝!
})
```

<h3>7. 쿼리 파라미터 자동 직렬화</h3>

```
// 일반 fetch - 수동으로 URL 생성
const params = new URLSearchParams({ page: 1, limit: 10 })
fetch(`/api/users?${params}`)

// fetchBaseQuery - 객체만 전달
query: () => ({
  url: '/users',
  params: { page: 1, limit: 10 }  // 자동으로 쿼리스트링 생성
})
```

<h3>8. 커스텀 응답 검증</h3>

```
// 일반 fetch - 매번 수동 체크
const response = await fetch(url)
const data = await response.json()
if (data.isError) {
  throw new Error('API returned error')
}

// fetchBaseQuery endpoints 쿼리
query: () => ({
  url: '/users',
  validateStatus: (response, result) =>
    response.status === 200 && !result.isError
})
```

## 일반 `fetch API`와 `fetchBaseQuery` 비교 예제

```
// ❌ 일반 fetch로 RTK Query 사용하려면
const customBaseQuery = async (args, api, extraOptions) => {
  const state = api.getState()
  const token = state.auth.token

  const url = typeof args === 'string' ? args : args.url
  const method = typeof args === 'string' ? 'GET' : args.method
  const body = typeof args === 'string' ? undefined : args.body

  try {
    const response = await fetch(`https://api.example.com${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { authorization: `Bearer ${token}` })
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          data: await response.json()
        }
      }
    }

    const data = await response.json()
    return { data }

  } catch (error) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error.message
      }
    }
  }
}
------------------------------------------------
// ✅ fetchBaseQuery 사용하면
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.example.com',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})
// 끝! 위의 모든 로직이 내장되어 있음
```

결국 `fetchBaseQuery`는 `fetch API`로부터 다음과 같은 이점을 부여한 래퍼 객체인 셈이다.

- `RTK Query` 생태계에 맞는 표준화된 인터페이스 제공
- 반복적인 보일러플레이트 코드 제거
- `Redux` 스토어와의 자연스러운 통합
- 일관된 에러 처리 및 타입 안정성

만약 일반 `fetch`를 직접 사용하면 위에 나열된 모든 기능을 매번 직접 구현해야 한다.

</br>

# `fetchBaseQuery` 호출 옵션

`RTK Query`의 `fetchBaseQuery` 사용할 때 두 가지 방식으로 추가 옵션들을 전달하여 HTTP 요청 시 동작을 조정할 수 있다. 둘 다 `RequestInit`의 프로퍼티를 상속받는다.

- **FetchBaseQueryArgs**: `fetchBaseQuery()` 함수 자체를 구성할 때 사용하는 옵션(`fetchBaseQuery()` 호출 시 전역 설정용)
- **FetchArgs**: 각 `endpoints`의 `query` 함수에서 개별 요청을 정의할 때 사용하는 옵션(각 엔드포인트별 개별 요청 설정용)

## `FetchBaseQueryArgs` : 전역 설정 객체

`fetchBaseQuery`를 호출할 때 전달하는 모든 요청의 전역 설정 객체 `FetchBaseQueryArgs`의 타입은 다음과 같다.

```
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
} & RequestInit
```

| 속성                   | 타입                                                            | 필수 | 기본값               | 설명                                                              |
| ---------------------- | --------------------------------------------------------------- | ---- | -------------------- | ----------------------------------------------------------------- |
| `baseUrl`              | `string`                                                        | 선택 | `''`                 | 모든 요청에 사용될 기본 URL. 상대 경로가 이 URL에 추가됨          |
| `prepareHeaders`       | `(headers: Headers, api) => Headers \| void`                    | 선택 | `undefined`          | 모든 요청 전에 헤더를 수정할 수 있는 함수. Redux 상태에 접근 가능 |
| `fetchFn`              | `(input: RequestInfo, init?: RequestInit) => Promise<Response>` | 선택 | `window.fetch`       | 기본 fetch 함수를 대체할 커스텀 fetch 함수 (SSR 등에서 유용)      |
| `paramsSerializer`     | `(params: Record<string, any>) => string`                       | 선택 | `URLSearchParams`    | 쿼리 파라미터를 직렬화하는 커스텀 함수                            |
| `isJsonContentType`    | `(headers: Headers) => boolean`                                 | 선택 | 기본 구현 제공       | body를 JSON으로 처리할지 결정하는 함수                            |
| `jsonContentType`      | `string`                                                        | 선택 | `'application/json'` | 자동 설정되는 JSON Content-Type 헤더 값                           |
| `timeout`              | `number`                                                        | 선택 | `undefined`          | 요청 타임아웃 (밀리초). 설정하지 않으면 타임아웃 없음             |
| **RequestInit 상속 ↓** |                                                                 |      |                      |                                                                   |
| `headers`              | `HeadersInit`                                                   | 선택 | `{}`                 | 모든 요청에 포함될 기본 헤더                                      |
| `credentials`          | `'omit' \| 'same-origin' \| 'include'`                          | 선택 | `'same-origin'`      | 쿠키 포함 정책                                                    |
| `mode`                 | `'cors' \| 'no-cors' \| 'same-origin'`                          | 선택 | `'cors'`             | CORS 모드                                                         |
| `cache`                | `RequestCache`                                                  | 선택 | `'default'`          | 캐시 모드                                                         |
| `redirect`             | `'follow' \| 'error' \| 'manual'`                               | 선택 | `'follow'`           | 리다이렉트 처리 방식                                              |
| `referrerPolicy`       | `ReferrerPolicy`                                                | 선택 | `''`                 | Referrer 정책                                                     |
| `integrity`            | `string`                                                        | 선택 | `''`                 | Subresource Integrity 값                                          |
| `keepalive`            | `boolean`                                                       | 선택 | `false`              | 페이지 수명을 넘어 요청을 유지할지 여부                           |
| `signal`               | `AbortSignal`                                                   | 선택 | `undefined`          | 요청을 중단하기 위한 AbortSignal                                  |

### `prepareHeaders` 속성의 `api` 객체

`prepareHeaders`의 두 번째 인자로 전달되는 `api` 객체의 속성은 다음과 같다.

<!-- 첫 번째 인자 Headers의 타입은? -->

| 속성       | 타입                    | 설명                                                  |
| ---------- | ----------------------- | ----------------------------------------------------- |
| `getState` | `() => RootState`       | Redux 스토어의 현재 상태를 가져오는 함수              |
| `extra`    | `unknown`               | `configureStore`의 `middleware`에 전달된 `extra` 인자 |
| `endpoint` | `string`                | 현재 호출 중인 엔드포인트 이름                        |
| `type`     | `'query' \| 'mutation'` | 엔드포인트 타입                                       |
| `forced`   | `boolean \| undefined`  | 강제 리페치 여부                                      |
| `arg`      | `string \| FetchArgs`   | `query` 함수에 전달된 인자                            |

<br>

## `FetchArgs` : 엔드포인트 개별 요청 설정 객체

`FetchArgs`는 `endpoints` 내부에 정의된 각 엔드포인트의 `query` 함수가 반환하는 값으로 개별 요청에 사용되는 옵션 객체이며 다음과 같은 타입을 갖는다.

만약 `FetchArgs`에 없는 속성을 전달하면 TypeScript 사용 시 컴파일 에러가 발생하고,
JavaScript 사용 시 에러 없이 무시된다.

<!-- 커스텀 baseQuery 사용할 땐 해당 안되는듯.. -->

```
interface FetchArgs extends RequestInit {
  url: string
  params?: Record<string, any>
  body?: any
  responseHandler?:
    | 'json'
    | 'text'
    | `content-type`
    | ((response: Response) => Promise<any>)
  validateStatus?: (response: Response, body: any) => boolean
  timeout?: number
}

// 기본 응답 유효성 체크
const defaultValidateStatus = (response: Response) =>
  response.status >= 200 && response.status <= 299
------------------------------------------------------
// 사용 예시
const api = createApi({
  reducerPath: 'example',
  baseQuery: ...,
        .
        .
        .
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET',
        params: { include: 'profile' },
        timeout: 5000
      })
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
        responseHandler: 'json'
      })
    })
  })
});
```

| 속성                     | 타입                                                  | 필수     | 기본값                | 설명                                                   |
| ------------------------ | ----------------------------------------------------- | -------- | --------------------- | ------------------------------------------------------ |
| `url`                    | `string`                                              | **필수** | -                     | 요청할 URL 경로 (`baseUrl`에 추가됨)                   |
| `body`                   | `any`                                                 | 선택     | `undefined`           | 요청 본문. 자동으로 `JSON.stringify()` 처리됨          |
| `params`                 | `Record<string, any>`                                 | 선택     | `undefined`           | URL 쿼리 파라미터 객체                                 |
| `responseHandler`        | `'json' \| 'text' \| 'content-type' \| CustomHandler` | 선택     | `'json'`              | 응답 파싱 방식                                         |
| `validateStatus`         | `(response: Response, body: any) => boolean`          | 선택     | 기본 구현             | 응답을 성공으로 처리할지 결정하는 함수                 |
| `timeout`                | `number`                                              | 선택     | `baseQuery의 timeout` | 이 요청의 타임아웃 (밀리초). baseQuery 설정 오버라이드 |
| **+ `RequestInit` 상속** |                                                       |          |                       |                                                        |

### `responseHandler` 옵션 상세

| 값                                     | 설명                                             |
| -------------------------------------- | ------------------------------------------------ |
| `'json'`                               | `response.json()`으로 파싱 (기본값)              |
| `'text'`                               | `response.text()`로 파싱                         |
| `'content-type'`                       | Content-Type 헤더를 보고 자동으로 json/text 선택 |
| `(response: Response) => Promise<any>` | 커스텀 파싱 함수                                 |

<br>

# `FetchBaseQueryArgs` vs `FetchArgs` 비교

| 구분              | `FetchBaseQueryArgs`                  | `FetchArgs`                                    |
| ----------------- | ------------------------------------- | ---------------------------------------------- |
| **사용 위치**     | `fetchBaseQuery()` 호출 시            | 각 엔드포인트의 `query` 함수 반환 값           |
| **적용 범위**     | 모든 요청에 공통 적용                 | 해당 엔드포인트에만 적용                       |
| **url 필수 여부** | 선택 (`baseUrl`만 설정)               | 필수                                           |
| **우선순위**      | 낮음 (기본 값)                        | 높음 (개별 설정이 `baseQuery` 설정 오버라이드) |
| **주요 용도**     | 전역 설정 (인증, 기본 헤더, 타임아웃) | 개별 요청 설정 (경로, 메서드, 바디)            |

## `FetchBaseQueryArgs` 활용 예제

```
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.example.com/v1',
  timeout: 10000,
  credentials: 'include',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    headers.set('X-App-Version', '1.0.0')

    console.log(`요청 엔드포인트: ${endpoint}`)

    return headers
  },
  paramsSerializer: (params) => {
    // 커스텀 쿼리 직렬화 (예: 배열을 콤마로 구분)
    return Object.entries(params)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}=${value.join(',')}`
        }
        return `${key}=${value}`
      })
      .join('&')
  }
})
```

## `FetchArgs` 활용 예제

```
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: (builder) => ({
    // 단순 GET 요청 - 문자열만 반환
    getUsers: builder.query({
      query: () => '/users'
    }),

    // 쿼리 파라미터 포함
    searchUsers: builder.query({
      query: ({ name, age }) => ({
        url: '/users/search',
        params: { name, age }  // ?name=xxx&age=yyy
      })
    }),

    // POST 요청 with body
    createUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user  // 자동으로 JSON.stringify()
      })
    }),

    // 커스텀 헤더와 타임아웃
    uploadFile: builder.mutation({
      query: (file) => ({
        url: '/upload',
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000  // 30초
      })
    }),

    // 텍스트 응답 처리
    getReport: builder.query({
      query: (reportId) => ({
        url: `/reports/${reportId}`,
        responseHandler: 'text'
      })
    }),

    // 커스텀 응답 검증
    getLegacyData: builder.query({
      query: () => ({
        url: '/legacy-api',
        validateStatus: (response, result) => {
          // 레거시 API는 항상 200을 반환하고 result.success로 성공 여부 판단
          return response.status === 200 && result.success === true
        }
      })
    })
  })
})
```

## 속성 적용 우선순위

동일한 속성이 여러 곳에 정의된 경우 우선순위는 다음과 같다.

1. **`FetchArgs`** (개별 엔드포인트의 `query` 반환 값) - 최우선
2. **`FetchBaseQueryArgs`** (`baseQuery` 설정)
3. **기본 값** (`fetch API` 기본 값)

### 예시

```
// baseQuery에서 timeout 10초 설정
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  timeout: 10000  // 모든 요청 기본 10초
})

export const api = createApi({
  baseQuery,
  endpoints: (builder) => ({
    // 이 엔드포인트는 10초 타임아웃 (baseQuery 설정 사용)
    getUsers: builder.query({
      query: () => '/users'
    }),

    // 이 엔드포인트는 30초 타임아웃 (FetchArgs가 오버라이드)
    uploadLargeFile: builder.mutation({
      query: (file) => ({
        url: '/upload',
        method: 'POST',
        body: file,
        timeout: 30000  // baseQuery 설정을 오버라이드
      })
    })
  })
})
```

## 주의사항

<!--  -->

### 1. body 자동 직렬화

- `FetchArgs`의 `body`는 객체나 배열일 경우 자동으로 `JSON.stringify()` 처리
- `Content-Type: application/json` 헤더도 자동 추가
- `FormData`나 `Blob`은 자동 직렬화 하지 않음

### 2. params 처리

- `params` 객체는 자동으로 URL 쿼리스트링으로 변환
- `undefined` 값은 제거됨
- 커스텀 직렬화가 필요하면 `paramsSerializer` 사용

### 3. timeout

- `timeout: 0`은 타임아웃 없음을 의미하지 않음
- 타임아웃을 해제하려면 `timeout` 속성을 설정하지 않아야 함

### 4. credentials

- 쿠키를 포함하려면 `credentials: 'include'` 설정 필요
- CORS 환경에서는 서버의 `Access-Control-Allow-Credentials: true` 헤더도 필요

<br>

type FetchBaseQuery = (
args: FetchBaseQueryArgs,
) => (
args: string | FetchArgs,
api: BaseQueryApi,
extraOptions: ExtraOptions,
) => FetchBaseQueryResult
