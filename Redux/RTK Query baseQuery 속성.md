<h2>목차</h2>

- [`createApi`의 `baseQuery`란?](#createapi의-basequery란)
- [자주 사용되는 `baseQuery` 구현: `fetchBaseQuery`](#자주-사용되는-basequery-구현-fetchbasequery)
  - [`fetchBaseQuery`를 사용하는 이유?](#fetchbasequery를-사용하는-이유)
  - [`fetchBaseQuery` 함수 시그니처](#fetchbasequery-함수-시그니처)
  - [`fetchBaseQuery` 옵션(프로퍼티) 설명](#fetchbasequery-옵션프로퍼티-설명)
- [`baseQuery` 커스터마이징](#basequery-커스터마이징)
  - [`baseQuery` 커스텀 함수 시그니처](#basequery-커스텀-함수-시그니처)
- [커스텀 `baseQuery`는 언제, 어떻게 사용하는가?](#커스텀-basequery는-언제-어떻게-사용하는가)
  - [예: `axios` 기반 커스텀 `baseQuery`](#예-axios-기반-커스텀-basequery)
  - [주의할 점 / 규칙](#주의할-점--규칙)

</br>

# `createApi`의 `baseQuery`란?

`baseQuery`는 **`RTK Query`가 모든 `endpoints` 요청을 실행할 때 사용되는 “공통 요청 처리 함수”** 다. 엔드포인트에 `queryFn`이 따로 정의되지 않은 경우 모든 `endpoints` 요청은 `baseQuery`를 호출하도록 되어 있다.

결국 `endpoints`의 `query` 옵션은 단순히 '어떤 요청을 할지(예: URL, method, body, headers 등 요청 정보)'를 기술할 뿐이고, `query`의 결과를 받아 실제 HTTP 요청 또는 기타 비동기 로직을 실행하는 것은 `baseQuery`다.

<!-- 일반적으로는 HTTP 요청이지만, 구조적으로는 어떤 비동기 작업도 가능하다  -->

보통 `RTK Query`에서 제공되는 `fetchBaseQuery`(`fetch API`을 감싼 경량 유틸)를 사용하며, 일반적인 REST API 호출에는 보통 이걸 바로 사용해도 충분하지만 필요에 따라 `axios`같은 라이브러리를 사용해 커스터마이징하여 작성하여 확장할 수 있다(실무에선 커스터마이징도 자주 사용되는 듯).

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

// fetchBaseQuery
query: () => ({
  url: '/users',
  validateStatus: (response, result) =>
    response.status === 200 && !result.isError
})
```

결국 `fetchBaseQuery`는 `fetch API`로부터 다음과 같은 이점을 부여한 래퍼 객체인 셈이다.

- `RTK Query` 생태계에 맞는 표준화된 인터페이스 제공
- 반복적인 보일러플레이트 코드 제거
- `Redux` 스토어와의 자연스러운 통합
- 일관된 에러 처리 및 타입 안정성

만약 일반 `fetch`를 직접 사용하면 위의 모든 기능을 매번 직접 구현해야 한다.

## `fetchBaseQuery` 함수 시그니처

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

</br>

## `fetchBaseQuery` 옵션(프로퍼티) 설명

<!-- `fetchBaseQuery`는 아래 옵션들을 넘겨 받아서 내부 HTTP 요청 방식을 조정할 수 있다.

`RTK Query`의 `fetchBaseQuery`는 두 가지 주요 타입을 사용한다. 둘 다 `RequestInit`의 프로퍼티를 상속받는다. -->

- **FetchBaseQueryArgs**: `fetchBaseQuery()` 함수 자체를 구성할 때 사용하는 옵션(`fetchBaseQuery()` 호출 시 전역 설정용)
- **FetchArgs**: 각 엔드포인트의 `query` 함수에서 개별 요청을 정의할 때 사용하는 옵션(각 엔드포인트별 개별 요청 설정용)

| 속성                 | 타입                                                            | 필수 | 기본값               | 설명                                                              |
| -------------------- | --------------------------------------------------------------- | ---- | -------------------- | ----------------------------------------------------------------- |
| `baseUrl`            | `string`                                                        | 선택 | `''`                 | 모든 요청에 사용될 기본 URL. 상대 경로가 이 URL에 추가됨          |
| `prepareHeaders`     | `(headers: Headers, api) => Headers \| void`                    | 선택 | `undefined`          | 모든 요청 전에 헤더를 수정할 수 있는 함수. Redux 상태에 접근 가능 |
| `fetchFn`            | `(input: RequestInfo, init?: RequestInit) => Promise<Response>` | 선택 | `window.fetch`       | 기본 fetch 함수를 대체할 커스텀 fetch 함수 (SSR 등에서 유용)      |
| `paramsSerializer`   | `(params: Record<string, any>) => string`                       | 선택 | `URLSearchParams`    | 쿼리 파라미터를 직렬화하는 커스텀 함수                            |
| `isJsonContentType`  | `(headers: Headers) => boolean`                                 | 선택 | 기본 구현 제공       | body를 JSON으로 처리할지 결정하는 함수                            |
| `jsonContentType`    | `string`                                                        | 선택 | `'application/json'` | 자동 설정되는 JSON Content-Type 헤더 값                           |
| `timeout`            | `number`                                                        | 선택 | `undefined`          | 요청 타임아웃 (밀리초). 설정하지 않으면 타임아웃 없음             |
| **RequestInit 상속** |                                                                 |      |                      |                                                                   |
| `headers`            | `HeadersInit`                                                   | 선택 | `{}`                 | 모든 요청에 포함될 기본 헤더                                      |
| `credentials`        | `'omit' \| 'same-origin' \| 'include'`                          | 선택 | `'same-origin'`      | 쿠키 포함 정책                                                    |
| `mode`               | `'cors' \| 'no-cors' \| 'same-origin'`                          | 선택 | `'cors'`             | CORS 모드                                                         |
| `cache`              | `RequestCache`                                                  | 선택 | `'default'`          | 캐시 모드                                                         |
| `redirect`           | `'follow' \| 'error' \| 'manual'`                               | 선택 | `'follow'`           | 리다이렉트 처리 방식                                              |
| `referrerPolicy`     | `ReferrerPolicy`                                                | 선택 | `''`                 | Referrer 정책                                                     |
| `integrity`          | `string`                                                        | 선택 | `''`                 | Subresource Integrity 값                                          |
| `keepalive`          | `boolean`                                                       | 선택 | `false`              | 페이지 수명을 넘어 요청을 유지할지 여부                           |
| `signal`             | `AbortSignal`                                                   | 선택 | `undefined`          | 요청을 중단하기 위한 AbortSignal                                  |

<br>

# `baseQuery` 커스터마이징

## `baseQuery` 커스텀 함수 시그니처

`baseQuery`에 커스텀 함수를 정의하는 경우 해당 함수는 다음 인자를 받는다.

| 인자             | 설명                                                                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **args**         | endpoint의 `query()`가 반환한 값 그대로                                                                                                                                                                   |
| **api**          | `RTK Query` 내부 도구(아래는 속성 일부)<br>• `signal`: 요청 취소용 AbortSignal<br>• `dispatch`: Redux 액션 디스패치 가능<br>• `getState`: Redux store 접근<br>• `extra`: middleware extraArgument 등 <br> |
| **extraOptions** | endpoint에서 지정한 `extraOptions`가 있으면 이게 전달됨                                                                                                                                                   |

<br>
<!-- 예시 필요 -->

여기서 `getState`를 통해 현재 `Redux` 상태를 읽고, `dispatch`로 액션을 디스패치할 수 있다.

반드시 에러를 throw 하지 말고, 아래와 같이 성공 시엔 `{ data: … }`, 실패 시엔 `{ error: … }` 형태의 객체를 반환해야 한다(또는 이 객체를 감싼 Promise를 반환해야 한다).

```
// 성공 시 반환
{ data: YourData }

// 실패 시 반환
{ error: YourError }
```

이 형식을 지켜야만 `RTK Query`가 올바르게 타입을 추론하고 요청 상태를 관리할 수 있다. 만약 에러를 throw 하거나 반환 형식을 어기면, 내부 캐시/상태 관리가 올바르게 동작하지 않을 수 있다.

# 커스텀 `baseQuery`는 언제, 어떻게 사용하는가?

기본 `fetchBaseQuery`가 “충분치 않다”고 느껴질 때, 직접 `baseQuery`를 정의하거나 래핑(wrapper)할 수 있다.

## 예: `axios` 기반 커스텀 `baseQuery`

<!--  더 추가 -->

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
```

## 주의할 점 / 규칙
