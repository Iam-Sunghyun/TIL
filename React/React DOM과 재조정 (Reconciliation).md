# React 가상 DOM, 재조정 (Reconciliation)
<!-- 디테일하게, 딥하게 한번 봐야될 듯. 재조정 엔진 fider 포함 -->
React는 실제 DOM(DOM의 가상 표현)의 경량 사본과 같은 가상 DOM을 사용하며 원래 DOM에 존재하는 모든 개체에 대해 React Virtual DOM에 해당 개체가 있다.

리액트 앱에서 상태가 변경될 때마다 업데이트된 새로운 가상 DOM 트리가 생성되며(re-render) React는 이전의 가상 DOM과 새로운 DOM을 비교하여 변경 사항을 기록한다(React는 2개의 가상 DOM을 유지한다고 한다).

-> 리액트에서 2개의 트리를 비교할 때 사용하는 알고리즘을 비교 알고리즘 (Diffing Algorithm)이라 하며 비교 알고리즘으로 변경된 내용을 적용하기 위한 최소한의 연산을 결정하고, 실제 DOM을 업데이트하는 과정을 재조정 (Reconciliation)이라고 한다. DOM 트리를 비교할 때 개발자는 key prop을 통해 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다-> 렌더링 List and Keys.md 참고.

<!-- 그런 다음 실제 브라우저 DOM에 변경된 요소만 업데이트하여 브라우저에 렌더링한다 -> 커밋 phase. -->

----------

**[React 함수 컴포넌트의 수명 주기, re-renders 발생하는 경우 등등]**

https://shash68i.hashnode.dev/lifecycle-of-react-functional-components#heading-stages-in-a-components-lifecycle

**[리액트 렌더링 및 재조정 과정, 리렌더링 발생하는 경우]**

https://dev.to/teo_garcia/understanding-rendering-in-react-i5i

**[What Is The Virtual DOM and How Does It Work, + 장점]**

https://vegibit.com/what-is-the-virtual-dom-and-how-does-it-work/


**[How does React’s Reconciliation Algorithm work? fiber 장점]**

https://upmostly.com/tutorials/how-does-reconciliation-in-react-work


<!-- 브라우저 DOM을 생성하거나 변경된 경우 **변경된 곳만을 동기화**하여 브라우저 출력을 업데이트하는데(React는 렌더링 간에 차이가 있는 경우에만 DOM 노드를 변경한다),  -->