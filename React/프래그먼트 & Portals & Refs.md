<h2>목차</h2>

- [JSX의 제한 사항](#jsx의-제한-사항)
  - [컴포넌트 Wrapper 만들기](#컴포넌트-wrapper-만들기)
  - [`<Fragment>`로 래핑하기](#fragment로-래핑하기)
- [React Portals 이란?](#react-portals-이란)
  - [1. 이동할 위치(마운트 지점) 지정](#1-이동할-위치마운트-지점-지정)
  - [2. `createPortal` 메서드로 포탈 래퍼 컴포넌트 생성](#2-createportal-메서드로-포탈-래퍼-컴포넌트-생성)
- [useRef 훅](#useref-훅)


# JSX의 제한 사항

컴포넌트가 반환하는 `JSX`는 하나의 루트 요소만 존재해야 한다고 했다. 즉, 하나의 엘리먼트에 감싸져 있어야 한다는 것인데 그 이유는 자바스크립트 자체가 하나의 반환 값만 허용하기 때문.

이러한 `JSX`의 한계로 인해 발생하는 문제점은 불필요한 Wrapper 요소가 너무 많아질 수 있다는 것이다('div soup' 이라고도 한다).

웹 사이트, 웹 애플리케이션의 규모가 커질수록 불필요한 DOM 요소 렌더링이 너무 많아져 성능이 느려질 수 있고, 중첩된 Wrapper 요소로 인해 레이아웃(ex) `Flex`, `grid`...)이 제대로 적용되지 않거나
중첩 CSS 선택자를 사용하여 스타일을 지정한 경우(ex) `ul > li`,  `table>tr>td`...) 예상대로 적용되지 않을 수 있는 등 문제가 될 수 있다(문제 예시는 아래 링크 참조). 

이러한 문제를 예방하기 위해 실제 DOM에는 영향을 주지 않는 Wrapper 컴포넌트가 필요하다.

## 컴포넌트 Wrapper 만들기

다음은 아무 컴포넌트로도 감싸지지 않은 `props.children`만을 반환하는 컴포넌트이다.

```
const Wrapper = (props) => {
  return props.children;
}

export default Wrapper;
```

아래와 같이 Wrapper 컴포넌트로 인접해있는 여러 개의 컴포넌트를 감싸서 return 하면 에러가 발생할 것 같으나 문제없이 작동한다. 이유는 하나의 루트 요소에 담겨져 있기 때문.

```
return (
  <Wrapper>
    <div>...</div>
    <div>...</div>
    <div>...</div>
      .
      .
  </Wrapper>
);
```

Wrapper 컴포넌트가 반환하는 내용이 인접한 여러 자식 컴포넌트들 일지라도, 직접 return 하지 않고 `props.children` 형태로 하나의 반환 값만 반환하기 때문에 에러가 발생하지 않는다(일종의 트릭).

물론 실제 DOM에도 Wrapper 요소는 추가되지 않기 때문에 기존에 하나의 컴포넌트로 감싸서 return 하는 방식과 비교했을 때 래퍼 컴포넌트들로 인해 렌더링되는 요소들이 불필요하게 많아지는 일을 방지할 수 있다.

## `<Fragment>`로 래핑하기

위에서 사용했던 Wrapper 컴포넌트를 따로 만들지 않아도 동일한 기능을 하는 React 컴포넌트가 있다. 바로 `<Fragment>` 컴포넌트이다.

실제 DOM에 래퍼 요소가 생성되지 않아 불필요한 요소 생성을 줄일 수 있으며 요소 중첩으로 인한 스타일 문제도 피할 수 있다. 

주로 약칭인 `<></>` 형태로 사용하며 프로젝트 설정에 따라 지원하지 않는 경우도 있다고 한다.

만약 프래그먼트에 `Key`를 전달하려면 `<></>` 구문을 사용할 수 없으며 `<Fragment key={yourKey}>...</Fragment>` 형태로 사용해야 한다.

```
return (
  <>
    <div>...</div>
    <div>...</div>
    <div>...</div>
      .
      .
  </>
);
```

**[Fragment 사용 이유, 중첩 요소로 인한 문제점 이해]**

https://blog.logrocket.com/understanding-react-fragments/

**[React docs `<fragment>`]**

https://beta.reactjs.org/reference/react/Fragment

# React Portals 이란?

포탈(Portals)이란 HTML 요소를 DOM 트리의 다른 위치로 옮기는 기능이다.
<!-- 내용 수정필 -->
포탈의 사용 예시를 하나 들자면, 화면 가장 위에 표시되는 모달의 경우 DOM의 깊은 곳에 있는 컴포넌트가 모달을 생성한다면 웹 페이지 가장 상위에 표시되는 모달이 DOM 트리 레벨 깊은 곳에 추가될 것.

이는 페이지의 구조적으로도 좋지 않고 스크린 리더를 사용하는 경우 화면 최상위에 오버레이되는 모달인 것이 확실하지 않아져 접근성에도 좋지 않다.

이런 경우 React 포탈을 사용해 요소를 DOM 트리의 다른 위치로 이동시킬 수 있다(EX) `<body>` 바로 밑).

이외에도 부모 컴포넌트 외부로 이동한 요소는 버블링되는 이벤트를 수신하여 부모 컴포넌트와 통신할 수 있으며 `Context`를 사용해 데이터를 전달할 수도 있다.

포탈을 사용하기 위해서는 우선 요소를 이동시킬 위치를 지정해야하고 또 그것을 컴포넌트에게 알려야한다. 다음 챕터에서 실제 코드를 통해 그 절차를 확인해본다.


## 1. 이동할 위치(마운트 지점) 지정


`index.html`에 요소가 이동할 위치를 지정해준다.

```
// public/index.html
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="backdrop-root"></div>  // 포탈 이동 위치 1
    <div id="overlay-root"></div>   // 포탈 이동 위치 2
    <div id="root"></div>
  </body>
```

## 2. `createPortal` 메서드로 포탈 래퍼 컴포넌트 생성

<!-- 내용 수정필? -->
`createPortal` 메서드는 `react-dom`에서 제공하는 포탈 생성 메서드이다.

`createPortal(children, domNode)`는 두 개의 인수를 전달하여 호출하는데 첫 번째는 렌더링 되어야하는 요소, 두 번째는 마운트 해야할 위치(요소)를 전달한다.

다음은 포탈을 사용해 에러 메시지 모달을 `body` 요소 바로 밑으로 이동시키는 예시이다.

```
import { createPortal } from 'react-dom';

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.title}</h2>
      </header>
      <div className={classes.content}>
        <p>{props.message}</p>
      </div>
      <footer className={classes.actions}>
        <Button onClick={props.onConfirm}>Okay</Button>
      </footer>
    </Card>
  );
};

// 포탈용 래퍼 컴포넌트
const ErrorModal = (props) => {
  return (
    <>
      {createPortal(<Backdrop onConfirm={props.onConfirm} />, document.getElementById('backdrop-root'))}
      {createPortal(
        <ModalOverlay title={props.title} message={props.message} onConfirm={props.onConfirm} />,
        document.getElementById('backdrop-root')
      )}
    </>
  );
};
```

`Backdrop`과 `ModalOverlay` 컴포넌트는 `ErrorModal` 래퍼 컴포넌트에만 사용되므로 하나의 파일에 묶어서 작성하였으며 첫 번째 인수로 `JSX`를 전달한 것과, 두 번째 인수에 DOM API로 요소를 취득해온 것을 주의하자.

`ErrorModal`로 감싼 포탈 대상 컴포넌트들은 컴포넌트 트리 어느 위치에 있던 상관없이 포탈로 이동시킬 위치(두 번째 인수로 전달한 요소 위치)에 렌더링 된다.

위 코드를 실행한 후 Elements 탭을 확인해보면 다음과 같이 지정한 위치에 렌더링된 것을 확인할 수 있다.

```
// 개발자 도구 Elements 탭
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="backdrop-root">
      <div class="ErrorModal_backdrop__i7dT4"></div>
    </div>
      <div id="overlay-root">...</div>
    </div>
    <div id="root"></div>
  </body>
```

**[React docs createPortal]**

https://beta.reactjs.org/reference/react-dom/createPortal

**[React portal 장/단점 및 사용 예시]**

https://codefrontend.com/react-portals/

https://www.geeksforgeeks.org/what-are-portals-in-react-and-when-do-we-need-them/

https://blog.logrocket.com/learn-react-portals-example/

# useRef 훅

`useRef` 훅은 'Ref'라는 이름 그대로 실제 DOM 요소를 참조하기 위한 기능이다.

```
// ref prop으로 지정한 요소의 참조가 저장 됨
const nameInputRef = useRef();

// 참조할 대상 요소
<input.... ref={nameInputRef}></input....>
```

참조할 리액트 요소에 `ref` prop을 추가해주면, `useRef()`로 생성한 변수에 해당 요소의 참조가 저장된다.

<!-- 흠,, 이벤트 객체로도 참조 가능한데 사용 장점은?-->
드암과 같이 폼 submit 이벤트 핸들러에서 `useRef()`로 생성한 input 요소 참조 변수를 통해 state와 같은 변수없이 입력 값을 가져올 수 있다.

```
const AddUser = (props) => {
  const nameInputRef = useRef();
  const [error, setError] = useState();

  const addUserHandler = (event) => {
    event.preventDefault();
    if (nameInputRef.value.trim().length === 0) {
      setError({
        title: 'Invalid input',
        message: 'Please enter a valid name and age (non-empty values).',
      });
      return;
    }
    props.onAddUser(enteredUsername, enteredAge);
  };

  const errorHandler = () => {
    setError(null);
  };
      .
      .
  return (
    <>
      {error && <ErrorModal title={error.title} message={error.message} onConfirm={errorHandler} />}
      <form onSubmit={addUserHandler}>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          type='text'
          ref={nameInputRef}
        />
        <Button type='submit'>Add User</Button>
      </form>
    </>
  );
};
```
<!-- 내용, 예시 보충 필요  -->
submit 이벤트 핸들러 마지막에 input 요소를 리셋해주기 위해 다음과 같이 코드를 작성할 수도 있는데, 이런 식으로 DOM을 직접 조작하기 위해 `ref`을 사용하는 건 매우 드물다.

```
nameInputRef.current.value = '';
ageInputRef.current.value = '';
```

사용자 입력으로부터 즉각적인 상호작용을 원한다면 state를 사용하는게 맞을듯.
<!-- 
렌더링 트리거 없이 데이터를 저장하기 위해선 Ref?

useRef()로 DOM 요소를 참조하여 값을 사용하는 경우...비제어 컴포넌트 -->


**[React docs Refs]**

https://beta.reactjs.org/learn/escape-hatches
