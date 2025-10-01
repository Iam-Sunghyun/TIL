<h2>목차</h2>

- [React 16까지 이벤트 위임 방식](#react-16까지-이벤트-위임-방식)
- [React 17부터 이벤트 핸들러가 등록되는 방식](#react-17부터-이벤트-핸들러가-등록되는-방식)
- [React 이벤트 객체](#react-이벤트-객체)

# React 16까지 이벤트 위임 방식

리액트는 16까지는 모든 이벤트 핸들러를 `document`에 위임했는데 이러한 구조에는 다음과 같은 문제점이 있다.

1. 여러 개의 root 노드를 사용할 때 충돌 가능성

   다음과 같이 페이지 안에 2개의 root 노드가 있는 경우 모든 이벤트가 `document`로 올라가 섞여버리게 된다.
   이벤트 핸들러는 `e.target`을 이용해 구분할 수 있지만 React 자체의 이벤트 디스패치 로직이 충돌하여 버그가 발생할 수 있다. root 단위로 이벤트를 관리하면 위임되는 이벤트 핸들러가 섞이지 않으므로 예기치 못한 버그를 막을 수 있다.

   ```
   <div id="root1"></div>
   <div id="root2"></div>
   ```

2. 외부 라이브러리와 충돌 가능성

   jQuery 같은 라이브러리가 `document`에 이벤트를 등록해 놓고, React도 똑같이 `document`에서 이벤트를 캐치하면, 이벤트 전파 순서가 꼬이거나 예상 못 한 동작이 생길 수 있다.

3. 점진적 업그레이드

   React 팀이 16 → 17 → 18 식으로 하나의 페이지에서 점진적으로 교체할 수 있게 하려고 이 변경을 하였다고 한다. `document` 단위 이벤트 위임은 모든 React 앱이 같은 이벤트 시스템을 써야만 했는데, 이제 root 단위로 컴포넌트 트리가 분리되니까 한 페이지에서 여러 버전 공존이 가능해진다.

<!-- 4. 포털(Portal) 같은 경우, 이벤트 경계가 애매해진다. -->

# React 17부터 이벤트 핸들러가 등록되는 방식

React 17버전부터 컴포넌트에 등록하는 모든 이벤트 핸들러는 해당 요소에 직접 바인딩 되지 않고 **DOM의 `#root` 노드에 이벤트 핸들러가 등록된다.** 즉, **이벤트가 발생하여 생성되는 이벤트 객체는 버블링 단계에서 `#root` 노드에서 캐치되고, `e.target`과 매치 되는 이벤트 핸들러 함수가 호출되는 것이다**(`#root`노드에서 위임).

만약 `onClick` 이벤트 핸들러를 여러 곳에 등록했다면 리액트는 모든 `onClick` 이벤트를 하나로 묶어 렌더링 과정에서 fiber 트리의 루트 노드에 등록된다(동일한 이벤트 타입에 대하여 하나로 번들링하여 등록한다).

이러한 동작은 리액트 내부에서 자동으로 이루어지며 위임 자체는 성능을 위한 것이라고 한다. 또한 `document`에서 위임되던 이벤트를 `root` 단위로 분리하여 한 페이지에 여러 버전의 리액트를 사용했을 시나, 외부 라이브러리가 `document`에서 이벤트를 처리하는 것과 같은 경우 코드가 섞여 발생할 수 있는 예기치 못한 버그를 막을 수 있다.

그리고 점진적 업그레이드도 가능해진다. 즉, `document` 단위 이벤트 위임은 모든 React 앱이 같은 이벤트 시스템을 써야만 했는데, 이제 root 단위로 분리되기 때문에 한 페이지에서 여러 버전 공존이 가능해진다(버전 업에 따른 이벤트 시스템 변경에도 문제 없음).

<div style="text-align: center">
  <img src="./img/react event handler.png" width="650px" heigth="550px" style="margin: 0 auto"/>

  <p style="color: gray">(https://www.udemy.com/course/the-ultimate-react-course/)</p>
</div>

# React 이벤트 객체

React에서도 vanilla JS와 마찬가지로 이벤트가 발생했을때 타입에 따른 이벤트 객체가 생성되고 이벤트 핸들러의 인수로 전달된다. 다만 React에선 `SyntheticEvent` 라고 하는 객체에 래핑되어 전달된다.

이 객체는 표준 DOM 이벤트 객체를 따르지만 모든 브라우저에서 동일하게 동작시키기 위해 일부 기능이 추가되거나 변경되어 만들어졌다.

<!-- ? -->

순수 JS 이벤트 객체의 메서드인 `preventDefault()`, `stopPropagation()`를 포함하고 있으며 일부 버블링되지 않는 이벤트들이 버블링되게 만들어져있다(ex) `focus`, `blur`, `change` 하지만 `scroll` 이벤트는 제외).

vanilla JS에선 요소의 기본 동작을 취소하고자 할 때, 이벤트 객체의 `preventDefault()` 메서드를 호출하거나, 이벤트 핸들러가 `false`를 반환하면 된다. 하지만 React의 이벤트 핸들러에선 `preventDefault()`만 동작한다.

추가로 리액트에서 캡처링 페이즈때 이벤트를 캐치하고자 한다면 `onClickCapture`과 같이 `Capture`가 붙은 `prop`에 이벤트 핸들러를 할당해주면 된다. 하지만 거의 사용하지 않음.

**[React.dev React event object]**

https://react.dev/reference/react-dom/components/common#react-event-object
