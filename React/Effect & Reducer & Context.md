<h2>목차</h2>

- [useEffect 훅](#useeffect-훅)
  - [useEffect에서 Cleanup 함수 사용하기](#useeffect에서-cleanup-함수-사용하기)
  - [Cleanup 함수로 디바운스(debounce) 구현하기](#cleanup-함수로-디바운스debounce-구현하기)
- [useReducer 훅](#usereducer-훅)
  - [`dispatch` 함수](#dispatch-함수)
    - [좀 더 복잡한 경우](#좀-더-복잡한-경우)
- [`useContext`, `Context API`](#usecontext-context-api)
    - [1. 컨텍스트 생성](#1-컨텍스트-생성)
    - [2. 컨텍스트 제공(provide)](#2-컨텍스트-제공provide)
  - [3. 컨텍스트 사용](#3-컨텍스트-사용)

# useEffect 훅

<!-- 천천히 이해하자 -->

`useState`와 함께 가장 많이 사용되는 훅으로 컴포넌트 렌더링 후에 부수 효과(side effect)를 수행하기 위한 리액트 훅이다.

사용 방식은 다음과 같다.

```
useEffect(() => { ... }, [ dependencies ]);
```

**첫 번째 인수로 함수** 전달. **두 번째 인수로는 의존성으로 구성된 배열**을 전달한다.

첫 번째로 전달한 함수는 **컴포넌트가 마운트 되면(컴포넌트가 DOM에 처음 추가되면)실행되며, 이후에는 의존성 데이터가 변경되면 실행된다**.

<!-- 변경된 상태에서 발생한 렌더링 후에 실행된다** -->

즉, 렌더링 후 부수 효과를 처리하기 위해 사용하는 훅이 `useEffect`이다. 여기서 부수 효과란 외부 상태를 변경하는 것을 말한다.

리액트의 범위를 벗어난 부수 효과(side effect, 부작용)를 일으키는 작업은 리액트 렌더링과 분리되어야 하며 필요시 렌더링 이후에 수행되어야 한다. 그 말은 **컴포넌트를 순수함수 이어야 한다는 것**인데 컴포넌트를 순수한 함수로만 엄격하게 작성하면 코드베이스가 커짐에 따라 예측할 수 없는 버그와 동작을 막을 수 있다.

자세한 추가 내용은 링크 참조.

<!-- 왜? -->

**[React docs 컴포넌트가 순수해야하는 이유]**

https://react.dev/learn/keeping-components-pure

**[순수 함수의 장점]**

https://www.learningjournal.guru/article/scala/functional-programming/benefits-of-pure-functions/

https://alvinalexander.com/scala/fp-book/benefits-of-pure-functions/

```
공식 문서에 따르면 일반적으로 부수 효과는 이벤트 핸들러 내부에서 수행된다. 그러나 부수 효과를 처리할 적절한 이벤트 핸들러를 발견하지 못하는 경우도 있는데, 그런 경우 최후의 수단으로 useEffect를 사용하라고 되어있다.
```

다음은 브라우저 로컬 스토리지(localstorage)에 저장된 값을 이용해 로그인 여부를 확인하는 코드인데, `console.log()`를 통해 `useEffect`가 호출되는 횟수를 확인해볼 수 있다.

```
// App.js
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // locagstrage에서 데이터를 가져온다
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('useEffect 테스트');
    if (storedIsLoggedIn === '1') {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    // locagstrage에 (키, 값) 저장
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    // locagstrage 데이터 삭제
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}

export default App;
```

`console.log('useEffect 테스트');`는 `useEffect()`가 초기 렌더링 시 호출되므로 우선 한번 출력된다.

그 후 로그인을 통해(`loginHandler` 호출) `isLoggedIn` 상태 변수가 업데이트되어 리렌더링이 발생하여도 의존성에 빈 배열을 전달했기 때문에 `useEffect()`는 더 이상 호출되지 않는다(애초에 변경 될 의존성 값이 없으므로).

자주 사용되는 방법은 아니지만 만약 의존성을 아예 전달하지 않는다면 해당 `useEffect()`는 매 렌더링마다 실행된다.

## useEffect에서 Cleanup 함수 사용하기

<!-- 내용 수정필 -->

`useEffect` 에서는 함수를 반환 할 수 있는데 이를 **cleanup 함수**라고 한다.

cleanup 함수는 `useEffect` 컴포넌트가 언마운트(DOM에서 제거)되기 전에 실행되는 함수이다. 다시 말하면, 렌더링이 발생하여 다음 새 컴포넌트가 마운트 되기 직전에 즉, 다음 `useEffect` 함수가 실행되기 전 실행된다(첫 마운트 제외).

cleanup 함수는 `useEffect` 에 대한 뒷정리를 해준다고 이해하면 될듯.

다음은 cleanup 함수가 호출되는 타이밍을 확인할 수 있는 예시이다.

```
useEffect(() => {
  console.log('useEffect')
  setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
  return () => {
    console.log('cleanup');
  }
}, [enteredEmail, enteredPassword]);
----------------------------
// 브라우저 console 탭
useEffect    -> 첫 렌더링
cleanup      -> 2번째 렌더링
useEffect
cleanup      -> 3번째 렌더링
useEffect
```

페이지 첫 로드 시 컴포넌트가 DOM에 마운트 되면서 'useEffect' 문자열이 한 번 출력된다.

그 후 `enteredEmail`, `enteredPassword` 상태 변수가 변경되면 이전 컴포넌트가 언마운트(DOM에서 제거) 되면서 cleanup 함수가 호출되고, 새 컴포넌트가 마운트(DOM에 추가) 되면서 `useEffect` 함수가 호출되어 'cleanup \n useEffect'이 출력되게 되는 것이다.

## Cleanup 함수로 디바운스(debounce) 구현하기

디바운스(debounce)란 이벤트 핸들러 처리할 때 유용한 기법으로 짧은 시간에 이벤트가 연속해서 발생하면 이벤트 핸들러 호출을 취소하고 맨 마지막에 발생한 이벤트의 핸들러 함수만 호출한다.

즉, 이벤트를 그룹화하여 맨 마지막에만 핸들러를 호출함으로서 과도한 이벤트 핸들러 호출을 막는다. 비슷한 기법으로 스로틀(throttle)이 있다.

`useEffect` cleanup 함수로 디바운스를 구현할 수 있다.

```
// 기존 코드
useEffect(() => {
  setFromIsValid(
    enterdEmail.includes('@) && enteredPassword.trim().length > 6
  );
}, [enteredEmail, enteredPassword]);
----------------------------
// 디바운스를 구현한 코드
useEffect(() => {
  const identifier = setTimeout(() => {
    setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
  }, 500);

  return () => {
    console.log('Clean up');
    clearTimeout(identifier);
  };
}, [enteredEmail, enteredPassword]);
```

위 예시의 로직은 다음과 같다.

먼저 `input` 요소의 `onChange` 이벤트가 발생할 때 마다 입력 값을 `enteredEmail`,`enteredPassword`에 업데이트한다. 그 후 `useEffect`에서 입력 값을 검사하여 `formIsValid` 상태 변수에 유효성 여부를 `Boolean` 값으로 저장한다.

여기서 문제는 입력이 업데이트될 때마다 유효성 검사도 실행되기 때문에 너무 많은 렌더링이 발생할 수 있다는 것이다. 위 예제에서의 가벼운 유효성 검사 정도라면 실제로는 별 문제가 되지 않을 수 있다. 하지만 Ajax와 같은 무거운 처리를 수행하는 코드가 있다면, 매 입력마다 요청이 발생하여 서버에 부담을 주게 된다.

이때 디바운스를 통해 입력이 0.5초 이내로 연속해서 발생하는 경우 타이머를 취소하고, 맨 마지막 입력 후 0.5초 이상 입력이 없는 경우 유효성 검사를 실행하도록 한다.

**[React docs useEffect]**

https://react.dev/reference/react/useEffect

**[A complete guide to the useEffect React Hook]**

https://blog.logrocket.com/useeffect-hook-complete-guide/#utilizing-cleanup-functions

**[The Lifecycle of React Hooks Component, 마운트 / 언마운트?]**

https://blog.bhanuteja.dev/the-lifecycle-of-react-hooks-component

https://stackoverflow.com/questions/31556450/what-is-mounting-in-react-js

**[벨로퍼트 리액트 useEffect]**

https://react.vlpt.us/basic/16-useEffect.html

# useReducer 훅

`useReducer`는 `useState`처럼 `state`를 생성하고 관리하기 위한 훅으로 여러 개의 하위 값을 갖는 **좀 더 복잡한 `state`를 다양한 방식으로 업데이트 해야할 때 유용하다**. 사용 형식은 다음과 같다.

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

### 좀 더 복잡한 경우

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

# `useContext`, `Context API`

앱 규모가 커질수록, 컴포넌트 트리가 깊어지게 되고 그에따라 자식 컴포넌트에 `props`로 데이터를 전달하는데 불편함이 생긴다.

이런 경우 `context`를 사용하여 여러 컴포넌트에 공통적으로 필요한 `state`를 전역에서 관리하여 중간에 거치는 컴포넌트 없이 하위 컴포넌트에서 직접 사용할 수 있다.

`context` 데이터를 사용하려면 필요한 하위 컴포넌트에서 `useContext` 훅을 사용해 받아오면 된다.

### 1. 컨텍스트 생성

다음은 다크모드를 구현한 예제로, 버튼을 클릭하면 `isDark` 상태 변수의 값이 `true`/`false`로 반전되고 이에 따라 모든 컴포넌트의 색을 반전시킨다.

우선 별도의 파일을 구성. `createContext`로 `context`를 생성해준다.

```
// ThemeContext.js
import { createContext } from 'react';

export const DarkTheme = createContext(null);
```

`createContext` 함수의 인수로 전달되는 값은 `Context.Provider`가 없을 경우 `useContext`로 읽어오는 초기 값이 된다. 별다른 목적이 없다면 보통 `null`을 사용한다.

### 2. 컨텍스트 제공(provide)

그 다음 `props`를 공유하고자 하는 부모 컴포넌트의 엘리먼트들을 `<Context.Provider>` 태그로 감싸주고 `value` `prop`에 전달하고자 하는 데이터를 넣어준다.

```
// App.js
import { useState } from 'react;
import Page from './components/Page';
// `<Context.Provider>`로 사용하려는 `context`를 `import` 해주는 것 주의
import { ThemeContext } from './context/ThemeContext';

function App(){
  const [isDark, setIsDark] = useState(false);

  return (
    // 공유할 context에 isDark 상태 변수와, set 함수를 전달
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <Page />
    </ThemeContext.Provider>
  )
}
```

## 3. 컨텍스트 사용

이제 `<App>`의 하위 컴포넌트에서 `context` 데이터를 사용할 수 있는데 `context` 데이터가 필요한 자식 컴포넌트에서 `useContext` 훅으로 데이터를 받아와 사용한다.

여기서도 생성한 `context`를 `import` 해줘야 하는 것 주의!

```
// Page.js
import Header from './Header'
const Page = () => {

  return (
    <div>
      <Header />
      <Content />
      <Footer />
    <div>
  )
}
export default Page;
---------------------
// Head.js
import { ThemeContext } from './context/ThemeContext';

const Header = () => {
    // 객체 디스트럭쳐링으로 context 데이터 전달 받음
  const { isDark, setIsDark } = useContext(ThemeContext);

  return (
      // context로 가져온 isDark 값에 따라 backgroundColor 값을 설정
      <header style={{ backgroundColor : isDark ? 'black' : 'white' }}>
        .
        .
        .
      </header>
    )
}
export default Header;
```

`context`를 사용해보면, `props`를 완전히 대체할 수 있어 보인다. 하지만 `context`를 사용하면 컴포넌트를 재사용하기 어려워 질 수 있고, 무분별하게 사용한다면 가독성이 떨어질 수 있기 때문에 필요한 경우에만 사용해야 한다(prop drilling을 피하기 위한 목적이라면 컴포넌트 합성도 고려해보라고 되어있다).

컨텍스트 사용 전 고려해봐야 할 사항과 사용 사례 등 추가 내용은 공식 문서 링크 참조.

**[React docs passing data deeply with context]**

https://react.dev/learn/passing-data-deeply-with-context


**[React docs createContext]**

https://react.dev/reference/react/createContext
