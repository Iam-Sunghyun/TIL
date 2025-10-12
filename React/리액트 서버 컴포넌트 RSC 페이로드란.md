- [RSC 페이로드란?](#rsc-페이로드란)
  - [RSC 페이로드의 예시](#rsc-페이로드의-예시)
  - [Json-like 데이터란?](#json-like-데이터란)
- [클라이언트로 가는 데이터 흐름](#클라이언트로-가는-데이터-흐름)
  - [1. 서버에서 React Server Component를 실행](#1-서버에서-react-server-component를-실행)
  - [2. 서버가 클라이언트로 RSC 페이로드 및 데이터 전송](#2-서버가-클라이언트로-rsc-페이로드-및-데이터-전송)
  - [3. 클라이언트에서 해석](#3-클라이언트에서-해석)

</br>

# RSC 페이로드란?

**RSC 페이로드(RSC Payload)** 란 React Server Component가 서버에서 렌더링된 후, 직렬화 되어 클라이언트로 전송되는 데이터를 말한다(React 컴포넌트 트리를 직렬화한 것).

이 페이로드는 일반적인 HTML이 아니라, **JSON-like** 형식으로 되어 있으며, 브라우저에서 직접 실행되지 않고 React의 클라이언트 런타임에 의해 해석된다.

또한 자바스크립트 번들에 포함되는 게 아닌 별도의 네트워크 요청을 통해 클라이언트 측으로 전송된다.

## RSC 페이로드의 예시

```
// ServerComponent.tsx (RSC)
import ClientButton from "./ClientButton";

export default async function ServerComponent() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(r => r.json());

  return (
    <section>
      <h1>Todo: {data.title}</h1>
      <ul>
        <li>ID: {data.id}</li>
        <li>Completed: {String(data.completed)}</li>
      </ul>
      <ClientButton label="Click me!" />
    </section>
  );
}
---------------------------
// ClientButton.tsx (Client Component)
"use client";

export default function ClientButton({ label }: { label: string }) {
  return <button onClick={() => alert("clicked!")}>{label}</button>;
}
---------------------------

---------------------------
// RSC 페이로드(json-like 데이터)
J0: ["$","section",null,{
  "children":[
    ["$","h1",null,{"children":"Todo: delectus aut autem"}],
    "$L0",
    "$L3"
  ]
}]
---------------------------
L0: ["$","ul",null,{
  "children":[
    "$L1",
    "$L2"
  ]
}]
---------------------------
L1: ["$","li",null,{"children":"ID: 1"}]
---------------------------
L2: ["$","li",null,{"children":"Completed: false"}]
---------------------------
L3: ["$","ClientButton","$L4",{"label":"Click me!"}]
---------------------------
L4: "$$moduleReference(ClientButton)"
----------------------------------

----------------------------------
// 실제 Flight wire format (raw 프로토콜)
1:["$","section",null,{"children":[["$","h1",null,{"children":"Todo: delectus aut autem"}],"$2","$5"]}]
2:["$","ul",null,{"children":["$3","$4"]}]
3:["$","li",null,{"children":"ID: 1"}]
4:["$","li",null,{"children":"Completed: false"}]
5:["$","ClientButton","$6",{"label":"Click me!"}]
6:$$moduleReference(ClientButton)
```

서버에서 클라이언트로 정보를 보낼 때 기본적으로 스트리밍을 통해 조각 단위로 보내게 되는데 J0 같은 접두사가 하나의 조각 -> **청크(chunk)** 를 의미하며 J, M, S와 같은 알파벳이 청크 타입을 의미한다.

이 청크 단위로 클라이언트로 전송되고 또 클라이언트에선 청크 단위로 받아서 역직렬화 후 렌더링하여 Fiber tree의 일부로 재구성한다(점진적 렌더링 -> 빠른 속도). 또한 필요시 청크 단위로 나중에 다운로드 받거나 하는게 가능하다

-> (참고로 RSC 청크 단위와 Fiber가 처리하는 렌더링 단위(청크)와는 다르다).

## Json-like 데이터란?

JSON-like는 JSON과 유사한 구조지만, JSON에서 허용되지 않는 데이터(함수, Symbol 등)가 포함될 수도 있는 데이터 형식이다.

</br>
</br>

# 클라이언트로 가는 데이터 흐름

## 1. 서버에서 React Server Component를 실행

- 데이터베이스 조회, API 호출 등을 수행.
- 서버 컴포넌트는 서버에서 실행되고, HTML이 아닌 **RSC 페이로드(JSON-like)** 로 직렬화 된다.
- RSC 페이로드는 컴포넌트 트리 구조와 `props`, 어디에 어떤 클라이언트 컴포넌트가 어느 위치에 삽입될 지에 대한 정보 등을 담고 있다.

## 2. 서버가 클라이언트로 RSC 페이로드 및 데이터 전송

- 서버는 초기 HTML(SSR/SSG)과 RSC Payload 그리고 클라이언트 컴포넌트가 담긴 JS 번들을 클라이언트로 전송 한다.

RSC 페이로드는 스트리밍 방식으로 전달될 수 있어서, 클라이언트가 받은 데이터를 즉시 렌더링하면서, 남은 데이터를 계속 받아올 수 있다. 즉, 서버가 RSC 트리 일부를 계산하면 곧바로 클라이언트로 흘려보내고, 클라이언트는 받은 부분부터 점진적으로 UI를 채워 넣는다.

참고로 Next.js의 서버 컴포넌트의 기본 전송 방식이 스트리밍 방식이다.

## 3. 클라이언트에서 해석

<!-- 약간 헷갈 -->

- 브라우저가 초기 HTML을 렌더링하여 화면에 표시한다.
- RSC Payload 받아서 React가 UI를 갱신한다.
- JS 번들 로드 후 상호작용을 활성화(Hydration)한다.

</br>

**[서버 컴포넌트 요청 응답 시퀀스 다이어그램]**

https://www.jimmymeetsworld.com/claude-code-personal-tutor
