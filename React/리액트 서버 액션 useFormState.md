<h2>목차</h2>

- [리액트 서버 함수(server function)란?](#리액트-서버-함수server-function란)
  - [서버 함수 사용 방법](#서버-함수-사용-방법)
- [서버 액션으로 사용자 프로필 업데이트하기](#서버-액션으로-사용자-프로필-업데이트하기)
- [`useFormStatus` 훅으로 로딩 표시기 사용하기](#useformstatus-훅으로-로딩-표시기-사용하기)
- [useFormState(전) -\> useActionState(후) 훅](#useformstate전---useactionstate후-훅)

# 리액트 서버 함수(server function)란?

`Server Fucntion`이란 클라이언트 컴포넌트에서 호출할 수 있는 서버 측에서 실행되는 비동기 함수를 말한다(서버 함수는 async 함수이어야 한다).

`Server Fucntion`으로 클라이언트 측에서 사용자와 상호작용을 통해 서버 측 데이터 변이(데이터 생성, 업데이트, 삭제 등)가 가능해진다.

```
참고: 2024년 9월까지 모든 서버 함수를 "서버 액션"이라고 했다. 서버 함수가 액션 prop에 전달되거나 액션 내부에서 호출되면 서버 액션이지만 모든 서버 함수가 서버 액션은 아니다. 이 문서의 명명은 서버 함수가 여러 용도로 사용될 수 있음을 반영하도록 업데이트 되었다. - 공식 홈페이지
```

<!-- 서버 액션 자체는 서버에서만 실행되는 비동기 함수를 의미하는 듯. -->

<!-- 데이터 변경을 위해 API를 작성할 필요가 없어진다..  -->

## 서버 함수 사용 방법

함수나 별도의 모듈(파일) 최상단에 `'use server'` 지시어를 명시하여 서버 함수를 정의해줄 수 있다.

컴포넌트 내부에서 함수로 정의하는 경우 서버 컴포넌트 내에서 정의하여 클라이언트 컴포넌트에 `props`로 전달하는 방식이고(일반 함수는 서버 컴포넌트에서 클라이언트 컴포넌트로 전달할 수 없다.), 별도의 파일에 정의하는 경우 서버, 클라이언트 상관 없이 `import` 하여 전달할 수 있다(권장).

```
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Action
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

위 코드는 리액트 공식 홈페이지 예시로 `React`가 `EmptyNote` 서버 컴포넌트를 렌더링할 때, `createNoteAction` 함수에 대한 참조를 생성하고, 그 참조를 `Button` 클라이언트 컴포넌트에 전달한다. 버튼이 클릭 되면, `React`는 제공된 참조로 `createNoteAction` 함수를 실행하라는 요청을 서버로 보낸다.

# 서버 액션으로 사용자 프로필 업데이트하기

Server Action을 폼에 전달하여 폼을 서버에 자동으로 제출할 수 있다. 폼은 서버 컴포넌트여도 가능...

```
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

# `useFormStatus` 훅으로 로딩 표시기 사용하기

<!-- 뭔가 내용이 잘못 된듯? -->

`useFormStatus`는 마지막 폼 제출의 상태 정보를 제공하는 `react-dom`에서 제공되는 Hook이다. 따라서 클라이언트 컴포넌트에서만 사용 가능하다.

```
const { pending, data, method, action } = useFormStatus();
```

`useFormStatus` 훅은 폼에 포함된 컴포넌트에서 사용할 수 있다. -> `<form>` 내부에 렌더링한 컴포넌트에서 호출해야 한다.

```
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

https://ko.react.dev/reference/react-dom/hooks/useFormState#display-a-pending-state-during-form-submission

# useFormState(전) -> useActionState(후) 훅
