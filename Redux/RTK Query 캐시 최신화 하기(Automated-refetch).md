<h2>목차</h2>

- [`RTK Query` 캐시 데이터 최신 값으로 업데이트 하기](#rtk-query-캐시-데이터-최신-값으로-업데이트-하기)
  - [수동으로 업데이트 하기](#수동으로-업데이트-하기)
  - [태그 기반 캐시 무효화(Cache Invalidation)로 자동 업데이트 하기](#태그-기반-캐시-무효화cache-invalidation로-자동-업데이트-하기)
  - [Reference](#reference)

</br>

# `RTK Query` 캐시 데이터 최신 값으로 업데이트 하기

```
import React from 'react'

import { useAppSelector } from '@/app/hooks'

import { useAddNewPostMutation } from '@/features/api/apiSlice'
import { selectCurrentUsername } from '@/features/auth/authSlice'

// omit field types

export const AddPostForm = () => {
  const userId = useAppSelector(selectCurrentUsername)!
  const [addNewPost, { isLoading }] = useAddNewPostMutation()

  const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
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

위 코드에서 'Save Post'를 클릭하면 브라우저 DevTools의 네트워크 탭을 통해 HTTP POST 요청이 성공했는지 확인할 수 있다. 하지만 `<PostsList />`로 돌아가면 새 게시물이 표시되지 않는다. Redux 저장소 상태는 변경되지 않았고, 메모리에는 여전히 동일한 캐시 데이터가 있다.

방금 추가한 새 게시물을 보려면 `RTK Query`에 캐시된 게시물 목록을 새로 고치도록 설정해야 한다.

## 수동으로 업데이트 하기

첫 번째 옵션은 실제 앱에서 사용하는 방법은 아니지만 RTK 쿼리가 지정된 엔드포인트에 대한 데이터를 수동으로 다시 가져오도록 강제하는 것이다.

쿼리 후크 결과 객체에는 강제로 다시 가져오기를 수행할 수 있는 `refetch` 함수가 포함되어 있다. `<PostsList />`에 'Refetch Posts' 버튼을 임시로 추가하고 새 게시물을 추가한 후 이 버튼을 클릭하면 된다.

```
// features/posts/PostsList.jsx
export const PostsList = () => {
  const {
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetPostsQuery()

      .
      .
      .
  // 생략

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
```

새 게시물을 추가하고 완료될 때까지 기다린 후 'Refetch Posts'를 클릭하면 새 게시물이 표시되는데, 위 컴포넌트에선 리페치가 진행 중이라는 표시가 구현되어 있지 않다.

<!--  -->

앞서 쿼리 훅에는 첫 번째 데이터 요청인 경우 `true`인 `isLoading` 플래그와 모든 데이터 요청이 진행 중인 경우 `true`인 `isFetching` 플래그가 모두 있다는 것을 살펴보았는데, `isFetching` 플래그를 보고 다시 가져오기가 진행되는 동안 전체 게시물 목록을 로딩 스피너로 다시 바꿀 수 있다. 하지만 이는 다소 번거로울 수 있으며, 이미 모든 게시물이 있는 상황에서 굳이 완전히 숨기지 않고도 사용자에게 좋은 응답을 줄 수 있다.

기존 게시물 목록을 부분적으로 투명하게 만들어 데이터가 오래되었음을 나타내면서도 다시 가져오기가 진행되는 동안에는 계속 표시할 수 있다. 요청이 완료되면 게시물 목록을 정상적으로 다시 표시하는 식이다.

```
// features/posts/PostsList.jsx
import classnames from 'classnames'

import { useGetPostsQuery, Post } from '@/features/api/apiSlice'

// omit other imports and PostExcerpt

export const PostsList = () => {
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname = classnames('posts-container', {
      disabled: isFetching
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
```

새로운 게시물을 추가한 다음 'Refetch Posts'를 클릭하면 게시물 목록이 몇 초 동안 반투명해진 다음(`disabled: true`), 맨 위에 추가된 새로운 게시물로 다시 렌더링된다.

## 태그 기반 캐시 무효화(Cache Invalidation)로 자동 업데이트 하기

<!--  -->

사용자 동작에 따라 가끔씩 수동으로 데이터를 다시 가져오도록 강제해야 할 수도 있지만, 일반적인 사용에는 확실히 좋은 해결책이 아니다.

이상적으로는 뮤테이션 요청이 완료되는 즉시 앱에서 업데이트된 게시물 목록을 자동으로 다시 가져오도록 설정하는 것이 일반적이다. 이렇게 하면 클라이언트 측 캐시 데이터가 서버에 있는 데이터와 동기화된다는 것을 확인할 수 있다.

RTK 쿼리를 사용하면 `tag`를 사용하여 쿼리와 뮤테이션 간의 관계를 정의하여 자동으로 데이터를 다시 가져올 수 있다. `tag`는 특정 유형의 데이터에 식별자를 부여하고 캐시의 일부를 무효화(invalidation)할 수 있는 문자열 또는 작은 객체다. 캐시 태그가 무효화되면 RTK 쿼리는 해당 태그로 표시된 엔드포인트를 자동으로 다시 가져온다.

<!-- tag가 객체인 경우 프로퍼티 모두 비교? -->

태그를 사용하기 위해선 API 슬라이스에 다음 3가지 값을 설정해주면 된다.

- `tagTypes` 배열

  사용 할 태그 명 선언

- `providesTags` 배열

  쿼리 데이터에 붙는 태그 명 지정

- `invalidatesTags` 배열

  뮤테이션이 실행될 때마다 무효화되는 태그 명 지정

아래 예시의 경우 `addNewPost` 훅 호출 시 `providesTags` 값이 `['Post']`인 `getPosts` 엔드포인트의 캐시가 무효화되어 자동으로 새 값을 refetch 하게 된다. 즉, `<AddPostForm />` 컴포넌트의 'Save Post' 버튼을 클릭하면 `['Post']` 태그의 캐시가 무효화되고, 그에 따라 `<PostsList />` 컴포넌트 리렌더링 되고, `useGetPostsQuery()` 훅이 호출되면서 쿼리 상태(`isLoading`, `isFetching` 등)에 따른 컴포넌트가 출력된다.

```
// features/api/apiSlice.js
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post']
    }),
    getPost: builder.query({
      query: postId => `/posts/${postId}`
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: initialPost
      }),
      invalidatesTags: ['Post']
    })
  })
})
```

<br>

## Reference

**[RTK Query Automated Re-fetchung]**

https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#invalidating-cache-data

**[Query `providesTags` 태그 명 매칭 예]**

https://redux-toolkit.js.org/rtk-query/api/createApi#providestags
