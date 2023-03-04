<h2>목차</h2>

- [컴포넌트에 이벤트 핸들러 등록하기](#컴포넌트에-이벤트-핸들러-등록하기)
- [리액트 요소에 반응성 추가하기 (`state`, 상태 `Hook`, `useState()`)](#리액트-요소에-반응성-추가하기-state-상태-hook-usestate)
- [`Form`으로 사용자 입력 업데이트하기](#form으로-사용자-입력-업데이트하기)
  - [이전 `state` 값에 의존하여 업데이트하기](#이전-state-값에-의존하여-업데이트하기)

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


**[React 지원하는 event]**

https://ko.reactjs.org/docs/events.html
 
# 리액트 요소에 반응성 추가하기 (`state`, 상태 `Hook`, `useState()`)

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
그 이유는 리액트에서 컴포넌트 렌더링 후 `JSX`에서 자바스크립트로 변환을 거쳐(React DOM), 실제 DOM과 비교 후 변경된 곳을 동기화하여 브라우저 출력을 업데이트하는데, 위와 같이 일반적인 지역변수는 렌더링 간에 값이 유지되지도 않고(매 렌더링마다 새롭게 평가, 생성), 초기 렌더링 이후 지역변수 값을 변경하는 것으로는 렌더링이 트리거 되지 않기 때문("렌더링"은 React가 함수인 컴포넌트를 호출한다는 것을 의미). 

이런 경우 `state`라고 하는 상태 변수를 사용하는데 함수 컴포넌트에선 React 버전 16.8부터 추가된 **`Hook`이라는 기능을 사용하여 `state` 값을 생성 및 변경하고 컴포넌트를 리렌더링 시킬 수 있다.**

+ **`state`란 컴포넌트 자기 자신 안에서 생성되고 제어되는 데이터로 요소에 반응성을 추가하기 위한 컴포넌트 내부 상태 값(데이터)이다.**
+ `props`와 달리 변경이 가능한 값이다.

훅은 React가 렌더링 되는 동안에만 사용할 수 있는 특수 기능으로 `state`를 제어하는 `Hook` 말고도 여러 추가적인 `Hook`이 있으며 모든 `Hook`은 컴포넌트 내부의 최상위 수준에서 호출되어야 한다.

아래와 같이 `useState()` 훅을 호출하여 인수로 전달한 값을 갖는 `state`와, `state`를 업데이트 할 수 있는 함수를 요소로 갖는 배열을 반환받아 `state`를 제어할 수 있다.

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

`useState()`가 반환한 함수를 `setTitle` 변수에 저장하고, 인수를 전달해 호출하여 상태 변수 값을 업데이트하고 렌더링을 트리거한다.

컴포넌트가 다시 호출되면 위의 `title` 상태 변수는 `setTitle()`로 설정한 가장 최신 값이 할당되는데 이는 상태 변수가 지역 변수와 달리 매 호출마다 새롭게 평가되고 값이 할당되는 것이 아니라 리액트에 의해 기억되기 때문이다.

맨 처음 `useState()`를 호출했을 때 전달한 값을 초기 값으로 갖고 `set` 함수로 상태 값이 변경되면 컴포넌트가 재호출 되는데 이때 `useState()`의 인수로 또 다시 초기화되는 것이 아닌(초기 렌더링 이후 무시 됨) `set` 함수로 업데이트 된 가장 최신의 값을 할당한다.

추가로 `set`함수를 통한 `state` 값의 변경은 비동기적으로 이루어진다. 따라서 `setTitle()` 다음에 `console.log()`가 위치하여도 콘솔창에는 업데이트 전 값이 출력된다. 

<!-- 비동기로 동작하는게 맞나? -->

결국 `set` 함수는 다음 렌더링에 대한 상태 변수만 업데이트하는 것.

<!--


후크 종류
State 후크
Context 후크
Ref(참조) 후크
Effect 후크
Performance Hooks

그 외 -->

**[React docs hooks 종류, 개요]**

https://beta.reactjs.org/reference/react

https://ko.reactjs.org/docs/hooks-intro.html

**[※ React docs State 특징, useState()]**

https://beta.reactjs.org/learn/state-a-components-memory

https://beta.reactjs.org/reference/react/useState#avoiding-recreating-the-initial-state


**[※ React docs 컴포넌트 렌더링에 대하여]**

https://beta.reactjs.org/learn/render-and-commit


# `Form`으로 사용자 입력 업데이트하기

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
    e.preventDefault();     // form
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

여기서 알아야 할 것은 **React는 상태 업데이트를 일괄 처리한다는 것**. 즉, 이벤트 핸들러의 모든 코드와 `set` 함수가 호출된 후에 화면을 업데이트하는 것으로 단일 이벤트 중에 여러 번 렌더링되는 것을 방지한다. 

위와 같이 3개의 상태 변수를 선언할 수도 있고 다음과 같이 하나의 객체에 담아서 선언할 수도 있다.

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

## 이전 `state` 값에 의존하여 업데이트하기

이전 상태 값에 의존하여 상태를 업데이트해야 되는 경우가 있을 수 있다.

여러 개의 이벤트 핸들러에서 `set` 함수로 업데이트 하는 코드가 있고 해당 이벤트 핸들러들이 동시에 호출된다면, 혹은 하나의 이벤트 핸들러에서 동시에 여러 개의 `set` 함수로 업데이트 한다면 갱신되지 않은 `state` 값으로 업데이트하여 기대한 값이 나오지 않을 수 있다. 

이런 경우 **`set` 함수에 콜백을 전달하여 이전 상태 값에 의존하여 업데이트 할 수 있다.**

<!-- 예시 수정필 -->
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
```
</br>



**[React docs 상태 업데이트 일괄 처리]**

https://beta.reactjs.org/learn/queueing-a-series-of-state-updates


<!-- # 양방향 바인딩

사용자 입력을 받아 `state` 업데이트, `state` 값 수정한 것을 기반으로 input 요소 값 결정


## -->