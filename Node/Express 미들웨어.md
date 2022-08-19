# Express 미들웨어(middelware)의 개념

미들웨어 함수란 요청-응답 사이클 안에서 요청(req)/응답(res) 객체와, next() 메서드를 인수로 갖는 함수를 말한다. 

쉽게 말해 요청/응답 중간에서 처리되는 함수로, 요청에 대한 핸들러 함수라고 보면 된다. 

### 예시
```
const express = require('express')
const app = express()

// 모든 요청에 대해 미들웨어 함수 실행
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// GET /user/:id 요청에 대한 라우팅
app.get('/user/:id', (req, res, next) => {
  res.send('Request Type:', req.method)
})
```

## 미들웨어 함수의 기능

+ 요청/응답 사이클 내에서 원하는 코드 실행
+ 요청/응답 객체(req, res) 변경(데코레이트) 
  + ex) app.use(express.urlencoded(...))로 요청 body 파싱하기
  + ex) req.requestTime = Date.now()과 같이 요청 시간 값을 req 객체 프로퍼티로 추가 등등 
+ 요청에 대한 응답을 전송하여 요청/응답 사이클 종료
+ 다음 미들웨어 함수로 제어 전달(next())

현재 미들웨어 함수가 요청/응답 사이클을 종료하지 않으면, next() 메서드로 다음 미들웨어에 제어를 전달해줘야 한다. 그렇지 않으면 요청이 중단된다.

## 미들웨어 함수의 종류

Express 미들웨어 유형은 다음과 같다. 자세한 것은 공식 페이지 참고.

+ 애플리케이션 수준 미들웨어(Application-level middleware)
+ 라우터 수준 미들웨어(Router-level middleware)
+ 오류 처리 미들웨어(Error-handling middleware)
+ 내장 미들웨어(Built-in middleware)
+ 타사 미들웨어(Third-party middleware)

### [Express 공식 홈페이지 middleware]
http://expressjs.com/en/guide/writing-middleware.html

### [Middleware in Express.js]
https://www.geeksforgeeks.org/middleware-in-express-js/



# 써드파티(third-party) 미들웨어 

Express 앱에 여러 가지 외부 미들웨어 모듈을 통해 필요한 기능을 사용할 수 있다(`method-override`로 HTML 폼에서 POST 요청을 PATCH, DELETE, PUT과 같은 지원되지 않는 요청 메서드로 재정의 한 것처럼).

## Morgan 미들웨어

`Morgan` 미들웨어는 써드파티 미들웨어로 HTTP 요청 로그를 터미널에 출력해주어 디버깅 할 때 매우 유용하다(ex) 요청 후 원하는 응답을 못 받은 상황이나, 어떤 요청인지 확인하고자 하는 경우). 

`Morgan`은 Node.js 모듈로 npm 레지스트리에서 다운로드 받을 수 있다.
```
npm install morgan
```
### morgan(format, options)

morgan 함수에 로그 출력 형식과 옵션을 지정하여 사용할 수 있다.

다음은 기본 출력 형식으로 HTTP 요청 로그를 출력한 예이다. 로그는 응답이 완료되고 나서 출력된다.
```
const morgan = require('morgan');

// 사전 정의된 형식으로 HTTP 요청 로그 출력
app.use(morgan('tiny'));

app.get('/dogs', (req, res) => {
  res.send('woof woof');
});

>> GET /dogs 200 9 - 0.406 ms
>> GET /dogs 304 - - 0.371 ms
```

<!-- Morgan 사용법 내용 보충↓ -->
### [npm morgan]
https://www.npmjs.com/package/morgan

### [Express 써드파티 미들웨어 목록]
http://expressjs.com/en/resources/middleware.html


# 미들웨어 정의하기

## 미들웨어로 요청(`req`) 객체에 값 추가하기

아래 예시에서 2번째 부터 전달되는 콜백함수가 미들웨어 함수이다.

### 요청 시간 기록 미들웨어 함수

모든 요청의 시간을 `req`의 `requestTime` 프로퍼티에 저장하여 후속 미들웨어 함수에서 사용할 수 있게 한다. 
```
const express = require('express')
const app = express()

// 요청 시간 기록 미들웨어 함수
const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next() // 현재 미들웨어 함수가 요청-응답 주기를 종료하지 않으면 next() 메서드를 호출해 다음 미들웨어 함수에 제어를 전달해줘야 한다. 그렇지 않으면 요청이 중단된다.
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
이렇게 다음에 호출 될 라우트 핸들러 함수에서 사용하기 위해 요청 객체에 데이터를 추가하는 것을 데코레이팅이라고 한다.

## next()
미들웨어 함수의 `next()`를 사용하면 같은 경로, 요청 메서드의 후속 미들웨어 함수로 제어를 전달할 수 있다.

**미들웨어의 실행 순서는 먼저 로드된 미들웨어 함수부터 순서대로 실행된다.**

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

## next() 이하 코드 무시하기

`next()`를 호출하여 다음 미들웨어 함수를 호출하여도, 제어권이 넘어간 미들웨어를 실행하고 나서 `next()` 이후 코드가 마저 실행되게 된다(물론 `next()` 밑에 코드를 작성하는 것이 일반적이진 않다.).

```
// localhost:3000 요청
app.use((req, res, next) => {
  console.log('morgan 1!!!!');
  next();
  console.log('morgan 2!!!!!');
});

app.use((req, res, next) => {
  console.log('morgan 3!!!!');
  next();
  console.log('morgan 4!!!!!');
});

>> morgan 1!!!!
   morgan 3!!!!
   morgan 4!!!!!
   morgan 2!!!!!
   GET / 200 10 - 3.528 ms
```

따라서 `next()`이하 코드를 무시하려면 다음과 같이 `next()`를 return해주면 된다. 
```
app.use((req, res, next) => {
  console.log('morgan 1!!!!');
  return next();
  console.log('morgan 2!!!!!');
});

app.use((req, res, next) => {
  console.log('morgan 3!!!!');
  return next();
  console.log('morgan 4!!!!!');
});

>> morgan 1!!!!
   morgan 3!!!!
   GET / 304 - - 3.232 ms
```


## 에러 코드 404 라우팅

다음과 같이 라우터 맨 마지막에 `app.use()` 라우터를 작성해두면 유효하지 않는 경로에 대한 요청을 처리할 수 있다.

예시를 위한 간단한 코드이지만 템플릿을 사용해 좀 더 보기좋은 에러 페이지를 렌더링 할 수도 있다.

```
app.get('/', (req, res) => {
  res.send('home page!');
});

app.get('/dogs', (req, res) => {
  res.send('woof woof');
});

// 상태코드 404와 함께 클라이언트에 응답을 보낸다.
app.use((req, res) => {
  res.status(404).send('no resource');
});

```

## 미들웨어로 간단한 패스워드 설정

미들웨어로 간이 특정 경로에 대한 사용자 인증을 구현해본다. 

특정 경로에 대한 요청 시 쿼리 스트링으로 전달한 패스워드를 검사하는 미들웨어로 연습을 위해 단순하게 구성해보았다.

```
// 요청 시 쿼리 스트링으로 전송한 패스워드 값이 유효한 값 인지 검사한다.
const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'chickennugget') {
        next();
    }
    res.send("YOU NEED A PASSWORD!")
}

// /secret 경로로 GET 요청 시 첫 번째 미들웨어로 패스워드를 검사한다.
// 검사에 통과하면 후속 미들웨어 함수를 호출한다.
// ->  /secret?password=chickennugget
app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: Sometimes I wear headphones in public so I dont have to talk to anyone')
})
```

실제로는 비밀번호 같은 중요 정보는 절대 쿼리 스트링으로 전송하지 않으며 연습을 위해 검증 과정도 매우 단순하게 작성하였다.