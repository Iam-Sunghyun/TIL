<h2>목차</h2>

- [React Query란?](#react-query)
- [React-query 시작하기](#react-query-)
  - [React-query 설치](#react-query-)
  - [react-query-devtools 설치 및 제공](#react-query-devtools---)
  - [React-query 클라이언트 생성 및 제공](#react-query----)
- [`useQuery` 훅으로 supabase 데이터 fetching 하기](#usequery--supabase--fetching-)
  - [`useQuery` 결과 객체 상태 및 데이터](#usequery-----)
- [`useMutation` 훅으로 supabase 서버 상태 수정하기](#usemutation--supabase---)
  - [상태 변이 성공 후 캐시 무효화하여 리페치하기](#------)
- [`react-hot-toast`로 토스트 메시지 띄우기](#react-hot-toast---)
  - [사용법](#)
- [`react-hook-form` 사용하여 데이터 생성하기](#react-hook-form---)
  - [`useForm` 훅](#useform-)
  - [폼 요소에 `register` 전달](#--register-)
  - [`Form` 요소에 `handleSubmit` 핸들러 등록](#form--handlesubmit--)
  - [`reset` 함수로 폼 요소 리셋하기](#reset----)

# React Query란?

리액트 쿼리란 원격 상태(서버 상태)를 관리하기 위한 써드 파티 라이브러리로(비슷한 라이브러리로는 SWR, Redux Toolkit Query가 있다) 서버 상태를 페칭, 캐싱, 동기화, 업데이트하는 작업을 쉽게 만들어준다.

리액트 쿼리의 주요 특징은 다음과 같다.

- **Auto Caching, Refetching**

리액트 쿼리를 사용하면 **모든 원격 상태가 기본적으로 자동 캐싱된다**. 즉, 한번 fetch된 데이터를 저장 후 재사용하여 동일한 데이터에 대해 중복 요청을 없게 해준다. 또한 캐시된 데이터로 사용자에게 즉각적인 응답을 가능하게 한다.

또한 **일정 시간이 지났거나 브라우저를 종료 후 다시 킨 경우, 혹은 브라우저 포커스가 사라졌다 돌아온 경우와 같은 상황에 데이터를 자동으로 re-fetching 하여 서버 상태와 동기화** 한다.

이로서 사용자가 오프라인일 때도 캐시된 데이터를 기반으로 웹 사이트를 표시할 수도 있게 된다.

- **Prefetching**

데이터를 화면에 출력하기 전에 미리 fetching 하는 기능이다. 대표적으로 페이지네이션을 구현할 때 모든 페이지의 데이터를 미리 가져오는 경우를 예로 들 수 있다.

- 쉬운 원격 상태 변경

리액트 쿼리에 내장된 기능들로 서버 상태를 업데이트하거나 변경하는 것이 간단하다.

그 외에 다양한 기능은 링크 참조.

**[Npm React-query]**

https://www.npmjs.com/package/@tanstack/react-query

# React-query 시작하기

## React-query 설치

리액트 쿼리 4 버전은 리액트 v16.8+과 호환되며 CDN으로 로드할 수도 있다.

```
npm i @tanstack/react-query
```

## react-query-devtools 설치 및 제공

리액트 쿼리 추가 도구. 쿼리나 캐시를 확인할 수 있다.
리액트 쿼리와 메이저 버전이 동일해야 한다(SemVer => major.minor.patch).

```
npm i @tanstack/react-query-devtools@4
```

```
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## React-query 클라이언트 생성 및 제공

리액트 쿼리의 `QueryClient` 생성자에 옵션 객체를 전달하여 클라이언트 객체를 생성해준다. `queries` 옵션의 `staleTime`은 리액트 쿼리가 캐시한 데이터를 오래된 데이터로 간주하는 시간으로 리페치 주기를 설정하는 값이다.

`staleTime` 값을 설정하지 않으면 기본 값은 0이며 리액트 쿼리는 다음과 같은 경우에 자동 리페치를 수행한다.

- 쿼리가 있는 컴포넌트 인스턴스가 새롭게 마운트된 경우(새로고침 등)
- 웹 사이트 탭이 다시 포커스된 경우
- 네트워크가 다시 연결된 경우

```
// 리액트 쿼리 모듈 import
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// 리액트 쿼리 클라이언트 생성
// 리페치 시간 주기 => 1분
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    // 클라이언트 제공 하위 컴포넌트에서 리액트 쿼리 훅을 통해 쿼리할 수 있게 된다.
    <QueryClientProvider client={queryClient}>
        .
        .
        .
    </QueryClientProvider>
  )
}

function Todos() {
  // 클라이언트 참조
  const queryClient = useQueryClient()

  // 쿼리
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // 데이터 변경
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // 데이터 변경 성공시 무효화 할 쿼리 데이터 -> 리페치 수행함
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <ul>{query.data?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```

# `useQuery` 훅으로 supabase 데이터 fetching 하기

서버에 데이터를 페치(GET)하기 위해선 리액트 쿼리의 `useQuery` 훅을 사용한다. `useQuery` 훅을 호출할 때 객체를 인수로 전달해줘야 하는데 전달하는 객체에 반드시 포함되어야 하는 프로퍼티는 다음과 같다.

- `queryKey` : 쿼리 결과 값을 식별할 고유 키(배열로 전달)
- `queryFn` : 쿼리를 수행하여 결과 데이터를 resolve 하거나 에러를 throw 하는 프로미스 반환 함수. 반환 값은 리액트 쿼리에 키와 함께 캐시된다

```
import { useQuery } from '@tanstack/react-query'

function CabinTable() {
  const { isLoading, data: cabins, error } = useQuery({ queryKey: ["cabins"], queryFn: getCabin });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Spinner />;
  }

  return (
    <Table role="table">
      <TableHeader role="row">
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </TableHeader>
      {cabins.map((cabin) => (
        <CabinRow
          key={cabin.id}
          id={cabin.id}
          image={cabin.image}
          cabin={cabin.name}
          price={cabin.regularPrice}
          discount={cabin.discount}
          maxCapacity={cabin.maxCapacity}
        />
      ))}
    </Table>
  );
}
export default CabinTable;
----------------------------
// getCabin.js
import supabase from "./supabase";

export async function getCabin() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("에러 발생"); // 에러 발생시 error throw
  }

  // 에러가 없을시 data를 resolve 프로미스 반환(async 함수 이므로)
  return data;
}
```

첫 번째 인수로 전달한 쿼리 키는 쿼리를 refetching 하고 캐싱하고 공유하기 위해, 또 캐시된 데이터를 식별하기 위해 내부적으로 사용된다.

`useQuery`가 반환하는 결과 객체에는 쿼리 결과가 포함 되어있으며 3가지 주요 상태(`isLoading`, `isError`, `isSuccess`)와 상태에 따른 값(`error`, `data`, `isFetching`)이 할당 되어있다.

```
const result = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })
```

## `useQuery` 결과 객체 상태 및 데이터

- `isLoading` 또는 `status === 'loading'` : 쿼리에 아직 데이터가 없는 상태
- `isError` 또는 `status === 'error'` : 쿼리에서 오류가 발생한 경우
- `isSuccess` 또는 `status === 'success'` : 쿼리가 성공했으며 데이터를 사용할 수 있는 상태

- `error` - 쿼리가 `isError` 상태인 경우 `error` 속성을 통해 오류를 사용할 수 있다
- `data` - 쿼리가 `isSuccess` 상태인 경우 `data` 속성을 통해 데이터를 사용할 수 있다
- `isFetching` - 어떤 상태에서든, 쿼리가 언제든지(백그라운드 재페칭 포함) 페칭 중이면 `isFetching`이 `true`가 된다

다음은 쿼리 결과에 따른 렌더링 컴포넌트를 결정하는 일반적인 예시이다.

```
function Todos() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  })

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // `isSuccess === true`인 경우 반환 되는 컴포넌트
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

# `useMutation` 훅으로 supabase 서버 상태 수정하기

<!-- 다음은 supabase 데이터 베이스의 `cabins` 테이블 데이터를 삭제하는 예시이다. -->
<!-- 수정 필 -->

`useMutation` 훅에 프로미스를 반환하는 비동기 처리 함수를 전달하여 서버 상태를 변경할 수 있다.

`useMutation` 훅이 반환하는 객체의 `mutate` 프로퍼티에 상태 변이 로직을 담은 함수가 할당되어 호출할 수 있다.

```
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
  })

  return (
    <div>
      {mutation.isLoading ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}
```

<!-- 수정 필 -->

`useMutation` 훅이 반환하는 객체는 다음 4가지 주요 상태 중 하나의 상태를 갖는다.

- `isIdle` 또는 `status === 'idle'` - 뮤테이션이 현재 유휴 상태이거나 새로 고침/재설정 상태
- `isLoading` 또는 `status === 'loading'` - 뮤테이션이 현재 실행 중인 상태
- `isError` 또는 `status === 'error'` - 뮤테이션에서 오류가 발생한 상태
- `isSuccess` 또는 `status === 'success'` - 뮤테이션이 성공했으며 뮤테이션 데이터를 사용할 수 있는 상태

또한 상태에 따라 다음 주요 값들이 할당된다.

- `error` - `mutation` 객체의 `status` 프로퍼티가 `error인` 경우, `error` 속성을 통해 에러 객체를 참조할 수 있다.
- `data` - `mutation` 객체의 `status` 프로퍼티가 `success인` 경우, 데이터는 `data` 속성을 통해 참조할 수 있다.

## 상태 변이 성공 후 캐시 무효화하여 리페치하기

<!-- 복습필 -->

`useMutation` 훅에 전달하는 객체의 `onSuccess` 프로퍼티에 상태 변이 성공 후 캐시 무효화(리페치) 할 쿼리를 설정할 수 있다.

캐시 무효화시 리액트 쿼리는 자동으로 데이터 리페치를 수행한다. `useQueryClient` 훅을 사용해 리액트 쿼리 클라이언트 객체를 참조하여 `useMutation` 훅에 전달할 객체의 `onSuccess` 프로퍼티에 `queryClient.invalidateQueries` 함수와 함께 쿼리 키를 전달하여 변이 성공 후 무효화할 캐시 데이터를 명시해줄 수 있다.

또한 `useMutation` 훅 호출시 전달하는 인수 객체의 `onError` 프로퍼티에 상태 변이 중 발생한 에러를 처리할 에러 핸들러를 지정할 수 있다.

```
function CabinRow({ id: cabinId, image, cabin, price, discount, maxCapacity }) {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: deleteCabin,
    onSuccess: (result) => {
      alert("cabin successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],   // cabins 키의 쿼리 데이터는 무효화 됨
      });
    },
    onError: (err) => alert(err.message),
  });

  return (
    <TableRow role="row">
      <Img src={image} />
      <Cabin>{cabin}</Cabin>
      <p>
        최대 <b>{maxCapacity}</b> 명
      </p>
      <Price>{formatCurrency(price)}$</Price>
      <Discount>{formatCurrency(discount)}$</Discount>
      <button onClick={() => mutate(cabinId)} disabled={isDeleting}>
        삭제
      </button>
    </TableRow>
  );
}
export default CabinRow;
```

# `react-hot-toast`로 토스트 메시지 띄우기

`react-hot-toast` 라이브러리를 사용하여 토스트 메시지를 간단하게 구현할 수 있다.

```
npm i react-hot-toast
```

## 사용법

토스터 스타일링, 위치 지정과 같은 것들은 공식 문서 참조할 것.

```
import toast, { Toaster } from 'react-hot-toast';

// 토스트 메시지
const notify = () => toast('Here is your toast.');

const App = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster position="top-center"/>
    </div>
  );
};
```

# `react-query`와 `react-hook-form`로 새 데이터 생성하기

`Form` 사용을 단순화하기 위한 라이브러리로 `react-hook-form`을 사용한다.

`react-hook-form`을 사용하면 리렌더링 횟수를 최소화하고(제어 컴포넌트 자식 요소 리렌더링 방지), 유효성 검사 계산 또한 최소화 할 수 있으며 컴포넌트 마운팅 속도를 높일 수 있다.

```
npm i react-hook-form
```

## `useForm` 훅

`react-hook-form`의 `useForm`은 폼을 쉽게 관리하기 위한 사용자 지정 훅이다. 하나의 객체를 선택적 인수로 사용한다.

전달할 수 있는 속성과 반환 값에 대한 모든 것은 링크 참조.

<!-- 반환값? -->

`useForm` 훅이 반환하는 값 중 사용되는 주요 객체는 `register`, `handleSubmit` 함수 이다.

```
const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true });
```

## 폼 요소에 `register` 전달

<!-- 헷갈 -->

폼 요소에 기본적인 props과 유효성 검사 로직을 등록하기 위해 사용하며
반환 값은 다음과 같다.

- `onChange`
- `onBlur`
- `ref`
- `name`

```
const { onChange, onBlur, name, ref } = register('firstName');
// include type check against field path with the name you have supplied.

<input
  onChange={onChange} // assign onChange event
  onBlur={onBlur} // assign onBlur event
  name={name} // assign name prop
  ref={ref} // assign ref prop
/>
// same as above
<input {...register('firstName')} />
```

## `Form` 요소에 `handleSubmit` 핸들러 등록

<!-- 수정필 -->

폼이 submit 되면 폼 데이터와 이벤트 객체를 수신하여 호출되는 함수. `handleSubmit`로 submit 핸들러 함수를 등록하므로서 폼 데이터를 따로 저장하지 않고도 수신할 수 있게 된다.

```
const onSubmit = async () => {
  // async request which may result error
  try {
    // await fetch()
  } catch (e) {
    // handle your error
  }
};

<form onSubmit={handleSubmit(onSubmit)} />
--------------------------------
// 동기 함수 전달
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit } = useForm();
  // 폼 data와 이벤트 객체e를 수신
  const onSubmit = (data, e) => console.log(data, e);
  const onError = (errors, e) => console.log(errors, e);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <button type="submit">Submit</button>
    </form>
  );
}
---------------------------------
// 비동기 함수 전달
function CreateCabinForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    // 성공 시 핸들러
    onSuccess: () => {
      // react-hot-toast
      toast.success("숙소 등록 성공");
      // cabins 키의 쿼리 리페치를 위한 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    // mutation 실패 시 에러 핸들러
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // 폼 데이터, 이벤트 객체 수신
  function onSubmit(data, e) {
    mutate(data);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input type="text" id="name" {...register("name")} />
      </FormRow>
          .
          .
          .
    </Form>
  );
}
----------------------------------------
export async function createCabin(newCabin) {
  const { data, error } = await supabase.from("cabins").insert([newCabin]);

  if (error) {
    console.log(error);
    throw new Error("숙소를 추가하는데 실패 했습니다.");
  }
  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("삭제할 수 없습니다.");
  }
}
```

## `reset` 함수로 폼 요소 리셋하기

리액트 훅 폼의 `useForm` 훅이 반환하는 `reset` 함수를 호출하여 폼 요소 상태를 간단히 리셋해줄 수 있다.

```
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("숙소 등록 성공");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
```

**[React Hooks - useForm]**

https://www.react-hook-form.com/api/useform/

**[tanstack-query - useMutation]**

https://tanstack.com/query/v5/docs/framework/react/reference/useMutation

**[tanstack query - queries]**

https://tanstack.com/query/v4/docs/framework/react/guides/queries

https://tanstack.com/query/v5/docs/framework/react/reference/useQueries

**[react-hot-toast]**

https://react-hot-toast.com/docs
