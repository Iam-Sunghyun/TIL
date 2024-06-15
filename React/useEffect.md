<h2>목차</h2>

- [`useEffect`](#useeffect)
  - [컴포넌트가 순수 함수일 때 장점?](#컴포넌트가-순수-함수일-때-장점)
  - [Reference](#reference)
  - [`useEffect`에서 Cleanup 함수 사용하기](#useeffect에서-cleanup-함수-사용하기)
  - [Cleanup 함수로 디바운스(debounce) 구현하기](#cleanup-함수로-디바운스debounce-구현하기)
- [`useEffect` 의존성 배열에 대한 규칙](#useeffect-의존성-배열에-대한-규칙)
  - [의존성 배열에 불필요한 종속성 최소화 하는법](#의존성-배열에-불필요한-종속성-최소화-하는법)
  - [`useEffect` 모범 사례가 아닌 경우](#useeffect-모범-사례가-아닌-경우)
  - [Reference](#reference-1)

# `useEffect`

`useState`와 함께 가장 많이 사용되는 훅으로 컴포넌트 렌더링 후에 부수 효과(side effect)를 수행하기 위한 리액트 훅이다. 여기서 부수 효과란 외부 상태를 변경하는 것을 말한다.

사용 방식은 다음과 같다.

```
useEffect(() => { ... }, [ dependencies ]);
```

**첫 번째 인수로 `setup` 함수** 전달. **두 번째 인수로는 의존성 배열**을 전달한다.

첫 번째로 전달한 함수는 **컴포넌트가 마운트 되면(컴포넌트가 DOM에 처음 추가되면)실행되며, 이후에는 의존성 데이터가 변경된 다음 발생한 리렌더링 후에 실행된다**(`Object.is` 함수로 배열의 요소들을 이전 렌더링 값과 비교).

<!-- 개념 추가 이해 필-->

리액트의 범위를 벗어난 부수 효과(side effect, 부작용)를 일으키는 작업은 렌더링 로직과 분리되어야 하며 필요시 렌더링 이후에 수행되어야 한다. 이 말은 **컴포넌트가 순수함수이어야 한다는 것**인데 컴포넌트를 순수한 함수로만 엄격하게 작성하면 **코드베이스가 커짐에 따라 예측할 수 없는 버그와 동작을 막을 수 있고 또 리액트는 컴포넌트가 순수 함수일 것을 가정하여 설계되었기 때문에 반드시 순수 함수로 작성되어야 한다.**

## 컴포넌트가 순수 함수일 때 장점?

1. 예측 가능한 동작: 순수한 컴포넌트는 동일한 입력에 대해 항상 동일한 출력을 생성한다. 이는 컴포넌트의 동작을 예측 가능하게 만들어 준다. 같은 props를 전달하면 항상 같은 결과를 얻을 수 있기 때문에 디버깅과 테스트가 더 쉬워진다.

2. 재사용성: 순수한 컴포넌트는 외부 의존성이 없고 입력에만 의존하므로 재사용성이 높아진다. 다른 프로젝트나 다른 부분에서 같은 컴포넌트를 사용할 수 있고 순수한 컴포넌트는 하나의 기능을 수행하기 때문에 다른 컴포넌트와 조합하여 더 복잡한 UI를 구성하는 데 유용하다.

3. 성능 최적화(메모이제이션): 순수한 컴포넌트는 불필요한 렌더링을 방지하여 성능을 최적화할 수 있다. 리액트는 가상 DOM을 사용하여 컴포넌트의 변경사항을 비교하고 필요한 경우에만 업데이트를 수행하는데 순수한 컴포넌트는 동일한 props를 전달할 때 이전과 동일한 결과를 반환하기 때문에 변경사항이 없으면 불필요한 렌더링을 방지할 수 있다(`React.memo`).

4. 테스트 용이성: 순수한 컴포넌트는 독립적으로 테스트할 수 있다. 외부 의존성이 없고 입력에만 의존하기 때문에 특정 상황에서의 동작을 쉽게 검증할 수 있다. 이는 테스트의 안정성과 신뢰성을 향상시키는 데 도움이 된다.

컴포넌트의 순수성을 유지하는 것은 리액트 애플리케이션을 개발하고 유지보수하는 데 매우 중요하다. 이를 통해 코드의 가독성, 재사용성, 성능, 테스트 용이성 등을 향상시킬 수 있다.

<!-- 1. 재사용성,
2. 캐시에 안전(메모이제이션 가능 React.memo, )
3. 버그 가능성 ↓ 예측하기 쉬우므로 테스트 용이 -->

<!-- 자세한 추가 내용은 링크 참조. -->

## Reference

**[React docs 컴포넌트가 순수해야하는 이유]**

https://react.dev/learn/keeping-components-pure#why-does-react-care-about-purity

**[순수 함수의 장점]**

https://www.learningjournal.guru/article/scala/functional-programming/benefits-of-pure-functions/

https://alvinalexander.com/scala/fp-book/benefits-of-pure-functions/

<br/>

참고로 **공식 문서에선 부수 효과를 내는 작업은 이벤트 핸들러 내부에서 수행하는걸 권장하고 있다. 그러나 부수 효과를 처리할 적절한 이벤트 핸들러를 발견하지 못하는 경우도 있는데, 그런 경우 최후의 수단으로 useEffect를 사용하라고 되어있다**(공식 홈페이지에 'escape hatch'라고 표현되어있는 이유..).

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

그 후 로그인을 통해(`loginHandler` 호출) `isLoggedIn` 상태 변수가 업데이트 되어 리렌더링이 발생하여도 의존성에 빈 배열을 전달했기 때문에 `useEffect()` `setup` 함수는 더 이상 호출되지 않는다(애초에 변경 될 의존성 값이 없으므로). **즉, 의존성에 빈 배열을 전달하면 컴포넌트가 마운트된 후 한번만 호출된다.**

자주 사용되는 방법은 아니지만 만약 **의존성을 아예 전달하지 않는다면 해당 `useEffect()`는 매 렌더링마다 실행된다.**

추가로 개발 환경에서 리액트 v18의 `<StrictMode>`가 활성화 되어있는 경우 컴포넌트 마운트 시 `setup` 함수와 `cleanup` 함수가 우선 한번씩 호출된 후 `setup` 함수가 호출된다. 이는 Effect의 로직이 올바르게 구현되었는지 확인하기 위한 테스트의 일환이다.

## `useEffect`에서 Cleanup 함수 사용하기

`useEffect` 에서는 함수를 반환 할 수 있는데 이를 **cleanup 함수**라고 한다.

cleanup 함수는 `useEffect`의 의존성이 변경된 상태에서 리렌더링 된 경우 `useEffect` 함수 전에 먼저 호출되는 함수이다. + 컴포넌트가 언마운트(DOM에서 완전히 제거)되고 나서는 단독적으로 실행되는 함수이다.

<!-- 컴포넌트는 마운트 -> 업데이트 -> 언마운트 주기를 갖는다 -->

cleanup 함수는 필요에 따라 이전 `useEffect` 함수에 대한 뒷정리를 해주기 위한 함수라고 이해하면 될듯.

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

그 후 의존성 배열의 요소인 `enteredEmail`, `enteredPassword` 상태 변수가 업데이트 되어 리렌더링이 발생하여 컴포넌트가 리페인트 된 후 cleanup 함수가 호출된 다음, `useEffect` 함수가 호출되어 'cleanup \n useEffect'이 출력되게 되는 것이다.

추가로 `useEffect`는 `cleanup` 함수 이외에 반환 값이 있어선 안된다. 따라서 `async/await`을 사용하는 경우는 다음과 같이 작성해줘야 한다.

```
// async 함수는 암묵적으로 항상 프로미스를 반환한다. 그러므로 useEffect의 중첩 함수로 선언하여 cleanup 함수가 아닌 값을 반환하는 일이 없도록 해준다.
useEffect(() => {
  async function testFetch() {
    try{
      const result = await fetch('https://test.com');
      const data = await result.json();
    } catch (e) {
      console.log(e);
    }
  }

  testFetch();
  return () => {
      console.log('Clean up')
    }
}, [testDependency])
```

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

# `useEffect` 의존성 배열에 대한 규칙

`useEffect` 함수 내부에서 사용되는 데이터가 브라우저나 컴포넌트 외부에서 온 데이터가 아닌 경우 즉, 리렌더링으로 인하여 변경될 여지가 있는 컴포넌트 내부의 반응형 값(`state`, `props`, `Context` 데이터, 함수, 변수 등..)이라면 반드시 의존성 배열에 포함시켜야 한다(실행 시 에러는 발생하지 않으나 `linter`가 콘솔에 오류로 표시함).

만약 리렌더링으로 변경될 수 있는 반응형 값이 의존성에 제대로 포함되지 않으면 버그가 발생할 위험이 높다.

## 의존성 배열에 불필요한 종속성 최소화 하는법

의존성 배열에 종속성이 너무 많이 포함되어 있으면 `useEffect`가 너무 많이 실행될 수 있다. 종속성의 내용에 따라 다음과 같이 작성하여 `useEffect`가 과도하게 호출되는 것을 방지할 수 있다.

1. 함수 종속성

   - 함수 정의를 `useEffect` 내부로 이동시킨다.
   - 여러 곳에서 사용되는 함수는 `useCallback`으로 캐시해준다.
   - 컴포넌트 내부의 반응형 값을 사용하지 않는다면 컴포넌트 외부에 정의해준다(렌더링에 영향받지 않으므로 의존성 배열에 넣지 않아도 됨).

2. 객체 종속성

   - 객체 자체를 의존성에 넣지 않고 객체의 원시값 프로퍼티를 넣는다.
   - `useEffect` 내부에 객체를 이동시키거나 `useMemo`로 메모이제이션 해준다.

3. 그 외 상태 값
   - 여러 반응형 값(컴포넌트 내부의 `state`, `props` 등)을 `useReducer`로 관리한다. 그런 경우 `useState`를 사용했을 때처럼 `setState`를 포함시키지 않아도 되고, `reducer`의 `dispatch` 함수 같은 경우 리액트가 렌더링 간 변경되지 않는 것을 보장하기 때문에 종속성에 포함시키지 않아줘도 된다.

## `useEffect` 모범 사례가 아닌 경우

1. 사용자 이벤트에 반응

   - 이벤트 핸들러를 사용하는 것이 적합하다.

2. Fetching data

   - 소규모 애플리케이션에선 문제가 없으나, 실제 서비스에서는 `React Query`같은 라이브러리로 원격 상태를 가져오는게 더 좋은 방법이다(Reference 참고).
   - (실제로 실습 프로젝트에서 effect로 가져오는 데이터의 순서가 달라지는 경우가 있어 화면에 데이터가 올바르게 표시되지 않은 경우가 있었다.)

3. 상태(state) 변수로 다른 상태 변수를 업데이트
   
   - 리렌더링이 여러 번 발생할 수 있다.
   - 파생 상태(derived state, 기본 상태로부터 직접적으로 계산된 상태)나 이벤트 핸들러를 사용하도록 한다.

## Reference

**[`Effect`에서 데이터 `Fetch`에 대한 좋은 대안은?]**

https://react.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects

**[React docs useEffect]**

https://react.dev/reference/react/useEffect

https://react.dev/learn/escape-hatches -> ※ Effect 관련 내용 목록 확인

**[React docs useEffect 의존성 배열 규칙, 반응형(reactive) 값이란?]**

https://react.dev/reference/react/useEffect#specifying-reactive-dependencies

https://react.dev/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values

**[The Lifecycle of React Hooks Component - useEffect, cleanup 함수]**

https://blog.bhanuteja.dev/the-lifecycle-of-react-hooks-component

https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#render-and-commit-phases
