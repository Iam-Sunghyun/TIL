# 목차
- [Node.js 개괄](#nodejs-개괄)
    - [짤막한 정보!](#짤막한-정보)
    - [Node로 만들 수 있는 것들..!](#node로-만들-수-있는-것들)
  - [Node 장점](#node-장점)
  - [Node.js 객체 몇가지(극히 일부)](#nodejs-객체-몇가지극히-일부)
    - [`process` 객체](#process-객체)
    - [`file system` 모듈 (fs)](#file-system-모듈-fs)
    - [콜백을 이용한 비동기 방식으로 디렉토리 생성하기](#콜백을-이용한-비동기-방식으로-디렉토리-생성하기)
    - [동기 방식으로 사용자 입력 디렉토리 생성하기 + 빈파일 생성하기](#동기-방식으로-사용자-입력-디렉토리-생성하기--빈파일-생성하기)
- [유용한 도구들](#유용한-도구들)
  - [nvm(Node Version Manager) 노드 버전 관리자](#nvmnode-version-manager-노드-버전-관리자)
    - [OSX, Linux 버전](#osx-linux-버전)
    - [windows 버전](#windows-버전)
  - [유용한 도구 nodemon](#유용한-도구-nodemon)
  
# Node.js 개괄

Node.js에 대해서 간단하게 요약 정리 해본다.

공식 홈페이지에 따르면 Node.js는 브라우저 밖에서 작동되는 Chrome V8 JavaScript 엔진으로 빌드된 JavaScript 런타임 환경이다.

**Non-blocking I/O와 단일 스레드 이벤트 루프**기반으로 동작하여 **Request 처리 성능**좋아 I/O가 빈번히 발생하는 SPA(Single Page Application)에 적합하다. 하지만 CPU 사용률이 높은 앱에선 비추.

### 짤막한 정보!

```
자바스크립트 Deep Dive에서 본 것처럼 브라우저와 Node.js는 호스트 API가 다르다. 예를들어 Node에선 DOM API, alert() 메서드같은 브라우저 API가 제공되지 않는다. 하지만 Node에서만 제공되는 내장 API가 있다.
```

**[블록킹과 논블록킹 살펴보기]**

https://nodejs.org/ko/docs/guides/blocking-vs-non-blocking/

**[Nodejs 특징]**

https://node-js.tistory.com/27

**[SPA MPA SSR CSR]**

https://hanamon.kr/spa-mpa-ssr-csr-%EC%9E%A5%EB%8B%A8%EC%A0%90-%EB%9C%BB%EC%A0%95%EB%A6%AC/

### Node로 만들 수 있는 것들..!

- 웹 서버
- Command Line Tool(npm같은 명령줄 도구)
- Native app(VSCode, slack...)
- Video Game - 게임 개발에서 최선의 선택은 아닌듯. cross code라는 성공 사례가 있긴 함
- 드론 소프트웨어
- 등등

Node.js는 Netflix, Uber, Ebay, Udemy, twitter등 여러 기업에서 사용 중이며 심지어 NASA에서도 Node.js를 사용한다고 한다!

또한 npm같은 명령줄 도구(CLI Tool)을 만드는 데에도 사용하고, vscode같은 데스크탑 앱도 node와 electron 프레임워크 기반으로 만들어졌다고 함.

```
네이티브 앱? -> 특정 플랫폼(개발 맥락에선 운영 체제), 장치를 대상으로 만든 프로그램
```

**[Stack Share 노드를 사용하는 서비스들]**

https://stackshare.io/nodejs

**[NASA가 Node.js를 사용하는 이유]**

https://openjsf.org/wp-content/uploads/sites/84/2020/02/Case_Study-Node.js-NASA.pdf
https://www.sharedit.co.kr/posts/6211

## Node 장점

- 비동기 I/O 지원, 단일 스레드 이벤트 루프 기반 동작으로 요청/응답 처리 성능이 좋음.
- 익숙한 언어(자바스크립트)로 서버 개발을 할 수 있고 인기도 많아서 커뮤니티 풀이 크다.
- 따라서 개발 지식을 찾기도 쉬움.

## Node.js 객체 몇가지(극히 일부)

다음은 Node.js 홈페이지 docs를 참고하여 작성했다.

### `process` 객체

현재 Node.js 프로세스에 대한 process 정보와 제어를 제공한다. 전역으로 사용할 수 있지만 `require`또는 `import`를 통해 명시해주는 것이 좋다.

`process.argv`속성은 Node.js 프로세스가 시작될 때 전달된 명령줄 인수가 포함된 배열을 반환한다.

### `file system` 모듈 (fs)

fs모듈을 사용하면 표준 POSIX 기능을 모델링한 방식으로 파일 시스템과 상호 작용할 수 있다고 한다. -> 파일 처리를 위한 모듈이라고 보면 된다.

Node.js docs에 따르면 모든 파일 시스템 모듈은 **동기 방식** 혹은 **콜백**, **프로미스 기반**으로 작동되며 CommonJS, ESM 형식으로 모듈을 사용할 수 있다.

공식 문서에 나온 방식으로 디렉토리를 만들어 보았다.

### 콜백을 이용한 비동기 방식으로 디렉토리 생성하기

```
import { mkdir } from 'fs'; // ESM

// 첫 번째 인수로 전달한 경로에 비동기로 디렉토리 모두 생성(경로 상에 디렉토리가 이미 있어도)
mkdir('dogs', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('mkdir completed!!');
});

console.log('mkdir ing');
```

인수로 전달한 경로를 모두 생성하고 싶다면 `recursive: true`로 설정 해준다.

위 코드는 비동기로 동작하기 때문에 mkdir ing -> mkdir completed 순으로 출력된다.

### 동기 방식으로 사용자 입력 디렉토리 생성하기 + 빈파일 생성하기

```
import fs from 'fs';
import process from 'process'; // process는 import없이 전역에서 사용 가능하나 명시를 위한 import

const folderName = process.argv[2] || 'Project'; // 사용자 입력 받기

try {
  fs.mkdirSync(folderName);
  fs.writeFileSync(`${folderName}/index.html`, '');
  fs.writeFileSync(`${folderName}/style.css`, '');
  fs.writeFileSync(`${folderName}/app.js`, '');
} catch (e) {
  console.log('오류 발생!!');
}
```

주의할 점은 스크립트 위치에 디렉토리, 파일이 생성되는 게 아니라 실행하는 위치에 생성된다는 것.

<br>

**[Node.js, npm 정리 잘된 사이트]**

https://nodejs.dev/learn

**[Node.js 웹사이트 docs]** <br>

https://nodejs.org/dist/latest-v16.x/docs/api/

# 유용한 도구들

## nvm(Node Version Manager) 노드 버전 관리자

노드 버전 관리자(nvm)을 이용해 여러 버전의 Node.js와 npm을 설치하고 전환할 수 있다.

### OSX, Linux 버전

- nvm
- N

### windows 버전

- nodist
- nvm-windows

<BR>

**[geeksforgeeks nvm]**

https://www.geeksforgeeks.org/how-to-update-node-js-and-npm-to-next-version/

## 유용한 도구 nodemon

디렉토리의 파일 변경이 감지되면 자동으로 Node 앱을 재시작 해주는 프로그램.

아래와 같이 전역 설치(global install) 해주었다.

```
npm install -g nodemon
```

**[nodemon, live-server 차이]**

https://stackoverflow.com/questions/54388825/what-is-the-difference-between-nodemon-and-live-server

**[nodemon]** <br>

https://www.npmjs.com/package/nodemon
