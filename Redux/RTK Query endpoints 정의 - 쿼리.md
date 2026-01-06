<h2>목차</h2>

- [`RTK Query` Query 엔드포인트 정의하기](#rtk-query-query-엔드포인트-정의하기)
  - [쿼리 훅의 결과 객체](#쿼리-훅의-결과-객체)
  - [`isLoading`과 `isFetching`의 차이 (핵심 구분)](#isloading과-isfetching의-차이-핵심-구분)
  - [쿼리 훅에 인수 전달해 호출하기](#쿼리-훅에-인수-전달해-호출하기)
  - [Reference](#reference)

</br>

# `RTK Query` Query 엔드포인트 정의하기

`RTK Query`의 쿼리 엔드포인트는 **서버로부터 데이터를 가져와 캐시 하기 위해 사용되며** `build.query()` 구문을 사용해 정의한다.

다음은 컴포넌트 내에서 쿼리 훅을 사용하는 일반적인 패턴이다.

<!-- builder.query 로도 POST, PUT..etc, body 포함 가능한듯? -->

https://redux-toolkit.js.org/rtk-query/api/createApi#endpoints

참고

```
// API 슬라이스 정의
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  endpoints: builder => ({

    // query 엔드포인트 정의
    getPosts: builder.query({
      query: () => '/posts'
    })
  })
})

export const { useGetPostsQuery } = apiSlice
---------------------------------
// 컴포넌트 내에서 쿼리 훅 사용
import { useGetPostsQuery } from './postsApi';

function PostList() {
  const {
    data: posts,  // 구체적인 변수 명으로 바꾸는 것이 일반적
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch
  } = useGetPostsQuery();

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

`useQuery`는 컴포넌트가 마운트 될 때 자동으로 호출된다.

<!-- 캐시가 있을 떄, 없을 때 호출 차이? 백그라운드 페칭?-->

## 쿼리 훅의 결과 객체

`RTK Query`에서 `createApi`로 정의된 쿼리(Query) 엔드포인트를 사용할 때, 자동 생성되는 훅(`useGetXxxQuery`)을 호출하면 요청 상태와 데이터를 포함하는 결과 객체를 반환한다.

```
const {
    data: posts,
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch
  } = useGetPostsQuery();
```

이 결과 객체에는 현재 데이터 요청 상태를 파악하고, 데이터를 사용하며, 에러를 처리하는 데 필요한 핵심 프로퍼티들이 포함되어 있다.

| 프로퍼티          | 타입                                                        | 설명                                                                                                                                                                                         |
| :---------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`data`**        | `T` (응답 데이터 타입)                                      | 요청이 **성공**했을 때 서버에서 받은 최종 **데이터**다. 로딩 중이거나 에러 발생 시에는 `undefined`일 수 있다.                                                                                |
| **`error`**       | `FetchBaseQueryError \| SerializedError`                    | 요청 중 **에러**가 발생했을 때 에러 정보를 담고 있다. 성공적으로 완료되면 `undefined`다.                                                                                                     |
| **`isLoading`**   | `boolean`                                                   | 현재 **첫 번째 요청**을 수행 중인지를 나타낸다. 캐시가 없어서 데이터를 가져오는 초기 로딩 단계에서 `true`다.                                                                                 |
| **`isFetching`**  | `boolean`                                                   | **백그라운드에서 데이터를 가져오는 중**인지를 나타낸다. 초기 로딩(`isLoading: true`)을 포함하여, 캐시된 데이터가 있지만 재검증(revalidation) 또는 재요청(refetching) 중인 경우에도 `true`다. |
| **`isSuccess`**   | `boolean`                                                   | 요청이 **성공적으로 완료**되었고, 유효한 **데이터(`data`)** 를 가지고 있음을 나타낸다.                                                                                                       |
| **`isError`**     | `boolean`                                                   | 요청이 **에러**와 함께 완료되었음을 나타낸다.                                                                                                                                                |
| **`status`**      | `'uninitialized' \| 'pending' \| 'fulfilled' \| 'rejected'` | 요청의 현재 **상태**를 나타내는 열거형 값이다.                                                                                                                                               |
| **`refetch`**     | `() => Promise<QueryActionCreatorResult<T>>`                | **수동으로** 해당 쿼리를 **다시 실행**하도록 트리거하는 함수다.                                                                                                                              |
| **`currentData`** | `T`                                                         | 현재 캐시에 존재하는 **최신 데이터**다. `isFetching` 중일 때 (새 데이터를 가져오는 중), 이 값은 **이전 데이터**를 유지한다.                                                                  |

컴포넌트는 요청 상태가 변경되거나 응답 데이터가 사용 가능해지면 리렌더링이 일어난다.

</br>

## `isLoading`과 `isFetching`의 차이 (핵심 구분)

<!--  -->

`RTK Query`에서 캐시된 데이터가 있을 때와 없을 때의 상태를 구분하기 위해 `isLoading`과 `isFetching` 두 가지 프로퍼티를 사용하는데 두 프로퍼티의 차이를 이해하는 것이 중요하다.

| 특징            | `isLoading` (데이터 없음)                                                                                        | `isFetching` (모든 요청)                                                                                                                                                     |
| :-------------- | :--------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **정의**        | 현재 캐시에 유효한 데이터가 **없어서** 초기 또는 강제 요청을 수행 중인 상태.                                     | 현재 백그라운드에서 **어떤 종류의 데이터 요청이든** 활발하게 수행 중인 상태.                                                                                                 |
| **발생 시점**   | 1. 쿼리 훅 컴포넌트가 **처음 마운트**되었을 때. <br> 2. 이전 데이터가 **만료**되거나 **캐시에서 제거**되었을 때. | 1. `isLoading`이 `true`일 때. <br> 2. 캐시 데이터가 있지만, **백그라운드에서 재검증**(`refetchOnFocus`, `refetchOnReconnect`) 중일 때. <br> 3. **수동 `refetch()`** 호출 시. |
| **`data` 상태** | 보통 **`undefined`**                                                                                             | **유효한 이전 데이터**를 포함할 수 있다 (`currentData`와 동일).                                                                                                              |
| **UI 활용**     | 전체 화면을 덮는 **로딩 스켈레톤** 또는 스피너를 보여줄 때 사용.                                                 | 이미 데이터를 보여주면서, 작은 **업데이트 인디케이터**나 알림을 표시할 때 사용.                                                                                              |
| **포괄 관계**   | `isLoading`이 `true`이면, **항상** `isFetching`도 `true`다.                                                      | `isFetching`이 `true`일 때, `isLoading`은 `true`일 수도 있고, `false`일 수도 있다.                                                                                           |

`isLoading`

"데이터가 없어서" 처음으로 또는 강제로 새로 요청하는 경우다. 이때는 화면에 스켈레톤(Skeleton) 또는 로딩 스피너를 보여주는 것이 일반적이다. data는 보통 undefined다.

`isFetching`

모든 활성 요청에 대해 true다. 초기 로딩 시 (`isLoading`이 `true`일 때) 당연히 `true`다.
캐시된 데이터가 이미 존재하는 상황에서, 사용자의 재접속(`refetchOnReconnect`), 포커스(`refetchOnFocus`), 또는 수동 `refetch()`로 백그라운드에서 재요청이 일어날 때도 `true`다.

이때는 이미 **이전 데이터(data 또는 currentData)** 를 보여주고, 작은 업데이트 알림이나 인디케이터를 표시하는 것이 좋다.

예를 들면 `isLoading`은 처음 로드할 때 스켈레톤을 표시하는 데 사용할 수 있고, `isFetching`은 1페이지에서 2페이지로 전환하거나 데이터가 무효화되어 다시 가져올 때 이전 데이터를 회색으로 표시하는 데 사용할 수 있다.

## 쿼리 훅에 인수 전달해 호출하기

`RTK Query`는 엔드포인트 + 인수 조합에 대해 각각의 캐시 키를 생성하고, 그 결과를 개별적으로 저장한다. 즉, 동일한 쿼리 훅에 서로 다른 매개변수를 사용했을 경우 개별적으로 캐시되는 것이다.

만약 여러 컴포넌트에서 동일한 데이터가 필요한 경우 각 컴포넌트에서 동일한 인수의 쿼리 훅을 호출하기만 하면 된다. 그럼 `RTK Query`는 데이터를 한 번만 가져오고 나머지는 캐시된 데이터를 사용하여 불필요한 쿼리를 줄이고 결과 값에 따라 컴포넌트는 알아서 리렌더링 될 것이다.

또한 쿼리 매개 변수는 단일 값이어야 한다. 여러 매개 변수를 전달해야 하는 경우 여러 필드가 포함된 객체를 전달해야 하는데 이때 `RTK Query`는 각 필드(프로퍼티)를 얕은 비교로 값을 비교하고, 값이 변경된 경우 리페치(re-fetch)를 수행한다.

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

## Reference

**[RTK Query using query]**

https://redux-toolkit.js.org/rtk-query/usage/queries

https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics
