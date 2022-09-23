# 목차
- [세션(session)이란?](#세션session이란)
- [Express 세션 구현하기](#express-세션-구현하기)
  - [express-session 세션 미들웨어 생성하기](#express-session-세션-미들웨어-생성하기)
    - [express-session options 종류와 예시](#express-session-options-종류와-예시)
  - [`req.session`으로 세션 데이터 접근하기](#reqsession으로-세션-데이터-접근하기)
- [플래시 메시지](#플래시-메시지)
  
  
# 세션(session)이란?

사용자가 애플리케이션에 접속해있는 상태, 기간(클라이언트가 웹 사이트에 접속하여 종료하기 전까지 상태) 혹은 무상태 프로토콜인 HTTP에서 사용자를 식별하기 위해 사용자의 정보를 서버측에 저장하는 방법을 말한다(DB에 데이터를 저장하는 것과 다르다).

쿠키의 경우 보통 4KB의 용량 제한과 20개의 개수 제한이 있어서 사용자 정보가 매우 많을 경우 모두 담아내지 못할 수 있다. 또한 클라이언트측에 저장되어 누구나 쉽게 열어보고 조작할 수 있고, 중요한 정보를 쿠키에 직접 담을 경우 요청 전송 중 가로채질 수 있는 등 보안적인 부분에서 서버측에 저장하는 것보다 안전하지 않다.

따라서 사용자 정보를 저장하고 식별하기 위해 쿠키와 세션이 함께 사용되는데 보통 쿠키에 세션 키를 저장해 세션 정보 확인용으로 사용한다.

# Express 세션 구현하기

npm의 `express-session` 모듈로 Express에서 세션을 구현할 수 있다.
```
npm i express-session
```

이 모듈을 사용하기 위해선 `cookie-parser` 모듈이 필요했으나 1.5.0 이후 버전부터는 `cookie-parser` 모듈 없이도 쿠키를 자동으로 읽거나 작성하여 Express의 `req`/`res` 객체에 할당한다. 

만약 `cookie-parser`를 사용할 경우 쿠키 서명을 위해 사용한 `secret` 값을 `express-session`의 `secret`과 일치시켜야 서명된 쿠키 사용시 문제가 발생하지 않는다.

## express-session 세션 미들웨어 생성하기

`session(options)`으로 인수로 전달한 옵션을 적용한 세션 미들웨어를 생성한다. 세션 데이터는 서버에만 적용되고 쿠키는 세션을 식별하기 위한 ID가 담겨 클라이언트(브라우저)측에 저장된다.

`express-session` 미들웨어를 생성할 때 여러가지 속성을 지정할 수 있는데 그 중에서도 쿠키 서명을 위한 `secret` 속성은 필수 속성이다.

예측하기 어려운 `secret` 값을 사용하여 쿠키의 세션 ID가 노출될 가능성을 줄일 수 있다.

### express-session options 종류와 예시

+ genid
+ name
+ proxy
+ resave
+ rolling
+ saveUninitialized
+ secret(필수 옵션)
+ store
+ unset
+ cookie - 세션 ID 쿠키의 속성 지정. 기본 값은`{ path: '/', httpOnly: true, secure: false, maxAge: null }`이다.

```
// 예시
const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true}
}))

app.get('/viewcount', (req, res) => {
  res.send('hey')
})

app.listen(3000, () => {
  console.log('server listening on 3000...')
});
```

위 예시처럼 `app.use()`로 세션 미들웨어를 적용시켜주기만 해도 요청이 왔을 경우 자동으로 쿠키를 전송한다. 개발자 도구로 확인해 볼 수 있는데, 전송된 쿠키는 `connect.sid=s%328qwheio..` 형식으로 되어있다.


## `req.session`으로 세션 데이터 접근하기

`express-session`의 세션 데이터는 `req.session` 프로퍼티로 접근하거나 추가할 수 있다.
<!-- To store or access session data, simply use the request property `req.session`, which is (generally) serialized as JSON by the store, so nested objects are typically fine. -->

다음 예시는 `views` 프로퍼티를 세션에 추가해 특정 사용자의 웹 사이트 페이지 조회 횟수를 저장하는 예시이다.

```
// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// req.session로 세션 데이터에 접근
app.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})
```

세션 데이터는 메모리(서버 기본 세션 저장소: MemoryStore)에 저장된다(따라서 앱을 껏다 키면 데이터 사라짐).
<!-- 
The default server-side session storage, Memo ryStore, is purposely not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing. -->

이외에 Redis, mongo 등 호환되는 여러가지 세션 저장소가 있다(DB와 달리 지속되지 않아 서버를 종료하면 사라짐).


**[npm express-session 설명서]**

https://www.npmjs.com/package/express-session

# 플래시 메시지

플래시는 단일 요청에 대한 데이터를 저장하는데 사용되는 세션의 특수 영역이며 플래시 메시지는 사용자의 사이트 이용을 방해하지 않으면서 피드백(완료 메시지 등)을 보내는 방법이다. 

완료 메시지나 확인 메시지 같은 알림용 메시지에 사용되는데 사용자 세션에 저장되고 가장 먼저 렌더링된 페이지에 표시된 다음 폐기된다. -> 특정 동작을 수행하고 다른 페이지로 리다이렉트되기 전에 세션에 메시지를 추가하여 리다이렉트된 페이지에 출력후 세션에서 제거된다(새로고침시 페이지에서 사라짐).

<!-- 플래시 메시지는 세션을 이용하여 간단하게 구현할 수 있다. -->
<!-- 다양한 용도로 사용됨. -->

<!-- connect-flash를 사용하여 구현.
```
``` -->

## res.locals와 플래시

**[세션과 플래시]**

https://memphis-cs.github.io/rails-tutorial-2019/deets-sessions/