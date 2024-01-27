# Context API vs Redux

리액트의 내장 기능인 `Context API`가 있는데도 `Redux`를 사용하는 이유는 `Context`의 단점 중 하나가 규모가 큰 애플리케이션에서 아래와 같이 매우 복잡해질 수 있다는 것이다('provider hell' 이라고도 한다).

```
return (
  <AuthContextProvider>
    <ThemeContextProvider>
      <UIINteractionContextProvider>
        <MultiStepFormContextProvider>
          <UserRegistration />
        </MultiStepFormContextProvider>
      </UIINteractionContextProvider>
    </ThemeContextProvider>
  </AuthContextProvider>
)
```

그렇다고 하나의 `Context`에 모든 상태를 담기엔 너무 복잡해지고 잦은 업데이트로 인해 불필요한 렌더링도 발생하게 된다. `Context`의 일부만 업데이트 해도 `Context`를 사용하는 모든 컴포넌트가 리렌더링되는 성질 때문(업데이트한 값을 사용하지 않더라도).

`React Redux`는 내부적으로 많은 성능 최적화를 구현하므로 컴포넌트가 사용하는 상태가 변경되었을 때만 다시 렌더링된다. 따라서 업데이트가 잦거나 서버에서 fetch해온 원격 상태같은 경우 `Redux`를 통해 전역에서 관리하는 것이 일반적이라고 한다(원격 상태는 `React query`같은 도구를 사용하는 것이 더 모범사례이긴 하다).

<!-- Context API 대신 Redux 사용 이유, 차이점 어렴풋이 이해하는 중. 내용 보완 필 -->

`Redux`는 상태를 하나의 중앙 저장소에 저장하여 관리하기 때문에 데이터 흐름을 이해하기 쉽고 디버깅도 용이하다. `Redux`는 MVC 패턴의 양방향 데이터 흐름으로 인한 복잡성을 해결하기 위해 만들어진 flux 패턴에 `reducer` 개념을 도입하여 만들어졌다(리액트 앱에서는 리액트에서 더 쉽게 `Redux`를 사용할 수 있게 해주는 `Redux-toolkit`이라는 라이브러리를 사용한다).

**결론적으로 `Redux`를 사용하는 이유는 전역 상태 값을 하나의 중앙 저장소에서 저장하여 관리하고 단방향 데이터 흐름을 통해 앱의 복잡도를 줄이고 데이터 흐름을 예측하기 쉬운 코드를 작성하기 위한 것이다.**

**[Redux / Context API 장단점]**

https://likims.com/blog/context-vs-redux-pros-and-cons

# Context API + useReducer vs Redux 결론

규모 작고 업데이트 빈도 적은 전역 데이터, 약간의 프롭 드릴링 문제 해결을 위함 -> Context API

규모 크고 업데이트 빈도 높은 여러 컴포넌트에서 사용되는 복잡한 전역 데이터 -> Redux
