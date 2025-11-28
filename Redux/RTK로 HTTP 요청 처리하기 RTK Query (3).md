<h2>목차</h2>

- [`RTK Query` Mutation 엔드포인트 정의하기](#rtk-query-mutation-엔드포인트-정의하기)
  - [컴포넌트에서 Mutation 훅 사용하기](#컴포넌트에서-mutation-훅-사용하기)

</br>

# `RTK Query` Mutation 엔드포인트 정의하기

API 슬라이스를 정의할 때 데이터를 가져오는 쿼리 뿐 아니라 서버 상태를 변경하는 로직을 작성할 수도 있다.

서버 데이터를 변경하는 mutation 엔드포인트는 쿼리 엔드포인트와 거의 비슷한데 `builder.query()` 대신 `builder.mutation()` 메서드를 사용하며, `query`에 정의한 함수가 URL과, `POST` HTTP 메서드, 요청 body를 포함한 객체를 반환해야 한다는 차이가 있다.

<!--  -->

`fetchBaseQuery`를 사용하여 요청을 생성하므로 body 필드는 자동으로 JSON 직렬화된다.

```
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
  useAddNewPostMutation
} = apiSlice
```

## 컴포넌트에서 Mutation 훅 사용하기
