<h2>목차</h2>

- [컴포넌트에 이벤트 핸들러 등록하기](#컴포넌트에-이벤트-핸들러-등록하기)
  - [Reference](#reference)
- [상태 변수로 상호작용 추가하기 (`useState()`, 상태 `Hook`,)](#상태-변수로-상호작용-추가하기-usestate-상태-hook)
- [`useState` 훅(`Hook`)이란?](#usestate-훅hook이란)
  - [`useState` 게으른 초기화(lazy initialize)](#usestate-게으른-초기화lazy-initialize)
- [`setSomething(nextState)` 함수로 상태 업데이트](#setsomethingnextstate-함수로-상태-업데이트)
  - [HTML `Form`으로 사용자 입력받아 상태 업데이트하기](#html-form으로-사용자-입력받아-상태-업데이트하기)
  - [`set` 함수의 상태 업데이트 일괄처리(Batching)](#set-함수의-상태-업데이트-일괄처리batching)
  - [다음 렌더링 전 `state` 값을 여러 번 업데이트하기](#다음-렌더링-전-state-값을-여러-번-업데이트하기)
  - [Lifting state up - 상위 컴포넌트에 데이터 전달하기](#lifting-state-up---상위-컴포넌트에-데이터-전달하기)
  - [Reference](#reference-1)

# 컴포넌트에 이벤트 핸들러 등록하기

컴포넌트에 이벤트를 등록하는 것은 HTML 요소에서 이벤트 어트리뷰트를 통해 이벤트 핸들러를 등록하는 방법과 거의 동일하다.

다음은 각각 HTML과 React에서 이벤트 핸들러를 등록하는 예시이다.

```
// HTML 이벤트 어트리뷰트
<button onclick="activateLasers()">
  Activate Lasers
</button>
---------------
// React
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

둘다 'on' 접두사와 함께 해당 요소에서 유효한 이벤트를 이름으로 한다. 여기서 `React`는 카멜 케이스를 사용하고 값으로 `{}`를 사용한다는 차이가 있다.

## Reference

**[React 지원하는 event]**

https://ko.reactjs.org/docs/events.html

https://react.dev/reference/react-dom/components/common#reference

https://react.dev/reference/react-dom/components/input
 
# 상태 변수로 상호작용 추가하기 (`useState()`, 상태 `Hook`,)

다음은 버튼 클릭 시 근처 요소의 텍스트가 변경되는 이벤트 핸들러를 등록하는 코드이다. 

이벤트 핸들러를 등록하고 이벤트를 발생시키면 `console.log(title)`로 인해 브라우저 콘솔창에 변경된 `title` 값이 출력되는 반면 화면의 `<h2>`요소의 텍스트는 변경되지 않는다.

```
function ExpenseItem(props) {
  let title = props.title;
  const clickHandler = () => {
    title = '제목 업데이트 테스트';
    console.log(title);
  };

  return (
    <Card className='expense-item'>
      <div className='expense-item__description'>
        <ExpenseDate date={props.date} />
        <h2>{title}</h2>
      </div>
      <div className='expense-item__price'>
        {props.amount + ' 원'}
        <button onClick={clickHandler}>버튼</button>
      </div>
    </Card>
  );
}
```

그 이유는 위와 같이 일반적인 지역변수는 렌더링 간에 값이 유지되지도 않고(매 렌더링마다 새롭게 평가, 생성), 초기 렌더링 이후 지역변수 값을 변경하는 것으로는 렌더링이 트리거 되지 않기 때문이다(**리액트에서 "렌더링"은 React가 함수 컴포넌트를 호출하거나, 클래스 컴포넌트의 경우 `render()`를 호출하는 것을 의미한다**). 

이런 경우 `useState` 훅을 사용하여 새로운 렌더링이 발생해도 이전 값을 유지하고, 또 값 변경 시 화면을 업데이트하기 위해 렌더링을 트리거하는 상태 변수를 사용한다.

# `useState` 훅(`Hook`)이란?

**`state`란 컴포넌트 자기 자신 안에서 생성되고 제어되는 데이터로 렌더링 간에 유지되며(언마운트 시 사라짐) `set` 함수로 값 변경 시 렌더링을 트리거하여 반응성을 추가하는데 사용되는 데이터이다**.

리액트 훅(React Hook)은 React 버전 16.8부터 추가된 기능으로, 함수형 컴포넌트에서 상태(state)와 클래스 컴포넌트의 라이프 사이클(lifecycle) 메서드 기능을 사용할 수 있도록 해주는 리액트의 내장 함수이다.

React 훅에는 `state`를 제어하는 `Hook` 말고도 `useState`, `useEffect`, `useContext`와 같은 여러 `Hook`이 있으며 모든 `Hook`은 컴포넌트 내부의 최상위 수준에서 호출되어야 한다.

아래와 같이 `useState()` 훅을 호출하여 인수를 초기 값으로 갖는 상태 변수(`state`)와, `state`를 업데이트 할 수 있는 `set` 함수를 요소로 갖는 배열을 반환받아 `state`를 제어할 수 있다.

```
import ExpenseDate from './ExpenseDate';
import Card from '../UI/Card';
import './ExpenseItem.css';
import { useState } from 'react';

function ExpenseItem(props) {
  const [title, setTitle] = useState(props.title); // state와 업데이트 함수를 반환

  // 버튼 클릭 이벤트 핸들러
  const clickHandler = () => {
    setTitle('업데이트 완료');  // 변경 값을 인수로 전달
    console.log(title);
  };

  return (
    <Card className='expense-item'>
      <div className='expense-item__description'>
        <ExpenseDate date={props.date} />
        <h2>{title}</h2>      // state
      </div>
      <div className='expense-item__price'>
        {props.amount + ' 원'}
        <button onClick={clickHandler}>버튼</button>
      </div>
    </Card>
  );
}
```

## `useState` 게으른 초기화(lazy initialize)

컴포넌트의 `state`는 초기 렌더링 시 `useState()`에 전달한 인수로 한번 초기화되고 다음 렌더링부터 무시된다. 이때 콜백 함수(initializer 함수)를 전달하여 값을 초기화해줄 수 있는데 이를 게으른 초기화(lazy initiliize)라고도 한다. 함수를 사용하면 초기 상태 값을 동적으로 계산할 수 있으며 이는 경우에 따라 유용할 수 있다.
 
주의할 것은 다음과 같이 초기화 함수를 호출해버리면 초기 렌더링 후 반환 값은 무시되지만 함수는 계속해서 호출되는 불필요한 작업이 일어나므로 **함수 자체를 전달해줘야 한다.**

```
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

다음과 같이 함수 자체를 전달하면 리액트는 초기 렌더링 때만 호출하고 그 다음 렌더링부턴 호출하지 않는다.

```
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

# `setSomething(nextState)` 함수로 상태 업데이트

`useState()`가 반환한 `set` 함수에 인수를 전달해 호출하면 상태 변수 값을 업데이트하고 렌더링을 트리거 할 수 있다.

`set` 함수를 호출하면 우선 `Object.is` 메서드로 이전 상태와 인수로 전달한 새 값을 비교하고 값이 다르면 렌더링을 트리거하고, 동일하면 렌더링을 건너뛴다.

함수 컴포넌트가 다시 호출되면(리렌더링) 위의 `title` 상태 변수는 `useState()`의 인수로 또 다시 초기화되는 것이 아닌 `setTitle()`로 설정한 가장 최신 값이 할당되는데 이는 상태 변수가 지역 변수와 달리 매 호출마다 새롭게 평가되고 값이 할당되는 것이 아니라 리액트에 의해 유지되기 때문이다.

추가로 `set` 함수를 통한 `state` 업데이트는 비동기로 일괄적으로 처리된다. 따라서 위에서 `setTitle()` 다음에 `console.log()`가 위치하여도 콘솔 창에는 업데이트 전 값이 출력된다. 

## HTML `Form`으로 사용자 입력받아 상태 업데이트하기

`Form` 요소로 사용자 입력을 받고 이벤트 핸들러에서 `state`를 업데이트하는 코드이다.

사용자로부터 날짜, 이름, 금액을 입력 받고 폼 요소의 Submit 이벤트를 통해 상태를 업데이트한다.

```
function ExpenseForm() {

  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const formSubmited = e => {
    setDate(e.target[0]);
    setTitle(e.target[1]);
    setAmount(e.target[2]);
    e.preventDefault();     
  };

  return (
    <form  className='new-expense__form' onSubmit={formSubmited} >
      <div>
        <label htmlFor='date'>날짜</label>
        <input type='date' name='date' id='date' min='2019-01-01' max='2023-12-31' required />
      </div>
      <div>
        <label htmlFor='title'>항목 명</label>
        <input type='text' name='title' id='title' required/>
      </div>
      <div>
        <label htmlFor='amount'>금액</label>
        <input type='number' name='amount' id='amount' min='1' required/>
      </div>
        <button>등록</button>
    </form>
  );
}

export default ExpenseForm;
```
## `set` 함수의 상태 업데이트 일괄처리(Batching)

상태 업데이트에 대해서 알아야 할 것은 `set` 함수는 **다음 렌더링에서만 상태 변수를 업데이트한다는 것**과 **React는 `set` 함수를 일괄 처리한다는 것**이다(batching 이라고 한다). 즉, `set` 함수는 **비동기적으로** 동작하여 따로 큐에 푸시되고, 이벤트 핸들러의 모든 코드가 실행되고 난 뒤 일괄적으로 실행되어 한번의 리렌더링이 발생하고 상태가 업데이트된다. 이때 `Object.is()` 메서드로 이전 상태와 새 상태를 비교하여 값이 변경된 경우 렌더링된다. 

정리하면 **`set` 함수 호출마다 렌더링이 발생하는 것이 아니라는 것이다.** 이런 방식으로 동작하는 이유는 **단일 이벤트 중에 여러 번 렌더링되는 것을 방지하여 성능 저하를 막고 변수 전체가 업데이트되지 않은 미완성 상태로 화면을 출력하지 않기 위함**이다. 

```
추가로 리액트 18 이전에는 리액트 컴포넌트에 등록한 이벤트 핸들러의 set 함수만 일괄처리 됐었으나, 18 버전 이후로 DOM api(ex) addEventListner())로 요소에 추가한 이벤트 핸들러, 프로미스, 타이머 함수와 같은 모든 비동기 작업에서도 일괄처리가 적용되게 되었다. 
```

따라서 아래와 같이 동일한 `set` 함수를 여러 번 호출하여도 일괄적으로 실행되며 한번의 렌더링이 발생하기 때문에 상태 값이 거듭해서 업데이트 되는 것이 아니다(예상대로 +3이 나오려면 각각의 `set` 함수마다 렌더링이 발생해야 가능한 것).

```
/** 
 * 버튼을 클릭하면 number 값이 +3 될 것 같지만 그렇지 않다.
 * set 함수는 다음 렌더링에 대한 상태 값을 업데이트하는 것이고, 일괄적으로 처리되고 나서 렌더링이 발생하기 때문에 각각의 set 함수 호출마다 상태 변수가 업데이트 되지 않는다.
 * 따라서 아래의 set 함수 3회 호출은 렌더링 당시 number 값(0)을 기준으로 다음 렌더링에 number에 0 + 1 을 할당하라고 3번 호출하는 것과 같다.
 * 결론적으로 버튼 클릭 시 number 값은 +3이 아닌 +1이 되는 것.
 */
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

추가로 상태 변수를 다음과 같이 하나의 객체로 선언할 수도 있다.

```
function ExpenseForm() {

const [userInput, setUserInput] = useState({
  date: '',
  title: '',
  amount: ''
});

const formSubmited = e => {
    setUserInput({
      ...userInput,
      date: e.target[0],
    });
    e.preventDefault();
  };

 return (
        . 
        .
        .
  );
}
```

주의할 것은 `set` 함수로 객체 상태 변수를 업데이트 시 업데이트 하지 않는 프로퍼티도 추가해줘야 한다는 것.

**`set` 함수는 이전 값과 병합하는게 아닌 새롭게 업데이트하는 것**이기 때문에 `set` 함수에 전달하지 않은 프로퍼티는 사라진다. 

## 다음 렌더링 전 `state` 값을 여러 번 업데이트하기

이전 상태 값에 의존하여 다음 렌더링 전에 상태를 여러 번 업데이트해야 되는 경우가 있을 수 있다.

여러 개의 이벤트 핸들러에서 `set` 함수로 업데이트 하는 코드가 있고 해당 이벤트 핸들러들이 동시에 호출된다면, 혹은 하나의 이벤트 핸들러에서 동시에 여러 개의 `set` 함수로 업데이트 한다면 갱신되지 않은 `state` 값으로 업데이트하여 기대한 값이 나오지 않을 수 있다. 

이런 경우 **`set` 함수에 콜백을 전달하여 이전 상태 값에 의존하여 업데이트 할 수 있다.**

```
// 버튼 클릭 시 number 값이 +3 씩 증가
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
------------------------------------
// 위의 코드를 수정한 예시
function ExpenseForm() {

const [userInput, setUserInput] = useState({
  date: '',
  title: '',
  amount: ''
});

const formSubmited = e => {
    setUserInput(userInput => ({   // 이전 userInput 값에 의존
      ...userInput,    
      date: e.target[0],
    }));
    e.preventDefault();
  };

 return (
        . 
        .
        .
  );
}
```
</br>

## Lifting state up - 상위 컴포넌트에 데이터 전달하기

상태 끌어올리기(Lifting state up)는 **컴포넌트 간에 상태를 공유할 때 사용되는 중요한 패턴**으로 자식 컴포넌트에서 부모 컴포넌트로 데이터를 이동해서, 부모 컴포넌트에서 사용하거나 또는 다른 자식 컴포넌트로 데이터를 전달하는 것을 말한다(트리에서 간선을 하나씩 거쳐 이동하는 것과 같다).

아래의 `ExpenseForm.js`에서 폼으로 수집한 사용자 데이터를 상위 컴포넌트인 `App.js`에 전달하는 과정을 통해 상태 끌어올리기(Lifting state up)가 어떻게 동작하는 것인지 살펴본다. 


```
// App.js (상위 컴포넌트)
function App() {
      .
      .
      .
  // 하위 컴포넌트 데이터를 전달받기 위한 함수
  const onAddExpense = expenses => {
    console.log(expenses);
  }

  return (
    <div className='header'>
      <ExpenseForm onAddExpense={onAddExpense} />
      <h2>지출 내역</h2>
      <Expenses expenses={expenses} />
    </div>
  );
}

export default App;
----------------------------
// ExpenseForm.js (하위 컴포넌트)
function ExpenseForm(props) {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // form 요소 submit 이벤트 핸들러
  const submitHandler = (e) => {
    e.preventDefault();

    // form으로 입력 받은 데이터를 객체에 저장
    const expenseData = {
      date: enteredDate,
      title: enteredTitle,
      amount: enteredAmount,
    }
    // 상위 컴포넌트에서 props로 전달받은 함수에 전달하고자 하는 데이터를 인수로 넣어 호출. 상태를 상위 컴포넌트에 전달한다
    props.onAddExpense(expenseData);    
    setDate('');              
    setTitle('');
    setAmount('');
  };

  // input 요소 change 이벤트 핸들러
  const enteredDate = (e) => {
    setDate(e.target.value);
  };

  const enteredTitle = (e) => {
    setTitle(e.target.value);
  };

  const enteredAmount = (e) => {
    setAmount(e.target.value);
  };

  return (
    <form className='new-expense__form' onSubmit={submitHandler}>
      <div>
        <label htmlFor='date'>날짜</label>
        <input
          type='date'
          value={date}
          onChange={enteredDate}
          name='date'
          id='date'
          min='2019-01-01'
          max='2023-12-31'
          required
        />
      </div>
      <div>
        <label htmlFor='title'>항목 명</label>
        <input type='text' value={title} onChange={enteredTitle} name='title' id='title' required />
      </div>
      <div>
        <label htmlFor='amount'>금액</label>
        <input type='number' value={amount} onChange={enteredAmount} name='amount' id='amount' min='1' required />
      </div>
      <button>등록</button>
    </form>
  );
}

export default ExpenseForm;
```

`form` 요소가 있는 하위 컴포넌트에서 사용자로부터 입력을 받고, `submit` 이벤트가 발생하면 해당 입력 값을 상위 컴포넌트로부터 `props`로 전달받은 함수에 인수로 전달해서 호출하여 상위 컴포넌트에 데이터를 전달하는 방식이다.


## Reference

**[usestate-lazy-initialization]**

https://blog.logrocket.com/initialize-state-react-hooks/#bonus-usestate-lazy-initialization

**[React docs 여러 개의 상태 업데이트 일괄 처리]**

https://beta.reactjs.org/learn/queueing-a-series-of-state-updates

**[※ React docs 컴포넌트 렌더링에 대하여]**

https://beta.reactjs.org/learn/render-and-commit

**[React docs 내장 hooks 종류]**

https://beta.reactjs.org/reference/react


**[※ React docs State 특징, useState()]**

https://beta.reactjs.org/learn/state-a-components-memory

https://beta.reactjs.org/reference/react/useState#avoiding-recreating-the-initial-state