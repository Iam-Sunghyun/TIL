<h2>목차</h2>

- [조건부 렌더링(Conditinal rendering)](#조건부-렌더링conditinal-rendering)
- [인라인 조건(Inline condition)](#인라인-조건inline-condition)

# 조건부 렌더링(Conditinal rendering)

조건부 렌더링이란 말 그대로 조건에 따라 렌더링이 달라지는 것을 말하며 자바스크립트 조건문(`if`)을 통해 컴포넌트가 반환하는 값을 달리한다.

아래는 회원, 비회원 여부에 따라 다르게 렌더링하는 간단한 예시이다.

```
function UserGreeting(props) {
  return <h1>어서오세요!</h1>;
}

function GuestGreeting(props) {
  return <h1>회원가입을 해주세요.</h1>;
}
---------------------------
function Greeting(props){
  const isLoggedIn = props.isLoggedIn;
  if(isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
```
<h3>엘리먼트 변수(Element variable)</h3>

컴포넌트를 할당한 변수를 말한다. 엄밀히는 컴포넌트가 반환하는 엘리먼트를 변수에 담아 사용하는 것.


# 인라인 조건(Inline condition)

인라인 조건은 리액트 내에서 매우 자주 사용되는 패턴으로 `JSX` 내부에 중괄호(`{}`)를 사용하여 `&&`, `? :`과 같은 자바스크립트 논리 연산자로 렌더링 될 컴포넌트를 결정한다. 

다음 예시는 삼항 조건 연산자를 사용하여 기본 값은 모두 출력, 특정 년도가 입력되면 해당 년도 값의 엘리먼트들을 반환하는 컴포넌트이다.

하위 컴포넌트(`ExpenseFilter.js`)에서 사용자로부터 특정 년도를 입력받은 뒤, 상위 컴포넌트(`Expense.js`)로 끌어올리고 `state`를 업데이트하여 렌더링을 트리거한다.

```
function Expenses(props) {
  const [year, setYear] = useState('all');

  // 컴포넌트 리스트
  let expenseItems = props.expenseList.map((expense) => (
    <ExpenseItem key={expense.id} title={expense.title} amount={expense.amount} date={expense.date} />
  ));
    
  if (year !== 'all') {
    expenseItems = expenseItems.filter((expense) => expense.props.date.split('-')[0] === year);
  }
    
  // ExpenseFilter.js state 끌어올리기용 함수
  const getExpenseYear = (selectedYear) => {
    setYear(selectedYear);
  };

  return (
    <div>
      <ExpenseFilter year={year} getExpenseYear={getExpenseYear} />
      <Card className='expenses'>
      // 삼항 조건 연산자로 조건 부여
        {expenseItems.length === 0 ? '표시할 내용이 없습니다.' : expenseItems}
      </Card>
    </div>
  );
}

export default Expenses;

```

`&&` 연산자 사용 예시는 아래 링크 참조. 

**[React docs conditional-rendering]**

https://beta.reactjs.org/learn/conditional-rendering


**[React 조건부 렌더링에서 `&&` 사용하지 말아야하는 이유]**

https://medium.com/geekculture/stop-using-for-conditional-rendering-in-react-a0f7b96200f8

<!-- # 컴포넌트 렌더링 막기

return null을 하면 렌더링이 발생하지 않음.
중괄호{}에 false 집어넣으면 아무것도 출력되지 않는다 -->