<h2>목차</h2>

- [컴포넌트에 이벤트 핸들러 등록하기](#컴포넌트에-이벤트-핸들러-등록하기)
- [리액트 요소에 반응성 추가하기 (`state`, 상태 `Hook`, `useState()`)](#리액트-요소에-반응성-추가하기-state-상태-hook-usestate)
- [Form으로 사용자 입력 받기](#form으로-사용자-입력-받기)

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
그 이유는 리액트에서 `JSX` 컴포넌트들이 자바스크립트로 변환을 거쳐(virtual DOM), 실제 DOM과 동기화하여 브라우저에 렌더링 되고나면 위와 같이 일반적인 지역 변수를 변경하는 것으로는 리렌더링이 발생하지 않기 때문("렌더링"은 React가 함수인 컴포넌트를 호출한다는 것을 의미). 

이런 경우 `state`라고하는 상태 변수를 사용해야 하는데 함수형 컴포넌트에선 React 버전 16.8부터 추가된 **`Hook`이라는 기능을 사용하여 `state` 값을 생성 및 변경하고 컴포넌트를 리렌더링 시킬 수 있다.**

+ **`state`란 컴포넌트 자기자신 안에서 생성되고 제어되는 데이터로 요소에 반응성을 추가하기 위한 컴포넌트 내부 상태 값(데이터)이다.**
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

**[React docs useState()에 대하여]**

https://beta.reactjs.org/reference/react/useState#avoiding-recreating-the-initial-state

**[React docs hooks 종류, 개요]**

https://beta.reactjs.org/reference/react

https://ko.reactjs.org/docs/hooks-intro.html

**[※ React docs State 특징]**

https://beta.reactjs.org/learn/state-a-components-memory

**[※ React docs 컴포넌트 렌더링에 대하여]**

https://beta.reactjs.org/learn/render-and-commit


# Form으로 사용자 입력 받기