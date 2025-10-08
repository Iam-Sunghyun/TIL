<h2>목차</h2>

- [`params` `prop`으로 동적 세그먼트(경로 매개변수) 사용하기](#params-prop으로-동적-세그먼트경로-매개변수-사용하기)
- [`searchParams` `prop`으로 쿼리 스트링 사용하기](#searchparams-prop으로-쿼리-스트링-사용하기)
- [동적 메타데이터 사용하기](#동적-메타데이터-사용하기)
- [`error.js` 파일로 에러 처리하기](#errorjs-파일로-에러-처리하기)
- [`not-found.js` 파일로 404 에러 처리하기](#not-foundjs-파일로-404-에러-처리하기)

# `params` `prop`으로 동적 세그먼트(경로 매개변수) 사용하기

다음과 같이 `[]`로 감싼 이름의 디렉토리를 생성하면 해당 페이지 `props`의 `params` 프로퍼티를 통해 값을 참조할 수 있다.

```
          Example	                         URL	            params
app/shop/[slug]/page.js  ->             /shop/1  ->     { slug: '1' }
app/shop/[category]/[item]/page.js  ->  /shop/1/2  -> 	{ category: '1', item: '2' }
app/shop/[...slug]/page.js  -> 	        /shop/1/2  ->	  { slug: ['1', '2'] }
---------------------------
// app/shop/[slug]/page.js  -> /shop/1
function page({ params }) {
  console.log(params);
  return <div></div>;
}

export default page;
-> { slug: '1' }
```

# `searchParams` `prop`으로 쿼리 스트링 사용하기

```
  URL	                searchParams
/shop?a=1	 ->      { a: '1' }
/shop?a=1&b=2  ->  { a: '1', b: '2' }
/shop?a=1&a=2  ->  { a: ['1', '2'] }
```

`layout.js`의 경우 **페이지 네비게이션이 일어나도 리렌더링되지 않아 오래된 쿼리 스트링이 전달 될 수 있기 때문에 `searchParams`를 받지 않는다.**(부분 렌더링)

<!-- params도 마찬가지여야 되는거 아닌가? -->

**[Nextjs dynamic-routes]**

https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

# 동적 메타데이터 사용하기

`generateMetadata` 이름의 함수를 정의하여 메타데이터를 동적으로 설정할 수 있다. 이때 `async` 함수로 정의하여 필요한 데이터를 페치 후 메타데이터를 설정해줄 수 있다.

또한 `generateMetadata` 함수는 첫 번째 매개변수로 받는 객체의 `params`, `searchParams` 프로퍼티를 통해 경로 매개변수, 쿼리 스트링을 참조할 수도 있다.

```
export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinsId);

  return { title: `The Wild Oasis | ${name}` };
}
```

**[Nextjs Metadata Object and generateMetadata Options]**

https://nextjs.org/docs/app/api-reference/functions/generate-metadata

# `error.js` 파일로 에러 처리하기

루트 디렉토리에 `error.js` 파일 정의하여 전역 에러 표시기를 설정할 수 있다.

`error.js` 파일은 반드시 클라이언트 컴포넌트이어야 한다.

```
"use client"; // 클라이언트 컴포넌트로 설정

export default function Error({ error, reset }) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <button
        onClick={() => reset()}
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
      >
        Try again
      </button>
    </main>
  );
}
```

<!--  -->

`error.js`의 `Error` 컴포넌트는 `error`, `reset` 프로퍼티를 매개변수로 받으며 `reset` 호출 시 에러가 발생했던 작업을 재시도한다.

추가로 `error.js`의 에러 컴포넌트는 렌더링시 발생한 에러에 대해서만 출력되며 `app/error.js`는 `/app/layout.js`나 `/app/template.js` 컴포넌트에서 발생한 오류를 포착하지 않는다.

루트 레이아웃 컴포넌트를 포함하여 렌더링 에러를 캐치하려면 `app/global-error.js` 이름으로 루트 디렉토리에 정의해주면 된다. 이때 `app/global-error.js`은 루트 레이아웃을 대체하여 렌더링되며 `<html>`과 `<body>`를 포함해야 한다.

# `not-found.js` 파일로 404 에러 처리하기

`not-found.js` 이름의 파일을 정의하여 정의되지 않은 라우트에 대한 에러를 렌더링할 수 있다.

또한 `next/navigation`의 `notFound` 함수를 호출하여 명시적으로 `not-found.js`를 렌더링하게 할 수도 있다.

```
import { notFound } from 'next/navigation'

async function fetchUser(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const user = await fetchUser(params.id)

  if (!user) {
    notFound()
  }

  // ...
}
```

**[Nextjs Error Handling]**

https://nextjs.org/docs/app/building-your-application/routing/error-handling

https://nextjs.org/docs/app/api-reference/functions/not-found
