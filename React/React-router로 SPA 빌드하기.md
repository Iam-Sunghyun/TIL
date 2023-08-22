<h2>목차</h2>

- [리액트 라우터가 뭔지 역할, 필요 이유 및 장점](#리액트-라우터가-뭔지-역할-필요-이유-및-장점)
- [vite를 이용한 프로젝트 생성](#vite를-이용한-프로젝트-생성)
  - [개발환경 구성 - 기본적인 패키지 설치](#개발환경-구성---기본적인-패키지-설치)
    - [npm install (plugin) --save란?](#npm-install-plugin---save란)
    - [npm install (plugin) --save-dev란?](#npm-install-plugin---save-dev란)
  - [`.eslintrc.json`, `vite.config.js` 파일 설정](#eslintrcjson-viteconfigjs-파일-설정)
- [](#)

vite - 빌드 툴
webpack - 모듈 번들러
babel - 트랜스 파일러

create-react-app과 달리 Vite는 기본적으로 다양한 프레임워크(vue, react, preact, svelte 등)에 대한 몇 가지 템플릿을 포함하는 최신 빌드 도구에 가깝습니다. 따라서 다양한 프레임워크에서 사용할 수 있고 바닐라 JS로도 사용할 수 있다.




# 리액트 라우터가 뭔지 역할, 필요 이유 및 장점

페이지 변경 시 url도 변경하여 페이지 history를 기록할 수 수 있게 한다. 이로서 뒤로 가기, 앞으로 가기 기능을 가능하게 하고 페이지 북마크도 가능해진다. 즉, 제대로 된 SPA가 되는 셈

# vite를 이용한 프로젝트 생성

## 개발환경 구성 - 기본적인 패키지 설치

```
// vite 프로젝트 생성
npm create vite@latest

// eslint 및 설정 플러그인 설치
npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev
```
eslint-config-react-app  -> create-react-app에 포함 되어있는 리액트 앱용 eslint 설정 파일.


### npm install (plugin) --save란?

패키지(plugin)를 ./node_moduels 디렉터리에 설치하고 ./package.json 파일의 dependencies 항목에 플러그인 정보가 저장 됩니다.
--production 빌드시 해당 플러그인이 포함됩니다.

### npm install (plugin) --save-dev란?

패키지(plugin)를 ./node_moduels 디렉터리에 설치하고 ./package.json 파일의 devDependencies 항목에 플러그인 정보가 저장 됩니다.
--production 빌드시 해당 플러그인이 포함되지 않습니다.

https://ithub.tistory.com/165



## `.eslintrc.json`, `vite.config.js` 파일 설정

```
// .eslintrc.json
module.exports = {
     . 
     . 
 extends: [  
    'react-app',  // extend 프로퍼티에 react-app 추가
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
     .
     .
  "no-unused-vars": "warn",  // 사용되지 않은 변수 존재 시 에러를 발생시키던 것을 경고 메시지로 변경
};
----------------------------------
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],  // eslint() -> vite eslint 플러그인 추가
});
```

```
// 애플리케이션 실행
npm run dev 
```

// 애플리케이션 실행
npm run dev 



# 


**[vscode에서 자주 쓰는 코드 스니펫(조각) 설정하는 법]**

https://react.vlpt.us/basic/27-useful-tools.html