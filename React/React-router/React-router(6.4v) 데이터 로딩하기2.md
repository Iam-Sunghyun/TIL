<h2>목차</h2>

- [로더 함수에서 동적 세그먼트(경로 매개변수) 받아오기](#로더-함수에서-동적-세그먼트경로-매개변수-받아오기)
- [`<Form>` 컴포넌트와 `action`으로 데이터 작성 및 변형하기](#form-컴포넌트와-action으로-데이터-작성-및-변형하기)
  - [`<input type='hidden'>` 사용하여 요청에 숨겨진 데이터 정의하기](#input-typehidden-사용하여-요청에-숨겨진-데이터-정의하기)
- [데이터 전송 후 리디렉션(rediretion) 하기](#데이터-전송-후-리디렉션rediretion-하기)
- [`<Form>` `submitting` 중 버튼 비활성화 하기](#form-submitting-중-버튼-비활성화-하기)
- [`Form` 데이터 유효성 검사 후 에러 반환하기](#form-데이터-유효성-검사-후-에러-반환하기)

# 로더 함수에서 동적 세그먼트(경로 매개변수) 받아오기

경로상에 `:`로 시작되는 부분은 동적 세그먼트(경로 매개변수)로 취급된다. `react-router`의 `useParams` 훅을 사용하면 컴포넌트 내부에서 경로 매개변수를 참조할 수 있지만 로더 함수는 컴포넌트가 아니므로 `useParams` 훅을 사용할 수 없다.

이를위해 로더 함수는 호출시 객체를 매개변수로 받는데 이 객체는 `params` 객체와 `request` 객체를 프로퍼티로 갖고 있다. `params` 객체는 경로 매개변수 정보를 갖고있고, `request` 객체는 말 그대로 `fetch` 요청 객체를 의미한다.

이 매개변수를 이용해 동적 세그먼트를 로더 함수 내에서 사용해줄 수 있다.

```
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder /> },
      {
        path: '/order/:orderId',  // 경로 매개변수
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
      },
    ],
  },
]);
------------------------------
// Order.jsx
  .
  .
// 로더 함수
export async function loader({ params }) {
  const order = await getOrder(params.orderId); // 경로 매개변수 참조
  console.log(params);
  return order
}

export default Order;
------------------------------
>>
{request: Request, params: {…}, context: undefined}
context: undefined
params: {orderId: '123'}
request: Request {method: 'GET', url: 'http://localhost:5173/order/123', headers: Headers, destination: '', referrer: 'about:client', …}
[[Prototype]]: Object
```

# `<Form>` 컴포넌트와 `action`으로 데이터 작성 및 변형하기

`loader` 함수는 데이터를 읽어오는데 사용되지만 `action`은 데이터를 쓰거나 변형하는데 사용된다.

함께 사용되는 `<Form>` 컴포넌트는 클라이언트 측 라우팅 및 데이터 변형을 위해 일반 HTML 폼을 둘러싼 래퍼 컴포넌트이다. 기본 `method`는 `get`이며 `get` 및 `post` 외에 `put`, `patch` 및 `delete`도 지원한다는 점을 제외하면 일반 HTML 양식 메소드와 동일하다.

또한 `action` 함수의 사용 방법은 `loader` 함수 사용 방식과 유사하다.

`react-router`에서 `Form` 컴포넌트의 요청을 `action` 함수가 가로채 동작을 수행한다. 즉, `Form`이 `submit`되면 리액트 라우터는 `action` 함수를 호출하고 제출된 요청 객체를 함수에 전달한다(`loader`와 동일한 인수 전달하는듯({ params, request ..})).

다음과 같이 액션 함수를 사용할 컴포넌트 파일 내에 정의해주고(관례) `Form`을 `submit`할 컴포넌트의 라우트에 연결시켜 준다.

```
// CreateOrder.jsx
function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method="POST" action="/order/new">  // react-rotuer Form 컴포넌트
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <button>Order now</button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData(); // request 객체의 요청 body를 FormData 형태로 이행하는 프로미스 반환
  const data = Object.fromEntries(formData); // Object.fromEntires() => 키/값 쌍의 목록을 객체로 변환
  console.log(data);

  return formData
}

export default CreateOrder;
---------------------------------
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      { path: '/cart', element: <Cart /> },
      { path: '/order/new', element: <CreateOrder />, action: createOrderAction }, // 액션 함수 전달.
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
      },
    ],
  },
]);
```

이렇게 하면 액션 함수가 전달된 라우트의 컴포넌트에서 `Form` `submit`이 발생할 때마다 액션 함수가 호출된다.

## `<input type='hidden'>` 사용하여 요청에 숨겨진 데이터 정의하기

`<input type=“hidden”>`은 사용자에게는 보이지 않는 숨겨진 입력 필드를 정의한다. 숨겨진 입력 필드는 렌더링이 끝난 웹 페이지에서는 전혀 보이지 않으며, 페이지 콘텐츠 내에서 그것을 볼 수 있게 만드는 방법도 없다.

따라서 숨겨진 입력 필드는 폼 제출 시 사용자가 변경해서는 안 되는 데이터를 요청에 함께 보낼 때 유용하게 사용되며 업데이트 되어야 하는 데이터베이스의 레코드를 저장하거나, 고유한 보안 토큰 등을 서버로 보낼 때 주로 사용된다.

이를 `action` 함수에서 전달받은 `request` 객체를 통해 확인해보면 다음과 같다.

```
// 임시 데이터
const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart; // 임시 데이터 할당

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method='POST' action='/order/new'>
        <div>
          <label>First Name</label>
          <input type='text' name='customer' required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type='tel' name='phone' required />
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type='text' name='address' required />
          </div>
        </div>

        <div>
          <input
            type='checkbox'
            name='priority'
            id='priority'
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority'>Want to yo give your order priority?</label>
        </div>
        <div>
          // value는 문자열만 가능하므로 JSON.stringify() 해준다
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <button>Order now</button>
        </div>
      </Form>
    </div>
  );
}
--------------------------------
// action 함수
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);

  return formData;
}
---------------------------------
// 액션 함수에서 전달받은 요청 객체 body를 확인해보면 다음과 같이 JSON.stringify(cart) 문자열이 담겨져있는 것을 확인할 수 있다.
>>  {customer: '123', phone: '123', address: '123', cart: '[{"pizzaId":12,"name":"Mediterranean","quantity":2…om","quantity":1,"unitPrice":15,"totalPrice":15}]'}
address: "123"
cart: "[{\"pizzaId\":12,\"name\":\"Mediterranean\",\"quantity\":2,\"unitPrice\":16,\"totalPrice\":32},{\"pizzaId\":6,\"name\":\"Vegetale\",\"quantity\":1,\"unitPrice\":13,\"totalPrice\":13},{\"pizzaId\":11,\"name\":\"Spinach and Mushroom\",\"quantity\":1,\"unitPrice\":15,\"totalPrice\":15}]"
customer: "123"
phone: "123"
[[Prototype]]: Object
```

# 데이터 전송 후 리디렉션(rediretion) 하기

액션 함수에서 `react-router`의 `redirect` API를 반환해 새 페이지로 리디렉션 해준다(`useNavigate`는 컴포넌트에서만 사용 가능).

```
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on'
  }

  const newOrder = await createOrder(order);
  return redirect(`/order/${newOrder.id}`);
}
```

# `<Form>` `submitting` 중 버튼 비활성화 하기

리액트 라우터의 `Form`이 `submit`되면 리액트 라우터는 `action` 함수를 호출한다고 했다. `submit` 중일때 `useNavigation` 훅의 `state`가 `submitting`이 되는데(로더 함수 호출 중일 땐 `loading`) 이를 통해 버튼을 잠시 비활성화 해줄 수 있다.

```
function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method='POST' action='/order/new'>
        <div>
          <label>First Name</label>
          <input type='text' name='customer' required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type='tel' name='phone' required />
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type='text' name='address' required />
          </div>
        </div>

        <div>
          <input
            type='checkbox'
            name='priority'
            id='priority'
            //value={withPriority}
            //onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority'>Want to yo give your order priority?</label>
        </div>
        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <button disabled={ isSubmitting }>{ isSubmitting ? '제출 중..' : '주문 하기'}</button>
        </div>
      </Form>
    </div>
  );
}
```

# `Form` 데이터 유효성 검사 후 에러 반환하기

`action` 함수가 바인딩된 라우트의 컴포넌트에서 `useActionData` 훅을 사용해 `action` 함수가 반환하는 값을 사용할 수 있다. 이것을 통해 `action`의 요청 body 내용의 유효성을 검사를 실행하고, 잘못된 경우 에러를 식별할 객체를 반환하여 `action`이 등록된 컴포넌트에서 에러 처리를 해줄 수 있다.

```
// 폰 번호 검사용 정규표현식
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // action 함수가 반환하는 값 참조
  const formError = useActionData();

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method='POST' action='/order/new'>
        <div>
          <label>First Name</label>
          <input type='text' name='customer' required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type='tel' name='phone' required />
          </div>
          // useActiondata로 참조하는 action 반환 객체에 phone 프로퍼티가 있다면 저장된 에러 메시지 출력.
          { formError?.phone && <p>{ formError.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type='text' name='address' required />
          </div>
        </div>

        <div>
          <input
            type='checkbox'
            name='priority'
            id='priority'
            //value={withPriority}
            //onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority'>Want to yo give your order priority?</label>
        </div>
        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <button disabled={ isSubmitting }>{ isSubmitting ? '제출 중..' : '주문 하기'}</button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  };

  // 전화번호가 정규표현식에 유효하지 않은 번호면 에러 객체에 phone 프로퍼티를 추가해준다.
  const errors = {};
  if(!isValidPhone(order.phone)) errors.phone = '유효하지 않은 번호 형식입니다.'
  // 에러 객체가 빈 객체가 아니라면(에러가 있다면) errors 객체를 반환해준다.
  if (Object.keys(errors).length > 0) return errors

  const newOrder = await createOrder(order);
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
```

**[React router Form]**

https://reactrouter.com/en/main/components/form

**[MDN FormData]**

https://developer.mozilla.org/ko/docs/Web/API/FormData
