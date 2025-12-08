<h2>목차</h2>

- [`createApi`의 `baseQuery` 속성에 대하여](#createapi의-basequery-속성에-대하여)
- [커스텀 `baseQuery`는 언제, 어떻게?](#커스텀-basequery는-언제-어떻게)

# `createApi`의 `baseQuery` 속성에 대하여

baseQuery는 createApi 호출 시 설정하는 옵션으로, 각 endpoints에서 정의한 query의 결과를 실제 네트워크 요청 등으로 처리해주는 기본 함수 역할을 한다.

즉, endpoints의 query 옵션은 단순히 “어떤 요청을 할지 (예: URL, method, body 등)”를 기술할 뿐이고, 실제 HTTP 요청 또는 기타 비동기 로직은 baseQuery가 실행한다.

기본값으로는 fetchBaseQuery (즉, fetch을 감싼 경량 유틸)가 제공되며, 일반적인 REST API 호출에는 보통 이걸 바로 사용해도 충분하다.

→ 즉, baseQuery는 “기본 fetch/mutation 로직”을 정의하는 곳이며, 필요에 따라 커스터마이징하거나 완전 새로 작성할 수 있는 핵심 확장 포인트다.

# 커스텀 `baseQuery`는 언제, 어떻게?

기본 fetchBaseQuery가 “충분치 않다”고 느껴질 때, 직접 baseQuery를 정의하거나 래핑(wrapper)할 수 있다.

```
args,
api: { signal, dispatch, getState },
extraOptions
```
