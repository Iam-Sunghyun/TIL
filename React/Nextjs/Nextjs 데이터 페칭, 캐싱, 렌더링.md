<h2>목차</h2>

- [`params` `prop`으로 동적 세그먼트(경로 매개변수) 사용하기](#params-prop으로-동적-세그먼트경로-매개변수-사용하기)
- [`searchParams` `prop`으로 쿼리 스트링 사용하기](#searchparams-prop으로-쿼리-스트링-사용하기)
- [동적 메타데이터 사용하기](#동적-메타데이터-사용하기)
- [`error.js` 파일로 에러 처리하기](#errorjs-파일로-에러-처리하기)
- [`not-found.js` 파일로 404 에러 처리하기](#not-foundjs-파일로-404-에러-처리하기)
- [정적 렌더링과 동적 렌더링](#정적-렌더링과-동적-렌더링)
- [동적 페이지 정적 페이지로 만들기](#동적-페이지-정적-페이지로-만들기)
- [부분 사전 렌더링](#부분-사전-렌더링)
- [정적 증분 재생?(Increamental static regeneration)](#정적-증분-재생increamental-static-regeneration)
- [Next.js 가 데이터를 캐시하는 방법](#nextjs-가-데이터를-캐시하는-방법)
  - [서버 측 캐시](#서버-측-캐시)
    - [요청 메모이제이션](#요청-메모이제이션)
    - [데이터 캐시](#데이터-캐시)
    - [전체 라우트 캐시](#전체-라우트-캐시)
  - [클라이언트 측 캐시](#클라이언트-측-캐시)
    - [라우터 캐시](#라우터-캐시)

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

# 정적 렌더링과 동적 렌더링

<!--  -->

- 정적 렌더링 -> 빌드 타임에 렌더링 수행. 데이터가 자주 바뀌지 않고, 개인화된 페이지가 아닌 페이지를 렌더링할 때 유용. 미리 렌더링된 페이지를 응답하는 것이므로 동적 렌더링보다 빠름

- 동적 렌더링 -> 서버에 페이지 요청 시 렌더링 수행. 데이터가 동적으로 자주 변경되는 개인화된 페이지에 유용(ex) 쇼핑 카트)

Nextjs의 페이지는 기본적으로 정적 렌더링됨.

Vercel에 배포시 정적 렌더링 페이지는 자동으로 CDN에 호스팅됨. 동적 렌더링 페이지는 서버리스 함수가 됨.

웹 사이트 전체 페이지가 정적 페이지라면 static site로 export 될 수 있다(SSG).

다음과 같은 경우 Nextjs는 정적 페이지를 동적 페이지로 전환한다.

1. 특정 라우트에 동적 세그먼트(경로 매개변수)를 사용한 경우
2. page.js 컴포넌트에서 쿼리 스트링을 참조하는 경우
3. 서버 컴포넌트에서 `header()`나 `cookies()` 함수를 사용한 경우
4. 캐시되지 않은 데이터 요청이 서버 컴포넌트에 존재하는 경우

# 동적 페이지 정적 페이지로 만들기

<!-- 헷갈-->

`generateStaticParams`로 동적 페이지의 동적 URL(동적 세그먼트)에 가능한 값들을 Nextjs에게 알려주어 정적 페이지처럼 빌드 타임에 렌더링되게 만들 수 있다.

`generateStaticParams`는 반드시 객체 배열을 반환해야 하며 반환하는 배열의 각 요소 객체 프로퍼티가 개별 라우트의 동적 세그먼트의 값이 되어 빌드시 정적 페이지처럼 사전 렌더링 된다(응답 성능이 더 좋은듯).

```
  Example Route	                   generateStaticParams Return Type
/product/[id]	                       { id: string }[]
/products/[category]/[product]	     { category: string, product: string }[]
/products/[...slug]	                 { slug: string[] }[]
```

https://nextjs.org/docs/app/api-reference/functions/generate-static-params

# 부분 사전 렌더링

<!-- 헷갈 -->

부분 사전 렌더링(Partial Pre-Rendering)이란 정적 렌더링과 동적 렌더링의 장점을 합친 렌더링 방식이다.

정적 셸(Static shell)?

# 정적 증분 재생?(Increamental static regeneration)

<!--  -->

# Next.js 가 데이터를 캐시하는 방법

<!-- ?? -->

Nextjs 앱 라우터에서 캐싱은 기본적으로 실행된다.

Nextjs의 캐싱 메커니즘은 4가지가 있으며 프로덕션 상태일 때 일어난다(개발 모드에선 no).

## 서버 측 캐시

### 요청 메모이제이션

- 동일한 `fetch` GET 요청을 캐시(동일 URL, 옵션).
- 여러 컴포넌트에서 동일한 요청 시 캐시되어 한번만 요청함.
- 상위 컴포넌트에서 요청하여 `prop`으로 내려줄 필요 없이 각 컴포넌트에서 동일한 요청을 하면됨.
- 캐시 재검증할 수 없으며 요청은 `AbortController`로 취소할 수 있다.

### 데이터 캐시

- 단일 페치 요청에서 페치된 모든 데이터를 캐싱.
- 캐시를 업데이트 하지 않는 이상 영구적으로 저장됨. 즉, 앱이 재배포 되어도 캐시된 데이터는 남아있다.
<!-- ? -->
- 정적인 페이지를 위한 데이터, 데이터 재검증 시 ISR?(빌드 후 정적 페이지 업데이트/?)
- `fetch`시 `next.revalidate` 옵션을 설정하여 일정 시간이 지나면 다시 특정 데이터를 `fetch` 하도록 만들 수 있다(시간 기반 재검증).
- 이벤트(ex) 폼 제출)에 따라 데이터 재검증(주문형 재검증). 태그, 경로 기반 재검증 가능
- 매번 새롭게 페치하려면 `page.js`에서 `export const revalidate = 0` 설정해주면 된다.

### 전체 라우트 캐시

- 정적 페이지 전체(HTML, RSC payload) 캐시. 데이터 캐시가 유효하지 않게 될 때 까지(데이터 캐시가 재검증 될 때까지 혹은 앱이 재배포되기 전까지) 지속됨
- 정적 페이지에서 가능.
- 데이터 캐시가 재검증 되는 경우에 재검증 일어남.
- 정적 사이트에서 유용(블로그 등)

## 클라이언트 측 캐시

### 라우터 캐시

- 사전 페치됐거나 사용자가 방문했던 정적, 동적 페이지 캐시.
- 싱글 페이지 애플리케이션같은 페이지 전환 가능.
- 동적 페이지라면 30초, 정적 페이지라면 5분 지속됨.

**[Caching in Next.js]**

https://nextjs.org/docs/app/building-your-application/caching
