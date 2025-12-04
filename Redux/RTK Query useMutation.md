<h2>목차</h2>

- [`RTK Query` Mutation 엔드포인트 정의하기](#rtk-query-mutation-엔드포인트-정의하기)
- [컴포넌트에서 Mutation 훅 사용하기](#컴포넌트에서-mutation-훅-사용하기)
  - [`useMutation` 훅](#usemutation-훅)
    - [**뮤테이션 트리거 함수(Trigger Function)**](#뮤테이션-트리거-함수trigger-function)
    - [**결과 객체(Result Object)**](#결과-객체result-object)
  - [뮤테이션 트리거 함수 호출 결과 값](#뮤테이션-트리거-함수-호출-결과-값)
    - [1. 기본 Promise 반환 값 구조](#1-기본-promise-반환-값-구조)
    - [2. `.unwrap()` 사용 시 반환 값 구조 (권장)](#2-unwrap-사용-시-반환-값-구조-권장)
  - [Reference](#reference)

</br>

# `RTK Query` Mutation 엔드포인트 정의하기

API 슬라이스를 정의할 때 데이터를 가져오는 쿼리 뿐 아니라 서버 상태를 변경(수정, 생성, 삭제)하는 로직을 작성할 수도 있다.

서버 데이터를 변경하는 mutation 엔드포인트는 쿼리 엔드포인트와 거의 비슷한데 `endpoints` 프로퍼티에 전달되는 함수의 인수(`builder`)로부터 `builder.query()` 대신 `builder.mutation()` 메서드를 사용하며, `query`에 정의한 함수가 URL과, `POST`, `PUT`, `DELETE` 등의 HTTP 메서드, 요청 body를 포함한 객체(`{url, method, body}`)를 반환해야 한다는 차이가 있다.

`fetchBaseQuery`를 사용하여 요청을 생성하는 경우 body 필드는 자동으로 JSON 직렬화된다.

```
// features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts'
    }),
    getPost: builder.query({
      query: postId => `/posts/${postId}`
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        // -> '/fakeApi/posts'
        url: '/posts',
        // HTTP 메서드
        method: 'POST',
        // 요청 body
        body: initialPost
      })
    })
  })
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation  // 쿼리 엔드포인트와 마찬가지로 hook 자동 생성
} = apiSlice
```

</br>

# 컴포넌트에서 Mutation 훅 사용하기

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

## `useMutation` 훅

뮤테이션 훅은 다음 두 값을 요소로 갖는 배열을 반환한다.

### **뮤테이션 트리거 함수(Trigger Function)**

API 슬라이스 엔드포인트에 정의한 mutation 함수로 전달한 인수와 함께 서버에 mutation을 요청하며 몇몇 프로퍼티가 추가된 `Promise`를 반환한다.

### **결과 객체(Result Object)**

현재 요청의 상태 및 결과를 담고 있는 객체.

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

## 뮤테이션 트리거 함수 호출 결과 값

### 1. 기본 Promise 반환 값 구조

`useMutation` 훅이 반환하는 트리거 함수를 호출하면 `Promise`를 반환 하는데 성공/실패와 관계없이 응답 데이터와 메타 정보를 포함하는 `resolve` 프로미스를 반환한다.

| 프로퍼티 / 메서드           | 타입                                | 설명                                                                                         |
| --------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| **`data` (resolve 값 내)**  | `T`                                 | 요청이 성공했을 때 resolve되는 객체 안에 포함된 응답 데이터. (`{ data: T }`)                 |
| **`error` (resolve 값 내)** | `BaseQueryError \| SerializedError` | 요청 실패 시 resolve되는 객체 안에 포함된 에러. (`{ error: ... }`)                           |
| **`abort`**                 | `() => void`                        | 해당 요청을 **즉시 중단**한다. 중단되면 promise가 reject 되지 않고 error 형태로 resolve된다. |
| **`unwrap`**                | `() => Promise<T>`                  | 성공 시 `T`값만 반환하고, 실패 시 throw하는 “정제된 Promise". 실무에서 가장 많이 사용.       |
| **`reset`**                 | `() => void`                        | useMutation으로 반환된 상태 객체(`isSuccess`, `isError`, `data`)를 **초기 상태로 되돌린다.** |
| **`requestId`**             | `string`                            | 뮤테이션 요청마다 생성되는 고유 ID. 중복 요청 관리/디버깅에 유용.                            |

이 외에도 여러 메타데이터를 설명하는 `meta` 속성이 존재한다. 하지만 공식 문서에는 표시되어 있지 않은데 이는 실무에서 `meta`를 사용할 일이 거의 없으며 `createApi`의 `baseQuery`의 값이 `fetchBaseQuery`로 이루어져 있는지, 커스텀 `baseQuery`인지에 따라 `meta` 속성이 달라질 수도 있다고 한다. 즉, `meta`는 사실상 내부의 값이고, 안정성이 보장되지 않으며, 실무에서 거의 사용되지 않기 때문에 불필요한 혼란을 방지하기 위해 타입 명시에는 노출되지 않는 것이다.

</br>

### 2. `.unwrap()` 사용 시 반환 값 구조 (권장)

`Promise` 체인에 `.unwrap()`을 사용하면, 성공/실패와 관련 없이 `resolve` 프로미스를 반환하던 것과 달리 성공/실패에 따라 `resolve`/`reject`한 프로미스를 반환한다. 또한 결과 값만으로 이루어진 프로미스를 반환하기 때문에 응답 처리 방식이 간결해진다.

| 상태                   | Promise 결과                        | 설명                                                                                             |
| :--------------------- | :---------------------------------- | :----------------------------------------------------------------------------------------------- |
| **성공 시 (Resolved)** | **순수한 응답 데이터 $\mathbf{T}$** | 응답 데이터 외의 추가 정보를 제거하고 순수 데이터만 반환한다.                                    |
| **실패 시 (Rejected)** | **에러 객체 $\mathbf{E}$**          | Promise가 에러 객체로 Reject되므로, `try...catch` 구문에서 `catch(error)`로 바로 처리할 수 있다. |

추가로 mutation 요청 상태가 변경되거나 응답 데이터가 사용 가능해지면 컴포넌트 리렌더링이 일어난다.

</br>

## Reference

**[RTK Query basics, mutations]**

https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics

https://redux-toolkit.js.org/rtk-query/usage/mutations
