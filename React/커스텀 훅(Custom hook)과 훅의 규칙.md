<h2>목차</h2>

- [Custom Hook이란?](#custom-hook이란)
- [커스텀 훅 명명 규칙](#커스텀-훅-명명-규칙)
- [리액트 훅(hook)의 규칙?](#리액트-훅hook의-규칙)
- [커스텀 훅 사용 예시](#커스텀-훅-사용-예시)
  - [HTTP 요청 로직 커스텀 훅으로 추출하기](#http-요청-로직-커스텀-훅으로-추출하기)
  - [추출 전](#추출-전)
  - [추출 후](#추출-후)
  - [Reference](#reference)
  
# Custom Hook이란?

커스텀 훅이란 이름 그대로 사용자 정의 훅(hook)으로 리액트 내장 훅을 사용하는 중복 로직 부분을 추출하고 새로운 훅으로 정의하여, 코드를 간소화하고 재사용성을 극대화 할 수 있다.

# 커스텀 훅 명명 규칙

**커스텀 훅의 이름은 `useSometing`과 같이 항상 `use`로 시작해야한다.**

그래야만 리액트가 `hook`인 것을 식별할 수 있고 또 `hook`의 규칙이 적용되어 내장 `hook`처럼 사용할 수 있기 때문이다. -> 훅의 규칙이 적용되어 커스텀 훅이 내장 훅처럼 호출되어야, 커스텀 훅 내부의 내장 훅(`useState`, `useEffect` 등..)이 훅의 규칙에 어긋나게 호출되는 일을 방지할 수 있다.

만약 `React` 환경에 맞게 구성된 린터(linter)를 사용한다면, `use`로 시작하지 않은 경우 에러를 발생시킨다.
<!-- 컴포넌트 처럼 대문자로 시작해도 에러가 발생하지 않긴 함.  -->

**또 함수 내부에서 리액트 내장 훅(`useState`,`useEffect` 등)을 호출하지 않는다면 `use` 접두사를 붙이지 않고 일반 함수로 정의해야한다.** -> 일반 함수의 이름에 `use` 접두사가 붙는다고 해서 에러가 발생하진 않지만 가독성을 해치고 리액트 훅의 규칙에 의해 컴포넌트 최상위가 아닌 곳에서는 호출할 수 없게 된다.

# 리액트 훅(hook)의 규칙?

1. 오직 React 함수 내에서 Hook을 호출해야 한다.<br/> 
Hook을 일반적인 JavaScript 함수에서 호출하면 에러가 발생한다. 따라서 리액트 컴포넌트, 혹은 커스텀 훅의 내부에서만 호출되어야 한다.

2. 최상위(at the Top Level)에서만 Hook을 호출해야 한다.<br/> 반복문, 조건문 혹은 중첩된 함수 내에서 Hook을 호출하면 안되며 early return이 실행되기 전에 항상 React 함수의 최상위(at the top level)에서 Hook을 호출해야 한다. **이 규칙을 따르면 컴포넌트가 렌더링 될 때마다 항상 동일한 순서로 Hook이 호출되는 것이 보장되고 이러한 점은 React가 `useState`와 `useEffect`가 여러 번 호출되는 중에도 Hook의 상태를 올바르게 유지할 수 있도록 해준다.** <br/> -> 호출 순서 보장이 중요한 이유는 **React는 특정 `state`가 어떤 `useState` 호출에 해당되는 것 인지를 Hook이 호출되는 순서에 의존하여 아는 것이기 때문.** 만약 최상위가 아닌 곳에서 hook이 호출되면 렌더링 간에 hook 호출 순서가 달라질 수 있고 이것은 에러를 발생시킨다.

# 커스텀 훅 사용 예시

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


`App.js`, `NewTask.js` 컴포넌트의 HTTP 요청 로직을 `useFetch.js` 커스텀 훅으로 추출하는 예시이다.

## 추출 전 

`App.js`의 `fetchTasks` 함수와 `NewTask.js`의 `enterTaskHandler` 함수의 로직이 매우 비슷하고, 그리고 두 컴포넌트에서 `isLodaing`, `error` 상태 변수가 공통적으로 사용됨으로 이 부분을 추출하고자 한다.

각 컴포넌트에서 추출하고자 하는 부분의 공통 로직은 다음과 같다.

`App.js`의 `fetchTasks` 함수는 파이어베이스의 실시간 DB에 연결하여 `GET`요청으로 `json` 데이터를 가져오고, `tasks` 상태 변수에 저장하여 렌더링을 트리거 해 화면에 출력한다. 

`NewTask.js`의 `enterTaskHandler` 함수는 폼으로 사용자 입력을 받아 `POST` 요청으로 파이어베이스에 새로운 데이터를 추가한다.

```
// App.js
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-http-6b4a6.firebaseio.com/tasks.json'
      );

      // ok 프로퍼티로 응답 상태 확인
      if (!response.ok) {
        throw new Error('Request failed!');
      }

      // 응답 데이터 파싱 및 가공
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={ taskAddHandler } />
      <Tasks
        items={ tasks }
        loading={ isLoading }
        error={ error }
        onFetch={ fetchTasks }
      />
    </React.Fragment>
  );
}
---------------------------------
// NewTask.js
const NewTask = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enterTaskHandler = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-http-6b4a6.firebaseio.com/tasks.json',
        {
          method: 'POST',
          body: JSON.stringify({ text: taskText }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      // 파이어베이스 POST 요청의 응답은 데이터베이스에 기록한 데이터를 포함한다
      const data = await response.json();
      const generatedId = data.name; // 기록된 데이터의 키 값 참조
      const createdTask = { id: generatedId, text: taskText };

      props.onAddTask(createdTask);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};
```

## 추출 후

`useFetch.js` 커스텀 훅은 `App.js`와 `NewTask.js` 컴포넌트에서 공통적으로 필요한 `[isLoading, error, sendRequest]`을 반환한다.

`sendRequest` 함수는 커스텀 훅이 호출될 때마다 새롭게 생성되는 것을 막기 위해 `useCallback`을 사용해주었다.

`sendRequest` 함수의 첫 번째 인수 `requestConfig`는 요청에 필요한 설정 객체로 요청 `method`, `url`, `headers`, `body` 등 `fetch API`로 요청을 전송할 때 필요한 값들을 전달하기 위해 필요하다. 이 객체에 `url`만 담아서 전달하면 기본적으로 `GET` 요청을 전송한다.

두 번째 인수 `applyData`에는 함수를 전달하는데, `GET` 혹은 `POST` 요청에 대한 응답 데이터로 후속 처리를 위한 함수이다.

```
// useFetch.js 공통 로직 추출 커스텀 훅
import { useCallback, useState } from "react";

function useFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      // 요청 전송
      const response = await fetch(
        requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : 'GET',
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        }
      );

      // 응답 상태 확인
      if (!response.ok) {
        throw new Error('Request failed!');
      }

      // 응답 body 파싱
      const data = await response.json();
      // 인수로 전달받은 후속처리 함수 호출
      applyData(data);

    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  return [isLoading, error, sendRequest];
}

export default useFetch;
-----------------------------
// App.js
function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, error, sendRequest] = useFetch();
  
  useEffect(() => {
    // 응답받은 데이터를 가공하여 배열에 저장, 그 후 tasks 상태에 저장하는 함수
    const transformTasks = (loadedData) => {
      const loadedTasks = [];
      for (const taskKey in loadedData) {
        loadedTasks.push({ id: taskKey, text: loadedData[taskKey].text });
      }
      setTasks(loadedTasks);
    }
    // 커스텀 훅 요청 함수 호출
    sendRequest({ url: 'https://udemy-e6977-default-rtdb.firebaseio.com/tasks.json' }, transformTasks);
  }, [sendRequest]);


  // 하위 컴포넌트에서 받은 입력을 끌어올리기 위한 함수
  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={ taskAddHandler } />
      <Tasks
        items={ tasks }
        loading={ isLoading }
        error={ error }
        onFetch={ sendRequest }
      />
    </React.Fragment>
  );
}
--------------------------------
// NewTasks.js
const NewTask = (props) => {
  const [isLoading, error, sendTaskRequest] = useFetch();

  // 하위 컴포넌트에서 상태를 끌어올리기 위한 함수
  // 사용자 입력을 받아 createdTask 객체 생성하여 props.onAddTask 함수로 한번 더 데이터 끌어올리기
  const enterTaskHandler = async (taskText) => {

    const addTask = (data) => {
      const generatedId = data.name; // 파이어베이스에 추가한 데이터 키 값
      const createdTask = { id: generatedId, text: taskText };
      props.onAddTask(createdTask);
    };

    sendTaskRequest({
      url: 'https://udemy-e6977-default-rtdb.firebaseio.com/tasks.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { text: taskText },
    }, addTask);

  };

  return (
    <Section>
      <TaskForm onEnterTask={ enterTaskHandler } loading={ isLoading } />
      { error && <p>{ error }</p> }
    </Section>
  );
};
```

## Reference

**[React docs Custom Hooks]**

https://react.dev/learn/reusing-logic-with-custom-hooks


**[React hook의 규칙과 컴포넌트 최상위(the top of level)에서 Hook이 호출되어야만 하는 이유]**

https://ko.reactjs.org/docs/hooks-rules.html

**[커스텀 훅이 use로 시작해야되는 이유]**

https://ko.reactjs.org/docs/hooks-custom.html#using-a-custom-hook