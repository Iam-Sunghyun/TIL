<h2>목차</h2>

- [`RTK Query` Query 엔드포인트 정의하기](#rtk-query-query-엔드포인트-정의하기)
  - [`endpoints` 옵션 상세](#endpoints-옵션-상세)
- [React Hooks를 이용해 쿼리하기](#react-hooks를-이용해-쿼리하기)
  - [`RTK Query` 쿼리 훅(hook)의 특징](#rtk-query-쿼리-훅hook의-특징)
    - [1. 자동 생성](#1-자동-생성)
    - [2. 렌더링 최적화](#2-렌더링-최적화)
    - [3. 백그라운드 페칭](#3-백그라운드-페칭)
  - [쿼리 훅의 종류](#쿼리-훅의-종류)
    - [`refetch` vs `trigger` 함수의 차이?](#refetch-vs-trigger-함수의-차이)
- [`useQuery` 훅 타입](#usequery-훅-타입)
  - [`useQuery` 호출 주요 옵션](#usequery-호출-주요-옵션)
  - [`useQuery` 반환 객체](#usequery-반환-객체)
  - [`isLoading`과 `isFetching`의 차이](#isloading과-isfetching의-차이)
  - [쿼리 훅(`useQuery`)에 인수 전달하기](#쿼리-훅usequery에-인수-전달하기)
  - [고급 기능 및 최적화 예시](#고급-기능-및-최적화-예시)
    - [1. 조건부 페칭](#1-조건부-페칭)
    - [2. 성능 최적화 : 일부만 선택해 사용하기(`selectFromResult`)](#2-성능-최적화--일부만-선택해-사용하기selectfromresult)
    - [3. 실시간성 유지(`pollingInterval`)](#3-실시간성-유지pollinginterval)
- [`query` 엔드포인트 정의 시 `GET` 외 메서드 사용 가능 여부?](#query-엔드포인트-정의-시-get-외-메서드-사용-가능-여부)
  - [Reference](#reference)

</br>

# `RTK Query` Query 엔드포인트 정의하기

`RTK Query`의 쿼리 엔드포인트는 **`build.query()` 구문으로 정의 되며 서버로부터 데이터를 가져와 캐시 하기 위해 사용된다.** 이때 `build.query()`에 전달되는 객체에 `query` 혹은 비동기 로직을 담은 `queryFn` 필드를 반드시 포함해야 한다.

또한 `endpoints`를 정의할 때 옵션을 추가하여 캐시 되기 전 데이터를 조작할 수 있고, 태그를 이용해 캐시를 무효화 할 수도 있으며 캐시가 추가/제거될 때 실행할 로직을 정의할 수도 있다.

다음은 API 슬라이스에 엔드포인트를 정의하고 컴포넌트 내에서 쿼리 훅(`useQuery`)을 사용하는 일반적인 패턴이다.

```
// API 슬라이스 정의
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Post } from './types'

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['Post'],
  endpoints: (build) => ({

    getPost: build.query<Post, number>({

      query: (id) => ({ url: `post/${id}` }),

      // 쿼리 결과 캐시하기 전 조작
      transformResponse: (response: { data: Post }, meta, arg) => response.data,

      // 쿼리 결과가 에러인 경우 캐시하기 전 수정
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg,
      ) => response.status,

      // build.query에서만 가능한 태그 옵션
      providesTags: (result, error, id) => [{ type: 'Post', id }],

      // The 2nd parameter is the destructured `QueryLifecycleApi`
      async onQueryStarted(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          queryFulfilled,
          getCacheEntry,
          updateCachedData,
        },
      ) {},

      // The 2nd parameter is the destructured `QueryCacheLifecycleApi`
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
          updateCachedData,
        },
      ) {},
    }),
  }),
})

export const { useGetPostQuery } = apiSlice
---------------------------------
// 컴포넌트 내에서 쿼리 훅 사용
import { useGetPostQuery } from './postsApi';

function PostList() {
  const {
    data: posts,  // 구체적인 변수 명으로 바꾸는 것이 일반적
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch
  } = useGetPostQuery();

  // 1. 초기 로딩 상태 처리
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 2. 에러 상태 처리
  if (isError) {
    return <div>에러 발생: {error.message}</div>; // 에러 객체에 따라 접근 방식 다름
  }

  // 3. 성공 및 데이터 표시
  return (
    <div>
      {/* isFetching을 사용하여 백그라운드 재요청 표시 */}
      {isFetching && <small>데이터 업데이트 중...</small>}

      <button onClick={refetch}>수동 새로고침</button>

      {isSuccess && posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### `endpoints` 옵션 상세

**[RTK Query endpoint parameters]**

https://redux-toolkit.js.org/rtk-query/api/createApi#endpoint-definition-parameters

<br>

# React Hooks를 이용해 쿼리하기

## `RTK Query` 쿼리 훅(hook)의 특징

### 1. 자동 생성

`createApi`의 `endpoints`에 정의된 이름에 따라 `use[EndpointName]Query` 형태의 훅이 자동으로 생성된다.

### 2. 렌더링 최적화

- **파생 상태 기반의 세밀한 제어**

  데이터 로딩 상태를 나타내는 파생 상태(derived booleans)를 불리언 값으로 제공해 세밀하게 하위 요소 렌더링을 컨트롤 할 수 있다.

- **`selectFromResult`를 통한 선택적 구독**

  `selectFromResult` 옵션으로 특정 값만 선택해 사용함으로서 리렌더링을 최소화 시킬 수 있다.

### 3. 백그라운드 페칭

- **"Stale-While-Revalidate" 패턴**

  캐시된 데이터가 있다면 먼저 화면에 즉시 보여주고(`data`에 캐시 값 할당), 동시에 백그라운드에서 서버에 요청을 보냄으로 화면에 스피너와 같은 로딩 표시 출력을 최소화한다.

- **자동 가비지 컬렉션(Automatic GC)**

  `RTK Query`는 백그라운드에 데이터를 무한정 유지하지 않는다. 특정 데이터를 구독하는 컴포넌트가 모두 언마운트되면, 기본적으로 60초(`keepUnusedDataFor`) 후에 해당 캐시를 자동으로 제거하며 이후 다시 컴포넌트가 마운트될 때만 새로운 백그라운드 페칭을 시작하여 메모리를 효율적으로 관리한다.

- **포커스 및 네트워크 복구 시 재검증**

  사용자가 다른 탭을 갔다가 돌아오거나(`refetchOnFocus`), 인터넷 연결이 끊겼다 복구되었을 때(`refetchOnReconnect`) 백그라운드 페칭을 트리거한다. 사용자는 새로고침 버튼을 누르지 않아도 최신 상태의 대시보드를 볼 수 있다.

<br>

## 쿼리 훅의 종류

데이터를 가져오기 위한 `query` 훅으로는 다음과 같이 5가지가 있는데, 대부분의 경우 `useQuery`를 사용하는 것이 일반적이다.

| Hook 타입                      | fetch 실행 | 캐시 구독 | 상태 반환 | trigger 제공 | 주요 용도                                                                                                  |
| ------------------------------ | ---------- | --------- | --------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| **`useQuery`**                 | 자동       | O         | O         | refetch      | 가장 표준적인 훅. 컴포넌트 마운트, 매개변수 변경 시 자동으로 데이터를 페칭하고 상태를 반환한다.            |
| **`useQueryState`**            | ❌         | O         | O         | ❌           | 캐시된 상태를 조회하고 실행 중인 쿼리의 로딩 상태만 읽어온다. 새로운 요청을 발생시키지 않는다.             |
| **`useQuerySubscription`**     | 자동       | O         | ❌        | refetch      | 데이터를 가져오고(fetch) 캐시를 유지(구독)하지만, 로딩 상태나 결과 값은 반환하지 않아 리렌더링하지 않는다. |
| **`useLazyQuery`**             | 수동       | O         | O         | trigger      | 호출 시 즉시 실행되지 않고, 반환된 `trigger` 함수를 실행할 때 데이터를 가져온다.                           |
| **`useLazyQuerySubscription`** | 수동       | O         | ❌        | trigger      | `trigger`를 통해 수동으로 요청할 수 있고 구독하지만 결과는 반환하지 않음.                                  |

<br>

### `refetch` vs `trigger` 함수의 차이?

| 구분           | `refetch`                                           | `trigger`                                       |
| -------------- | --------------------------------------------------- | ----------------------------------------------- |
| 주요 목적      | 데이터 새로고침: 이미 보여지고 있는 데이터를 최신화 | 수동 쿼리: 특정 시점에 쿼리 시작                |
| 인수(Arg) 변경 | ❌ (원본 재사용)                                    | ✅ (호출 시 새로운 인자 전달 가능)              |
| 반환 값        | `Promise` (결과 상태는 훅의 결과 객체에 반영)       | `Promise` (결과 데이터를 직접 포함한 객체 반환) |
| 캐시 동작      | 기존 캐시를 무시하고 서버에 강제 요청               | 캐시가 있으면 캐시를 반환하거나 설정을 따름     |

<br>

```
const { data, refetch } = useQuery(userId);  // useQuery - 컴포넌트 마운트 시 자동 실행

// 동일한 userId로 재실행
// 기존 캐시 키 유지, 값만 업데이트
refetch();

const [trigger, { data }] = useLazyQuery();  // useLazyQuery - 수동으로만 실행

// trigger 호출 전까지 실행 안 되며, 다른 인수로 실행 가능
// 만약 다른 인수면 별도 캐시
trigger(newUserId);
```

<br>

# `useQuery` 훅 타입

```
type UseQuery = (
  arg: any | SkipToken,
  options?: UseQueryOptions,
) => UseQueryResult

type UseQueryOptions = {
  pollingInterval?: number // 자동으로 데이터를 다시 가져오는 주기 (밀리초 단위, 예: 3000 = 3초마다)
  skipPollingIfUnfocused?: boolean // 브라우저 탭이 백그라운드일 때 폴링 멈추기
  refetchOnReconnect?: boolean // 인터넷 재연결되면 자동으로 다시 가져오기
  refetchOnFocus?: boolean // 브라우저 탭으로 돌아오면 자동으로 다시 가져오기
  skip?: boolean // 이 쿼리를 실행하지 않음 (조건부 실행에 유용)
  refetchOnMountOrArgChange?: boolean | number // 컴포넌트가 새로 마운트되거나 인수가 바뀌면 다시 가져오기 (숫자면 초 단위)
  selectFromResult?: (result: UseQueryStateDefaultResult) => any // 결과에서 필요한 부분만 선택하는 함수
}

type UseQueryResult<T> = {
  // 기본 쿼리 상태

  // 쿼리를 호출할 때 전달한 인자 (예: 사용자 ID)
  originalArgs?: unknown
  // 가장 최근에 받은 데이터 (다른 컴포넌트에서 같은 쿼리를 호출해도 공유됨)
  data?: T
  // 현재 이 컴포넌트의 인자로 받은 데이터 (이 컴포넌트에만 해당)
  currentData?: T
  // 에러가 발생했을 때의 에러 정보
  error?: unknown
  // 이번 요청의 고유 ID
  requestId?: string
  // 이 쿼리의 이름 (예: 'getUser')
  endpointName?: string
  // 쿼리를 시작한 시간
  startedTimeStamp?: number
  // 쿼리가 완료된 시간
  fulfilledTimeStamp?: number

  // 현재 상태를 나타내는 boolean 값들

  // 아직 한 번도 실행되지 않음
  isUninitialized: boolean
  // 처음 데이터를 가져오는 중 (아직 데이터 없음)
  isLoading: boolean
  // 데이터를 가져오는 중 (이전 데이터가 있을 수 있음)
  isFetching: boolean
  // 성공적으로 데이터를 받아옴
  isSuccess: boolean
  // 에러 발생
  isError: boolean

  // 수동으로 데이터를 다시 가져오는 함수 (새로고침 버튼 만들 때 사용)
  refetch: () => QueryActionCreatorResult
}
```

<br>

## `useQuery` 호출 주요 옵션

쿼리 훅은 `use[EndpointName]Query(queryArg?, queryOptions?)` 형태로 2가지 인수를 전달할 수 있는데, 2번째 인수인 `queryOptions` 객체의 속성으로 다음과 같은 옵션을 전달할 수 있다.

| 옵션                        | 의미                                                                                          | 기본 값  |                             |
| --------------------------- | --------------------------------------------------------------------------------------------- | -------- | --------------------------- |
| `skip`                      | 컴포넌트 렌더링마다 자동 호출을 건너뜀(조건부 페칭에 유용)                                    | `false`  |                             |
| `pollingInterval`           | 지정된 밀리초(ms) 간격으로 자동 재요청                                                        | `0`(off) |                             |
| `refetchOnMountOrArgChange` | 컴포넌트 마운트 시 또는 인자가 바뀔 때 강제로 다시 가져올지 설정(시간 설정 가능)              | `false`  |                             |
| `refetchOnFocus`            | 탭/윈도우 포커스 시 재요청                                                                    | `false`  |                             |
| `refetchOnReconnect`        | 네트워크 재연결 시 재요청                                                                     | `false`  |                             |
| `selectFromResult`          | 결과 데이터 중 특정 부분만 선택하여 반환하며, 선택한 데이터가 변경될 때만 리렌더링되도록 한다 | —        | ([redux-toolkit.js.org][1]) |

<br>

실전에서는 `skip`, `pollingInterval`, `refetchOnMountOrArgChange` 정도를 가장 많이 사용한다.

[1]: https://redux-toolkit.js.org/rtk-query/usage/queries "Queries | Redux Toolkit"

<br>

## `useQuery` 반환 객체

`RTK Query`의 `createApi`에 쿼리(Query) 엔드포인트를 정의할 때, 자동으로 생성되는 훅(`useGetXxxQuery`)을 호출하면 요청 상태와 데이터를 포함하는 결과 객체를 반환한다.

다음은 반환 객체의 주요 속성들이다.

```
// 자주 사용되는 반환 속성
const {
    data: posts,
    currentData,
    error,
    isUninitialized,
    isLoading,
    isFetching,
    isSuccess,
    refetch
  } = useGetPostsQuery();
```

<br>

이 결과 객체에는 현재 데이터 요청 상태를 파악하고, 데이터를 사용하며, 에러를 처리하는 데 필요한 핵심 프로퍼티들이 포함되어 있다. 또한 **컴포넌트는 요청 상태가 변경되거나 응답 데이터가 사용 가능해지면 자동으로 리렌더링이 일어난다.**

<br>

<!-- data, currentData 차이 -->

| 프로퍼티          | 타입                                                        | 설명                                                                                                                                                                                         |
| :---------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`data`**        | `T` (응답 데이터 타입)                                      | 요청이 **성공**했을 때 서버에서 받은 최종 **데이터**다. 로딩 중이거나 에러 발생 시에는 `undefined`일 수 있다.                                                                                |
| **`currentData`** | `T`                                                         | 현재 캐시에 존재하는 **최신 데이터**다. `isFetching` 중일 때 (새 데이터를 가져오는 중), 이 값은 **이전 데이터**를 유지한다.                                                                  |
| **`error`**       | `FetchBaseQueryError \| SerializedError`                    | 요청 중 **에러**가 발생했을 때 에러 정보를 담고 있다(객체). 성공적으로 완료되면 `undefined`다.                                                                                               |
| **`isLoading`**   | `boolean`                                                   | 현재 **첫 번째 요청**을 수행 중인지를 나타낸다. 캐시가 없어서 데이터를 가져오는 초기 로딩 단계에서 `true`다.                                                                                 |
| **`isFetching`**  | `boolean`                                                   | **백그라운드에서 데이터를 가져오는 중**인지를 나타낸다. 초기 로딩(`isLoading: true`)을 포함하여, 캐시된 데이터가 있지만 재검증(revalidation) 또는 재요청(refetching) 중인 경우에도 `true`다. |
| **`isSuccess`**   | `boolean`                                                   | 요청이 **성공적으로 완료**되었고, 유효한 **데이터(`data`)** 를 가지고 있음을 나타낸다.                                                                                                       |
| **`isError`**     | `boolean`                                                   | 요청이 **에러**와 함께 완료되었음을 나타낸다.                                                                                                                                                |
| **`status`**      | `'uninitialized' \| 'pending' \| 'fulfilled' \| 'rejected'` | 요청의 현재 **상태**를 나타내는 값이다.                                                                                                                                                      |
| **`refetch`**     | `() => Promise<QueryActionCreatorResult<T>>`                | **수동으로** 해당 쿼리를 **다시 실행**하도록 트리거하는 함수다.                                                                                                                              |

---

</br>

## `isLoading`과 `isFetching`의 차이

`RTK Query`에서 캐시된 데이터가 있을 때와 없을 때의 상태를 구분하기 위해 `isLoading`과 `isFetching` 두 가지 프로퍼티를 사용하는데 두 프로퍼티의 차이를 이해하는 것이 중요하다.

<br>

| 특징            | `isLoading` (데이터 없음)                                                                                        | `isFetching` (모든 요청)                                                                                                                                                     |
| :-------------- | :--------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **정의**        | 현재 캐시에 유효한 데이터가 **없어서** 초기 또는 강제 요청을 수행 중인 상태.                                     | 현재 백그라운드에서 **어떤 종류의 데이터 요청이든** 활발하게 수행 중인 상태.                                                                                                 |
| **발생 시점**   | 1. 쿼리 훅 컴포넌트가 **처음 마운트**되었을 때. <br> 2. 이전 데이터가 **만료**되거나 **캐시에서 제거**되었을 때. | 1. `isLoading`이 `true`일 때. <br> 2. 캐시 데이터가 있지만, **백그라운드에서 재검증**(`refetchOnFocus`, `refetchOnReconnect`) 중일 때. <br> 3. **수동 `refetch()`** 호출 시. |
| **`data` 상태** | 보통 **`undefined`**                                                                                             | **유효한 이전 데이터**를 포함할 수 있다 (`currentData`와 동일).                                                                                                              |
| **UI 활용**     | 전체 화면을 덮는 **로딩 스켈레톤** 또는 스피너를 보여줄 때 사용.                                                 | 이미 데이터를 보여주면서, 작은 **업데이트 인디케이터**나 알림을 표시할 때 사용.                                                                                              |
| **포괄 관계**   | `isLoading`이 `true`이면, **항상** `isFetching`도 `true`다.                                                      | `isFetching`이 `true`일 때, `isLoading`은 `true`일 수도 있고, `false`일 수도 있다.                                                                                           |

<br>

`isLoading`

"데이터가 없어서" 처음으로 또는 강제로 새로 요청하는 경우다. 이때는 화면에 스켈레톤(Skeleton) 또는 로딩 스피너를 보여주는 것이 일반적이다. `data`는 보통 `undefined`다.

`isFetching`

모든 활성 요청에 대해 `true`다. 초기 로딩 시 (`isLoading`이 `true`일 때) 당연히 `true`다.
캐시된 데이터가 이미 존재하는 상황에서, 사용자의 재접속(`refetchOnReconnect`), 포커스(`refetchOnFocus`), 또는 수동 `refetch()`로 백그라운드에서 재요청이 일어날 때도 `true`다.

이때는 이미 **이전 데이터(data 또는 currentData)** 를 보여주고, 작은 업데이트 알림이나 인디케이터를 표시하는 것이 좋다.

예를 들면 `isLoading`은 처음 로드할 때 스켈레톤을 표시하는 데 사용할 수 있고, `isFetching`은 1페이지에서 2페이지로 전환하거나 데이터가 무효화되어 다시 가져올 때 이전 데이터를 회색으로 표시하는 데 사용할 수 있다.

```
// isLoading/isFetching 예시 코드
function App() {
  const { data = [], isLoading, isFetching, isError } = useGetPostsQuery()

  if (isError) return <div>Error!</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={isFetching ? 'disabled' : ''}>
      {data.map(post => <Post key={post.id} {...post}/>)}
    </div>
  );
}
```

<br>

## 쿼리 훅(`useQuery`)에 인수 전달하기

**`RTK Query`는 고유한 엔드포인트 + 인수 조합에 대해 각각의 캐시 키를 생성하고, 그 결과를 개별적으로 저장한다**. 즉, 동일한 쿼리 훅에 서로 다른 인수를 사용했을 경우 `Redux` 스토어에 개별적으로 캐시되는 것이다.

만약 여러 컴포넌트에서 동일한 데이터가 필요한 경우 각 컴포넌트에서 동일한 인수의 쿼리 훅을 호출하기만 하면 된다. 그럼 `RTK Query`는 **데이터를 한 번만 가져오고 나머지는 캐시된 데이터를 사용하여 불필요한 쿼리가 줄어들게 되고 각 컴포넌트는 필요에 따라 리렌더링이 일어나게 된다.**

<!-- 필요에 따라? -->

**또한 쿼리 매개 변수는 단일 값이어야 한다.** 여러 매개 변수를 전달해야 하는 경우 여러 필드가 포함된 객체를 전달해야 하는데 이때 `RTK Query`는 각 필드(프로퍼티)를 얕은 비교로 값을 비교하고, 값이 변경된 경우 리페치(re-fetch)를 수행한다.

```
// features/api/apiSlice.js
    .
    .
    .
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts'
    }),
    getPost: builder.query({
      query: postId => `/posts/${postId}`
    })
  })
})

export const { useGetPostsQuery, useGetPostQuery } = apiSlice
------------------------------
// features/posts/SinglePostPage.jsx
    .
    .
    .
import { useGetPostQuery } from '@/features/api/apiSlice'
import { selectCurrentUsername } from '@/features/auth/authSlice'

export const SinglePostPage = () => {
  const { postId } = useParams()

  const currentUsername = useAppSelector(selectCurrentUsername)
  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  let content
  const canEdit = currentUsername === post?.user

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        {canEdit && (
          <Link to={`/editPost/${post.id}`} className="button">
            Edit Post
          </Link>
        )}
      </article>
    )
  }

  return <section>{content}</section>
}
```

<br>

## 고급 기능 및 최적화 예시

### 1. 조건부 페칭

특정 아이디가 있을 때만 쿼리를 실행하고 싶다면 `skip` 옵션을 사용해줄 수 있다.

```
const { data } = useGetPostQuery(id, { skip: !id });
```

### 2. 성능 최적화 : 일부만 선택해 사용하기(`selectFromResult`)

응답 데이터가 클 경우, 필요한 부분만 선택하여 해당 값이 변경됐을 때만 렌더링하게 만들어 리렌더링을 최소화할 수 있다.

```
const { post } = useGetPostsQuery(undefined, {
  selectFromResult: ({ data }) => ({
    post: data?.find((p) => p.id === postId),
  }),
});
```

### 3. 실시간성 유지(`pollingInterval`)

일정한 간격으로 서버의 데이터를 확인해야 할 때 사용한다.

```
const { data } = useGetStatusQuery(undefined, { pollingInterval: 3000 });
```

<br>

# `query` 엔드포인트 정의 시 `GET` 외 메서드 사용 가능 여부?

`builder.query()`를 사용해 쿼리를 정의할 때 `GET`만 사용할 수 있을 것 같지만, **`POST`, `PUT`, `DELETE`와 같은 다른 메서드도 가능하다.** 일반적인 REST API는 아니지만, 다음과 같은 상황에서 `builder.query`에 `POST` 메서드와 같은 다른 메서드를 사용하기도 한다.

- 검색(Search) API: 보안 상 혹은 검색 조건이 너무 복잡하여 body에 데이터를 담아 `POST`로 조회해야 할 때.

- `GraphQL API`: 모든 요청이 `POST`로 이루어지는 환경에서 데이터를 조회할 때.

<br>

```
const apiSlice = createApi({
    .
    .
endpoints: (builder) => ({
  // 검색 결과는 캐싱되어야 하므로 query를 사용
  searchProducts: builder.query({
    query: (searchArgs) => ({
      url: '/products/search',
      method: 'POST', // GET이 아닌 POST 사용 가능!
      body: searchArgs,
    }),
    // 검색어가 같으면 서버에 다시 묻지 않고 캐시된 데이터를 사용함
  }),

  // 데이터 추가는 서버 상태를 바꾸는 것이므로 mutation 사용
  addProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
    }),
  }),
});
```

<br>
 
## Reference

**[RTK Query using query]**

https://redux-toolkit.js.org/rtk-query/usage/queries

https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics
