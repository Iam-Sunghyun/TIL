# Custom Hook이란?

커스텀 훅이란 이름 그대로 사용자 정의 훅(hook)으로 리액트 내장 훅을 사용하는 함수 중복되는 로직을 추출하여 코드를 간소화하고 재사용성을 극대화 할 수 있다.

커스텀 훅의 이름은 `useSometing`과 같이 항상 `use`로 시작하는 형태로 작성해야한다.

만약 커스텀 훅 내부에서 리액트 내장 훅(`useState`,`useEffect` 등)을 호출하지 않는 경우 `use` 접두사를 붙이지 않고 일반 함수로 정의해야한다. -> 에러가 발생하진 않지만 가독성을 해치고, `use`가 붙게되면 컴포넌트 최상위가 아닌 곳에서는 호출할 수 없다.

```
```

**[React docs Custom Hooks]**

https://react.dev/learn/reusing-logic-with-custom-hooks