# Node.js 모듈(module)?

모듈(module)이란 프로그램을 구성하는 개별적 요소로, 재사용 가능한 코드 조각들을 말한다.
보통 모듈은 기능을 기준으로 파일 단위로 분리하며 모듈이 성립되려면 모듈만의 독립적인 스코프를 가질 수 있어야 한다.

Node.js에는 CommonJS, ECMAScript 모듈(ESM) 두가지 모듈 시스템이 있다. 



## ESM

JavaScript 표준 모듈화 시스템으로 비동기로 동작하며 `import`, `export`, `export default`문을 사용한다. 

ESM 파일에는 클래스처럼 strict mode가 적용된다.

### import, export
```
// addTwo.mjs  
export function addTwo(num) {
  return num + 2;
}
// or
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
모듈에서 하나만을 export할 때는 `export default` 키워드를 사용할 수 있다. default 키워드를 사용하는 경우 중괄호 없이 모듈을 import 한다.

### export default 
```
// app.js
export default function (x) {
  return x * x;
}
----------------------------------
import square from 'app.js'

console.log(square(5)); // 25
```

default 키워드를 사용하는 경우 var, let, const는 사용할 수 없다.
```
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

nodejs에서 esm을 사용하려면 `package.json`파일에 `"type"="module"`을 넣어줘야 한다.


**[ES6 모듈 내보내고 가져오기]** <BR>
https://ko.javascript.info/import-export#ref-4122 <BR>



## Commonjs(CJS)

Node.js의 기본 모듈화 시스템이다. 동기 방식으로 동작하기 때문에 서버 사이드에서 사용하기 좋다.(흠..)

`module.exports`, `exports`, `require`문을 사용한다.

`module.exports`는 모듈에서 내보낼 객체이고, `exports`는 `module.exports`의 축약어로 `module.exports` 객체를 참조하고 있는 키워드이다. 

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

하나의 클래스를 exports 하는 경우
```
// bar.js
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`The area of mySquare is ${mySquare.area()}`);
--------------------------------------------
// square.js
// 이 경우 exports에 할당하면 지역변수가 되어버린다. 따라서 module.exports에 직접 할당할 것.
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```

조심해야 할 것은 클래스같은 하나의 객체, 값을 exports하고 싶을때 `module.exports`에 할당하지 않고 `exports`에 할당하게 되면 모듈화 되지 않고 그 모듈안에 exports란 이름의 지역변수가 되어 버린다. 

따라서 하나의 객체, 값을 exports하고 싶으면 반드시 `module.exports` 객체에 직접 할당 할 것.
```
exports = { a: 'a', b: 'b'} // (x)
module.exports = { a: 'a', b: 'b'} // (O)
--------
exports = (name) => `Hi ${name} 👋`; (x)
module.exports = (name) => `Hi ${name} 👋`; (O)
```

Node.js가 모듈을 결정하는 방법은 아래 링크 참조.

<!--EMS #CJS 어떤걸 써야 할까??????-->


https://yceffort.kr/2020/08/commonjs-esmodules
<br>

**[Node.js 모듈 시스템 결정 방법]** <br>
https://nodejs.org/api/packages.html#determining-module-system <br>

**[CommonJS exports, module.exports 차이]** <br>
https://dydals5678.tistory.com/97<br>
https://pawelgrzybek.com/the-difference-between-module-exports-and-exports-in-node-js/



## 모듈화 필요성

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



## 디렉토리로 파일 불러오기
index.js 파일은 특정 디렉토리의 진입점 역할을 한다.

예를들면 require('/폴더1')로 파일이 아닌 디렉토리를 로드했을 때 폴더1의 index.js파일이 export한 내용을 로드하게 된다.

```
/폴더1 
   ㄴapp1.js
   ㄴapp2.js
   ㄴindex.js
```
index.js는 라이브러리를 만들 때나, 사용할 때 매우 중요한 역할을 한다.



# NPM(Node Package Manger)

NPM(Node Package Manger) 이란?

+ 수 많은 패키지로 구성된 패키지 저장소(레지스트리)이다. 무료로 사용 가능하다. 

+ 명령줄 인터페이스(CLI)로 아주 간단하게 패키지들을 설치하고 관리할 수 있다.

`npm install`로 패키지를 설치하면 해당 디렉토리에 `node_modules` 폴더, `package.json`, `package-lock.json` 파일이 생성된다(npm init없이 생성된 경우 `package.json`에 프로젝트 이름, 라이센스 기타 메타 데이터들은 생성되지 않았다.).

## `node_modules` 

패키지 파일들이 저장되는 디렉토리. `package.json`에 등록된 패키지와 그 패키지들이 의존하고 있는 패키지 전부를 포함함.


패키지 모듈을 로드할 때 경로가 아닌 패키지 이름으로 로드할 경우 자동으로 해당 디렉토리의 `node_modules`를 탐색함.
ex) require('give-me-a-joke')


## `package.json`

프로젝트 이름, 의존성(dependency)과 같은 여러가지 프로젝트 메타 데이터가 저장되어 있다.

`npm init`으로 프로젝트를 처음 만들 때 초기화 해주거나 `npm install`로 패키지를 다운 받으면 생성된다. 보통 루트 디렉토리에 위치한다.

`package-lock.json`이 존재할 때에는 `package.json`을 사용하여 `node_modules`를 생성하지않고 `package-lock.json`을 사용하여 `node_modules`를 생성한다고 한다. 더 정확한 버전의 패키지를 받기 위함인 듯.

`package.json`이나 `package-lock.json`의 의존성 패키지들을 다운로드 받기 위해선 일일히 다운로드 할 필요 없이 `npm install` 명령어를 입력해주면 된다.


## `package-lock.json`

`node_modules`나 `package.json` 파일이 수정되면 자동으로 생성되거나 업데이트되고 그 시점에 정확한 버전의 의존성 버전을 저장하는 파일. 

`package.json`은 의존성 패키지 버전이 ^, ~ 같이 범위로 지정 되어있는 경우가 많은데 이로인해 프로젝트를 내려받고 의존성 패키지를 설치하는 시점에 따라 패키지 버전이 다르게 다운로드될 수 있다. `package-lock.json`은 정확한 의존성 버전을 저장하여 개발자들 사이에 서로 다른 버전의 패키지가 설치되는 일을 막는다. 

즉 어느 환경, 시점에라도 동일한 의존성 트리를 생성할 수 있도록 정확한 패키지 버전을 저장해 놓은 것.

### `node_modules`를 직접 내려받으면 되지 않는가?
의존성 패키지가 많은 경우 디렉토리 공간을 매우 많이 차지하게 됨. 따라서 `package.json`이나 `package-lock.json` 내용을 기반으로 `node_modules`를 생성하게 된다.


<br>

### [Package.json과 Package-lock.json의 차이]
https://velog.io/@songyouhyun/Package.json%EA%B3%BC-Package-lock.json%EC%9D%98-%EC%B0%A8%EC%9D%B4 <br>

### [패키지 잠금 파일 (package-lock.json, yarn.lock)]
https://www.daleseo.com/js-package-locks/ <br>



## 패키지 지역 설치, 전역 설치

말 그대로 특정 디렉토리안에 설치하는 것과, -g 플래그를 추가해 전역에 설치하는 것.
```
npm install <package-name>
npm install -g <package-name>
```
### 지역 설치(local install)
일반적으로 지역 설치를 많이하는 데 이유는
1. 프로젝트마다 사용 패키지 버전이 다를 수 있다.
2. 글로벌 패키지의 경우 업데이트하면 모든 프로젝트에서 새 릴리스를 사용하게 되며, 
일부 패키지가 추가 의존성과의 호환성을 깨뜨릴 수 있기 때문에 유지 관리 측면에서 복잡해질 수 있다.


### 전역 설치(global install)
전역 설치시 프로젝트 디렉토리 같은 특정 디렉토리가 아닌, 전체 계정 및 전체 사용자에 대한 node_modules에 저장이 된다(로컬 컴퓨터 전역).
전역 설치된 패키지는 OS에 따라 다음과 같은 위치에 저장된다.
```
macOS의 경우  -  /usr/local/lib/node_modules
윈도우의 경우  -  c:\Users\%USERNAME%\AppData\Roaming\npm\node_modules
```

+ powershell로 전역 설치한 모듈을 실행하면 보안 정책 위반이 뜬다. 따라서 다음과 같은 명령어로 보안 수준을 변경시켜 주었다.
```
Set-ExecutionPolicy -Scope CurrentUser Unrestricted
```

<!-- 특정 디렉토리에서 'npm link 패키지명'을 사용해 전역 패키지에 접근할 수 있다.  -->
<!-- 패키지 는 셸(CLI)에서 실행하는 실행 가능한 명령을 제공할 때 전역적으로 설치되어야 하며 프로젝트 전체에서 재사용됩니다.
흠... -->



<br>

### [Node.js npm 정리 사이트]
https://nodejs.dev/learn

### [npm doc]
https://docs.npmjs.com/about-npm






