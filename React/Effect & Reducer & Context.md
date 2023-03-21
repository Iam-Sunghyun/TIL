<h2>목차</h2>

- [useEffect 훅](#useeffect-훅)
  - [useEffect에서 Cleanup 함수 사용하기](#useeffect에서-cleanup-함수-사용하기)
    - [Cleanup 함수로 디바운스(debounce) 구현하기](#cleanup-함수로-디바운스debounce-구현하기)
- [useReducer 훅](#usereducer-훅)
- [context - 여러 컴포넌트에 영향을 주는 State](#context---여러-컴포넌트에-영향을-주는-state)

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


### Cleanup 함수로 디바운스(debounce) 구현하기

<!-- 내용 다듬기 -->
디바운스란 이벤트 핸들러 처리할 때 유용한 기법으로 짧은 시간에 이벤트가 연속해서 발생하면 이벤트 핸들러 호출을 취소하고 맨 마지막에 발생한 이벤트의 핸들러 함수만 호출한다. 즉, 이벤트를 그룹화하여 맨 마지막에만 핸들러를 호출함으로서 과도한 이벤트 핸들러 호출을 막는다. 비슷한 기법으로 스로틀(throttle)이 있다.

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

<!-- 천천히 이해하자 -->
useState와 비슷?
복잡한 State를 관리하기 위한 훅. 여러 개의 연관된 state를 useState가 아닌 useReducer로 관리

많은 이벤트 핸들러에 분산된 상태 업데이트가 많은 구성 요소는 압도적일 수 있습니다. 이러한 경우 구성 요소 외부의 모든 상태 업데이트 로직을 리듀서라는 단일 함수로 통합할 수 있습니다 .
<!-- 다른 state를 기반으로 하는


그 경우에는 하나의 state로 병합하는 것도 좋습니다 -->
```

```
# context - 여러 컴포넌트에 영향을 주는 State