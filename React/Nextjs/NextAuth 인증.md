<h2>목차</h2>

- [NextAuth(Auth.js) 세팅하기](#nextauthauthjs-세팅하기)
  - [환경 변수 설정](#환경-변수-설정)
  - [Google OAuth 클라이언트 생성](#google-oauth-클라이언트-생성)
  - [`auth.js` 설정 파일 생성](#authjs-설정-파일-생성)
- [사용자 세션 데이터 가져오기](#사용자-세션-데이터-가져오기)
- [미들웨어로 권한 부여하기(authorization)](#미들웨어로-권한-부여하기authorization)
  - [미들웨어로 리디렉션하기](#미들웨어로-리디렉션하기)
- [커스텀 로그인 페이지 출력하기](#커스텀-로그인-페이지-출력하기)
  - [커스텀 버튼 로그인/로그아웃 구현하기](#커스텀-버튼-로그인로그아웃-구현하기)
- [사용자 정보 데이터베이스에 저장하기](#사용자-정보-데이터베이스에-저장하기)

# NextAuth(Auth.js) 세팅하기

`NextAuth`는 `Next.js` 애플리케이션의 인증(authentication) 구현을 단순화하기 위한 라이브러리이다. `NextAuth`의 이름은 V5에서 `Auth.js`로 변경될 예정인데 `Auth.js`는 `Next.js`외에도 몇가지 프레임워크를 지원한다.

```
// npm
npm install next-auth@beta
```

## 환경 변수 설정

```
// .env.local
NEXTAUTH_URL=''
NEXTAUTH_SECRET='' // 필수 요구(AUTH_SECRET)
```

`Auth.js` V5 부터는 `NEXTAUTH_` 접두사가 `AUTH_`로 대체됨. 일관성을 위해 위와 같이 작성해도 상관은 없다고 한다(별칭으로 취급).

`NEXTAUTH_URL`(`AUTH_URL`)의 경우 V5부터 작성하지 않아도 `Auth.js`가 요청 헤더로부터 자동으로 추적한다고 한다. 만약 다른 기본 URL을 추가로 사용하고자 한다면 작성해줄 수도 있다.

`NEXTAUTH_SECRET`(`AUTH_SECRET`)의 경우 필수 요구되는 환경 변수로 `JWT` 토큰과 이메일 확인 해시를 암호화하는 데 사용되는 값이다(32자 이상 랜덤 값을 권장).

**[Auth.js installation]**

https://authjs.dev/getting-started/installation

**[Auth.js Deployment Environment Variables]**

https://authjs.dev/getting-started/deployment#environment-variables

https://authjs.dev/guides/environment-variables

## Google OAuth 클라이언트 생성

`Auth.js`에서 구글로 로그인 하기(OAuth) 기능 테스트를 위해 OAuth 관련 설정하는 과정(471강 참조).

Google developer console에 들어가 프로젝트 생성 후 API 및 서비스 탭에 OAuth 동의 화면(OAuth content screen) User Type 외부(External)로 설정 후 절차 수행.

대시보드로 돌아와서 API 및 서비스 탭의 사용자 인증 정보 클릭하여 상단에 사용자 인증 정보 만들기 클릭해 OAuth 클라이언트 ID 만들기 선택. 승인된 JavaScript 원본에 `http://localhost:3000` 입력하고 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` 입력하여 생성.

생성된 OAuth 클라이언트 정보 창을 통해 다음과 같이 환경 변수 설정해준다.

```
AUTH_GOOGLE_ID="1041413271058-b5a4u7d7c0sicg968hpdgd5t0pgfokm5.apps.googleusercontent.com" // 클라이언트 ID
AUTH_GOOGLE_SECRET="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" // 클라이언트 보안 비밀번호
```

## `auth.js` 설정 파일 생성

`auth.js` 파일을 생성하여 다음과 같이 import 해주고 생성한 환경 변수를 클라이언트 아이디, 비밀번호에 입력해준다(최근 버전(v5)에는 안해줘도 됨).

```
// /app/_lib/auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
--------------------------
// V5
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
});
```

외부 웹 사이트 인증이 아닌 사용자 정보(이메일, 비밀번호)로 인증하고자 한다면 `https://authjs.dev/getting-started/authentication/credentials` 참조.

<!-- ↓ ? -->

그 후 `NextAuth()`가 반환하는 `handlers`를 `route.js`에 `import`하여 들어오는 모든 요청에서 `Auth.js`가 실행될 수 있도록 해준다.

```
// ./app/api/auth/[...nextauth]/route.js
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

# 사용자 세션 데이터 가져오기

`NextAuth()`가 반환하는 `auth` 함수를 호출하여 서버 컴포넌트에서 사용자 세션 데이터 참조할 수 있다. 비동기로 동작하므로 `await`을 사용해준다.

`auth` 함수는 `header()`, `cookies()` 함수를 사용하기 때문에 `auth`를 사용하는 컴포넌트는 동적 렌더링된다.

```
// @/app/_lib/auth
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
});
-------------------------------------
import Link from "next/link";
import { auth } from "../_lib/auth";

export default async function Navigation() {
  const session = await auth();
  console.log(session)
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 ">
        <li>
          <Link href="/cabins" className="hover:text-accent-400 transition-colors">
            Cabins
          </Link>
        </li>
            .
            .
            .
      </ul>
    </nav>
  );
}

>> {
  user: {
    name: '전성현',
    email: 'sunghyun1148@gmail.com',
    image: 'https://lh3.googleusercontent.com/a/ACg8ocKy16hG4UEXx-WxU4ZQl_dqHLsWNT95Ofsiq6bO0-j7vpxZig=s96-c'
  },
  expires: '2024-10-02T06:14:19.216Z'
}
```

# 미들웨어로 권한 부여하기(authorization)

<!--  -->

`Next.js` 미들웨어란 요청에 대한 응답이 완료되기 전 중간에서 실행되는 코드를 말한다(직접 응답할 수 있다).

미들웨어는 `Nextjs` 컨벤션에 따라 루트 디렉토리에 파일명 `middelware.js`으로 하나만 생성해야 하며 미들웨어 함수는 항상 응답을 반환해야 한다(리디렉션 혹은 직접 응답(일반적으로 JSON 형태)). 또한 미들웨어 함수는 요청(`request`) 객체를 매개변수로 받는다.

미들웨어는 기본적으로 모든 경로에 대해 호출되는데 `middelware.js` 내부의 `config` 객체에 `matcher` 프로퍼티 값을 할당하여 어떤 라우트에 미들웨어가 호출되어야 하는지 설정해줄 수 있다.

1. 미들웨어 정의

```
// /middleware.js
import { auth } from "./app/_lib/auth";

export const middleware = auth; // NextAuth가 반환하는 auth 함수를 미들웨어로 설정

export const config = {
  matcher: ["/account"], // /account 경로 이동 시 미들웨어 호출
};
```

2. NextAuth `auth.js` `callbacks` 정의

<!-- ??? -->

`NextAuth` 함수에 전달되는 `callbacks` 프로퍼티에는 객체를 전달해야 하며 이 객체 내부에는 `authorized` 이름으로 함수를 정의할 수 있는데 이 함수가 전달받는 객체는 `auth`, `request` 프로퍼티를 갖는다.

`callbacks`의 `authorized` 함수는 `true`/`false`를 반환해야 한다. `true`를 반환할 경우 현재 사용자에게 `matcher`에 등록한 경로에 대한 사용 권한이 부여되고 `false`를 반환하는 경우 로그인 페이지로 리디렉션 된다. 즉, `middleware.js`의 `matcher`에 등록한 경로로 접근할 때 마다 `NextAuth`가 `callbacks`에 등록한 `authorized` 함수를 호출한다.

```
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user; // 로그인한 사용자는 인증, 그렇지 않은 사용자는 로그인 페이지로 리디렉션 됨.
    },
  },
});
```

**[Nextjs protecting resources]**

https://authjs.dev/getting-started/session-management/protecting

## 미들웨어로 리디렉션하기

```
import { NextResponse } from 'next/server'

return NextResponse.redirect(new URL('/new', request.url))
```

**[Nextjs middleware]**

https://nextjs.org/docs/app/building-your-application/routing/middleware

# 커스텀 로그인 페이지 출력하기

다음과 같이 커스텀 로그인 페이지를 생성해준다.

```
// /login/page.js
import SignInButton from "../_components/SignInButton";

export default function Page() {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">Sign in to access your guest area</h2>
      <SignInButton />
    </div>
  );
}
```

그 후 `NextAuth`의 `pages` 프로퍼티에 `/login` 경로를 등록해주면 보호된 라우트로 접근할 때(인증이 필요할 때) 커스텀 페이지(`/login/page.js`)가 출력된다.

```
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
  },
});
```

**[Nextjs Session Management Custom Pages]**

https://authjs.dev/getting-started/session-management/custom-pages

## 커스텀 버튼 로그인/로그아웃 구현하기

`NextAuth`가 반환하는 `signIn`, `signOut` 함수를 사용해 로그인, 로그아웃 페이지와 연결할 수 있다.

서버 컴포넌트에 상호작용성(ex)onClick 이벤트 핸들러)을 추가하기 위해 리액트 서버 액션을 사용.

서버 액션 함수는 서버에서만 실행됨.

```
// /app/_lib/auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
  },
});
---------------------------------------
// SignInButton.js
import Image from "next/image";
import { signInAction } from "../_lib/actions";

function SignInButton() {
  return (
    <form action={signInAction}> // 서버 액션 할당
      <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
----------------------------------------
// SignOutButton.js
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOutAction } from "../_lib/actions";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 w-full">
        <ArrowRightOnRectangleIcon className="h-5 w-5 text-primary-600" />
        <span>Sign out</span>
      </button>
    </form>
  );
}

export default SignOutButton;
----------------------------------------
// /app/_lib/actions.js
"use server"; // 서버 액션용 명령어

import { signIn, signOut } from "./auth";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" }); // provider(google)과 리디렉션 경로 전달
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
```

**[Nextjs Authentication OAuth]**

https://authjs.dev/getting-started/authentication/oauth

# 사용자 정보 데이터베이스에 저장하기

<!--  -->

`NextAuth` 함수의 `callbacks` 프로퍼티에 `signIn` 함수를 정의하여 사용자 로그인 전 수행할 로직을 작성해줄 수 있다.

```
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest) await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch {
        return false;
      }
    },
  },

  pages: {
    signIn: "/login",
  },
});
```

`NextAuth` 함수의 `callbacks` 프로퍼티에 `session` 함수를 전달하여 `signIn` 함수 호출 후 작업을 정의할수 있다.

**[Nextjs next-auth callbacks]**

https://authjs.dev/reference/nextjs#callbacks
