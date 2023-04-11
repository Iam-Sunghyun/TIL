# Custom Hook이란?

커스텀 훅이란 이름 그대로 사용자 정의 훅(hook)으로 리액트 내장 훅을 사용하는 함수 중복되는 로직을 추출하여 코드를 간소화하고 재사용성을 극대화 할 수 있다.

커스텀 훅의 이름은 `useSometing`과 같이 항상 `use`로 시작하는 형태로 작성해야한다.

만약 커스텀 훅 내부에서 리액트 내장 훅(`useState`,`useEffect` 등)을 호출하지 않는 경우 `use` 접두사를 붙이지 않고 일반 함수로 정의해야한다. -> 에러가 발생하진 않지만 가독성을 해치고, `use`가 붙게되면 컴포넌트 최상위가 아닌 곳에서는 호출할 수 없다.

다음은 `fetch` API를 사용하여 서버로부터 `JSON` 데이터를 받아오는 예제이다.

```
// App.js
import { useEffect } from 'react';

const baseUrl = 'https://jsonplaceholder.typicode.com';

function App(){
  const [data, setData] = useState('');

  const fetchUrl = (type) => {
    fetch(baseUrl + '/' + type)
      // Response.json()은 응답 메시지 body의 json 데이터를 파싱한 결과를 값으로 갖는 resolve한 프로미스를 반환한다
      // 즉, Response.json()의 반환 값은 json이 아닌 자바스크립트 객체인 것 주의
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUrl('users');
  }, []);

  return (
    <div>
      <button onClick={() => fetchUrl('users')}>Users</button>
      <button onClick={() => fetchUrl('posts')}>Posts</button>
      <button onClick={() => fetchUrl('todos')}>Todos</button>
      {/* 일반 자바스크립트 객체를 직접 {}안에 출력하는 것은 불가능하기 때문에 stringify로 JSON 변환 후 출력해주었다() 템플릿 리터럴로 출력도 가능하다) */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

위 코드에서 `Fetch`를 사용하는 부분을 재사용 가능한 커스텀 훅으로 추출하여 코드를 좀 더 간결하게 만들어준다.

```
// useFecth.js
import { useEffect, useState } from 'react';

export function useFetch(baseUrl, initialType){
  const [data, setData] = useState('');

  const fetchUrl = (type) => {
    fetch(baseUrl + '/' + type)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUrl(initialType);
  }, []);

  // state, fetch 함수 반환
  return {
    data,
    fetchUrl,
  };
}
-------------------------------
// App.js
import { useFetch } from './useFetch';

const baseUrl = 'https://jsonplaceholder.typicode.com';

function App(){
  const { data, fetchUrl } = useFetch(baseUrl, 'users');

  return (
    <div>
      <button onClick={() => fetchUrl('users')}>Users</button>
      <button onClick={() => fetchUrl('posts')}>Posts</button>
      <button onClick={() => fetchUrl('todos')}>Todos</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

**[React docs Custom Hooks]**

https://react.dev/learn/reusing-logic-with-custom-hooks
