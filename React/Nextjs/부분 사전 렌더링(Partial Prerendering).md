- [정적 렌더링과 동적 렌더링](#정적-렌더링과-동적-렌더링)
- [동적 페이지 정적 페이지로 만들기](#동적-페이지-정적-페이지로-만들기)
- [부분 사전 렌더링](#부분-사전-렌더링)
- [정적 증분 재생?(Increamental static regeneration)](#정적-증분-재생increamental-static-regeneration)

# 정적 렌더링과 동적 렌더링

<!--  -->

- 정적 렌더링 -> 빌드 타임에 렌더링 수행. 데이터가 자주 바뀌지 않고, 개인화된 페이지가 아닌 페이지를 렌더링할 때 유용. 미리 렌더링된 페이지를 응답하는 것이므로 동적 렌더링보다 빠름.

- 동적 렌더링 -> 서버에 페이지 요청 시 렌더링 수행. 데이터가 동적으로 자주 변경되는 개인화된 페이지에 유용(ex) 쇼핑 카트)

Nextjs의 페이지는 기본적으로 정적 렌더링 된다.

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
