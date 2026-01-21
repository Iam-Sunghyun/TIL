<h2>목차</h2>

- [`RTK Query` Mutation 엔드포인트 정의하기](#rtk-query-mutation-엔드포인트-정의하기)
    - [`endpoints` 옵션 상세](#endpoints-옵션-상세)
- [`useMutation` 훅 타입](#usemutation-훅-타입)
- [`useMutation` 훅 반환 값(`[trigger, result]`)](#usemutation-훅-반환-값trigger-result)
  - [Mutation 결과 객체(`result`)](#mutation-결과-객체result)
- [뮤테이션 `trigger` 함수 반환 값](#뮤테이션-trigger-함수-반환-값)
  - [1. 기본 반환 값(`Promise`) 구조](#1-기본-반환-값promise-구조)
  - [**2. `.unwrap()` 사용 시 반환 값 구조 (권장)**](#2-unwrap-사용-시-반환-값-구조-권장)
- [Query vs Mutation 캐싱 차이](#query-vs-mutation-캐싱-차이)
- [`onQueryStarted`로 낙관적 업데이트](#onquerystarted로-낙관적-업데이트)
- [`useMutation` 훅 사용 예제](#usemutation-훅-사용-예제)
  - [Reference](#reference)

</br>

# `RTK Query` Mutation 엔드포인트 정의하기

API 슬라이스를 정의할 때 데이터를 가져오는 쿼리 뿐 아니라 서버 상태를 변경(수정, 생성, 삭제)하는 요청을 작성할 수도 있다.

서버 데이터를 변경하는 mutation 엔드포인트는 쿼리 엔드포인트와 거의 비슷한데 `endpoints` 프로퍼티에 전달되는 함수의 인수(보통 `builder`혹은 `build`로 명명)로부터 `builder.query()` 대신 `builder.mutation()` 메서드를 사용하며, **서버에 변경 사항을 전송하고 캐시를 무효화하여 쿼리 엔드포인트의 refetch를 위해 사용된다**. 또한 **mutation은 수동으로 호출해야 하며 결과 데이터를 캐시하지 않는다.**

추가로 쿼리 엔드포인트와 마찬가지로 `query` 혹은 비동기 로직의 `queryFn`을 반드시 정의해줘야 한다.

```
// features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Post } from './types'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts'
    }),
    getPost: builder.query({
      query: postId => `/posts/${postId}`
    }),

    // 뮤테이션 정의
    addNewPost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...patch }) => ({
      url: `post/${id}`,
      method: 'PATCH',
      body: patch,
    }),

    // 훅이나 셀렉터에서 data를 추출하고 중첩 속성 방지
    transformResponse: (response: { data: Post }, meta, arg) => response.data,

    // 훅이나 셀렉터에서 에러를 추출하고 중첩 속성 방지
    transformErrorResponse: (
      response: { status: string | number },
      meta,
      arg,
    ) => response.status,

    // 무효화 할 태그 명
    invalidatesTags: ['Post'],

    // onQueryStarted는 낙관적 업데이트에 유용함
    // 두 번째 파라미터는 구조 분해된 `MutationLifecycleApi`
    async onQueryStarted(
      arg,
      { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry },
    ) {},

    // 두 번째 파라미터는 구조 분해된 `MutationCacheLifecycleApi`
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
      },
    ) {},
    })
  })
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation  // 쿼리 엔드포인트와 마찬가지로 hook 자동 생성
} = apiSlice
```

### `endpoints` 옵션 상세

**[RTK Query endpoint parameters]**

https://redux-toolkit.js.org/rtk-query/api/createApi#endpoint-definition-parameters

</br>

# `useMutation` 훅 타입

```
type UseMutation = (
  options?: UseMutationStateOptions,
) => [UseMutationTrigger, UseMutationResult | SelectedUseMutationResult]

type UseMutationStateOptions = {
  // 결과에서 필요한 부분만 선택하는 함수
  selectFromResult?: (result: UseMutationStateDefaultResult) => any
  // 여러 컴포넌트에서 같은 mutation 결과를 공유하고 싶을 때 사용하는 고유 키
  fixedCacheKey?: string
}

type UseMutationTrigger<T> = (arg: any) => Promise
  { data: T } | { error: BaseQueryError | SerializedError }
> & {
  requestId: string // 요청을 구분하는 고유 ID
  abort: () => void // 진행 중인 요청을 취소하는 함수
  unwrap: () => Promise<T> // 성공 시 데이터만, 실패 시 에러를 던지는 함수 (try-catch 사용 가능)
  reset: () => void // mutation 상태를 초기 상태로 되돌리는 함수
}

type UseMutationResult<T> = {
  // 기본 쿼리 상태

  // mutation을 호출할 때 전달한 인자 (fixedCacheKey 사용 시에는 없음)
  originalArgs?: unknown
  // 성공 시 서버에서 받은 데이터
  data?: T
  // 실패 시 에러 정보
  error?: unknown
  // 이 mutation의 이름 (예: 'updateUser')
  endpointName?: string
  // mutation이 완료된 시간
  fulfilledTimeStamp?: number

  // 현재 상태를 나타내는 boolean 값들

  // 아직 한 번도 실행하지 않은 상태
  isUninitialized: boolean
  // 현재 서버 응답을 기다리는 중
  isLoading: boolean
  // 성공적으로 완료됨
  isSuccess: boolean
  // 에러 발생
  isError: boolean
  // mutation을 시작한 시간
  startedTimeStamp?: number

  // mutation 상태를 초기화하는 함수 (data, error 등을 모두 지움)
  reset: () => void
}
```

<br>

# `useMutation` 훅 반환 값(`[trigger, result]`)

`useMutation` 훅이 반환하는 첫 번째 요소인 `trigger` 함수는 API 슬라이스 엔드포인트에 정의한 mutation 함수로, 호출 시 전달한 인수와 함께 서버에 mutation을 요청하며 몇몇 프로퍼티가 추가된 `Promise`를 반환한다. 또한 이때마다 컴포넌트 렌더링을 일으키는데, 다음과 같이 `selectFromResult` 옵션에 빈 객체를 전달하면 처음 한 번만 렌더링이 일어난다.

```
selectFromResult: () => ({})
```

## Mutation 결과 객체(`result`)

현재 요청의 상태 및 결과를 담고 있는 객체로 다음과 같은 속성을 갖고 있다.

| 프로퍼티                 | 타입                                                        | 설명                                                                                                                              |
| :----------------------- | :---------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **`data`**               | `T` (응답 데이터 타입)                                      | 뮤테이션 요청이 **성공적으로 완료되었을 때 서버로부터 받은 최종 응답 데이터**. 성공 전에는 `undefined`.                           |
| **`error`**              | `FetchBaseQueryError \| SerializedError`                    | 요청이 **실패**했을 때 에러 정보를 담는다. 네트워크 에러, 4xx/5xx 응답, 직렬화 에러 등이 포함될 수 있다. 성공 시에는 `undefined`. |
| **`isLoading`**          | `boolean`                                                   | 현재 **뮤테이션 요청이 진행 중**인지 여부. 트리거를 호출하면 즉시 `true`가 되고, 성공/실패로 끝나면 다시 `false`가 된다.          |
| **`isSuccess`**          | `boolean`                                                   | 요청이 **정상적으로 완료된 직후부터 `true`**가 된다. 보통 성공 토스트, UI 상태 변경 등에 이 값을 사용한다.                        |
| **`isError`**            | `boolean`                                                   | 요청이 **에러와 함께 종료**되면 `true`. 이 값을 이용해 에러 UI, 경고 메시지 등을 처리할 수 있다.                                  |
| **`isUninitialized`**    | `boolean`                                                   | **아직 한 번도 이 뮤테이션이 실행되지 않은 상태**일 때 `true`. 초기 렌더링에서 흔히 `true` 상태다.                                |
| **`status`**             | `'uninitialized' \| 'pending' \| 'fulfilled' \| 'rejected'` | 뮤테이션 요청의 **전체 상태를 문자열로 표현한 값**이다. 로직에서 상태 분기를 세세하게 만들 때 유용하다.                           |
| **`originalArgs`**       | `unknown`                                                   | 마지막으로 `trigger(arg)` 호출할 때 전달했던 **요청 파라미터**. 성공/실패 여부와 관계없이 그대로 남아있다.                        |
| **`startedTimeStamp`**   | `number` (timestamp)                                        | 요청이 시작된 시점의 timestamp(ms). 요청 시간 로깅이나 디버깅 때 유용하다.                                                        |
| **`fulfilledTimeStamp`** | `number \| undefined`                                       | 요청이 완료(성공)된 시점의 timestamp. 실패한 경우 `undefined`.                                                                    |
| **`reset`**              | `() => void`                                                | 뮤테이션 상태 객체를 **초기 상태('uninitialized')로 되돌리는 함수**. 새로운 뮤테이션 시나리오를 시작할 때 사용한다.               |

</br>

추가로 mutation 요청 상태가 변경되거나 응답 데이터가 사용 가능해지면 컴포넌트 리렌더링이 일어난다.

<br>

# 뮤테이션 `trigger` 함수 반환 값

## 1. 기본 반환 값(`Promise`) 구조

`useMutation` 훅이 반환하는 트리거 함수를 호출하면 `Promise`를 반환 하는데 성공/실패와 관계없이 응답 데이터와 메타 정보를 포함하는 `resolve` 프로미스를 반환한다.

| 프로퍼티 / 메서드           | 타입                                | 설명                                                                                         |
| --------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| **`data` (resolve 값 내)**  | `T`                                 | 요청이 성공했을 때 resolve되는 객체 안에 포함된 응답 데이터. (`{ data: T }`)                 |
| **`error` (resolve 값 내)** | `BaseQueryError \| SerializedError` | 요청 실패 시 resolve되는 객체 안에 포함된 에러. (`{ error: ... }`)                           |
| **`abort`**                 | `() => void`                        | 해당 요청을 **즉시 중단**한다. 중단되면 promise가 reject 되지 않고 error 형태로 resolve된다. |
| **`unwrap`**                | `() => Promise<T>`                  | 성공 시 `T`값만 반환하고, 실패 시 throw하는 “정제된 Promise". 실무에서 가장 많이 사용.       |
| **`reset`**                 | `() => void`                        | useMutation으로 반환된 상태 객체(`isSuccess`, `isError`, `data`)를 **초기 상태로 되돌린다.** |
| **`requestId`**             | `string`                            | 뮤테이션 요청마다 생성되는 고유 ID. 중복 요청 관리/디버깅에 유용.                            |

<br>

<!-- 맞는지 확인 필  -->

이 외에도 여러 메타데이터를 설명하는 `meta` 속성이 존재한다. 하지만 공식 문서에는 표시되어 있지 않은데 이는 실무에서 `meta`를 사용할 일이 거의 없으며 `createApi`의 `baseQuery`의 값이 `fetchBaseQuery`로 이루어져 있는지, 커스텀 `baseQuery`인지에 따라 `meta` 속성이 달라질 수도 있다고 한다. 즉, `meta`는 사실상 내부의 값이고, 안정성이 보장되지 않으며, 실무에서 거의 사용되지 않기 때문에 불필요한 혼란을 방지하기 위해 타입 명시에는 노출되지 않는 것이다.

-> 참고로 `meta` 속성은 `fetchBaseQuery`를 사용했을때 반환되는 객체의 프로퍼티이다.

</br>

## **2. `.unwrap()` 사용 시 반환 값 구조 (권장)**

`Promise` 체인에 `.unwrap()`을 사용하면, 성공/실패와 관련 없이 `resolve` 프로미스를 반환하던 것과 달리 성공/실패에 따라 `resolve`/`reject`한 프로미스를 반환한다. 또한 결과 값만으로 이루어진 프로미스를 반환하기 때문에 응답 처리 방식이 간결해진다.

| 상태                   | Promise 결과                        | 설명                                                                                             |
| :--------------------- | :---------------------------------- | :----------------------------------------------------------------------------------------------- |
| **성공 시 (Resolved)** | **순수한 응답 데이터 $\mathbf{T}$** | 응답 데이터 외의 추가 정보를 제거하고 순수 데이터만 반환한다.                                    |
| **실패 시 (Rejected)** | **에러 객체 $\mathbf{E}$**          | Promise가 에러 객체로 Reject되므로, `try...catch` 구문에서 `catch(error)`로 바로 처리할 수 있다. |

<br>

# Query vs Mutation 캐싱 차이

<!-- 맞는지 확인 필  -->

mutation의 경우 query와 달리 결과를 캐시하지 않기 때문에 요청과 결과가 컴포넌트 별로 독립적이다.

```
// 동일한 인수로 여러 컴포넌트에서 호출 시 캐시 재사용
const { data } = useGetUserQuery(1); // 캐시에 저장
const { data } = useGetUserQuery(1); // 캐시에서 가져옴 (네트워크 요청 X)
--------------------------------------
// 매번 새로운 요청 실행
const [updateUser] = useUpdateUserMutation();
updateUser({ id: 1, name: 'John' }); // 요청 1
updateUser({ id: 1, name: 'John' }); // 요청 2 (캐시 사용 안 함)
```

<br>

| **특징**  | **Query**          | **Mutation**  |
| :-------- | :----------------- | :------------ |
| 캐싱      | ✅ 자동            | ❌ 없음       |
| 목적      | 데이터 읽기        | 데이터 변경   |
| 중복 요청 | 캐시 재사용        | 매번 실행     |
| 결과 공유 | 여러 컴포넌트 공유 | 호출한 곳에만 |

<br>

만약 결과를 공유하고 싶다면 `fixedCacheKey` 속성을 설정해 mutation이 있는 컴포넌트 간에 결과를 공유할 수 있다.

<br>

# `onQueryStarted`로 낙관적 업데이트

<!-- 내용 추가 필 -->

```
async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
  // Mutation 전에 Query 캐시를 직접 업데이트
  const patchResult = dispatch(
    api.util.updateQueryData('getUser', id, (draft) => {
      Object.assign(draft, patch);
    })
  );

  try {
    await queryFulfilled;
  } catch {
    patchResult.undo(); // 실패 시 롤백
  }
},
```

</br>

# `useMutation` 훅 사용 예제

```
// features/posts/AddPostForm.jsx
import React from 'react'

import { useAppSelector } from '@/app/hooks'

import { useAddNewPostMutation } from '@/features/api/apiSlice'
import { selectCurrentUsername } from '@/features/auth/authSlice'

// omit field types

export const AddPostForm = () => {
  const userId = useAppSelector(selectCurrentUsername)
  const [addNewPost, { isLoading }] = useAddNewPostMutation()

  const handleSubmit = async (e) => {
    // Prevent server submission
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    const form = e.currentTarget

    try {
      await addNewPost({ title, content, user: userId }).unwrap()

      form.reset()
    } catch (err) {
      console.error('Failed to save the post: ', err)
    }
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" defaultValue="" required />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          defaultValue=""
          required
        />
        <button disabled={isLoading}>Save Post</button>
      </form>
    </section>
  )
}
```

`<AddPostForm />` 컴포넌트에는 'Save Post' 버튼을 클릭할 때마다 게시물을 추가하는 비동기 함수가 `<form />` 요소의 이벤트 핸들러로 등록 되어있다. 원래는 `useDispatch`와 `addNewPost` 함수를 가져와야 하는데 `RTK Query`의 `useMutation` hook은 두 가지를 모두 대체한다.

</br>

## Reference

**[RTK Query basics, mutations]**

https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics

https://redux-toolkit.js.org/rtk-query/usage/mutations
