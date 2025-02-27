- [RSC 페이로드란?](#rsc-페이로드란)
  - [Json-like 데이터란?](#json-like-데이터란)
    - [정리](#정리)
- [서버 컴포넌트의 렌더링 과정 (RSC 페이로드 생성 과정)](#서버-컴포넌트의-렌더링-과정-rsc-페이로드-생성-과정)
  - [1. 서버에서 React Server Component를 실행](#1-서버에서-react-server-component를-실행)
  - [2. 서버가 클라이언트로 RSC 페이로드 전송](#2-서버가-클라이언트로-rsc-페이로드-전송)
  - [3. 클라이언트에서 RSC 페이로드를 React 클라이언트 런타임이 해석](#3-클라이언트에서-rsc-페이로드를-react-클라이언트-런타임이-해석)
- [🛠 RSC 페이로드 생성 예제](#-rsc-페이로드-생성-예제)
  - [1. 서버 컴포넌트 (ServerComponent.tsx)](#1-서버-컴포넌트-servercomponenttsx)
  - [2. 서버에서 생성된 RSC 페이로드 (전송되는 데이터)](#2-서버에서-생성된-rsc-페이로드-전송되는-데이터)
  - [3. 클라이언트에서 RSC 페이로드 해석 후 UI 생성](#3-클라이언트에서-rsc-페이로드-해석-후-ui-생성)
  - [정리](#정리-1)

# RSC 페이로드란?

**RSC 페이로드(RSC Payload)** 는 React Server Component가 서버에서 렌더링된 후, 클라이언트로 전달되는 데이터 형식을 말한다.

이 페이로드는 일반적인 HTML이 아니라, 특수한 **JSON-like 형식**으로 되어 있으며, 브라우저에서 직접 실행되지 않고 React의 클라이언트 런타임에 의해 해석된다.

또한 자바스크립트 번들에 포함되는 게 아닌 별도의 네트워크 요청을 통해 클라이언트 측으로 전송된다.

## Json-like 데이터란?

JSON-like란 JSON과 유사한 형식이지만, 정확히 JSON은 아닌 데이터 구조를 말한다.

React Server Components(RSC)에서 서버가 클라이언트로 보내는 RSC 페이로드는 JSON-like 데이터로, **JSON과 비슷하지만, JSON으로 완전히 표현할 수 없는 데이터(예: 함수, Symbol 등)** 가 포함될 수도 있다.

### 정리

- ✅ JSON-like는 JSON과 유사한 구조지만, JSON에서 허용되지 않는 데이터(함수, Symbol 등)가 포함될 수도 있는 데이터 형식이다.
- ✅ RSC에서 서버가 클라이언트로 보내는 페이로드는 JSON-like 데이터이다.
- ✅ 클라이언트에서 이 데이터를 React 클라이언트 런타임이 해석하여 UI를 렌더링한다.

즉, JSON과 거의 같지만, React에서 특별한 처리를 위해 JSON이 아닌 데이터가 들어갈 수도 있어서 JSON-like라고 부르는 것이다.

# 서버 컴포넌트의 렌더링 과정 (RSC 페이로드 생성 과정)

### 1. 서버에서 React Server Component를 실행

- 데이터베이스 조회, API 호출 등을 수행.
- 서버에서 JSX를 실행하지만, HTML을 직접 생성하는 것이 아니라 **RSC 페이로드(JSON-like 데이터)**로 변환.

### 2. 서버가 클라이언트로 RSC 페이로드 전송

- HTML이 아니라 React의 클라이언트 런타임이 해석할 수 있는 JSON-like 데이터.
- 클라이언트가 필요한 부분만 받아오므로 불필요한 JavaScript 번들 크기가 줄어듦.

### 3. 클라이언트에서 RSC 페이로드를 React 클라이언트 런타임이 해석

- React가 해당 데이터를 기반으로 실제 DOM을 생성하여 브라우저에 표시.
- 클라이언트에서 JavaScript가 거의 실행되지 않음.

# 🛠 RSC 페이로드 생성 예제

## 1. 서버 컴포넌트 (ServerComponent.tsx)

서버에서 API 데이터를 가져와 `<h1>` 요소로 출력하는 서버 컴포넌트.

```
export default async function ServerComponent() {
const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
(res) => res.json()
);


return <h1>{data.title}</h1>;
}
```

## 2. 서버에서 생성된 RSC 페이로드 (전송되는 데이터)

위 컴포넌트가 렌더링되면, 서버는 클라이언트에게 아래와 같은 **RSC 페이로드(JSON-like 데이터)** 를 보낸다.

```
[
  {
    "type": "h1",
    "key": null,
    "ref": null,
    "props": {
      "children": "delectus aut autem"
    }
  }
]
```

➡️ HTML이 아니라, React의 클라이언트 런타임이 해석할 수 있는 JSON-like 형식으로 변환된 React 컴포넌트 데이터가 서버에서 클라이언트로 전달됨.

## 3. 클라이언트에서 RSC 페이로드 해석 후 UI 생성

브라우저는 이 JSON-like 데이터를 받아서 React 클라이언트 런타임이 해석 후 결과적으로 브라우저 화면에는 다음과 같은 HTML 출력한다.

```
<h1>delectus aut autem</h1>
```

➡️ 이렇게 하면 불필요한 JavaScript 없이 서버에서 가져온 데이터를 기반으로 UI가 렌더링됨.

<!--  -->

RSC 페이로드는 클라이언트에서 fetch() 요청을 통해 전송됨.
그 후 React 클라이언트 런타임이 RSC 페이로드를 받아서 DOM에 렌더링함.
결과적으로 브라우저에는 최종적으로 `<h1>delectus aut autem</h1>` 같은 HTML이 나타남.

💡 중요한 점은 이 과정에서 불필요한 JavaScript가 클라이언트에 전달되지 않는다는 것!
➡️ 일반적인 CSR 방식에서는 API 응답을 받은 후 `useState`를 이용해 상태를 업데이트해야 하지만, RSC 방식에서는 서버에서 이미 Json-like 데이터를 렌더링하여 보내기 때문에 브라우저가 불필요한 JavaScript를 실행할 필요가 없음.

## 정리

- ✅ 서버 컴포넌트는 직접 HTML을 생성하지 않고, RSC 페이로드(JSON-like 데이터)를 만든다.
- ✅ 클라이언트는 이 페이로드를 받아서 React 클라이언트 런타임이 해석하고 UI를 렌더링한다.
- ✅ 클라이언트에서 불필요한 JavaScript 실행 없이 최적화된 UI를 렌더링할 수 있다.
