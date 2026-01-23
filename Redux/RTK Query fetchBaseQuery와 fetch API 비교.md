<h2>목차</h2>

- [`fetchBaseQuery`를 사용하는 이유?](#fetchbasequery를-사용하는-이유)
  - [1. 표준화된 응답 구조](#1-표준화된-응답-구조)
  - [2. 응답 데이터 자동 파싱 (`json`/`text`)](#2-응답-데이터-자동-파싱-jsontext)
  - [3. 통일된 에러 처리](#3-통일된-에러-처리)
  - [4. `prepareHeaders`로 간편한 공통 헤더 설정](#4-prepareheaders로-간편한-공통-헤더-설정)
  - [5. `baseUrl` 자동 결합](#5-baseurl-자동-결합)
  - [6. 타임아웃 기능 간소화](#6-타임아웃-기능-간소화)
  - [7. 쿼리 파라미터 자동 직렬화](#7-쿼리-파라미터-자동-직렬화)
  - [8. 커스텀 응답 검증](#8-커스텀-응답-검증)
- [일반 `fetch API`와 `fetchBaseQuery` 비교 예제](#일반-fetch-api와-fetchbasequery-비교-예제)

<br>

# `fetchBaseQuery`를 사용하는 이유?

다음은 일반 `fetch API`가 아닌 `fetchBaseQuery`를 사용했을 때 주요 장점들을 나열한 것이다.

<!--  -->

## 1. 표준화된 응답 구조

일관된 응답 객체 구조로 안정적인 후속 처리를 가능하게 한다.

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

## 2. 응답 데이터 자동 파싱 (`json`/`text`)

`fetchBaseQuery`를 사용하여 요청을 생성하는 경우 기본 값으로 적절한 헤더 설정과 함께 body 필드가 `JSON`으로 직렬화된다. 응답도 자동으로 `JSON` 파싱되며 body가 없는 경우 `null`로 처리된다.

다른 타입을 원한다면 엔드포인트 `query`에 `headers`, 혹은 `responseHandler`를 통해 요청/응답 바디의 값을 설정해줄 수 있다.

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
--------------------------------------------------
// fetchBaseQuery - 자동 처리
query: (data) => ({
  url: '/users',
  method: 'POST',
  body: data  // 자동으로 JSON.stringify() + 헤더 설정
})
```

## 3. 통일된 에러 처리

일반 `fetch API`의 경우 상태 코드가 200~299가 아니어도 에러를 throw 하지 않는 반면 `fetchBaseQuery`는 응답 상태 코드가 200~299 외인 경우 `error`를 `reject` 한다. 따라서 불필요한 상태 코드 체크를 생략할 수 있다.

```
// 일반 fetch - 200-299가 아니어도 에러를 throw하지 않음
const response = await fetch(url)
if (!response.ok) {  // 매번 체크 필요
  throw new Error('Request failed')
}
----------------------------------------
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

## 4. `prepareHeaders`로 간편한 공통 헤더 설정

브라우저 `fetch API`의 경우 매 요청마다 `headers` 객체에 토큰을 직접 넣어주거나, 전역 `fetch`를 래핑하는 함수를 직접 만들어야 한다.

반면 `fetchBaseQuery`는 요청 시 `prepareHeaders` 프로퍼티를 통해 모든 요청에 공통적으로 적용될 로직(예: `Redux` 상태에서 토큰 가져와서 삽입하기)을 한 곳에서 중앙 관리할 수 있으며 `prepareHeaders` 내에서 `Redux` 상태에 접근할 수 있으므로 더욱 유용하다.

```
// 일반 fetch - 스토어 접근 불가능..
const token = fetch(url, {
  headers: { authorization: `Bearer ${token}` }
})
----------------------------------------
// fetchBaseQuery - prepareHeaders로 스토어 접근 가능
prepareHeaders: (headers, { getState }) => {
  const token = getState().auth.token  // Redux 스토어에서 바로 가져옴
  if (token) {
    headers.set('authorization', `Bearer ${token}`)
  }
  return headers
}
```

## 5. `baseUrl` 자동 결합

`baseUrl`을 한 번 설정해두면, 각 엔드포인트에 상대 경로만 적어주면 되기 때문에 API 주소가 바뀌었을 때 수정 내용이 최소화 된다.

```
// 일반 fetch - 매번 전체 URL 작성
fetch('https://api.example.com/users')
fetch('https://api.example.com/posts')
fetch('https://api.example.com/comments')

// fetchBaseQuery - baseUrl 한 번만 설정
fetchBaseQuery({ baseUrl: 'https://api.example.com' })
----------------------------------------
// 엔드포인트에서는 경로만 작성
query: () => '/users'
query: () => '/posts'
query: () => '/comments'
```

## 6. 타임아웃 기능 간소화

일반 `fetch API`를 사용하면 다소 복잡할 수 있는 타임아웃 기능을 값 할당 만으로 적용 시킬 수 있다.

```
// 일반 fetch
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 5000)

try {
  const response = await fetch(url, { signal: controller.signal })
} finally {
  clearTimeout(timeoutId)
}
----------------------------------------
// fetchBaseQuery - 간단하게 설정
fetchBaseQuery({
  baseUrl: '/api',
  timeout: 5000  // 끝!
})
```

## 7. 쿼리 파라미터 자동 직렬화

```
// 일반 fetch - 수동으로 URL 생성
const params = new URLSearchParams({ page: 1, limit: 10 })
fetch(`/api/users?${params}`)
----------------------------------------
// fetchBaseQuery - 객체만 전달
query: () => ({
  url: '/users',
  params: { page: 1, limit: 10 }  // 자동으로 쿼리스트링 생성
})
```

## 8. 커스텀 응답 검증

```
// 일반 fetch - 매번 수동 체크
const response = await fetch(url)
const data = await response.json()
if (data.isError) {
  throw new Error('API returned error')
}
----------------------------------------
// FetchArgs의 validateStatus 설정
query: () => ({
  url: '/users',
  validateStatus: (response, result) =>
    response.status === 200 && !result.isError
})
```

<!-- 5. 재시도 로직(Retry)과의 연동 (신규 추가 추천)
   fetchBaseQuery는 retry 유틸리티와 함께 사용하기 매우 쉽습니다. 특정 에러 발생 시 자동으로 재요청을 보내는 로직을 구현할 때 일반 fetch보다 훨씬 간결합니다.

```
// fetchBaseQuery를 retry로 감싸기만 하면 됨
const baseQuery = retry(fetchBaseQuery({ baseUrl: '/' }), { maxRetries: 3 });
```

6. 가벼운 용량 (Lightweight)
   Axios와 같은 외부 라이브러리를 추가하지 않고도, 브라우저의 fetch 위에서 핵심적인 편리함만 뽑아낸 무게감 없는(Bundle size) 해결책이라는 점도 큰 장점입니다. -->

<br>

# 일반 `fetch API`와 `fetchBaseQuery` 비교 예제

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

만약 일반 `fetch`를 직접 사용하면 위에 나열된 모든 기능을 매번 직접 구현해야 한다. 결국 `fetchBaseQuery`는 `fetch API`로부터 다음과 같은 이점을 부여한 래퍼 객체인 셈이다.

- `RTK Query` 생태계에 맞는 표준화된 인터페이스 제공
- 반복적인 보일러플레이트 코드 제거
- `Redux` 스토어와의 자연스러운 통합
- 일관된 에러 처리 및 타입 안정성
