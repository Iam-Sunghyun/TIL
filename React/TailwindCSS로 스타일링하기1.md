<h2>목차</h2>

- [Tailwind CSS란?](#tailwind-css란)
  - [Tailwind CSS 사용시 장점](#tailwind-css-사용시-장점)
  - [단점](#단점)
  - [인라인 스타일과 차이점?](#인라인-스타일과-차이점)
- [TailwindCSS 시작하기](#tailwindcss-시작하기)
  - [TailwindCSS 설치 및 설정파일 생성](#tailwindcss-설치-및-설정파일-생성)
  - [파일 경로 설정](#파일-경로-설정)
  - [`./src/index.css`에 지시어 추가 후 사용하기](#srcindexcss에-지시어-추가-후-사용하기)
- [추가 플러그인 설치하기](#추가-플러그인-설치하기)
  - [Vscode용 TailwindCSS intelliSense 설치](#vscode용-tailwindcss-intellisense-설치)
  - [Tailwind CSS용 공식 Prettier 플러그인 설치](#tailwind-css용-공식-prettier-플러그인-설치)

# Tailwind CSS란?

Utility first CSS이다. Utility-First: 미리 세팅된 유틸리티 클래스를 활용하여 HTML 코드 내에서 스타일링한다. 즉, 스타일링에 필요한 대부분의 속성들이 클래스 형태로 TaillwindCSS 내부에 정의되어 있고 사용자는 클래스들을 조합해서 HTML에 적용해주면 된다(Utility first CSS = atomic CSS).

## Tailwind CSS 사용시 장점

공식 웹 사이트에서 말하는 TailwindCSS 장점은 다음과 같다.

- 클래스 이름을 만드는 데 에너지를 낭비하지 않습니다 . 더 이상 스타일을 지정하기 위해 어리석은 클래스 이름을 추가할 필요가 없으며 실제로는 단지 플렉스 컨테이너인 것에 대한 완벽한 추상 이름을 놓고 고민할 필요가 없습니다.
- 귀하의 CSS가 성장을 멈춥니다 . 기존 접근 방식을 사용하면 새 기능을 추가할 때마다 CSS 파일이 더 커집니다. 유틸리티를 사용하면 모든 것이 재사용 가능하므로 새로운 CSS를 작성할 필요가 거의 없습니다. 유틸리티 중심의 CSS 프로젝트를 유지하는 것은 대규모 CSS 코드베이스를 유지하는 것보다 훨씬 쉬운 것으로 밝혀졌습니다.

- 변화를 주는 것이 더 안전하다고 느껴집니다 . CSS는 전역적이므로 변경할 때 무엇을 깨뜨릴지 결코 알 수 없습니다. HTML의 클래스는 로컬 클래스이므로 다른 문제가 발생할 염려 없이 변경할 수 있습니다.

## 단점

- JSX, HTML 클래스에 직접 스타일링하므로 가독성이 떨어질 수 있다.

- 매 프로젝트마다 설치와 사전 준비가 필요하다.

## 인라인 스타일과 차이점?

- 제약 조건을 고려한 설계 . 인라인 스타일을 사용하면 모든 값이 마법의 숫자가 됩니다. 유틸리티를 사용하면 사전 정의된 디자인 시스템 에서 스타일을 선택하므로 시각적으로 일관된 UI를 훨씬 쉽게 구축할 수 있습니다.
- 반응형 디자인 . 인라인 스타일에서는 미디어 쿼리를 사용할 수 없지만 Tailwind의 반응형 유틸리티를 사용 하면 완전히 반응형 인터페이스를 쉽게 구축할 수 있습니다.
- 호버, 포커스 및 기타 상태 . 인라인 스타일은 호버나 포커스와 같은 상태를 대상으로 할 수 없지만 Tailwind의 상태 변형은 유틸리티 클래스로 이러한 상태를 쉽게 스타일링할 수 있게 해줍니다.

# TailwindCSS 시작하기

## TailwindCSS 설치 및 설정파일 생성

TaillwindCSS 공식 문서를 참조하면 다양한 TaillwindCSS 설치 방법을 볼 수 있다. Vite를 이용한 설치 방법은 다음과 같다.

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p //tailwind.config.js, postcss.config.js 파일 생성
```

## 파일 경로 설정

다음은 `tailwind.config.js` 파일에 경로를 설정해주는데 이는 TailwindCSS에 `index.html`과 `js`,`ts`, `jsx`, `tsx` 파일의 위치를 알려주는 역할을 한다. 만약 폴더명을 바꾸거나 파일 위치를 변경하게 된다면 `tailwind.config.js` 파일의 경로 역시 바꿔줘야 한다.

```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",    // 이부분
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## `./src/index.css`에 ` @tailwind` 지시어 추가 후 사용하기

`./src/index.css`에 다음과 같은 지시어를 추가하고 프로젝트를 시작해주면 TailwindCSS를 사용할 수 있다. TaillwindCSS의 기본 적용 스타일을 보고싶다면 공식 문서의 `preflight`를 참조하면 된다.

```
// ./src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

    .
    .
    .
```

# 추가 플러그인 설치하기

## Vscode용 TailwindCSS intelliSense 설치

Vscode의 확장 플러그인 `Tailwind CSS intelliSense`를 설치하면 자동 완성, 구문 강조 표시, 린팅(linting)같은 편리한 코드 가이드 기능을 이용할 수 있다.

## Tailwind CSS용 공식 Prettier 플러그인 설치

`prettier-plugin-tailwindcss`는 TailwindCSS가 권장하는 순서대로 클래스 네임을 자동으로 정렬해주는 기능의 플러그인이다(레이아웃에 영향을 미치는 영향력 있는 클래스를 처음에, 장식용 클래스를 마지막에 배치하는 식). 이는 같은 스타일을 작성했을 경우 항상 같은 순서로 정렬되기 때문에 가독성에 도움이 된다.

```
npm install -D prettier prettier-plugin-tailwindcss
```

`Prettier` 설정 파일(`.prettierrc`)을 생성하여 다음과 같이 작성해준다.

```
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**[TailwindCSS 공식 웹 사이트]**

https://tailwindcss.com/docs
