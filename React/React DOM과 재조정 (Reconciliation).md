# React 가상 DOM

React는 실제 DOM(DOM의 가상 표현)의 경량 사본과 같은 가상 DOM을 사용하며 원래 DOM에 존재하는 모든 개체에 대해 React Virtual DOM에 해당 개체가 있다.

리액트 앱에서 상태가 변경될 때마다 업데이트된 새로운 가상 DOM 트리가 생성되며 React는 이전의 가상 DOM과 새로운 DOM을 비교하여 변경 사항을 기록한다(React는 2개의 가상 DOM을 유지한다고 한다).

리액트에서 2개의 트리를 비교할 때 사용하는 알고리즘을 비교 알고리즘 (Diffing Algorithm)이라한다. 개발자는 key prop을 통해, 여러 렌더링 사이에서 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다.

그런 다음 실제 브라우저 DOM에 변경된 요소만 웹 페이지에서 업데이트하여 렌더링하는데 변경 사항을 실제 DOM으로 변환하는 이 전체 프로세스를 재조정 (Reconciliation)이라고 한다.

**[※ React 성능 최적화 - React가 UI를 업데이트하는 방법 이해]**

https://blog.logrocket.com/optimizing-performance-react-app/#react-update-ui

**[React docs 재조정 (Reconciliation)]**

https://ko.reactjs.org/docs/reconciliation.html


**[geekforgeeks react virtual dom]**

https://www.geeksforgeeks.org/reactjs-virtual-dom/

**[리액트는 어쩌다 만들어졌을까?]**

https://react.vlpt.us/basic/01-concept.html


<!-- 브라우저 DOM을 생성하거나 변경된 경우 **변경된 곳만을 동기화**하여 브라우저 출력을 업데이트하는데(React는 렌더링 간에 차이가 있는 경우에만 DOM 노드를 변경한다),  -->