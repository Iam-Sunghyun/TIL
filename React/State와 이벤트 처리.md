<h2>목차</h2>

- [컴포넌트에 이벤트 핸들러 등록하기](#컴포넌트에-이벤트-핸들러-등록하기)
- [리액트 `Hook`, `useState()`](#리액트-hook-usestate)

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

 
# 리액트 `Hook`, `useState()`

<!-- hook에 대한 정의가 모호하다 -->
다음은 클릭 시 근처 요소의 텍스트가 변경되는 이벤트 핸들러를 등록하는 코드이다. 이벤트 핸들러를 등록하고 이벤트를 발생시키면 `console.log(title)`로 인해 브라우저 콘솔창에 변경된 `title` 값이 출력되는 반면 화면의 `<h2>`요소 텍스트는 변경되지 않는다.

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
그 이유는 리액트에서 `JSX` 컴포넌트들이 자바스크립트로 변환을 거쳐(virtual DOM), 실제 DOM과 동기화하여 브라우저에 렌더링 되고나면 위와 같은 형식으로는 리렌더링이 발생하지 않기 때문. 

이런 경우 React 버전 16.8부터 추가된 `Hook`이라는 기능을 사용하여 Class를 작성하지 않고도 `state`(상태) 값을 제어할 수 있으며 `Hook`을 통해 `state` 값을 변경하고 컴포넌트를 리렌더링 시킬 수 있다(`state`를 제어하는 `Hook` 말고도 여러 추가적인 React `Hook`이 있으며 모든 `Hook`은 컴포넌트 내부의 최상위 수준에서 호출되어야 한다).

여기서 `state`란 컴포넌트 자기자신 안에서 생성되고 제어되는 데이터로 `props`와 달리 변경이 가능한 값이며 `useState()` `Hook`를 통해 `state`를 제어할 수 있다.




<!-- 
`useState()` -> 직접 업데이트할 수 있는 상태 변수를 선언합니다.





후크 종류
State 후크
Context 후크
Ref(참조) 후크
Effect 후크
Performance Hooks

그 외 -->

**[React docs hooks]**

https://beta.reactjs.org/reference/react

https://ko.reactjs.org/docs/hooks-intro.html

