<h2>목차</h2>

- [`useTransition` 훅으로 폼 하위가 아닌 곳에서 로딩 표시기 출력하기](#usetransition-훅으로-폼-하위가-아닌-곳에서-로딩-표시기-출력하기)
- [`useOptimistic`으로 비동기 작업 처리하기](#useoptimistic으로-비동기-작업-처리하기)
- [`bind()`로 폼 서버 액션에 추가 인수 전달하기](#bind로-폼-서버-액션에-추가-인수-전달하기)

# `useTransition` 훅으로 폼 하위가 아닌 곳에서 로딩 표시기 출력하기

`useTransition`은 **상태 업데이트의 우선순위를 조정하여 UI를 더 반응성 있게 만드는 역할**을 한다.

기존 리액트의 동기적(synchronous)렌더링 방식에서는(18v 이전) 상태 업데이트가 발생하면 해당 렌더링 작업이 모두 완료될 때까지 다른 작업이 차단되었다. 이로 인해 시간이 오래 걸리는 업데이트가 있으면 UI가 멈추거나 버벅이는 문제가 발생할 수 있었다.

리액트 18v에서 비동기 렌더링 방식이 적용됨과 동시에 `useTransition`의 도입으로 특정 상태 업데이트를 나중에 처리해도 되는 작업(non-urgent update)으로 만들 수 있다. 즉, **사용자 입력과 같이 긴급한 업데이트가 아닌 상태 업데이트(예: 데이터 로딩 후 컴포넌트 렌더링)의 우선순위를 낮추어 후순위로 처리할 수 있게 해준다.**

<!-- 공식 홈페이지에서 말하는 백그라운드 처리는? -->

또 우선순위가 낮은 상태 업데이트가 진행되는 동안에, 다른 중요한 이벤트(예: 텍스트 입력, 버튼 클릭)는 즉시 처리될 수 있도록 한다.

```
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

`useTransition`은 상태 업데이트(transition)이 진행 중 인지 알 수 있는 `isPending`과 상태 업데이트를 transition으로 표시할 수 있게 해주는 `startTransition` 함수를 반환 한다. 상태 업데이트 로직을 `startTransition` 함수에 전달하여 사용하며 전달되는 함수는 `Actions`라고 한다.

이떄 **`startTransition`에 전달되는 `action`은 동기식이어야 한다.** `startTransition`를 호출하면 리액트는 전달한 함수를 즉시 실행하고, 실행하는 동안 발생하는 모든 `state` 업데이트를 transition으로 표시한다.

다음은 `useTransition`의 상태 업데이트 순서를 알 수 있는 사용 예시이다.

```
import { useState, useTransition } from "react";

function Example() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setText(e.target.value);

    // 급하지 않은 업데이트 → 우선순위 낮춤
    startTransition(() => {
      const items = Array(5000)
        .fill(0)
        .map((_, i) => `${e.target.value} - ${i}`);
      setList(items);
    });
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      {isPending && <p>로딩 중...</p>}
      <ul>{list.map((item) => <li key={item}>{item}</li>)}</ul>
    </>
  );
}
```

⚙️ 동작 설명

1. 사용자가 입력 → `setText()` 실행 → 즉시 렌더됨 ✅

2. `startTransition()` 내부의 `setList()` 실행 요청 → React는 이를 “나중에” 처리하기로 스케줄링

3. 입력 이벤트가 계속 발생하면 React는 기존의 transition 작업을 취소하고 새로 시작

4. 사용자가 멈추면 → transition 업데이트 실행됨

결과적으로, 입력 지연 없이 부드러운 UI 가 유지된다.

`action` 함수 내에서 `await`된 비동기 호출은 transition에 포함되지만 `await` 이후에 상태 업데이트를 위해 `set` 함수를 연달아 호출을 하는 경우 현재로서는(19.1v) 추가적으로 `startTransition`으로 감싸줘야 한다(향후 수정될 예정이라 함).

```
startTransition(async () => {
  await someAsyncFunction();
  // ❌ await 이후에 startTransition을 사용하지 않음
  setPage('/about');
});
------------------------------------
startTransition(async () => {
  await someAsyncFunction();
  // ✅ await *이후에* startTransition을 사용
  startTransition(() => {
    setPage('/about');
  });
});
```

서버 함수를 사용하면서 transition 상태를 표시해줄 수도 있다.

```
"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import { deleteReservation } from "../_lib/actions";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({ bookingId }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("삭제 하시겠습니까?")) {
      startTransition(() => deleteReservation(bookingId));
    }
  }
  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      {isPending ? ( // startTransition 함수로 감싼 로직이 실행 중이면 true가 된다.
        <div className="mx-auto">
          <SpinnerMini />
        </div>
      ) : (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      )}
    </button>
  );
}

export default DeleteReservation;
```

<!-- suspense에 기본으로 포함? -->
<!-- Transition으로 표시된 state 업데이트는 다른 state 업데이트에 의해 중단됩니다. 예를 들어 Transition 내에서 차트 컴포넌트를 업데이트한 다음 차트가 다시 렌더링 되는 도중에 입력을 시작하면 React는 입력 업데이트를 처리한 후 차트 컴포넌트에서 렌더링 작업을 다시 시작합니다. -->

https://ko.react.dev/reference/react/useTransition#usetransition

https://www.frontoverflow.com/question/46/useTransition()%20%ED%9B%85%EC%9D%98%20%EC%97%AD%ED%95%A0%EC%9D%B4%20%EB%AD%94%EA%B0%80%EC%9A%94%3F

# `useOptimistic`으로 비동기 작업 처리하기

`useOptimistic`은 React 19에서 도입된 훅으로, **비동기 작업이 진행 중일 때 응답을 기다리지 않고 미리 UI를 갱신해주는** 훅이다(실패 시 원래 상태로 되돌아 간다).

즉, **사용자의 작업이 성공할 것이라고 가정하고, 서버의 응답을 기다리는 동안에도 UI에 먼저 결과를 보여주어** 사용자 경험을 즉각적이고 매끄럽게 만들어 준다.

`useOptimistic` 훅은 현재 상태와 작업의 입력을 매개변수로 받는 함수를 매개변수로 받고, 결과 상태와 낙관적 업데이트 시(비동기 작업 시작 시) 호출되는 함수를 반환한다.

```
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn(currentState, optimisticValue));
----------------------------------------
import { useOptimistic } from 'react';

function AppContainer() {
  // 결과 상태(현재 상태 혹은 비동기 작업 성공 후 상태), updateFn 호출 함수
  const [optimisticState, addOptimistic] = useOptimistic(
    // 현재 상태
    state,
    // 낙관적 업데이트(비동기 작업 시작) 때 호출되는 함수(updateFn)
    // 현재 상태(state)와 addOptimistic 호출 시 전달된 인수를 매개변수로 받는다
    (currentState, optimisticValue) => {
      // 비동기 작업 실행 시 이 함수가 반환하는 값으로 optimisticState가 업데이트 된다
    }
  );
}
```

대표적 예시로 메시지 앱에서 사용자가 메시지를 입력하고 전송 버튼을 누르면, `useOptimistic`을 통해 메시지가 서버로 전송되기 전에 즉시 목록에 나타난다. 혹은 새로운 메시지를 전송할 때 "전송 중..."과 같은 상태를 보여주다가, 서버 응답이 완료되면 최종 상태로 업데이트하는 식이 있다.

아래는 실제 사용 코드이다.

```
// 18버전 방식
"use client";

import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/actions";
import { useOptimistic } from "react";

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard booking={booking} onDelete={handleDelete} key={booking.id} />
      ))}
    </ul>
  );
}

export default ReservationList;
-------------------------------------------
// 19v 방식
// 폼 외부에서 호출되는 서버 함수나(정확히는 폼 액션에 직접 전달되는 게 아닌 경우)
// 혹은 서버 함수 호출 후(async/await) 상태 업데이트(set)의 경우
// startTransition으로 감싸주고 있다.

import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();

  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}

    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);

  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }

  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
--------
// ./actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

https://ko.react.dev/reference/react/useOptimistic#noun-labs-1201738-(2)

# `bind()`로 폼 서버 액션에 추가 인수 전달하기

```
"use client";

import { differenceInDays } from "date-fns";
import { useReservation } from "./ReservationContext";
import { createBooking } from "../_lib/actions";

function ReservationForm({ cabin, user }) {
  const { range } = useReservation();

  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  // bind()로 전달한 2 번째 인수가 createBooking의 첫 번째 매개변수에 담긴다.
  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <form
        action={createBookingWithData}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
          .
          .
          .
      </form>
    </div>
  );
}

export default ReservationForm;

---------------------
// /app/_lib/actions.js
export async function createBooking(bookingData, formData) {
  console.log(bookingData, formData); // bookingData에 bind로 전달한 인수가 담긴다. form에 전달한 서버 액션이므로 formData가 전달되는데 전달한 인수 개수 + 1 번째 매개변수로 밀려난다.
}
```

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#passing-additional-arguments
