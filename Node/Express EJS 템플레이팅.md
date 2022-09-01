# 템플레이팅(templating)이란?

요청마다 다른 페이지를 구성하는 게 아닌, 하나의 템플릿 안에 데이터(변수), 조건문이나 반복문 같은 로직을 삽입하여 HTML 일부를 반복 사용하는 것을 말한다(마치 문자열 안에 템플릿 리터럴로 표현식을 삽입해놓은 것처럼). -> **재사용성↑ 유지보수 용이**

예를 들면 페이지에 회원가입, 로그인 버튼이 있는 부분에 로그인 후에는 로그아웃 버튼 하나만 표시되는 것과 같이 조건에 따라 로직을 만들고, 그에 맞는 HTML 응답 페이지를 만들어내는 것.

이러한 방식을 사용하면 **동적인 HTML페이지를 좀 더 쉽게 디자인할 수 있다**.

### 템플릿?

웹 맥락에서 템플릿은 하나의 양식화 된 페이지, 재사용할 수 있는 미리 만들어놓은 페이지(HTML)를 말한다. 크게 다를 것 없이 여기서도 템플릿 엔진의 코드가 삽입 된 HTML 문서를 템플릿 파일, 템플릿이라고 이해하면 될 듯.


## 템플릿 엔진

템플릿과 특정 데이터 모델에 따른 데이터를 합성하여 결과 문서를 출력하는 소프트웨어(또는 소프트웨어 컴포넌트)를 말한다.

템플릿 엔진을 사용하면 애플리케이션에서 템플릿 파일을 사용할 수 있다.

인기있는 템플릿 엔진으로는 EJS, Pug, Mustache, Handlebars와 같은 것들이 있으며 문법이 약간씩 다르다.

+ 클라이언트 사이드 템플릿 엔진 - Pug, Mustache...
+ 서버 사이드 템플릿 엔진 - EJS, Handlebars...

### [템플릿 엔진이란?] <br>

https://www.educative.io/answers/what-are-template-engines

### [서버 사이드, 클라이언트 사이드 템플릿 엔진] <br>

https://gmlwjd9405.github.io/2018/12/21/template-engine.html <br>

https://velog.io/@hi_potato/Template-Engine-Template-Engine <br>

https://usefultoknow.tistory.com/entry/%ED%85%9C%ED%94%8C%EB%A6%BF-%EC%97%94%EC%A7%84Template-Engine-%EC%9D%B4%EB%9E%80 

### [express와 호환되는 템플릿 엔진 목록] <br>

https://expressjs.com/en/resources/template-engines.html

# EXPRESS에서 EJS(Embedded javascript)로 템플릿 구성하기

EJS는 인기있는 express 템플릿 엔진 중 하나로 자바스크립트 구문을 사용하기 때문에 사용하기 쉽다.

우선 NPM으로 EJS를 설치해준다.
```
npm install ejs
```

express가 템플릿 파일을 렌더링하려면 `app.set()` 메서드로 다음과 같은 설정이 필요하다.

`views` - 템플릿이 있는 루트 디렉토리. 기본 값은 ./views이다.<br>
`view engine` - 사용할 템플릿 엔진.<br>

```
// 템플릿이 있는 디렉토리 설정. __dirname은 현재 파일이 있는 디렉토리 절대경로를 말한다. 상대경로를 사용할 경우 실행 위치에 따라서 지정한 경로가 다르게 설정될 수 있기 떄문에 다음과 같이 절대경로를 지정해준다.
app.set('views', __dirname + '/views');

// EJS 템플릿 엔진 모듈 로드
app.set('view engine', 'ejs' );

// render() 함수로 렌더링할 템플릿 설정
app.get('/', (req, res) => {
  res.render('home');
})
```

<!-- 템플릿과 view의 차이점은? 템플릿 파일 안에 반복 사용하기 위한 부분 즉, ejs의 경우 <%= %>같은 태그로 감싼 부분을 view라고 하는듯?? 흠 -->

- `app.set(title, value)` - 말 그대로 `title`에 값을 설정하는 것. `views`, `view engine` 말고도 여러가지 값들이 있다.

- `res.render(view , locals , callback)` <br>
  `res.render()`로 `view`를 렌더링하고 렌더링 된 HTML 문자열을 클라이언트에 보낸다.
  만약 `view engine`이 설정되어 있지 않으면 템플릿의 확장자를 명시해줘야 한다(ex) 'home.ejs').

- ` __dirname` - 현재 실행하는 파일의 절대경로를 말한다.

## EJS 태그

템플릿 안에서 html이 아니라는 것을 명시하기 위한 것.

- `<%= %>` - 템플릿에 값을 출력한다. <BR>
- `<% %>` - 태그 안에 자바스크립트를 임베드하되 템플릿에는 출력되진 않는다. 제어 흐름용.<BR>
- `<%- %>` - 이스케이프 처리되지 않은 값을 템플릿에 출력한다.<BR>
  
그 외에는 공식 사이트 참조.

# EXPRESS 앱에서 템플릿으로 정보 전달하기

다음은 난수를 생성하여 웹 페이지에 보여주는 템플릿 일부이다.

```
// random.ejs
<body>
  <h1> Random number! <%= rand %></h1>
</body>
--------------------------------------------
// index.js
app.get('/random', (req, res) => {
  const random = Math.floor(Math.random() * 10001);
  res.render('random', { rand: random });
});
```

코드의 `<%= %>` 태그 안에는 `rand`라는 변수 값이 들어가있다.

`res.render()`로 렌더링할 템플릿을 지정할 때, 2번째 인수로 { 변수명: 값 , ... } 형태의 객체를 통해 템플릿 안에서 사용할 변수를 전달할 수 있다.

<!-- ejs는 클라이언트 사이드 렌더링의 일환인가? -> 서버에서 요청에 따라 템플릿 렌더링하고 렌더링 된 html문서를 클라이언트에 응답 -> 서버 사이드 렌더링이다.-->

## EJS 조건문, 루프

`<% %>` 태그는 값을 직접 출력하진 않고 조건문이나 반복문처럼 제어 흐름을 설정하는 데 사용한다.

### 조건문

```
<body>
  <h1>Random number! <%= rand %></h1>
  <% if (rand % 2 === 0 ) { %>
  <h2><%= rand %> is even number</h2>
  <% } else { %>
  <h2><%= rand %> is odd number</h2>
  <% } %>
</body>
```

여러 줄의 경우 가독성이 좋진 않은 듯. `<%= %>` 태그로 아래와 같이 표현할 수도 있다.

```
<body>
  <h1>Random number! <%= rand %></h1>
  <h2>That number is <%= rand % 2 === 0 ? 'even' : 'odd' %></h2>
</body>
```

### 반복문

반복문을 사용해 배열의 요소를 `li`로 표현하는 예시이다.
데이터 출력 부분은 `<%= %>` 사용하였다.

```
<body>
  <h1>All the Cats</h1>
  <ul>
    <% for(let cat of cats) { %>
      <li> <%= cat %> </li>
    <% } %>
  </ul>
</body>
```
<!--  부트스트랩과 express 연동 -> Express-Project폴더 파일들 참조..-->

# include로 파일 분할(partials)

분할된 파일(partials)은 `include`로 다른 템플릿에 포함시켜 사용할 수 있다.

공통된 부분을 별개의 템플릿으로 구성하고 필요에 따라 다른 템플릿에 `<%- inlcude('path') %>`로 추가하여 재사용성을 높인다.

```
// partials/head.ejs
<link rel="stylesheet" href="/bootstrap.min.css" />
<link rel="stylesheet" href="/style.css" />
<script src="/bootstrap.min.js"></script>
<title>HomePage</title>

// example.ejs
<head>
<%- include('partials/head');  %>
</head>
<body>
  .
  .
  .
</body>
```

`include`를 사용하면 공통 부분을 분리하여 필요한 위치에 포함만 시켜주면 되므로 매번 복사해줄 필요도 없어진다. 또한 코드를 분리하여 복잡도를 줄이고 유지보수도 용이해져 유용하다.

`<%- %>` 태그는 공식 홈페이지 문서에 따르면 '이스케이프 처리되지 않은 값을 템플릿에 출력합니다'라고 되어있다.

콘텐츠를 문자열로 취급할 때 이스케이프 된다고 표현한다. 

값을 출력하기 위한 `<%= %>` 태그의 경우 HTML을 이스케이프 처리하여 문자열로 취급해 문자 그대로 출력되는데, `<%- %>` 태그는 HTML을 이스케이프 처리하지 않고 HTML로 취급하여 출력한다.

### ex)

```
/// partials/footer.ejs
<footer class="footer">
  <h1>this is footer</h1>
</footer>
---------------------------------
<%- include('partials/footer'); %>
>> this is footer

<%= include('partials/footer'); %>
>> <footer class="footer"> <h1>this is footer</h1> </footer>
```

따라서 `inlcude()`로 템플릿을 포함시킬 때는 `<%- %>` 태그를 사용해줘야 한다.


### [EJS 공식 사이트]

https://ejs.co/#install


## ejs-mate
### [npm ejs-mate]
https://www.npmjs.com/package/ejs-mate