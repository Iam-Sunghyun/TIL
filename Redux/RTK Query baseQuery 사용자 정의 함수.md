<h2>목차</h2>

- [`baseQuery` 커스터마이징](#basequery-커스터마이징)
  - [`baseQuery` 커스텀 함수 시그니처](#basequery-커스텀-함수-시그니처)
- [커스텀 `baseQuery`는 언제, 어떻게 사용하는가?](#커스텀-basequery는-언제-어떻게-사용하는가)
  - [예: `axios` 기반 커스텀 `baseQuery`](#예-axios-기반-커스텀-basequery)
  - [주의할 점 / 규칙](#주의할-점--규칙)

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
