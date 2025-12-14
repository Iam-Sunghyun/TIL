<h2>목차</h2>

- [`createApi`의 `baseQuery`란?](#createapi의-basequery란)
- [가장 많이 사용되는 `baseQuery` 구현: `fetchBaseQuery`](#가장-많이-사용되는-basequery-구현-fetchbasequery)
  - [`fetchBaseQuery` 사용 가능 옵션(프로퍼티)](#fetchbasequery-사용-가능-옵션프로퍼티)
    - [반환 값](#반환-값)
- [`baseQuery` 커스텀 함수 시그니처](#basequery-커스텀-함수-시그니처)
- [커스텀 `baseQuery`는 언제, 어떻게 사용하는가?](#커스텀-basequery는-언제-어떻게-사용하는가)
  - [예: `axios` 기반 커스텀 `baseQuery`](#예-axios-기반-커스텀-basequery)
  - [주의할 점 / 규칙](#주의할-점--규칙)

</br>

# `createApi`의 `baseQuery`란?

`baseQuery`는 **`RTK Query`가 모든 `endpoints` 요청을 실행할 때 사용되는 “공통 요청 처리 함수”**다.

**즉, `endpoints`의 `query` 옵션은 단순히 “어떤 요청을 할지 (예: URL, method, body, headers 등 요청 정보)”를 기술할 뿐이고, `query`의 결과를 받아 실제 HTTP 요청 또는 기타 비동기 로직을 실행하는 것은 `baseQuery`다.**

<!-- 일반적으로는 HTTP 요청이지만, 구조적으로는 어떤 비동기 작업도 가능하다  -->

기본 값으로는 보통 `fetchBaseQuery`(`fetch`을 감싼 경량 유틸)를 사용하며, 일반적인 REST API 호출에는 보통 이걸 바로 사용해도 충분하다.

→ 정리하면 `baseQuery`는 “기본 fetch/mutation 로직”을 정의하는 곳이며, 필요에 따라 커스터마이징하거나 완전 새로 작성할 수 있는 핵심 확장 포인트다.

</br>

# 가장 많이 사용되는 `baseQuery` 구현: `fetchBaseQuery`

`RTK Query`는 기본 통신을 위해 `fetch` API를 활용하는 `fetchBaseQuery` 유틸리티 함수를 제공하는데 대부분의 경우 이 함수를 사용하여 `baseQuery`를 정의하는 것이 가장 간단하고 강력하다.

`fetchBaseQuery`를 사용하여 요청을 생성하는 경우 body 필드는 자동으로 JSON 직렬화된다.

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

</br>

## `fetchBaseQuery` 사용 가능 옵션(프로퍼티)

`fetchBaseQuery`는 아래 옵션들을 넘겨 받아서 내부 HTTP 요청 방식을 조정할 수 있다.

아래 기본 프로퍼티 + 표준 `fetch` API의 `RequestInit` 상속

<!-- endpoints query 함수가 객체를 반환할 때, 허용되는 프로퍼티는 무엇이 있는가? url, method, body 등,,  -->

- ✅ baseUrl

  API의 기본 URL을 설정하는 옵션. 예) "https://api.example.com/v1/" 같은 식.

  endpoint의 `query()`에서 전달한 상대 경로에 자동으로 붙여서 요청함.

- ✅ prepareHeaders

  요청마다 헤더를 동적으로 구성해주는 함수.

  예) Redux store에서 토큰을 꺼내 Authorization 헤더를 붙이는 로직 구현 가능.

  함수 시그니처:

  ```
  // TS
  (headers, { getState, endpoint, type, forced, arg, extra }) => Headers | void
  ```

  headers를 직접 수정하거나 반환해도 되고, 아무 것도 반환하지 않아도 된다.

### 반환 값

```
type FetchBaseQueryResult = Promise<
  | {
      data: any
      error?: undefined
      meta?: { request: Request; response: Response }
    }
  | {
      error: FetchBaseQueryError
      data?: undefined
      meta?: { request: Request; response: Response }
    }
>
```

# `baseQuery` 커스텀 함수 시그니처

`baseQuery`에 커스텀 함수를 정의하는 경우 해당 함수는 다음 인자를 받는다.

| 인자             | 설명                                                                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **args**         | endpoint의 `query()`가 반환한 값 그대로                                                                                                                                                                   |
| **api**          | `RTK Query` 내부 도구(아래는 속성 일부)<br>• `signal`: 요청 취소용 AbortSignal<br>• `dispatch`: Redux 액션 디스패치 가능<br>• `getState`: Redux store 접근<br>• `extra`: middleware extraArgument 등 <br> |
| **extraOptions** | endpoint에서 지정한 `extraOptions`가 있으면 이게 전달됨                                                                                                                                                   |

<br>
<!-- 예시 필요 -->

여기서 `getState`를 통해 현재 `Redux` 상태를 읽고, `dispatch`로 액션을 디스패치할 수 있다.

반드시 에러를 throw 하지 말고, 아래와 같이 성공 시엔 `{ data: … }`, 실패 시엔 `{ error: … }` 형태의 객체를 반환해야 한다(또는 이 객체를 감싼 Promise를 반환해야 한다). -> `baseQuery`에 할당되는 값

```
// 성공 시 반환
{ data: undefined, error?: any, meta?: any }
-----------------------------------------
// 실패 시 반환
{ error: undefined, data?: undefined, meta?: any }
```

이 형식을 지켜야만 `RTK Query`가 올바르게 타입을 추론하고 요청 상태를 관리할 수 있다.❗ 만약 에러를 throw 하거나 반환 형식을 어기면, 내부 캐시/상태 관리가 올바르게 동작하지 않을 수 있다.

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

## 주의할 점 / 규칙
