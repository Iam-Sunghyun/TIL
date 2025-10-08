<h2>목차</h2>

- [프로젝트 생성](#프로젝트-생성)
- [페이지 라우팅](#페이지-라우팅)
- [페이지 간 네비게이션](#페이지-간-네비게이션)
- [루트 레이아웃 정의하기](#루트-레이아웃-정의하기)
- [페이지 메타데이터 정의하기](#페이지-메타데이터-정의하기)
  - [파비콘 설정하기](#파비콘-설정하기)
- [Nextjs 네이밍 컨벤션으로 개인 폴더 만들기(라우트 생성 제외시키기)](#nextjs-네이밍-컨벤션으로-개인-폴더-만들기라우트-생성-제외시키기)
- [폰트 추가하기](#폰트-추가하기)
- [`<Image />` 태그로 이미지 최적화](#image--태그로-이미지-최적화)
  - [로컬 이미지 가져오기](#로컬-이미지-가져오기)
  - [외부 이미지 가져오기](#외부-이미지-가져오기)
  - [`<Image />` fill 속성 사용하기](#image--fill-속성-사용하기)

# 프로젝트 생성

```
npx create-next-app@latest
-----------------------
// nextjs 프로젝트 버전 업
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

# 페이지 라우팅

`nextjs` 앱에선 **디렉토리 경로 기반으로 라우트가 자동 생성되며** 몇 가지 파일 명 컨벤션을 따른다(링크 참조). 다음 예시는 `/cabins/test` 경로로 매칭되는 페이지 디렉토리 구조이다.

```
/cabins/test
->
app
  └─cabins
      └─test
          └─page.js
```

위 구조의 디렉토리는 `/cabins/test` 라우트를 자동으로 생성하며 해당 경로로 요청했을 때 `page.js` 파일의 내용이 응답된다. 이때 **`page.js`의 컴포넌트는 반드시 `export default`로 내보내져야 한다.**

만약 같은 폴더에 `layout.js`와 `page.js`가 정의된 경우 `layout.js`가 `page.js`를 래핑한다(`layout.js`의 `children` 위치에 렌더링).

**[Nextjs app routing convention]**

https://nextjs.org/docs/getting-started/project-structure#app-routing-conventions

# 페이지 간 네비게이션

`<a href>` 태그를 이용하면 페이지 새로고침이 발생한다.

이를 방지하기 위해 **`nextjs`의 `next/link`를 사용하면 라우트 프리페칭을 통해 SPA처럼 부드러운 페이지 전환이 가능**하다(리액트 라우터에도 `<Link to="">` 컴포넌트가 있었다).

<!-- 라우트 프리페칭? -> 라우트 방문 전 라우트 컴포넌트를 미리 가져오는 것 -->

이 외에도 라우트 간에 네비게이션 하는 방법은 3가지 방법이 더 있으며 라우팅 및 네비게이션 동작 방식에 대한 내용은 링크 참조.

```
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Next!!!!!!wqe</h1>
      <Link href="/cabins">to Cabin</Link>
    </div>
  );
}
```

**[Nextjs Linking and Navigating]**

https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating

# 루트 레이아웃 정의하기

최상위 경로의 `layout.js` 파일에 `RootLayout` 이름으로 정의한다.
**모든 라우트를 래핑하는 레이아웃이며 `HTML`, `body` 태그를 포함해야한다.**

`children` 위치에는 현재 라우트와 매칭되는 `page.js`가 렌더링 된다(리액트 라우터 `<Outlet>`과 비슷한 컨셉).

```
// /app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

# 페이지 메타데이터 정의하기

<!-- 수정필 SEO 최적화...-->

페이지 `<Head>` 태그 내부에 메타 데이터를 정의하는 방법으로는 2 가지가 있다.

- 1. Config-based Metadata

  - 정적 메타 데이터 -> `layout.js` 나 `page.js` 파일에 `metadata` 이름으로 객체 정의하여 `export` 해준다.

```
export const metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

- 동적 메타 데이터 -> `generateMetadata` 함수 이용

```
export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const id = params.id

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }) {}
```

- 2. File-based Metadata
  <!-- 홈페이지 참조 -->

## 파비콘 설정하기

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

**[Nextjs docs Metadata]**

https://nextjs.org/docs/app/building-your-application/optimizing/metadata

# Nextjs 네이밍 컨벤션으로 개인 폴더 만들기(라우트 생성 제외시키기)

폴더 명 맨 앞에 '\_'를 추가하여 라우트 생성을 제외시킬 수 있다.

```
/cabins/test
->
app
  └─_components
      └─Counter.js
```

**[Nextjs docs project structure]**

https://nextjs.org/docs/getting-started/project-structure

# 폰트 추가하기

Nextjs는 모든 구글 폰트를 호스팅함. 별도의 다운이나 요청 없이도 사용 가능. `next/font/google`에서 글꼴을 가져와 함수처럼 호출해 사용할 수 있다.

이때 하위 집합으로 `subsets` 프로퍼티를 반드시 지정해줘야 한다.

```
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

**[Nextjs fonts]**

https://nextjs.org/docs/app/building-your-application/optimizing/fonts

# `<Image />` 태그로 이미지 최적화

이미지는 보통 크기가 크기 떄문에 웹 사이트 LCP에 중요한 영향을 끼치는 요소이며 최적화가 매우 중요.

`<Image />` 태그는 HTML `<img>` 태그를 확장한 태그로 다음과 같은 특징이 있다.

- 크기 최적화: WebP 및 AVIF와 같은 최신 이미지 형식을 사용하여 각 장치에 맞게 올바른 크기의 이미지를 자동으로 제공합니다.
- 시각적 안정성: 이미지가 로딩될 때 레이아웃이 자동으로 전환되는 것을 방지합니다 .
- 더 빠른 페이지 로드: 이미지는 기본 브라우저의 지연 로딩을 사용하여 뷰포트에 들어올 때만 로드되며, 선택적으로 블러 업 플레이스홀더가 사용됩니다.
- 에셋 유연성: 원격 서버에 저장된 이미지에 대해서도 주문형 이미지 크기 조정 가능

```
LCP => largest contentful paint, 최대 콘텐츠 렌더링 시간: 사용자가 URL을 요청한 시점부터 표시 영역에 가장 큰 시각 콘텐츠 요소를 렌더링하는 데 걸린 시간
```

## 로컬 이미지 가져오기

`<Image />` 태그를 이용해 로컬 이미지를 가져오는 방법은 2 가지가 있다. 이때 `src`, `width`, `height`, `alt` 속성을 반드시 지정해줘야 한다.

```
# 방법 1
import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image src="/logo.png" height="60" width="60" alt="The Wild Oasis logo" />
      <span className="text-3xl font-semibold text-primary-100">Hotel Booking</span>
    </Link>
  );
}

export default Logo;
-----------------------------------
# 방법 2 -> 이 방법의 경우 height, width를 지정하지 않아도 에러 발생 no
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image src={logo} height="60" width="60" alt="The Wild Oasis logo" />
      <span className="text-3xl font-semibold text-primary-100">Hotel Booking</span>
    </Link>
  );
}

export default Logo;
```

## 외부 이미지 가져오기

원격 이미지를 사용하려면 `src` 속성이 URL 이면 된다.

```
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

그 후 `next.config.js` 파일에 이미지를 가져올 경로를 추가해줘야 한다.

```
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
}
----------------------------
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
};

export default nextConfig;
```

## `<Image />` fill 속성 사용하기

Next.js의 `<Image fill>` 속성은 position이 static이 아닌 부모 요소를 기준으로 `{ position: absolute; width: 100%; height: 100%; }`을 적용해 이미지를 채운다.

이때 모든 조상 요소가 static이면 Image 컴포넌트 크기가 뷰포트 기준이 될 수 있다.

따라서 적절한 부모 위치에 relative, absolute, fixed와 같은 값을 사용해줘야 한다

**[Nextjs Image Optimization]**

https://nextjs.org/docs/app/building-your-application/optimizing/images

**[Nextjs Image API]**

https://nextjs.org/docs/app/api-reference/components/image#priority

<!-- # 중첩 라우트 추가하기

폴더 중첩해서 생성하면 중첩 라우트 생성된다.

# 중첩 레이아웃 추가하기

중첩 라우트와 동일. `layout.js`와 `page.js`를 같은 위치에 생성하면 `layout.js`가 `page.js`를 래핑한다. -->
