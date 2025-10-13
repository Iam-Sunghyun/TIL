<h2>목차</h2>

- [리액트 서버 함수(server function)란?](#리액트-서버-함수server-function란)
- [서버 함수 사용 방법](#서버-함수-사용-방법)
- [`<form>`에서의 서버 함수](#form에서의-서버-함수)
  - [폼 `action` 함수의 반환 값으로 `state` 업데이트하기(`useActionState`)](#폼-action-함수의-반환-값으로-state-업데이트하기useactionstate)
  - [`useFormStatus` 훅으로 로딩 표시기 사용하기](#useformstatus-훅으로-로딩-표시기-사용하기)
- [`<form>` 외부에서 서버 함수](#form-외부에서-서버-함수)
  - [서버 함수의 호출 방식 3가지 정리](#서버-함수의-호출-방식-3가지-정리)
  - [추가 예시](#추가-예시)

# 리액트 서버 함수(server function)란?

`Server Function`이란 클라이언트 컴포넌트에서 호출할 수 있는 서버 측에서 실행되는 비동기 함수를 말한다(19v에서 정식 출시).

`Server Function`으로 클라이언트 측에서 사용자와 상호작용을 통해 서버 측 데이터 변이(데이터 생성, 업데이트, 삭제 등)가 가능해진다.

리액트 공식 홈페이지에선 서버 함수는 서버 데이터 Mutation을 위해 설계되었기 때문에 데이터 가져오기(Fetching)에는 권장하지 않고 있다(Fetching 후 캐시 같은 최적화가 안 되어있는 듯).

```
참고: 2024년 9월까지 모든 서버 함수를 "서버 액션"이라고 했다. 서버 함수가 액션 prop에 전달되거나 액션 내부에서 호출되면 서버 액션이지만 모든 서버 함수가 서버 액션은 아니다. 이 문서의 명명은 서버 함수가 여러 용도로 사용될 수 있음을 반영하도록 업데이트 되었다. - 공식 홈페이지
```

# 서버 함수 사용 방법

서버 함수는 반드시 `async` 함수로 정의해야 하며 함수나 별도의 모듈(파일) 최상단에 `'use server'` 지시어를 명시하여 정의해줄 수 있다.

서버 함수는 서버 컴포넌트 혹은 서버 파일 내에서만 정의할 수 있으며 클라이언트 컴포넌트의 `props`를 통해 전달한다(일반 함수는 서버 컴포넌트에서 클라이언트 컴포넌트로 전달할 수 없지만 서버 함수는 참조를 전달하는 것이기 때문에 가능하다).

그렇게 되면 프레임워크(Nextjs)는 자동으로 서버 함수에 대한 참조를 생성하고 해당 참조 값을 클라이언트 컴포넌트에 전달한다. 서버 함수는 클라이언트 코드가 네트워크 요청을 거쳐 서버 함수를 호출하는 것이므로, 서버 함수에 전달되는 모든 인수는 직렬화 가능해야 한다.

별도의 파일에 정의하는 경우 서버, 클라이언트 상관 없이 `import` 하여 전달할 수 있다(권장).

또한 서버 함수는 `startTransition` 안에서 호출하는 것을 권장하고 있다. 참고로 `<form action>` 또는 `<input type="image">` 혹은 `<input type="submit">`의 `formaction` 어트리뷰트에 전달된 서버 함수는 자동으로 `startTransition` 내에서 호출된다.

```
// 서버 컴포넌트
import Button from './Button';

function EmptyNote () {
  async function createNote() {
    // 서버 함수
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNote}/>;
}
```

위 코드는 리액트 공식 홈페이지 예시로 `React`가 `EmptyNote` 서버 컴포넌트를 렌더링할 때, `createNoteAction` 함수에 대한 참조를 생성하고, 그 참조를 `Button` 클라이언트 컴포넌트에 전달한다. 버튼이 클릭 되면, `React`는 제공된 참조의 함수(`createNoteAction`)를 실행하라는 `POST` 요청을 서버로 보낸다.

아래는 파일로 정의한 서버 함수를 클라이언트 컴포넌트에 `import`한 예시이다.

```
// ./actions.js
"use server";

export async function createNote() {
  await db.notes.create();
}
----------------------------------------
// 클라이언트 컴포넌트
"use client";

import { createNote } from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

# `<form>`에서의 서버 함수

리액트의 `<form />` 요소 `action` 값에는 URL 혹은 함수를 전달할 수 있다.

URL을 `action`을 통해 전달하면, 폼은 HTML 폼 요소처럼 동작하며 서버 함수를 전달하면, 리액트는 폼을 통해 제출된 `formData`를 직렬화 하여 서버로 함수 호출을 요청한다(`POST`). 이때 서버 함수는 자동으로 `startTransition` 내에서 호출된다.

만약 `action`에 일반 함수를 전달하면 네트워크 요청없이 클라이언트 측에서 호출된다.

```
// App.js
async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

## 폼 `action` 함수의 반환 값으로 `state` 업데이트하기(`useActionState`)

`useActionState` 훅을 사용하여 `formAction` 함수가 반환하는 값으로 `state`를 업데이트할 수 있고 또 `state` 업데이트, 액션 함수가 처리중 인지 확인할 수 있다. `state`의 최초 값은 `initialState` 값으로 설정된다(18.3.1v 추가, 구 명칭은 `useFormState`).

<!-- state 업데이트, 액션 대기 -> ? 3번째 인수 -> ?? -->

```
// [상태 값, 폼 액션 함수(fn)]
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

`useActionState` 첫 번째 인수로 전달되는 함수의 첫 번째 인수는 이전 `state` 값 이며(처음엔 `initialState`) 두 번째는 폼 데이터가 전달된다.

```
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  );
}
```

```
// ./actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
-----------------------------------------
import { useActionState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  );
}
```

## `useFormStatus` 훅으로 로딩 표시기 사용하기

`useFormStatus`는 마지막 폼 제출의 상태 정보를 제공하는 `react-dom`에서 제공되는 Hook이다.

반환 값을 통해 상위 `<form>` 요소의 제출 상태와 요청 메서드, 제출되는 데이터(`FormData`)를 사용할 수 있다.

<!-- 4번째 인수 -> ?? -->

```
const { pending, data, method, action } = useFormStatus();
```

`useFormStatus` 훅은 폼에 포함된 컴포넌트에서 사용할 수 있다. 즉, `<form>` 하위에서 렌더링되는 컴포넌트에서 호출해야 한다.

```
import { useFormStatus } from "react-dom";
import action from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

# `<form>` 외부에서 서버 함수

만약 서버 함수가 서버 mutation이 없고, `<form action>` 혹은 `<input image or submit formaction>`으로 호출되는 것이 아닌 경우라면, `startTransition` 안에서 호출해야 한다. 다만 이건 강제 되는 규칙은 아니며, 필수에 가까운 권장 패턴이다.

<!-- 왜 폼 외부에선 transition이 필수? -->
<!-- transition 덕분에 React는 UI를 블락하지 않고 기존 UI 유지 + 로딩 상태를 표시 + 결과를 점진적으로 갱신 가능 -->

```
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  // startTransition으로 래핑
  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
--------------------------------------------
// ./actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

## 서버 함수의 호출 방식 3가지 정리

| 호출 방식                                                                      | 설명                                        | Transition 필요성                                     |
| ------------------------------------------------------------------------------ | ------------------------------------------- | ----------------------------------------------------- |
| **Form Action** (`<form action={action}>`, `<input image, submit formAction>`) | HTML form 제출 시 자동으로 서버 액션 호출   | ❌ 필요 없음 (React가 내부적으로 transition 처리함)   |
| **서버 Mutation 액션** (DB, write 등)                                          | 서버 상태가 바뀌는 액션 (`POST/PUT/DELETE`) | ⚙️ 선택적 (보통 결과 후에 refresh 시 transition 필요) |
| **서버 Fetch 액션** (read-only 액션)                                           | 서버에서 데이터 fetch만 하는 액션           | ✅ 반드시 `startTransition()`으로 감싸야 함           |

## 추가 예시

```
// 폼 외부에서 transition으로 래핑
"use client";
import { getData } from "@/actions/getData";
import { startTransition } from "react";

export default function Page() {
  const [data, setData] = useState(null);

  function handleClick() {
    startTransition(async () => {
      const result = await getData(); // 서버 액션 호출
      setData(result);
    });
  }

  return (
    <button onClick={handleClick}>
      Load Data
    </button>
  );
}
-------------------------------------
// 폼 action에 전달하는 예
"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("로그인 해야합니다.");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("유효하지 않은 nationalID 입니다.");
  }

  const updateData = { nationality, nationalID, countryFlag };
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}
---------------------------------------
"use client";
import { updateGuest } from "../_lib/actions";

function UpdateProfileForm({ children, guest }) {

  const { fullName, email, nationality, nationalID, countryFlag } = guest;

  return (
    <form action={updateGuest} className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          {/* <Image src={countryFlag} alt="Country flag" className="h-5 rounded-sm" /> */}
        </div>
        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          name="nationalID"
          defaultValue={nationalID}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <button className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
          Update profile
        </button>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
```

https://ko.react.dev/reference/rsc/server-actions#noun-labs-1201738-(2)

<!-- # useFormState(전) -> useActionState(후) 훅 -->
