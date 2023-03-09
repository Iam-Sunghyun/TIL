# 컴포넌트 인라인 스타일 적용하기

리액트 엘리먼트에 인라인 스타일을 적용할 때는 `style` props를 통해 설정하며 문자열 형태로 넣는 것이 아니라 다음과 같이 객체 형태로 넣어 주어야 한다.

```
function App() {
  const name = '리액트';
  const style = {
    // 카멜 표기법으로 작성. 케밥 케이스는 'background-color'과 같이 따옴표로 감싸준다
    backgroundColor: 'black',
    color: 'aqua',
    fontSize: '48px', // font-size -> fontSize
    fontWeight: 'bold', // font-weight -> fontWeight
    padding: 16 // 단위를 생략하면 px로 지정됩니다.
  };

  return <div style={style}>{name} </div>;
}
 
export default App;
```
스타일 프로퍼티 이름의 경우도 `background-color`처럼 `-` 문자가 포함되는 형태(케밥 케이스)를 사용하는 경우 따옴표(`'', ""`)로 감싸줘야한다.

그렇지 않은 경우 `-` 문자를 없애고 카멜 표기법(camelCase)으로 작성해야 한다(`background-color`는 `backgroundColor`로 작성).
