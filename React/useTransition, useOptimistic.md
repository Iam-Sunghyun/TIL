<h2>목차</h2>

- [`useTransition` 훅으로 폼 하위가 아닌 곳에서 로딩 표시기 출력하기](#usetransition-훅으로-폼-하위가-아닌-곳에서-로딩-표시기-출력하기)
- [`useOptimistic`으로 비동기 작업 처리하기](#useoptimistic으로-비동기-작업-처리하기)
- [`bind()`로 폼 서버 액션에 추가 인수 전달하기](#bind로-폼-서버-액션에-추가-인수-전달하기)

# `useTransition` 훅으로 폼 하위가 아닌 곳에서 로딩 표시기 출력하기

`useTransition` 훅은 UI를 block시키지 않고 상태(state)를 업데이트할 수 있게 해주는 리액트 훅이다.

폼 요소 하위에 렌더링되는 컴포넌트라면 `useFormStatus` 훅을 사용해 폼 제출 상태를 확인하여 로딩 표시기를 출력해줄 수도 있었다. `useTransition` 훅의 경우 **상태를 업데이트 중일 때**를 식별하여 더 나은 사용자 경험을 제공할 수 있다.

```
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` 훅의 반환 값으로는 대기 중인 Transition이 있는지 알 수 있는 `isPending`과 상태 업데이트를 Transition으로 표시할 수 있게 해주는 `startTransition` 함수가 있다. `startTransition` 함수에 상태 업데이트 로직을 감싸서 사용한다.

`startTransition`에 전달하는 함수는 동기식이어야 하며 React는 전달한 함수를 즉시 실행하여 실행하는 동안 발생하는 모든 state 업데이트를 Transition 으로 표시한다.

<!-- ??? -->

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

서버 액션을 사용하면서 Transition 상태를 표시해주는 데도 사용할 수 있다.

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
      startTransition(() => deleteReservation(bookingId)); // deleteReservation => 서버 액션 함수
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

<!-- ? -->

`useOptimistic`은 React Hook으로, **비동기 작업이 진행 중일 때** 다른 상태를 보여줄 수 있게 해준다.

인자로 주어진 일부 상태를 받아, 네트워크 요청과 같은 비동기 작업 기간 동안 달라질 수 있는 그 상태(결과)의 복사본을 반환한다.

현재 상태와 작업의 입력을 취하는 함수를 제공하고, 작업이 대기 중일 때 사용할 낙관 적인 상태(성공 시 결과)를 반환한다. 폼을 예로 들면 사용자가 폼을 제출할 때, 서버의 응답을 기다리는 대신 인터페이스가 기대하는 결과로 즉시 업데이트 된다.

`useOptimistic`을 사용함으로서 비동기 작업 중에도 앱이 더 빠르고 상호 작용 적으로 느껴지도록 하여 반응성과 낙관 적인 사용자 경험을 만드는 데 도움을 줄 수 있다.

```
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

<!-- ? -->

```
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
