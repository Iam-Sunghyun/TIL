<h2>목차</h2>

- [`useReducer`](#usereducer)
  - [`dispatch` 함수](#dispatch-함수)
  - [좀 더 복잡한 `state`](#좀-더-복잡한-state)
  - [Reference](#reference)

# `useReducer`

`useReducer`는 `useState`처럼 `state`를 생성하고 관리하기 위한 훅으로 여러 개의 하위 값을 갖는 **좀 더 복잡한 `state`를 다양한 방식으로 업데이트 해야할 때 유용하다**. `state` 업데이트 로직을 따로 분리해 관리할 수 있기 때문에 상황에 따라 유지보수성이나 가독성이 좋아질 수 있다.

`useState`를 사용해줘도 큰 차이는 없으나 `setState` 함수가 여러 개 생성되는 것이 싫다면 `useReducer`를 사용하는 것이 방법이 될 수 있다.

사용 형식은 다음과 같다.

```
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

`useReducer` 훅의 첫 번째 인수로 `reducer` 함수를 전달하고, 두 번째 인수로는 `state` 초기 값, 필요에 따라 세 번째 인수에 `state` 초기화 함수를 전달할 수 있다.

`useReducer`의 사용 예시는 다음과 같다.

```
// 사용 예시
import { useReducer } from 'react';

// 컴포넌트 외부에 정의한 `reducer` 함수는 `state`와 `action`을 인수로 받는다.
function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
```

**`useReducer`는 컴포넌트 외부에 '`reducer`'라는 단일 함수를 두고, 이 함수에 필요한 모든 상태 업데이트 로직을 넣어 `state` 업데이트를 통합하여 관리할 수 있게 한다.**

## `dispatch` 함수

호출한 `useReducer`는 [`state`, `dispatch`]를 반환하는데 여기서 `dispatch` 함수는 `state`를 업데이트할 때 사용하는 함수이다.

```
dispatch({ type: 'deposit' });
```

`dispatch` 함수를 호출할 때 인수로 업데이트 정보를 담은 `action` 객체를 전달한다. 이 `action` 객체는 리듀서의 `action`에 전달된다(리듀서의 첫 번째 인수에는 `useReducer`로 생성된 `state`가 전달 됨). 그 후 `action`의 내용에 따라 리듀서에 작성한 로직을 실행하고 리듀서 함수가 반환하는 값으로 `state`가 업데이트 된다(상태 변수가 업데이트 됨에 따라 렌더링도 트리거 됨).

`action` 객체는 일반적으로 업데이트 방식을 구분하기 위해 `type` 프로퍼티를 포함하고, 그 외에는 필요에 따라 추가하면 된다.

다음은 `input`으로 사용자로부터 입력을 받고, 버튼을 클릭하면 입력한 숫자 값이 +/- 되는 예제이다. 여기서 입력 값을 상태 변수에 저장하고 업데이트 로직을 `useReducer`에 통합하여 관리한다.

```
import { useReducer, useState } from 'react';

const ACTION_TYPES = {
  deposit: 'deposit',
  withdraw: 'widthdraw'
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.deposit:
      return state + action.payload;
    case ACTION_TYPE.withdraw:
      return state - action.payload;
    default:
      return state;
  }
};

function UseReducerTest() {
  const [number, setNumber] = useState(0);
  const [money, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <h2>useReducer 연습하기</h2>
      <p>잔고: {money}원</p>
      <input
        type='number'
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
        step='1000'
      />
      <button
        onClick={() => {
          dispatch({ type: ACTION_TYPE.deposit, payload: number });
        }}
      >예금</button>
      <button
        onClick={() => {
          dispatch({ type: ACTION_TYPE.withdraw, payload: number });
        }}
      >출금</button>
    </div>
  );
}

export default UseReducerTest;
```

위에서 버튼을 클릭하면 `onClick` 핸들러가 실행되고, `dispatch` 함수에 업데이트 정보를 담은 `action`를 전달하여 호출한다. 그 후 리듀서 함수에서 `action`의 `type`에 따라 `switch`문으로 분기된 코드가 실행된다(`if/else`를 사용하기도 한다).

유지보수를 고려해 `type` 값들을 별도의 객체로 만들어 사용하였다.

## 좀 더 복잡한 `state`

다음은 간단한 출석부 프로그램으로, 위의 예시보다 좀 더 복잡한 경우이다. 기능으로는 이름을 입력한 뒤 추가 버튼을 클릭하면 리스트에 출력되고 이름을 클릭 시 줄이 그어지는 효과와 삭제 버튼 클릭 시 해당 이름이 리스트에서 삭제된다.

```
// Student.js
import { useReducer, useState } from 'react';
import StudentList from './StudentList';

// 리듀서에 추가, 삭제 로직 추가
const reducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return {
        count: state.count + 1,
        students: [
          {
            id: Date.now(),
            name: action.name,
            isHere: false,
          },
          ...state.students,
        ],
      };
    case 'delete':
      return {
        count: state.count - 1,
        students: state.students.filter((student) => student.id !== action.key),
      };
    default:
      return state;
  }
};

// useReducer 상태 초기 값
const initialState = {
  count: 1,
  students: [
    {
      id: Date.now(),
      name: '홍길동',
    },
  ],
};

function Student() {
  const [name, setName] = useState('');
  const [studetInfo, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <h1>출석부</h1>
      <p>총 학생 수: {studetInfo.count}</p>
      <input
        type='text'
        placeholder='이름을 입력하세요'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => {
          dispatch({ type: 'add', name: name });
          setName('');
        }}
      >
        추가
      </button>
      {studetInfo.students.map((student) => (
        <StudentList
          key={student.id}
          id={student.id}
          name={student.name}
          // 하위 컴포넌트에 props로 dispatch 함수를 전달
          dispatch={dispatch}
        ></StudentList>
      ))}
    </>
  );
}

export default Student;
----------------------------------
// StudentList.js
import { useState } from 'react';
import style from './studentList.module.css';

function StudentList(props) {
  const [isClicked, setIsCliked] = useState(false);
  return (
    <div>
      <span
        className={`${style['student-name']} ${isClicked ? style['invalid'] : ''}`}
        onClick={() => {
          setIsCliked((prev) => !prev);
        }}
      >
        {props.name}
      </span>
      <button
        onClick={() => {
          props.dispatch({ type: 'delete', key: props.id });
        }}
      >
        삭제
      </button>
    </div>
  );
}

export default StudentList;
```

`dispatch` 함수를 하위 컴포넌트에서 사용한 것 주의!

## Reference

**[React docs useReducer]**

https://react.dev/reference/react/useReducer
