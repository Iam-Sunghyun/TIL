# Express 에러 처리

Express에서 에러 처리란 동기, 비동기로 동작하는 코드에서 발생하는 에러를 처리하는 것을 말한다.

Express 기본 에러 핸들러가 내장되어 있고 필요에 따라 사용자 정의 에러 핸들러를 작성할 수도 있다.

# 에러 캐치하기

## 동기적 코드

라우트 핸들러나 미들웨어 안에서 동기적으로 작동되는 코드에서 발생한 에러는 따로 조취를 취하지 않아도 Express가 알아서 catch하고 처리한다(잘못된 코드 문법으로 인한 에러, 직접 Throw한 에러 혹은 `'route'`가 아닌 인수로 `next()` 호출).
```
// 에러 Throw한 경우
app.get('/error', (req, res) => {
  throw new Error('throwed error')
});

>> Error: throwed error
    // 스택 추적(stack trace)
    at C:\Users\Administrator\Desktop\morgan\index.js:37:9
    at Layer.handle [as handle_request] (C:\Users\Administrator\Desktop\morgan\node_modules\express\lib\router\layer.js:95:5)
      .
      .
      .

// 선언되지 않은 객체 참조
app.get('/error', (req, res) => {
  chicken.fly();
});

>> ReferenceError: chicken is not defined
    at C:\Users\Administrator\Desktop\morgan\index.js:37:3
    at Layer.handle [as handle_request] 
      .
      .
      .
```
## 비동기적 코드

라우트 핸들러, 미들웨어 안에서 비동기적으로 동작하는 함수에서 발생하는 에러는 반드시 해당 에러 객체를 `next()`메서드 인수로 전달하여 호출해줘야 한다.

```
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      next(err) // Express에게 에러 객체 전달
    } else {
      res.send(data)
    }
  })
})
```
### +
만약 `next()` 메서드를 `'route'`를 제외한 어떤 값이든 인수로 전달하여 호출한다면 Express는 해당 요청을 에러로 간주하고 남은 에러 처리 미들웨어가 아닌 모든 라우터, 미들웨어를 건너뛴다.

```
app.get('/error', (req, res, next) => {
  next('에러!')               // next()에 'route'가 아닌 값을 전달하여 호출한 경우 에러로 간주
}, (req, res, next) => {      // 에러 처리가 아닌 미들웨어는 skip된다.
  res.send('2번째 미들웨어')
});

app.use((err, req, res, next) => {  // 다음 에러 처리 미들웨어에 에러 내용이 전달된다.
  res.send(err + '입니다.')
});

클라이언트 출력 >> 에러!입니다.
```



<!-- ## async/await -->

### [Error Handling in Express]
https://www.geeksforgeeks.org/error-handling-in-express/?ref=lbp

### [Express 공식 문서 Error Handling]
http://expressjs.com/en/guide/error-handling.html

# Express 내장 에러 핸들러

<!-- 에러 처리 내용 전반적으로 헷갈림 -->
Express는 앱에서 발생하는 에러를 처리하는 내장 에러 핸들러를 기본적으로 제공한다. 따라서 사용자가 따로 에러 처리를 정의하지 않아도 기본 에러 핸들러가 라우트 핸들러나 다른 미들웨어에서 발생한 모든 오류를 처리한다(기본적으로 상태 코드 500으로 클라이언트에 응답).

`next()` 함수에 에러를 전달한 후 따로 사용자 정의 에러 핸들러로 처리하지 않았다면 자동으로 내장 에러 핸들러로 처리되며 스택 추적 내용과 함께 클라이언트측에 에러가 전달된다. 프로덕션 환경(배포 환경)에서는 스택 추적이 포함되지 않는다.

```
스택 추적(stack trace) - 예외가 발생한 시점의 메서드 호출 목록(호출 스택)을 보여주는 것.
프로덕션 환경(production environment) - 완성된 소프트웨어가 배포되고 실행되는 컴퓨터 환경. 배포 환경이라고도 한다.
```

에러가 기록되면 응답에 다음과 같은 정보들이 추가된다.

+ `err.status`(에러 객체)로부터 `res.statusCode` 값이 저장된다. 상태 코드 값이 4xx나 5xx 범위를 벗어나면 500으로 저장된다.
+ 상태 코드에 따라 `res.statusMessage` 값이 저장된다.
+ 프로덕션 환경에 있을 때 응답 body는 HTML 형태의 상태 코드 메시지이며 프로덕션 환경이 아닌 경우는 `err.stack`이다.
+ 모든 헤더는 `err.hearders` 객체로 지정된다.

기본 에러 미들웨어는 미들웨어 함수 스택의 맨 마지막에 추가된다.


# 사용자 정의 에러 핸들러

Express에서 사용자가 직접 에러 처리 미들웨어 함수를 정의할 수 있다. 

에러 처리 미들웨어를 정의한 경우 앱에서 발생하는 에러는 내장 에러 처리 핸들러가 아닌 정의한 에러 처리 미들웨어가 캐치한다.

사용자 정의 에러 핸들러는 다른 미들웨어와 동일한 형식에 **`err`를 포함한 4개의 인수**를 전달 받는다.

```
// 4개의 인수를 받아야 에러 처리 미들웨어로 인식된다.
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

**에러 핸들러 미들웨어는 다음과 같이 다른 모든 라우터나 `app.use()` 호출 이후에 정의 한다.**

```
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
 .
 .
 .
app.use((err, req, res, next) => {
  // logic
})
```

사용자 정의 에러 핸들러에서 `next(err)`로 다음 에러 핸들러에 에러를 전달하지 않은 경우 에러에 대한 응답을 해줘야 한다. 그렇지 않으면 다른 미들웨어와 마찬가지로 요청이 중단되고 가비지 컬렉션의 대상이 되지 않으며 내장 에러 처리 미들웨어로도 처리되지 않는다.

사용자 에러 핸들러 실행 후에 내장 에러 핸들러로 처리하고 싶으면 `next(err)`를 호출해 계속해서 에러를 전달해주면 된다.

# 사용자 정의 에러 클래스

Express에서 자주 쓰이는 에러를 처리하는 패턴. DB와 상호작용, 사용자 인증 등과 같이 다양한 에러 상황에 응답하기 위해 하나의 사용자 정의 에러 클래스를 만들어 사용한다.


# 몽구스 Errors

# 비동기 에러 처리하기