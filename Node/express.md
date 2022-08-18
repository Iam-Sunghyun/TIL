# Express 프레임워크

### Express란?

Express.js, 또는 간단히 익스프레스는 Node.js를 위한 웹 프레임워크의 하나로, MIT 허가서로 라이선스되는 자유-오픈 소스 소프트웨어로 출시되었다. Node.js로 웹 애플리케이션, API 개발을 위해 설계되었다. Node.js의 사실상의 표준 서버 프레임워크로 불리고 있다. - 위키백과

간단히 node.js 서버 개발을 위한 다양한 기능을 제공하는 프레임워크이다.

<!-- Express 사용 이유? -->

### [Expressjs 공식 홈페이지]
http://expressjs.com/

### [Express.js vs Node.js]
https://procoders.tech/blog/express-js-vs-node-js/


## Express 장점

https://jsqna.com/ejs-1-why-express/


# 미들웨어 함수(middelware function)

미들웨어 함수란 요청-응답 사이클 안에서 요청(req)/응답(res) 객체와, next() 메서드를 인수로 갖는 함수를 말한다. 쉽게 말해 요청/응답 중간에서 처리되는 함수로, 요청에 대한 핸들러 함수라고 보면 된다. 

미들웨어 함수는 요청 객체(req), 응답 객체(res), 다음 미들웨어 함수 호출을 위한 next() 함수를 인수로 전달 받는다.

참고로 **미들웨어의 실행 순서는 먼저 로드된 미들웨어 함수가 먼저 실행된다.**

아래 예시에서 2번째 부터 전달되는 콜백함수가 미들웨어 함수이다.

```
const express = require('express')
const app = express()

// 요청 시간 기록 미들웨어 함수
const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next() // 현재 미들웨어 함수가 요청-응답 주기를 종료하지 않으면 next()다음 미들웨어 함수에 제어를 전달하기 위해 호출해야 한다. 그렇지 않으면 요청이 중단된다. (흠..)
}

app.use(requestTime) // 모든 요청에 대해 미들웨어 함수 실행

// 루트 경로에 대한 GET 요청 라우팅
app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

// 포트 3000에 연결 및 요청 수신 대기
app.listen(3000)
```
미들웨어 함수의 next()를 사용하면 후속 핸들러 함수로 제어를 전달할 수 있다.

```
app.all('/', (req, res, next) => {
  console.log('[All]');
  next(); // 후속 핸들러에게 컨트롤을 패스한다.
});

app.get('/', (req, res, next) => {
  console.log('[GET 1] next 함수에 의해 후속 핸들러에게 response가 전달된다.');
  next();
}, (req, res, next) => {
  console.log('[GET 2] next 함수에 의해 후속 핸들러에게 response가 전달된다.');
  next();
}, (req, res) => res.send('Hello from GET /'));

app.post('/', (req, res, next) => {
  console.log('[POST 1] next 함수에 의해 후속 핸들러에게 response가 전달된다.');
  next();
}, (req, res, next) => {
  console.log('[POST 2] next 함수에 의해 후속 핸들러에게 response가 전달된다.');
  next();
}, (req, res) => res.send('Hello from POST /'));
```
## 요청(response), 응답(request) 객체

미들웨어 함수의 인수로 전달되는 요청, 응답 정보를 저장하는 객체로 일반적으로 res, req로 명명하여 사용한다.

`req` - 요청 객체. http 요청 텍스트를 파싱해 자바스크립트 객체로 변환 후 전달된다.<br>

`res` - 요청 대상에게 응답하기 위한 응답 객체.<br>


### [middleware란?]

https://psyhm.tistory.com/8


# 헷갈렸던 Express 메서드
## app.use(path, callback...),  app.all(path, callback...)
`app.use(path, callback...)`는 요청 메서드 상관없이 경로에 대한 모든 요청에 미들웨어 함수를 실행한다.

`path`기본값은 `"/"`이며 경로 없이 마운트된 미들웨어는 앱에 대한 모든 요청에 ​​대해 실행된다.

비슷하게 `app.all(path, callback...)` 또한 모든 요청 메서드에 대해 미들웨어 함수를 실행하는데, `app.use()`와 경로 설정에서 차이가 있다.

아래의 예시에서 설정한 `app.use('/abcd', ...)` 경로는 `app.all('/abcd/*', ...)`과 일치한다.

즉, `app.use('/abcd', ...)`에서 경로는 `"/abcd"`, `"/abcd/images"`, `"/abcd/images/news/.."` 등등과 같이 하위의 경로를 모두 포함한다. 

따라서 세세하게 URI을 식별하여 적용하기 위해선 `app.all()`을 사용해야 한다.

```
// /abcd 하위 경로 요청 모두 포함
app.use('/abcd', function (req, res, next) {
  console.log('Time: %d', Date.now())
});

// /abcd 에 대한 요청만 실행
app.all('/abcd', function (req, res, next) {
  console.log('Time: %d', Date.now())
});

// 포트 3000에 연결 및 요청 수신 대기
app.listen('3000', () => {
  // 대기 중 서버 콘솔 메시지
  console.log(`Exapmle app listening on port ${port}`);
});
```
보통 `app.use()`는 주로 앱에 미들웨어를 적용하기 위해 사용하고(요청/응답 처리를 위한게 아닌) `app.all()`은 라우팅 용도로 응답을 위해 주로 사용된다고 함.

아래 링크 참조!

### [app.use(), app.all() 차이]
https://stackoverflow.com/questions/14125997/difference-between-app-all-and-app-use

# 라우팅(routing)

라우팅은 애플리케이션(서버)의 엔드 포인트(URI)를 정의하고 해당 URI로 클라이언트 요청이 왔을 때 응답하는 방식을 설정하는 것을 말한다.

### ex)

```
// /dogs 경로에 get 요청에 대한 응답 라우트
app.get('/dogs', (req, res) => {
  res.send(`<h1>Here is Response to get /dogs</h1>`);
});

// /dogs 경로에 post 요청에 대한 응답 라우트
app.post('/dogs', (req, res) => {
  res.send(`<h1>Here is Response to post /dogs</h1>`);
});

// 모든 경로에 get 요청에 대한 응답. 주의할 것은 코드 맨 앞에 위치할 경우 다른 get 요청 라우트는 무시된다.
app.get('*', (req, res) => {
  res.send(`<h1>Here is Response</h1>`);
});
```

# 경로 매개변수(path parameter)

경로 패턴을 설정하고, 콜론(:)뒤에 문자열이 변수가 되어 요청 uri에서 매치되는 부분의 문자열을 저장하는 매개변수.

요청 uri을 식별할 때 사용되며 `req.params` 프로퍼티에 저장된다.

```
// localhost:3000/dogs/cocker 요청 시

// param1에는 cocker가 저장된다.
app.get('/dogs/:param1', (req, res) => {
  const { param1 } = req.params;
  res.send(`<h1>Here is Response to get ${param1}</h1>`);
});
```

# 쿼리 스트링(query string)

쿼리 스트링은 요청 uri에서 ? 구분자 뒤에 오는 문자열들로,
클라이언트가 서버에 요청 데이터를 전달하는 방법 중 하나이다.

HTML 폼 값이나 링크에 따라 전달되는 내용이 다를 수 있다.

주로 데이터 필터링할 때 사용되며 `req.query` 프로퍼티에 저장된다.

```
// localhost:3000/search?q=10 요청 시

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) res.send('invalid query');
  res.send(`Search for: ${q}`);
});
----------------
Search for: 10
----------------

// localhost:3000/search?ekw=100 요청 시
----------------
invalid query
----------------
```

### [MDN express] <br>

https://developer.mozilla.org/ko/docs/Learn/Server-side/Express_Nodejs

### [poiemaweb Express-basics] <br>

https://poiemaweb.com/express-basics

