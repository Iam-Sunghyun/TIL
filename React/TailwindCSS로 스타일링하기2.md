<h2>목차</h2>

- [미디어 쿼리로 반응형 웹 디자인하기](#-------------------)

# width, height, margin, padding에 임의의 값(Arbitrary values) 설정하기

TailwindCSS의 정해진 값을 사용해줄 수도 있지만 다음과 같이 대괄호(`[]`)로 원하는 속성 접두사에 임의의 값을 지정해 줄 수도 있다(이 규칙은 width, height, margin, padding에만 한정된 것이 아니다).

```
<div class="m-[5px]">
  <!-- ... -->
</div>
```


# 미디어 쿼리로 반응형 웹 디자인하기

TailwindCSS에서 미디어 쿼리의 중단점(breakpoint)는 `sm`, `md`, `lg`, `xl`, `2xl`로 5가지로 모바일 우선 디자인을 염두하여 만들어져 있고 가장 일반적으로 사용되는 화면 해상도를 기준으로 나누어져 있다.

미디어 쿼리를 모든 기기에서 동일하게 적용되게 하기 위해선 뷰포트 메타 태그를 추가해줘야 한다(HTML 보일러 플레이트에 기본으로 포함되어 있음).

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

이를 위해 다음과 같이 `tailwind.config.js` 파일에 사용자 정의 중단점을 지정할 수 있다. 더 자세한 것은 링크 참조.

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

**[TailwindCSS spacing space between]**

https://tailwindcss.com/docs/space

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


# @apply 지시어로 스타일 재사용하기

다음과 같이 재사용성이 높은 스타일을 전역 CSS파일에 추출하여 사용할 수 있다. 이 방식을 남용할 경우 클래스명에 대한 고민, CSS 파일과 전환 불필요, CSS파일 사이즈 커짐 등 TailwindCSS의 이점이 사라지게 되므로 필요한 곳에만 사용할 것.

더 나은 방법은 컴포넌트 자체를 재사용 가능하게 구성하여 사용하는 것!

```
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