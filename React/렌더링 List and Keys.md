<h2>목차</h2>

- [배열로 리스트(list) 렌더링하기](#배열로-리스트list-렌더링하기)
- [리스트 키(key)](#리스트-키key)
  - [리스트에서 key를 사용해야하는 이유?](#리스트에서-key를-사용해야하는-이유)
  - [키 설정하는 방법](#키-설정하는-방법)
- [배열, 객체 상태 변수 불변성](#배열-객체-상태-변수-불변성)
- [배열 상태 변수 정렬해보기](#배열-상태-변수-정렬해보기)

# 배열로 리스트(list) 렌더링하기

리스트는 목록 데이터, 즉 순서대로 나열한 데이터를 말한다.

리액트에서 리스트란 말 그대로 여러 개의 비슷한 컴포넌트로 이루어진 목록을 말하는데 이러한 리스트를 직접 하드코딩하지 않고 배열을 사용하여 데이터가 추가됨에 따라 쉽게 렌더링 할 컴포넌트를 변경할 수 있다.

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

**[React docs Updating Arrays in State]**

https://beta.reactjs.org/learn/updating-arrays-in-state

# 리스트 키(key)

리액트에서 키(key)는 리스트 항목들을 구분하기 위한 고유한 식별자로 일반적인 키의 의미와 다르지 않다.

키는 어떤 데이터의 변경(추가, 제거 등)을 구별하기 위해 사용되며 하나의 리스트(map()으로 반환되는 배열) 내에서만 고유한 값이면 된다.


## 리스트에서 key를 사용해야하는 이유?
<!-- 중요 -->
React에서 컴포넌트의 상태가 변경되었을 때 React는 새로운 가상 DOM을 생성하고 diffing 알고리즘을 통해 이전의 DOM과 비교하여 변경 사항을 확인하고 변경된 부분만을 실제 DOM에서 업데이트한다. 

키를 사용하면 React가 리스트 요소가 변경되었을 때 올바르게 추적할 수 있게 하여 불필요한 렌더링을 막을 수 있기 때문에 반드시 사용할 것은 권장하고 있다(재조정(Reconciliation) 시 변경되지 않아야 할 엘리먼트들을 제대로 추적할 수 있음). 

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

Key를 사용하지 않고 리스트 맨 앞에 요소를 추가한 경우 React는 이를 식별하지 못한다. 따라서 모든 `<li>` 항목을 처음부터 다시 렌더링하는 불필요한 작업이 발생하게 되는 것이다.

이러한 부분이 대규모 앱에서는 큰 성능 문제로 연결될 수 있으므로 **성능 최적화를 위해서 반드시 사용할 것**.

## 키 설정하는 방법

리스트의 키를 설정하는 방법의 예로는 다음과 같은 것들이 있다.

1. 해당 컴포넌트에 사용될 값을 키에도 사용하는 방법 
2. 배열의 인덱스를 곧 키로 사용하는 방법
3. **별도의 id 값을 추가하여 사용하는 방법**

1번 컴포넌트에 집어넣을 값을 키로 사용하는 경우 다른 컴포넌트와 중복의 여지가 있고(경고 문구 뜸) 2번 인덱스를 키로 사용하게 되면 인덱스를 기준으로 상태나, props를 매핑한 경우 문제가 발생할 수 있다(key를 따로 명시하지 않으면 리액트는 자동으로 인덱스를 키로 사용한다고 함). 

따라서 가능한 별도의 **고유한 id를 생성후 추가하여 사용하도록 한다.**

**[React에서 key가 중요한 이유]**

https://betterprogramming.pub/why-react-keys-matter-an-introduction-136b7447cefc

**[React docs 리스트와 key]**

https://ko.reactjs.org/docs/lists-and-keys.html

**[React docs rendering-lists]**

https://beta.reactjs.org/learn/rendering-lists



# 배열, 객체 상태 변수 불변성

<!-- 80% 완 -->
React 공식 문서에는 배열이나 객체인 상태 변수를 읽기 전용으로 즉, 불변 데이터로 취급하라고 되어있다. 

배열 상태 변수로 예를 들면 `arr[0] = 'bird'`, `push()`, `pop()`같이 직접 변경하거나 요소를 추가, 삭제하는게 아닌 새로운 배열로 변경해야한다는 것(물론 `push()` 메서드와 같은 방법으로 직접 변경이 동작하지 않는 것은 아니다)

공식 문서에서 말하는 불변성의 장점은 다음과 같다.

+ 직접적인 데이터 변형을 피하면 이전 버전의 데이터를 그대로 유지하고 나중에 재사용할 수 있습니다.
+ 불변성은 컴포넌트의 데이터가 변경되었는지 여부를 비교하는 데 매우 저렴합니다 -> 주소 값 변경 여부만으로 쉽게 변경을 감지할 수 있기 때문.
  
<!-- 배열같은 객체를 저장하는 state는 직접 변경하면 안되고, set 함수를 이용해 새 값으로 교체하는 식으로 사용해야 된다고 했다. 정확한 이유는? -> 리액트의 state 변화 감지 기준은 주소 값이기 때문. https://hsp0418.tistory.com/171-->

<!-- 
이러한 이유로는 성능 최적화, 변경 사항 추적으로 렌더링 트리거
이유는 뭘까

만약 객체 상태 변수를 직접 변경하게 되면 React가 변경 사항을 추적하지 못하고 리렌더링이 발생하지 않기 때문에 성능에 문제가 생길 수 있다.


이전 버전의 상태 값을 유지할 수 없으며(재사용 불가능) `set`

배열 상태 변수를 업데이트하려면 다음과 같이 `set` 함수에 새 배열을 전달하거나 변수에 복사해서 사용해야한다.

```
setArtists([newValue, ...prevArray]);
```  -->


**[React docs 불변성이 중요한 이유]**

https://beta.reactjs.org/learn/tutorial-tic-tac-toe#why-immutability-is-important

https://velopert.com/3486

**[※ React 성능 최적화 - 불변 데이터 구조 사용]**

https://blog.logrocket.com/optimizing-performance-react-app/#immutable-data-structures

**[React docs Updating Arrays in State]**

https://beta.reactjs.org/learn/updating-arrays-in-state#making-other-changes-to-an-array


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