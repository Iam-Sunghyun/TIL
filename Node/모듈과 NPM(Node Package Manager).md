# Node.js 모듈(module)?

모듈(module)이란 프로그램을 구성하는 개별적 요소로, 재사용 가능한 코드 조각들을 말한다.
보통 모듈은 기능을 기준으로 파일 단위로 분리하며 모듈이 성립되려면 모듈만의 독립적인 스코프를 가질 수 있어야 한다.

Node.js에는 CommonJS, ECMAScript 모듈(ESM) 두가지 모듈 시스템이 있다. 

## ESM

JavaScript 표준 모듈화 시스템으로 비동기로 동작하며 import, export, export default문을 사용한다. 

ESM 파일에는 클래스처럼 strict mode가 적용된다.

### import, export
```
// addTwo.mjs  
function addTwo(num) {
  return num + 2;
}

export { addTwo };
--------------------------------------------
// app.mjs
import { addTwo } from './addTwo.mjs';

// Prints: 6
console.log(addTwo(4));
```
모듈에서 하나만을 export할 때는 default 키워드를 사용할 수 있다. default 키워드를 사용하는 경우 var, let, const는 사용할 수 없다.

### export default 
```
export default function (x) {
  return x * x;
}
-------------------------------------------
// lib.mjs
export default () => {};  // => OK

export default const foo = () => {};
// => SyntaxError: Unexpected token 'const'
```

`script` 태그에 `type="module"` 어트리뷰트를 추가하면 로드된 자바스크립트 파일은 esm모듈로서 동작한다.
```
<script type="module" src="lib.mjs"></script>
<script type="module" src="app.mjs"></script>
```

## Commonjs(CJS)

Node.js의 기본 모듈화 시스템이다. 동기 방식으로 동작하며 module.exports, exports, require문 사용한다.
```
// app.mjs
const circle = require('./circle.js');
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
--------------------------------------------
// circle.js
const { PI } = Math;
exports.area = (r) => PI * r ** 2;
exports.circumference = (r) => 2 * PI * r;
```

클래스를 exports 하는 경우
```
// bar.js
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`The area of mySquare is ${mySquare.area()}`);
--------------------------------------------
// square.js
// Assigning to exports will not modify module, must use module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```

Node.js가 모듈을 결정하는 방법은 아래 링크 참조.

<br>

**[Node.js 모듈 시스템 결정 방법]** <br>
https://nodejs.org/api/packages.html#determining-module-system <br>

**[CommonJS exports, module.exports 차이]** <br>
https://cotak.tistory.com/103 <br>


# 모듈화 필요성

+ 코드 재사용
+ 모듈마다 독립적인 스코프를 적용하여 변수 충돌 방지
+ 기능 분리로 복잡성 감소, 유지보수 용이

자바스크립트는 웹페이지에 있어서 보조적인 기능을 수행하기 위해 한정적인 용도로 만들어진 태생적 한계로 다른 언어에 비해 부족한(나쁜) 부분이 있는 것이 사실이다. 그 대표적인 것이 모듈 시스템을 지원하지 않았었다는 것.

즉, 자바스크립트 파일을 여러 개로 분리해서 `<script>`로 로드해도 분리된 파일들은 하나의 자바스크립트 파일 내에 있는 것처럼 동작한다. 모든 분리된 자바스크립트 파일이 하나의 전역을 공유하는 것이다. 이러한 특성은 전역 변수 충돌의 가능성을 만든다.

아래는 자바스크립트 파일들이 하나의 전역을 공유하여 충돌이 생기는 경우이다.
```
// app1.js
var x = 'foo';

// 변수 x는 전역 변수이다.
console.log(window.x);  // foo

-------------------------------------------
// app2.js
// app1.js에서 선언한 전역 변수 x와 중복된 선언이다.
var x = 'bar';

// 변수 x는 전역 변수이다.
// app1.js에서 선언한 전역 변수 x의 값이 재할당되었다.
console.log(window.x);  // bar

-------------------------------------------
<!DOCTYPE html>
<html>
<body>
  <script src="app1.js"></script>
  <script src="app2.js"></script>
</body>
</html>

console------------------------------------
foo
bar
```

<br>

https://yceffort.kr/2020/08/commonjs-esmodules

**[자바스크립트 모듈 시스템: ESM과 CommonJS]** <br>
https://www.youdad.kr/js-module-system/ <br>

**[Node.js DOCS]**  <br>
https://nodejs.org/api/modules.html <br>


<!-- # NPM

Node Package Manger -->



