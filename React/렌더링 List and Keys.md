<h2>목차</h2>

- [배열로 리스트(list) 반환하기](#배열로-리스트list-반환하기)
  - [Reference](#reference)
- [리스트 키(key)](#리스트-키key)
  - [리스트에서 key를 사용해야하는 이유?](#리스트에서-key를-사용해야하는-이유)
  - [키 설정하는 방법](#키-설정하는-방법)
  - [배열 항목이 여러 컴포넌트로 구성된 경우](#배열-항목이-여러-컴포넌트로-구성된-경우)
  - [Reference](#reference-1)
- [배열 상태 변수 정렬해보기](#배열-상태-변수-정렬해보기)

# 배열로 리스트(list) 반환하기

리스트는 목록 데이터, 즉 순서대로 나열한 데이터를 말한다.

리액트에서 리스트란 말 그대로 여러 개의 비슷한 컴포넌트로 이루어진 목록을 말하는데 이러한 리스트를 직접 하드코딩하지 않고 **배열을 사용하여 데이터가 추가됨에 따라 쉽게 렌더링 할 컴포넌트를 변경할 수 있다.**

```
import Card from '../UI/Card';
import ExpenseItem from './ExpenseItem';
import ExpenseFilter from './ExpenseFilter';

function Expenses(props) {
  const [year, setYear] = useState('all');

  // expenseList를 기반으로 컴포넌트 리스트 생성
  let expenseItems = props.expenseList.map((expense) => (
    <ExpenseItem key={expense.id} title={expense.title} amount={expense.amount} date={expense.date} />
  ));

  // 년도가 선택되면 filter로 해당되는 expenseList 요소만 걸러내기
  if (year !== 'all') {
    expenseItems = expenseItems.filter((expense) => expense.props.date.split('-')[0] === year);
  }

  const getExpenseYear = (selectedYear) => {
    console.log(selectedYear);
    setYear(selectedYear);
  };
  
  // 컴포넌트를 요소로 갖는 배열을 중괄호 안에 삽입하여 여러 개의 컴포넌트 리스트를 간단히 표현할 수 있다
  return (
   <div>
      <ExpenseFilter year={year} getExpenseYear={getExpenseYear} expenseItems={expenseItems} />
      <Card className='expenses'>
        <ExpenseSort sortCheck={props.sortCheck} />
        <ul className='expense-items__list'>{expenseItems.length === 0 ? '표시할 내용이 없습니다.' : expenseItems}</ul>
      </Card>
    </div>
  );
}
```

하지만 이렇게만 작성하면 브라우저 콘솔 창에 `Warning: Each child in a list should have a unique "key" prop.`라고 경구 문구가 뜨는데 다음 내용에서 키에 대해 살펴본다.

## Reference

**[React docs Rendering Lists]**

https://react.dev/learn/rendering-lists

# 리스트 키(key)

**리액트에서 키(key)는 컴포넌트를 구분하기 위한 고유한 식별자**로 일반적인 키의 의미와 다르지 않다.

키는 **컴포넌트를 구별하기 위해 사용되며 특히 배열에 담겨 반환되는 컴포넌트에서 중요하게 사용된다.** 키 값은 컴포넌트가 담긴 배열 내에서 고유한 값이어야 하며 서로 다른 배열에서 같은 키 값은 상관없다.

확인해본 결과 **키는 배열의 맥락에서만 의미가 있었다.** 즉, 배열로 반환되는 경우가 아니라면 형제 요소들 맨 앞에 `<li>`를 추가했을때 나머지 항목들이 렌더링은 일어났으나 DOM에서 새롭게 생성되지 않았다(React가 변경된 컴포넌트를 잘 식별함).

## 리스트에서 key를 사용해야하는 이유?
<!-- 중요 -->
React에서 컴포넌트의 상태가 변경되었을 때 React는 새로운 리액트 엘리먼트 트리(가상 DOM)을 생성하고 diffing 알고리즘을 통해 이전의 DOM(current 트리)과 비교하여 변경 사항을 확인하고 변경된 부분만 실제 DOM에서 업데이트한다. 

**키를 사용하면 배열 요소가 변경되었을 때(추가, 삭제 등) 변경되지 않은 컴포넌트를 식별할 수 있게 해주어 불필요한 렌더링을 막는다(렌더링이 필요한 컴포넌트만 렌더링). 이것은 재조정(Reconciliation) 시 변경 부분을 올바르게 추적할 수 있게 하여 반드시 사용할 것은 권장**하고 있다. 

다음은 리스트에서 key를 사용하지 않았을 때 React의 업데이트 과정에서의 차이를 알 수 있는 예시이다.

```
// 가상 DOM
<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
// 실제 DOM
<ul>
  <li>first</li>
  <li>second</li>
</ul>
```
위의 경우 맨 뒤에 `<li>third</li>`를 추가하는 식으로 업데이트가 이루어진다. 하지만 다음과 같이 리스트의 맨 앞에 요소를 추가하는 경우는 좀 다르게 동작한다.

```
// virtual DOM
<ul>
  <li>zero</li>
  <li>first</li>
  <li>second</li>
</ul>
// real DOM
<ul>
  <li>first</li>
  <li>second</li>
</ul>
```

**Key를 사용하지 않고 리스트 맨 앞에 요소를 추가한 경우 React는 뒷 요소들이 변경되지 않았다는 것을 식별하지 못한다.** 따라서 렌더링 프로세스(Reconciliation)간에 모든 `<li>` 항목이 변경된 부분으로 취급되어 실제 DOM에서 변경되지 않아도 될 요소들도 불필요하게 재생성 된다(이전 노드 파괴 후 새 노드를 생성하여 교체).

이러한 부분이 대규모 앱에서는 큰 성능 문제로 연결될 수 있으므로 **성능 최적화를 위해서 반드시 사용할 것**.

```
컴포넌트 렌더링 간에 특정 컴포넌트의 key 값을 의도적으로 변경하여 해당 엘리먼트를 재생성하게 만들 수 있다. 이때 실제 DOM 노드가 파괴 후 새롭게 생성되는데 해당 요소의 state를 리셋하기 위한 용도로 사용된다. 
```

## 키 설정하는 방법

리스트의 키를 설정하는 방법의 예로는 다음과 같은 것들이 있다.

1. 해당 컴포넌트에 사용될 값을 키에도 사용하는 방법 
2. 배열에서 인덱스를 곧 키로 사용하는 방법
3. **별도의 id 값을 추가하여 사용하는 방법**

1번. 배열의 요소 컴포넌트에 집어넣을 값을 키로 사용하는 경우 다른 컴포넌트와 중복의 여지가 있다(경고 문구 뜸). 

2번. 인덱스를 키로 사용하게 되면 정렬이 발생 했다던지, 배열의 맨 앞에 요소가 추가되어 인덱스가 바뀌어 버릴 수 있고, 인덱스를 기준으로 상태나, props를 매핑한 경우 버그가 발생할 수 있다(key를 따로 명시하지 않으면 리액트는 자동으로 인덱스를 키로 사용한다고 함). 

따라서 가능한 별도의 **`crypto.randomUUID()`나 `uuid` 라이브러리를 통해 고유한 id를 생성후 추가하여 사용하도록 한다.** 또한 렌더링마다 키로 사용할 값을 생성하지 않도록 주의.

**추가로 `key` 값은 자식 컴포넌트의 `props`에 전달되지 않는다.**


## 배열 항목이 여러 컴포넌트로 구성된 경우

배열의 각 컴포넌트를 `<div>`로 묶어서 `key`를 전달해주거나, 다음과 같이 `<Fragment>` 컴포넌트를 사용하여 `key`를 전달할 수 있다(프래그먼트는 `<></>` 형태로는 prop을 전달해줄 수 없음).

```
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

## Reference

**[React에서 key가 중요한 이유]**

https://betterprogramming.pub/why-react-keys-matter-an-introduction-136b7447cefc

**[React docs rendering-lists]**

https://beta.reactjs.org/learn/rendering-lists

https://legacy.reactjs.org/docs/lists-and-keys.html

# 배열 상태 변수 정렬해보기

배열 상태 변수의 특정 요소 값을 기준으로 정렬한다.

우선 오름차순, 내림차순을 입력받는 하위 컴포넌트(`ExpenseSort.js`)로 `App.js`의 정렬 함수(`sortCheck`)를 `props`로 전달하여 입력 받은 정렬 방식을 인수로 전달받는다.

오름차순('ascending'), 내림차순('descending') 여부에 따라 정렬을 실행하고 기존의 상태 변수에 업데이트하여 새롭게 정렬된 `expenseList`를 바탕으로 리렌더링 한다.

여기서 중요한 것은 2레벨 하위에 있는 컴포넌트로부터 값을 전달 받았다는 것과 불변성을 위해 배열을 새로운 배열에 복사하여 정렬 후 `set` 함수로 업데이트 한다는 것이다.

```
// App.js
      .
      .
      .
  const [expenseList, setExpenseList] = useState([]);

  // 하위 컴포넌트에서 입력받은 값을 전달받아 정렬하는 함수
  const sortCheck = (order) => {
    const orderedList = [...expenseList];

    if (order === 'ascending') {
      orderedList.sort((a, b) => {
        if (a.date.split('-')[1] === b.date.split('-')[1]) {
          return a.date.split('-')[2] - b.date.split('-')[2];
        }
        return a.date.split('-')[1] - b.date.split('-')[1];
      });
    }
    if (order === 'descending') {
      orderedList.sort((a, b) => {
        if (b.date.split('-')[1] === a.date.split('-')[1]) {
          return b.date.split('-')[2] - a.date.split('-')[2];
        }
        return b.date.split('-')[1] - a.date.split('-')[1];
      });
    }
    setExpenseList([...orderedList]);
  };

    return (
    <div className='header'>
      <NewExpense onAddExpense={onAddExpense} />
      <h2>지출 내역</h2>
      <Expenses expenseList={expenseList} sortCheck={sortCheck} />
    </div>
  );
}
-------------------------
// ExpenseSort.js
function ExpenseSort(props) {
  const sortChanged = (e) => {
    // App.js로부터 전달받은 함수
    props.sortCheck(e.target.value);
  };

  return (
    <div className='expense-item__sort'>
      <select className='expense-item__sort-select' onChange={sortChanged}>
        <option value={'default'}>--정렬--</option>
        <option value={'ascending'}>오름차순</option>
        <option value={'descending'}>내림차순</option>
      </select>
    </div>
  );
}
```