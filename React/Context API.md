<h2>목차</h2>

- [`Context API`란?](#context-api란)
- [사용 방법](#사용-방법)
  - [1. 컨텍스트 생성](#1-컨텍스트-생성)
    - [자잘한 Tip](#자잘한-tip)
  - [2. 컨텍스트 제공(provide)](#2-컨텍스트-제공provide)
  - [3. 컨텍스트 사용](#3-컨텍스트-사용)
  - [Context 문제점](#context-문제점)
  - [Reference](#reference)

# `Context API`란?

앱 규모가 커질수록, 컴포넌트 트리가 깊어지게 되고 그에 따라 자식 컴포넌트에 `props`로 데이터를 전달하는데 불편함이 생길 수 있다. 이런 경우 `Context`를 사용하여 여러 컴포넌트에 공통적으로 필요한 `state`를 전역에서 관리하여 prop drilling 없이 하위 컴포넌트에서 사용할 수 있다.

참고로 자주 변경될 가능성이 높은 원격 상태(ex) `fetch`로 서버에서 불러오는 데이터들)보다 UI 로컬 상태를 관리하는데 더 적합하다. 원격 상태(remote state)의 경우는 `Redux`, `SWR`, `Zustand`와 같은 상태 관리 도구를 함께 사용하여 관리하는 것이 일반적이다.

# 사용 방법

## 1. 컨텍스트 생성

다음은 다크모드를 구현한 예제로, 버튼을 클릭하면 `isDark` 상태 변수의 값이 `true`/`false`로 반전되고 이에 따라 모든 컴포넌트의 색을 반전시킨다.

우선 별도의 파일을 구성. `createContext`로 `Context`를 생성해준다.

```
// ThemeContext.js
import { createContext } from 'react';

export const ThemeContext = createContext(null);
```

`createContext` 함수의 인수로 전달되는 값은 `Context.Provider`가 없을 경우 `useContext`로 읽어오는 초기 값이 된다. 별다른 목적이 없다면 보통 `null`을 사용한다

### 자잘한 Tip

```
createContext()의 인수에 Provider가 제공하는 props 이름을(value로 전달한 값)을 넣으면 자동 완성 기능을 사용할 수 있다(값은 상관 없다).
ex) createContext({
    isDark: null,
    setIsDark: () => {}
   })
```

## 2. 컨텍스트 제공(provide)

그 다음 `props`를 제공하고자 하는 부모 컴포넌트의 엘리먼트들을 `<Context.Provider>` 태그로 감싸주고 `value` `prop`에 전달하고자 하는 데이터를 넣어준다.

```
// App.js
import { useState } from 'react;
import Page from './components/Page';
// `<Context.Provider>`로 사용하려는 `Context`를 `import`
import { ThemeContext } from './Context/ThemeContext';

function App(){
  const [isDark, setIsDark] = useState(false);

  return (
    // 공유할 Context에 isDark 상태 변수와, set 함수를 전달
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <Page />
        .
        .
        .
    </ThemeContext.Provider>
  )
}
```

## 3. 컨텍스트 사용

이제 `<App>`의 하위 컴포넌트에서 `Context` 데이터를 사용할 수 있는데 `Context` 데이터가 필요한 자식 컴포넌트에서 `useContext` 훅으로 데이터를 받아와 사용한다.

여기서도 생성한 `Context`를 `import` 해줘야 하는 것 주의!

```
// Head.js
import { ThemeContext } from './Context/ThemeContext';

const Header = () => {
    // 객체 디스트럭쳐링으로 Context 데이터 전달 받음
  const { isDark, setIsDark } = useContext(ThemeContext);

  return (
      // Context로 가져온 isDark 값에 따라 backgroundColor 값을 설정
      <header style={{ backgroundColor : isDark ? 'black' : 'white' }}>
        <button onClick={ () => { setIsDark(prev => !prev); }>다크모드</button>
          .
          .
          .
      </header>
    )
}
export default Header;
```

<!-- + 컨텍스트 파일에 <Context.Provider>로 감싸는 래퍼 컴포넌트를 만들어서 export하여 사용하는 방법도 있다. 134강 참조  -->

## Context 문제점

`Context`를 사용해보면, `props`를 완전히 대체할 수 있어 보이지만 몇 가지 문제가 되는 점이 있다.

우선 `Context`를 사용하면 컴포넌트를 재사용하기 어려워 질 수 있다. 예를 들어 버튼에서 `useContext`가 선언되어 있다면 해당 `Provider`에 대한 의존성으로 인해 `Provider` 하위가 아닌 곳에서는 사용할 수 없게 되는 것이다(이런 경우 보통의 `props`를 사용).

추가로 `Context`의 상태가 변경되는 경우 `Context`로 감싼 컴포넌트의 모든 하위 컴포넌트들이 리렌더링 된다. 이 경우 `memo`를 사용해서 불필요한 렌더링을 막을 수 있다.

하지만 `Context` 상태를 사용하는 자손 컴포넌트들의 경우, `memo`로 메모이제이션 해주더라도 무조건적으로 리렌더링 되는데 이때 `Context`에서 변경되지 않은 상태 값을 사용하는 자식 컴포넌트도 모두 리렌더링된다. 즉, `ContextA`가 `{ a: 1, b: 1}`를 제공하고 `ComponentA`가 `a`를 사용한다고 가정했을 때, `b`가 변경되어도 `ComponentA`는 리렌더링 된다.

따라서 성능을 위해서 상태를 세분화하여 `Context`를 구성하거나, `Context` 데이터가 짧은 시간에 여러 번 업데이트 되는 경우에는 사용하지 않는 것이 좋다.

또한 무분별하게 사용한다면 데이터 흐름을 파악하기 힘들어질 수 있기 때문에 필요한 경우에만 사용해야 한다(prop drilling을 피하기 위한 목적이라면 컴포넌트 합성을 고려해보라고 되어있다).

컨텍스트 사용 전 고려해봐야 할 사항과 사용 사례 등 추가 내용은 링크 참조.

## Reference

**[The Issue With Using React Context API for State]**

https://blog.jannikwempe.com/when-to-not-use-react-Context-api-for-state#heading-the-issue-with-using-react-Context-api-for-state

**[React docs passing data deeply with Context]**

https://react.dev/learn/passing-data-deeply-with-Context

**[React docs createContext]**

https://react.dev/reference/react/createContext
