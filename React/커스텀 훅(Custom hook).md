<h2>목차</h2>

- [Custom Hook이란?](#custom-hook이란)
  - [커스텀 훅 명명 규칙](#커스텀-훅-명명-규칙)
  - [사용 예](#사용-예)
  - [HTTP 요청 로직 커스텀 훅으로 추출하기](#http-요청-로직-커스텀-훅으로-추출하기)
  - [Reference](#reference)
  
# Custom Hook이란?

커스텀 훅이란 이름 그대로 사용자 정의 훅(hook)으로 리액트 내장 훅을 사용하는 중복 로직 부분을 추출하고 새로운 훅으로 정의하여, 코드를 간소화하고 재사용성을 극대화 할 수 있다.

## 커스텀 훅 명명 규칙

**커스텀 훅의 이름은 `useSometing`과 같이 항상 `use`로 시작해야한다.**

그래야만 `hook`인지 파악하기 쉽고 또 리액트에 의해 `hook`의 규칙이 적용되어 내장 `hook`처럼 사용할 수 있기 때문이다. -> 내장 훅의 규칙이 적용되어 커스텀 훅이 내장 훅처럼 호출되어야, 커스텀 훅 내부의 내장 훅이 훅의 규칙에 어긋나게 호출되는 일을 방지할 수 있다.

<!-- 컴포넌트 최상위에서 훅이 호출되어야 하는 이유가 이해가 안된다 -->
왜 내장 훅이 어긋나면 문제가 되는지는 아래 `React hook의 규칙`, `컴포넌트 최상위에서 훅이 호출되어야 하는 이유` 링크 참고.

만약 `React` 환경에 맞게 구성된 린터(linter)를 사용한다면, `use`로 시작하지 않은 경우 에러를 발생시킨다.

<!-- 컴포넌트 처럼 대문자로 시작해도 에러가 발생하지 않긴 함.  -->

만약 함수 내부에서 리액트 내장 훅(`useState`,`useEffect` 등)을 호출하지 않는다면 `use` 접두사를 붙이지 않고 일반 함수로 정의해야한다. -> `use`가 붙는다고 해서 에러가 발생하진 않지만 가독성을 해치고 훅의 규칙에 의해 컴포넌트 최상위가 아닌 곳에서는 호출할 수 없게 된다.

## 사용 예

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

컴포넌트에서 커스텀 훅을 사용하면 커스텀 훅에서 `useState`로 생성한 상태나, `useEffect`의 부수효과가 해당 컴포넌트에 묶이게 되며 이것은 컴포넌트마다 독립적으로 적용된다.

또한 커스텀 훅은 일반 함수처럼 개발자가 원하는 무엇이든 반환할 수 있다. 

## HTTP 요청 로직 커스텀 훅으로 추출하기


`App.js` 컴포넌트의 HTTP 요청 로직을 커스텀 훅으로 추출하는 예시이다.
<!-- 미완성 -->
```
// App.js
const fetchTasks = async (taskText) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(
      'https://udemy-e6977-default-rtdb.firebaseio.com/tasks.json'
    );
     if (!response.ok) {
      throw new Error('Request failed!');
    }
    const data = await response.json();
    const loadedTasks = [];
    
    for (const taskKey in data) {
      loadedTasks.push({ id: taskKey, text: data[taskKey].text });
    }
     setTasks(loadedTasks);
  
  } catch (err) {
    setError(err.message || 'Something went wrong!');
  }
  setIsLoading(false);
};
--------------------------------
import { useState } from "react";

function useFetch(requestConfig, applyData) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : 'GET',
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();
      applyData(data);

    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  };

  return [isLoading, error, sendRequest];
}

export default useFetch;
```

## Reference

**[React docs Custom Hooks]**

https://react.dev/learn/reusing-logic-with-custom-hooks


**[React hook의 규칙과 컴포넌트 최상위(the top of level)에서 Hook이 호출되어야만 하는 이유]**

https://ko.reactjs.org/docs/hooks-rules.html

**[커스텀 훅이 use로 시작해야되는 이유]**

https://ko.reactjs.org/docs/hooks-custom.html#using-a-custom-hook