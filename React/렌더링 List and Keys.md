# 배열로 리스트(list) 렌더링하기

리스트는 목록 데이터, 즉 순서대로 나열한 데이터를 말한다.

리액트에서 리스트란 말 그대로 여러 개의 비슷한 컴포넌트로 이루어진 목록을 말하는데 이러한 리스트를 직접 하드코딩하지 않고 배열을 사용하여 데이터가 추가됨에 따라 쉽게 렌더링 할 컴포넌트를 변경할 수 있다.

```
import Card from '../UI/Card';
import ExpenseItem from './ExpenseItem';
import ExpenseFilter from './ExpenseFilter';

function Expenses(props) {
 
  const [year, setYear] = useState('2023');
  // props.expense는 상위 컴포넌트에서 전달받은 배열로 컴포넌트 리스트의 각 컴포넌트에 들어갈 데이터를 담고있다
  // map() 메서드로 props.expense의 데이터를 컴포넌트에 집어넣어 새로운 컴포넌트 배열로 만든다
  const expenseItems = props.expenses.map((expense) => (
    <ExpenseItem title={expense.title} amount={expense.amount} date={expense.date} />
  ));

  const getExpenseYear = (selectedYear) => {
    console.log(selectedYear);
    setYear(selectedYear);
  };
  
  // 컴포넌트를 요소로 갖는 배열을 중괄호 안에 삽입하여 여러 개의 컴포넌트 리스트를 간단히 표현할 수 있다
  return (
    <div>
      <ExpenseFilter getExpenseYear={getExpenseYear} />
      <Card className='expenses'>{expenseItems}</Card>
    </div>
  );
}
```

하지만 이렇게만 작성하면 브라우저 콘솔 창에 `Warning: Each child in a list should have a unique "key" prop.`라고 경구 문구가 뜨는데 다음 내용에서 키에 대해 살펴본다.




# 리스트 키(key)

리액트에서 키(key)는 리스트 항목들을 구분하기 위한 고유한 식별자로 일반적인 키의 의미와 다르지 않다.

키는 어떤 데이터의 변경(추가, 제거 등)을 구별하기 위해 사용되며 하나의 리스트(map()으로 반환되는 배열) 내에서만 고유한 값이면 된다.

리스트의 키를 설정하는 방법의 예로는 다음과 같은 것들이 있다.

+ 해당 컴포넌트에 사용될 값을 키에도 사용하는 방법 
+ 배열의 인덱스를 곧 키로 사용하는 방법
+ 별도의 id 값을 추가하여 사용하는 방법

컴포넌트에 집어넣을 값을 키로 사용하는 경우 다른 컴포넌트와 중복의 여지가 있고(경고 문구 뜸) 인덱스를 키로 사용하는 경우 배열 내의 컴포넌트의 순서가 변경될 여지가 있는 경우 성능적인 부분이나 `state` 관리하는데 있어서 문제가 발생할 수 있다(key를 따로 명시하지 않으면 리액트는 자동으로 인덱스를 키로 사용한다고 함). 

따라서 가능한 별도의 고유한 id를 생성하여 사용하는 것이 좋을 듯.


**[React docs rendering-lists]**

https://beta.reactjs.org/learn/rendering-lists