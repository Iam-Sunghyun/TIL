# 목차
- [Express Router?](#express-router)
  - [Router 객체 생성](#router-객체-생성)
- [쿠키(cookie)](#쿠키cookie)
    - [MDN에서 말하는 쿠키!](#mdn에서-말하는-쿠키)
  - [Reference](#reference)
  - [Express로 쿠키 보내기](#express로-쿠키-보내기)
  - [Express 요청 쿠키 파싱하기](#express-요청-쿠키-파싱하기)
    - [cookieParser(secret, options)](#cookieparsersecret-options)
- [서명된 쿠키(signed cookies)](#서명된-쿠키signed-cookies)
- [HMAC](#hmac)

# Express Router?

Express Router 객체를 통해 라우터를 분리하고 그룹화하여 앱 구조를 단순화하고 관리(및 확장)하기 쉽게 만들 수 있다(Express의 장점). 보통 별도의 파일에 관련된 라우터들을 정의하여 모듈로 사용하며 큰 규모의 앱이라면 흔히 사용한다.

## Router 객체 생성

`router` 객체는 미들웨어와 라우팅을 수행하는 '미니 앱'이라고도 불리는데 미들웨어처럼 `app.use()`의 인수로 전달하여 앱에 적용시키거나, 다른 라우터의 `use()` 메서드의 인수로 결합하여 사용할 수 있다.

`Router`객체는 `express.Router()` Express 내장 메서드로 생성할 수 있다.

다음은 Router를 모듈로 작성하고 로드하여 라우터에 결합하는 사용 예시이다.

```
// ./routes/shelters.js
const express = require('express');
const router = express.Router() // 라우터 객체 생성

router.use(middleware); // 미들웨어 호출

// 라우터 정의
router.get('/', (req, res) => {
  res.render('home');
});

router.get('/new', (req, res) => {
  res.render('new')
});
  .
  .
module.exports = router;
-----------------------------------
// index.js
const shelterRoutes = require('./routes/shelters');

app.use('/shelters', shelterRoutes);
```

미들웨어를 적용시키듯이 `app.use()`의 두 번째 인수로 전달하여 적용시켜 주었고, 첫 번째 인수로 라우트의 접두사를 지정해주었다. 따라서 위 코드는 `/shelters`로 시작하는 URL의 요청에 응답하며 위 예시의 경우 라우터 모듈의 라우트가 `'/shelters'`, `'/shelters/new'` 가 되는 것.

또한 예시처럼 라우터 모듈안에 미들웨어를 호출하여 특정 라우트에 대해서만 미들웨어를 적용시킬 수 있다.

**[Express Router]**

https://expressjs.com/en/4x/api.html#router <br>
https://expressjs.com/en/guide/routing.html

**[Router 객체 쓰임새 예시]**

https://itecnote.com/tecnote/node-js-difference-between-app-use-and-router-use-in-express/

# 쿠키(cookie)

<!-- 일단 여기 정리하고, 나중에 http 파일로 따로 빼던지 하자. -->

HTTP는 웹에서 서버 애플리케이션과 클라이언트 애플리케이션이 HTML문서와 같은 리소스들을 주고받을 때 사용되는 애플리케이션 계층 프로토콜이다.

HTTP는 클라이언트에 대한 상태 정보를 유지하지 않는 **무상태(stateless, 비상태) 프로토콜**이다. 즉 특정 클라이언트가 몇 초 동안 같은 요청을 2번 했을 경우, 첫 번째 요청에 이미 응답한 적이 있더라도 서버는 이전에 한 요청에 대한 정보를 저장하지 않으므로 두 번째 요청에 대해 또 같은 응답을 보낸다.

정리하면 무상태 프로토콜은 **각각의 요청을 독립적인 작업으로 보며(같은 브라우저의 요청인지 알지 못함), 통신할 때 상태정보, 세션 등을 요구하지 않는 통신 프로토콜** 이다. 이러한 특징은 서버 설계를 간편하게하고, 동시에 수천개의 TCP 연결을 다룰수 있는 웹 서버를 만들수 있게 하였다.

그러나 사용자에 따라 맞는 콘텐츠를 제공하는 경우(로그인 지속, 장바구니, 웹사이트 테마 등) 사용자를 식별하기 위해 상태를 유지하는 것이 웹사이트 사용에 있어서 유용할 때가 있다. 이럴 때 무상태 프로토콜인 HTTP는 **쿠키(cookie)** 라고하는 텍스트 파일을 통해 사용자를 식별할수 있게 해준다.

**쿠키는 'name=zerocho'와 같이 키=값 쌍의 요소들로 이루어진 작은 텍스트 파일이다.** 보통 클라이언트(웹 브라우저)에 저장되며 웹 사이트에 처음 접속할 시 서버에 의해 생성되고, HTTP 응답 메시지 `Set-cookie` 헤더에 포함되어 전송된다. 그 후에 쿠키는 같은 웹 사이트(서버)에 접속할 시 요청 메시지의 `Cookie` 헤더에 포함되어 전송된다.

### MDN에서 말하는 쿠키!

```
과거엔 클라이언트 측에 정보를 저장할 때 쿠키를 주로 사용하곤 했습니다. 쿠키를 사용하는 게 데이터를 클라이언트 측에 저장할 수 있는 유일한 방법이었을 때는 이 방법이 타당했지만, 지금은 modern storage APIs를 사용해 정보를 저장하는 걸 권장합니다. 모든 요청마다 쿠키가 함께 전송되기 때문에, (특히 mobile data connections에서) 성능이 떨어지는 원인이 될 수 있습니다. 정보를 클라이언트 측에 저장하려면 Modern APIs의 종류인 웹 스토리지 API (localStorage와 sessionStorage) 와 IndexedDB를 사용하면 됩니다.
```

## Reference

**[MDN HTTP 개요]** https://developer.mozilla.org/ko/docs/Web/HTTP/Overview

**[MDN HTTP 쿠키]** https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies

**[쿠키 장단점]**

https://www.webcodeexpert.com/2013/03/what-is-cookie-advantages-and.html

**[쿠키 보안 취약점]**

https://velog.io/@seaworld0125/WEB-%EC%BF%A0%ED%82%A4%EC%9D%98-%EB%B3%B4%EC%95%88-%EC%B7%A8%EC%95%BD%EC%A0%90%EA%B3%BC-%EB%8C%80%EC%9D%91%EB%B0%A9%EB%B2%95

https://www.appsecmonkey.com/blog/cookie-security

https://quadrantsec.com/security-issues-cookies/

https://appcheck-ng.com/cookie-security


# Express로 쿠키 보내기

Express에선 `res.cookie(name, value [, options])` 메서드를 사용해 간편하게 응답 헤더에 쿠키를 설정할 수 있다. 또한 `[options]` 값으로 쿠키에 여러 옵션을 지정할 수도 있다.

다음은 Express로 쿠키를 설정하는 예시이다.

```
res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })

res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
```

<!-- http 무상태 프로토콜, 상태 프로토콜
https://byjus.com/gate/difference-between-stateless-and-stateful-protocol/
 -->

## Express 요청 쿠키 파싱하기

`cookie-parser` 미들웨어를 통해 문자열로 전송되는 요청 헤더의 쿠키를 파싱하여 `req.cookies`에 쿠키 이름과 값을 프로퍼티로 갖는 자바스크립트 객체를 채워넣을 수 있다. 또 부가적으로 `cookieParser(secret, options)`에 `secret` 문자열 값을 전달해 서명된 쿠키를 만들수도 있다.

<!-- `secret` 문자열은 `req.secret`에 할당된다?  -->

`cookie-parser`은 npm 모듈로 터미널에서 쉽게 다운받을 수 있다.
```
npm install cookie-parser
```
### cookieParser(secret, options)

다음은 `cookie-parser` 사용 예시이다.
```
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// 응답 헤더에 쿠키 설정
app.get('/cookie', (req, res) => {
  res.cookie('name', 'example!', {expires: new Date(Date.now() + 9000)})
  res.send('cookie!');
})
------------------------------------
// cookie-parser 적용 전
app.get('/cookie1', (req, res) => ()
  console.log(req.cookies)
})


>> undefined
-------------------------------------
// cookie-parser 적용 후
app.use(cookieParser());

app.get('/cookie1', (req, res) => ()
  console.log(req.cookies)
})


>> { name: 'example!' }
```

**[NPM cookie-parser]**

https://www.npmjs.com/package/cookie-parser

# 서명된 쿠키(signed cookies)

Express에서 `cookie-parser`를 사용해 서명된 쿠키를 전송할 수 있다.

서명된 쿠키란 쿠키가 변조 되지 않았음을 확인하기 위한 방법으로 편지를 밀랍으로 봉인하듯 `cookieParser(secret, options)`의 첫 번째 인수로 지정한 `secret`값을 쿠키의 서명으로 사용한다.

암호화와는 다르며 클라이언트(브라우저)가 보낸 쿠키 원본 데이터와 서버가 받은 데이터가 일치하는지(중간에 누군가 변경시키지 않았는지) 확인하는 용도로 사용된다.
<!-- 
서명된 쿠키를 사용하면 `XSS(cross-site sciprting)` -->
```
// 서명된 쿠키 예시를 위한 간단한 문자열
app.use(cookieParser('secretCookie!!'))

app.get('/cookie', (req, res) => {
  res.cookie('name', 'example!', {signed: true})
  res.send('cookie!');
})
```

서명된 쿠키는 `req.cookies`가 아닌 `req.singedCookies` 프로퍼티에 서명되지 않은 형태로 할당된다. 
```
app.use(cookieParser('secretCookie!!'))

app.get('/cookie', (req, res) => {
  res.cookie('name', 'example!', {signed: true})
  res.cookie('fruit', 'orange!')
  console.log(req.cookies);
  res.send('cookie!');
})

>> { fruit: 'orange!' }

app.get('/cookie', (req, res) => {
  res.cookie('name', 'example!', {signed: true})
  res.cookie('fruit', 'orange!')
  console.log(req.signedCookies)
  res.send('cookie!');
})

>> [Object: null prototype] { name: 'example!' }
```

개발자 도구에서 쿠키를 추가하거나, 값을 변경할 수 있는데 서명된 쿠키의 값을 변경할 경우 값이 `false`로 설정되거나 인코딩 된 부분을 다 지워버리면 서명된 쿠키로 취급되지 않아 아예 `req.cookies`에 할당된다.

<!-- 서명된 쿠키 값은 다른 객체에 있다?-->

<!-- 
# HMAC -->
