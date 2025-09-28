<h2>목차</h2>

- [`usePathname`으로 URL 참조하기](#usepathname으로-url-참조하기)
- [서버, 클라이언트 URL로 상태 공유하기](#서버-클라이언트-url로-상태-공유하기)
- [클라이언트 컴포넌트 안에 서버 컴포넌트 렌더링하기](#클라이언트-컴포넌트-안에-서버-컴포넌트-렌더링하기)
- [데이터 페칭 전략](#데이터-페칭-전략)
- [Context API로 클라이언트 컴포넌트에 상태 주입](#context-api로-클라이언트-컴포넌트에-상태-주입)
- [Route Handlers로 API 만들기](#route-handlers로-api-만들기)
  - [Route Handlers 동적 라우트 파라미터 사용하기](#route-handlers-동적-라우트-파라미터-사용하기)

# `usePathname`으로 URL 참조하기

클라이언트 컴포넌트에서만 사용 가능. 현재 URL의 경로를 읽어온다.

# 서버, 클라이언트 URL로 상태 공유하기

`nextjs`에서 서버, 클라이언트 컴포넌트 간에 상태를 공유하기 위한 권장되는 것으로는 URL로 전달하는 방법이 있다.

`page.js`에서 `searchParams` 매개변수로 현재 URL의 쿼리 스트링을 참조할 수 있다. `layout.js`의 경우 네비게이션이 일어나도 리렌더링되지 않기 때문에 `searchParams`를 사용할 수 없다.

```
// /cabins?capacity=small

export const metadata = {
  title: "Cabins",
};

export const revalidate = 0;

export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";
  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">Our Luxury Cabins</h1>
      <div className="flex justify-end mb-5">
        <Filter />
      </div>

      <Suspense fallback={<Loading />} key={filter}>
        <CabinList filter={filter} />
      </Suspense>
    </div>
  );
}
```

`URLSearchParams` web API 사용하여 쿼리 스트링을 업데이트 및 참조하여 컴포넌트간 상태를 주고 받을 수 있는데 이때 현재 URL을 가져와 값을 추가하거나, 삭제 등을 할 수 있지만 URL 자체를 변경시키진 않으므로 주의(navigate 하진 않는다).

URL 자체를 변경시키려면 `next/navigation`의 `useRouter` 훅을 사용해 네비게이션 해줘야 한다. `useRouter` 훅도 클라이언트 컴포넌트에서만 사용 가능하다.

```
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  const router = useRouter();     // 프로그래매틱 네비게이션을 위한 훅
  const pathname = usePathname(); // 현재 경로 가져오기

  const searchParams = useSearchParams(); // 현재 경로에서 쿼리 스트링 가져오기
  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleSubmit(filter) {
    const params = new URLSearchParams();
    params.set("capacity", filter); // 쿼리 스트링 설정
    router.replace(`${pathname}?${params}` , { scroll: false }); // 현재 History 스택 교체, 네비게이팅 시 스크롤 위치 고정
  }

  return (
    <div className="border border-primary-800 flex ">
      <Button filter="all" handleFilter={handleSubmit} activeFilter={activeFilter}>
        All cabins
      </Button>
      <Button filter="small" handleFilter={handleSubmit} activeFilter={activeFilter}>
        {" "}
        1 ~ 3 cabins
      </Button>
      <Button filter="medium" handleFilter={handleSubmit} activeFilter={activeFilter}>
        4 ~ 7 cabins
      </Button>
      <Button filter="large" handleFilter={handleSubmit} activeFilter={activeFilter}>
        8 ~ 12 cabins
      </Button>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`${
        filter === activeFilter ? "bg-primary-700" : ""
      } px-5 py-2 hover:bg-primary-700`}
    >
      {children}
    </button>
  );
}

export default Filter;
```

https://nextjs.org/docs/app/api-reference/functions/use-router

# 클라이언트 컴포넌트 안에 서버 컴포넌트 렌더링하기

<!-- ??????????  -->

클라이언트 컴포넌트에는 서버 컴포넌트 import 불가능. 클라이언트 측에선 서버 컴포넌트를 실행할 수 없기 때문.

하지만 서버 컴포넌트에 import된 클라이언트 컴포넌트의 children prop으로 서버 컴포넌트를 전달해주면 클라이언트 컴포넌트 내부에 서버 컴포넌트를 렌더링할 수 있다.

클라이언트 컴포넌트가 클라이언트에서 렌더링되기 전 서버에서 해당 서버 컴포넌트가 렌더링되기 때문에 가능.

# 데이터 페칭 전략

서스펜스로 로드가 느린 부분만 로딩 표시 해줄 수 있음. -> 로드 완료된 부분은 보여주고 느린 부분은 부분적으로 로딩 표시 가능

# Context API로 클라이언트 컴포넌트에 상태 주입

<!--  -->

# Route Handlers로 API 만들기

디렉토리에 `route.js` 파일을 생성하여 대응되는 메서드의 함수를 생성하여 API 정의 가능. 대신 `page.js` 파일과 같은 레벨에 공존할 수 없다. 같은 레벨 인 경우는 `api` 디렉토리를 생성하여 그 안에 만들어주면 된다.

GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS HTTP 메서드가 지원되며 지원되지 않은 메서드를 사용할 시 405 에러가 throw 된다.

```
// /app/api/route.js
export async function GET() {
  return Response.json({ test: "test" });
}
----------------------------
// http://localhost:3000/api
// 아래 값이 페이지에 출력됨
>> {"test":"test"}
```

## Route Handlers 동적 라우트 파라미터 사용하기

`route.js`에 정의한 라우트 핸들러 함수는 첫 번째 인수로 요청 객체를 받고, 두 번째 인수로 받는 객체로부터 `params`를 통해 경로 매개변수를 참조할 수 있다.

```
export async function GET(request, { params }) {
  const slug = params.slug // 'a', 'b', or 'c'
}
---------------------------------------
       Route                  URL          params
app/items/[slug]/route.js	/items/a	{ slug: 'a' }
app/items/[slug]/route.js	/items/b	{ slug: 'b' }
app/items/[slug]/route.js	/items/c	{ slug: 'c' }
```

**[Nextjs Route Handlers]**

https://nextjs.org/docs/app/building-your-application/routing/route-handlers
