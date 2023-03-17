# useEffect 훅
<!-- 천천히 이해하자 -->
<!-- 왜쓰는지에 대하여 -->
useEffect는 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook이다.

useState와 함께 가장 많이 사용되는 훅.

컴포넌트 렌더링 후에 side effect를 수행하기 위한 리액트 훅으로 다음과 같은 형식으로 사용한다.

```
useEffect(() => { ... }, [ dependencies ]);
```
**첫 번째 인수로 함수** 전달. **두 번째 인수로는 의존성으로 구성된 배열**을 전달한다.

첫 번째로 전달한 함수는 **모든 컴포넌트 평가 후(렌더링 이후)에 실행되는데 초기 렌더링 시 실행되고, 이후에는 의존성 데이터가 변경된 상태에서 발생한 렌더링 때만 실행된다**. 즉, 매 렌더링마다 호출되는 것이 아닌 개발자가 의도한 경우에만 실행되는 것.

다음은 브라우저 로컬 스토리지(localstorage)에 저장된 값을 이용해 로그인 여부를 확인하는 코드인데, `console.log()`를 통해 `useEffect`가 호출되는 횟수를 확인해볼 수 있었다.

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

`console.log('useEffect 테스트');`는 `useEffect()`가 초기 렌더링 시 호출되므로 한번 출력된다. 

그 후 로그인을 통해(`loginHandler` 호출) `isLoggedIn` 상태 변수가 업데이트되어 리렌더링이 발생하여도 의존성에 빈 배열을 전달했기 때문에 `useEffect()`는 호출되지 않는다(애초에 변경 될 의존성 값이 없으므로). 

자주 사용되는 방법은 아니지만 만약 의존성을 아예 전달하지 않는다면 해당 `useEffect()`는 매 렌더링마다 실행된다.

<!-- ## useEffct 훅 의존성(Depedency)

모든 컴포넌트 재평가 후에

특정 의존성이 변경되는 경우의 예를

로그인 컴포넌트에서 찾을 수 있습니다

```
const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    setFormIsValid(enteredEmail.includes('@') && enteredPassword.trim().length > 6);
  }, [setFormIsValid, enteredEmail, enteredPassword]);

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes('@'));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div className={`${classes.control} ${emailIsValid === false ? classes.invalid : ''}`}>
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div className={`${classes.control} ${passwordIsValid === false ? classes.invalid : ''}`}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};
``` -->

## useEffect에서 Cleanup 함수 사용하기

<!-- Cleanup 함수란? -->
+ 디바운스로 최적화..

# useReducer 훅

<!-- 천천히 이해하자 -->
useState와 비슷?
복잡한 State를 관리하기 위한 훅

많은 이벤트 핸들러에 분산된 상태 업데이트가 많은 구성 요소는 압도적일 수 있습니다. 이러한 경우 구성 요소 외부의 모든 상태 업데이트 로직을 리듀서라는 단일 함수로 통합할 수 있습니다 .

# context - 여러 컴포넌트에 영향을 주는 State