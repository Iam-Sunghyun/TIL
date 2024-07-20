<h2>목차</h2>

- [width, height, margin, padding에 임의의 값(Arbitrary values) 설정하기](#width-height-margin-padding-arbitrary-values-)
- [미디어 쿼리로 반응형 웹 디자인하기](#-)
  - [미디어 쿼리 중단점 설정 참고](#--1)
- [자식 요소 사이 margin 설정하기(Space between)](#-margin-space-between)
  - [`flexbox`, `grid` 자식 요소 사이에 여백(margin) 설정하기](#flexbox-grid-margin-)
- [`flexbox`로 화면 height 꽉 채우기](#flexbox-height-)
- [`grid`로 화면 height 꽉 채우기](#grid-height-)
- [@apply 지시어로 재사용 유틸리티 스타일 지정하기](#apply-)
- [사용자 정의 기본 `font-family` 설정 값 변경하기](#-font-family-)
- [`divide`로 자식 요소 테두리(border) 설정하기](#divide-border-)
  - [자식 요소 순서가 바뀐 경우](#--2)

# width, height, margin, padding에 임의의 값(Arbitrary values) 설정하기

TailwindCSS의 정해진 값을 사용해줄 수도 있지만 다음과 같이 대괄호(`[]`)로 원하는 속성 접두사에 임의의 값을 지정해 줄 수도 있다(이 규칙은 width, height, margin, padding에만 한정된 것이 아니다).

```
<div class="m-[5px]">
  <!-- ... -->
</div>
```

# 미디어 쿼리로 반응형 웹 디자인하기

TailwindCSS에서 미디어 쿼리의 중단점(breakpoint)는 `sm`, `md`, `lg`, `xl`, `2xl`로 5가지로 모바일 우선 디자인을 염두하여 만들어져 있고 가장 일반적으로 사용되는 화면 해상도를 기준으로 나누어져 있다.

미디어 쿼리를 모든 기기에서 적용되게 하기 위해선 뷰포트 메타 태그를 추가해줘야 한다(HTML 보일러 플레이트에 기본으로 포함되어 있음).

```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

그런 다음 유틸리티를 추가하지만 특정 중단점에서만 적용되도록 하려면 유틸리티 앞에 중단점 이름을 접두사로 붙이고 그 뒤에 세미콜론을 붙이면 된다.

```
<img class="w-16 md:w-32 lg:w-48" src="...">
----------------
// => 768px 이상부터 적용
@media (min-width: 768px) {
    .md\:w-32 {
        width: 8rem /* 128px */;
    }
}
```

## 미디어 쿼리 중단점 설정 참고

실제 프로젝트에 미디어 쿼리를 적용할 경우 특정 장치를 기준으로 하기보다 웹 사이트 디자인이 망가지는 지점에 중단점을 두는 것이 더 적절하다.

이를 위해 다음과 같이 `tailwind.config.js` 파일에 `theme.screens` 프로퍼티를 통해 사용자 정의 중단점을 지정할 수 있다. 더 자세한 것은 링크 참조.

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
-----------------------
<div class="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
  <!-- ... -->
</div>
```

**[사용자 정의 중단점 설명서]**

https://tailwindcss.com/docs/screens

**[tailwindCSS responsive-design]**

https://tailwindcss.com/docs/responsive-design

# 자식 요소 사이 margin 설정하기(Space between)

자식 요소 사이에 적절한 공간을 설정하기 위한 속성으로는 `space-*-*`가 있다.

수평 요소 간에 공간을 설정하기 위해선 `space-x-*`를, 수직 요소 간에 공간은 `space-y-*`를 설정해주면 된다.

```
// x축 요소간 공간
<div class="flex space-x-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
----------------
// y축 요소간 공간
<div class="flex flex-col space-y-4 ...">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## `flexbox`, `grid` 자식 요소 사이에 여백(margin) 설정하기

`gap`을 사용해 `flexbox`와 `grid` 자식 요소 간 간격을 설정할 수 있다.

```
gap-0	-> gap: 0px;
gap-x-0	-> column-gap: 0px;
gap-y-0 -> row-gap: 0px;
    .
    .
    .
```

**[TailwindCSS spacing space between, gap]**

https://tailwindcss.com/docs/space

https://tailwindcss.com/docs/gap

## 요소 텍스트 간격(`letter-spacing`) 설정하기

`tracking-*` 클래스로 요소의 텍스트 사이 간격을 설정할 수 있다.

```
<p class="tracking-tight ...">The quick brown fox ...</p>
<p class="tracking-normal ...">The quick brown fox ...</p>
<p class="tracking-wide ...">The quick brown fox ...</p>
```

# `flexbox`로 화면 height 꽉 채우기

```
    <div className="flex flex-col justify-between h-screen ">
      {isLoading && <Loader />}

      <Header />

      <div className="">
        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
------------------------
// =>
.flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100dvh;
}
```

# `grid`로 화면 height 꽉 채우기

```
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      {isLoading && <Loader />}

      <Header />

      <div className="">
        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
------------------
=>
 .grid {
    display: grid;
    height: 100dvh;
    grid-template-rows: auto 1fr auto;
}
```

# @apply 지시어로 재사용 유틸리티 스타일 지정하기

다음과 같이 재사용성이 높은 유틸리티 스타일을 전역 CSS파일에 추출하여 새롭게 정의하여 사용할 수 있다. 이 방식을 남용할 경우 클래스명에 대한 고민, CSS 파일과 전환 불필요, CSS파일 사이즈 커짐 등 TailwindCSS의 이점이 사라지게 되므로 필요한 곳에만 사용할 것.

더 나은 방법은 컴포넌트 자체를 재사용 가능하게 구성하여 사용하는 것!

```
// index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// 기존 유틸리티 클래스를 묶어서 새로운 클래스로 정의
@layer components {
  .btn-primary {
    @apply py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75;
  }
}
-------------------------
<button class="btn-primary">
  Save changes
</button>
```

**[@apply를 사용하여 클래스 추출]**

https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply

# 사용자 정의 기본 `font-family` 설정 값 변경하기

TailwindCSS가 제공하는 기본(`sans`, `serif`, `mono`) 폰트 패밀리 외에도 구글 폰트를 `<link>`로 로드하여 사용자 정의 폰트 패밀리 클래스로 명명하여 사용할 수 있다(폰트 패밀리 뿐아니라 다른 기존 유틸리티 클래스 값을 재정의할 수 있다).

로드된 구글 폰트를 `tailwind.config.js` 파일의 `theme.fontFamily` 프로퍼티에 넣어 기존 값을 수정할 수 있다. 이때 TailwindCSS 기본 폰트는 모두 덮어 씌워져 사라진다. 기존 설정 값들을 유지하면서 새 값을 정의하고 싶다면 `theme.extend`에 추가해주면 된다.

```
// index.html (폰트 명 Roboto Mono)
<link
      href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
----------------------
// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      pizza: 'Roboto Mono, monospace'
      // === ['Roboto Mono', 'monospace']
    },
    height: {
        screen: '100dvh'
    }
  }
}
----------------------
// 기존 설정 값 유지
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
      pizza: 'Roboto Mono, monospace'
      // === ['Roboto Mono', 'monospace']
    },
      colors: {
        test: #123456,
      }
    },
  },
  plugins: [],
};
----------------------
// 실제 사용 예시
<div className='font-pizza bg-test'>
    pizza font
</div>
```

만약 사용자 정의 폰트 패밀리를 `sans`로(TailwindCSS 기본 폰트중 우선 적용되는 폰트 패밀리) 지정하면 모든 폰트가 사용자가 정의한 폰트로 지정된다.

<!-- 이때 스페이스(공백) 같은 문자가 자동으로 이스케이프되지 않으므로 이런 경우 따옴표(`'`)로 묶어줘야 한다. -->

TailwindCSS의 기본 설정은 다음 링크에서 확인할 수 있다.

**[tailwindCSS config.full.js]**

https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js#L302

# `divide`로 자식 요소 테두리(border) 설정하기

`divide`는 자식 요소 간에 테두리를 설정할 수 있는 클래스이다.

```
// x축 방향(가로) 요소 사이마다 테두리 설정
<div class="grid grid-cols-3 divide-x">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```

## 자식 요소 순서가 바뀐 경우

요소가 역순으로 배열된 경우(예: `flex-row-reverse` 또는 ` flex-col-reverse`) `divide-x-reverse` 또는 ` divide-y-reverse` 유틸리티를 사용하여 자식 요소 사이에 올바르게 테두리가 설정되도록 해줘야 한다.

```
<div class="flex flex-col-reverse divide-y divide-y-reverse">
  <div>01</div>
  <div>02</div>
  <div>03</div>
</div>
```
