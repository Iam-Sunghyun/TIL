# Express

### express란?

Express.js, 또는 간단히 익스프레스는 Node.js를 위한 웹 프레임워크의 하나로, MIT 허가서로 라이선스되는 자유-오픈 소스 소프트웨어로 출시되었다. Node.js로 웹 애플리케이션, API 개발을 위해 설계되었다. Node.js의 사실상의 표준 서버 프레임워크로 불리고 있다. - 위키백과

### [Expressjs.com]
http://expressjs.com/

# 미들웨어 함수(middel ware function)

미들웨어 함수란 쉽게말해 요청에 대한 응답을 위해 중간에서 처리를 수행하는 함수로, 요청에 대한 핸들러 함수라고 보면 된다.

아래 예시에서 2번째 인수로 전달되는 콜백함수가 미들웨어 함수이다.
```
// '/' 경로로 get 요청이 발생했을 때 미들웨어 함수가 실행된다.
app.get('/', (req, res, next) => {...});

// port에 연결 및 요청 수신 대기(서버 실행)
app.listen(port, () => {
  // 대기 중 서버 콘솔 메시지
  console.log(`Exapmle app listening on port ${port}`);
});
```
### [middleware란?]
https://psyhm.tistory.com/8


## 요청(response), 응답(request) 객체

미들웨어 함수의 인수로 전달되는 요청, 응답 정보를 저장하는 객체로 일반적으로 res, req로 명명하여 사용한다.

`req` - 요청 객체. http 요청 텍스트를 파싱해 자바스크립트 객체로 변환 후 전달된다.<br>

`res` - 요청 대상에게 응답하기 위한 응답 객체.<br>


# 라우팅(routing)

라우팅은 클라이언트의 요청에 대해 애플리케이션이 응답하는 방법을 결정하는 것을 말한다. 즉 요청에 따른 처리 방법을 설정하는 것이라 보면 될 듯.

### ex)
```
app.get('/dogs', (req, res) => {
  res.send(`<h1>Here is Response to get /dogs</h1>`);
});

app.post('/dogs', (req, res) => {
  res.send(`<h1>Here is Response to post /dogs</h1>`);
});

// 모든 get 요청에 대한 응답. 주의할 것은 코드 맨 앞에 위치할 경우 다른 get 요청 라우팅은 무시된다.
app.get('*', (req, res) => {
  res.send(`<h1>Here is Response</h1>`);
});
```

## 경로 매개변수(path parameter)

요청 url에 경로 패턴을 설정하고, 콜론(:)뒤 값이 변수가 되어 패턴상 매치되는 문자열을 저장하는 매개변수를 말한다.

요청 uri를 식별할 때 사용되며 `req.params` 프로퍼티에 저장된다.

```
localhost:3000/dogs/cocker 요청 시

// param1에는 cocker가 저장된다.
app.get('/dogs/:param1', (req, res) => {
  const { param1 } = req.params;
  res.send(`<h1>Here is Response to get ${param1}</h1>`);
});
```

## 쿼리 스트링(query string)

쿼리 스트링은 요청 url에서 ? 구분자 뒤에 오는 문자열들로, 
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


### 유용한 도구 nodemon

서버를 재시작하지 않아도 변경사항을 감지하여 자동으로 재시작 해주는 프로그램.

### [nodemon] <br>
https://www.npmjs.com/package/nodemon