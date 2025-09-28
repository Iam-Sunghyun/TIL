**목차**

- [Express Router?](#express-router)
  - [Router 객체 생성](#router-객체-생성)
  - [router.route() 메서드로 라우터 통합하기](#routerroute-메서드로-라우터-통합하기)
- [Express로 쿠키 보내기](#express로-쿠키-보내기)
- [cookie-parser로 요청 쿠키 파싱하기](#cookie-parser로-요청-쿠키-파싱하기)
- [서명된 쿠키(signed cookies)](#서명된-쿠키signed-cookies)

# Express Router?

Express `Router` 객체를 통해 라우터를 분리하고 그룹화하여 앱 구조를 단순화하고 관리(및 확장)하기 쉽게 만들 수 있다(Express의 장점). 보통 별도의 파일에 관련된(동일 요청 경로) 라우터들을 정의하여 미들웨어처럼 사용한다. -> 라우터를 분리하고 연결하는데 사용되는 객체.

## Router 객체 생성

`router` 객체는 미들웨어와 라우팅을 수행하는 '미니 앱'이라고도 불리는데 미들웨어처럼 `app.use()`의 인수로 전달하여 특정 경로에 대한 라우터로 사용하거나, 다른 `router`객체의 `use()` 메서드의 인수로 결합하여 사용할 수 있다.

`Router` 객체는 `express.Router()` Express 내장 메서드로 생성할 수 있다.

다음은 `Router`를 모듈로 작성하고 로드하여 라우터에 결합하는 사용 예시이다.

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

미들웨어를 적용시키듯이 `app.use()`의 두 번째 인수로 전달하여 적용시켜 주었고, 첫 번째 인수로 라우트의 접두사를 지정해주었다. 위의 코드는 `/shelters`로 시작하는 URL의 요청에 대한 라우터들을 `Router` 객체에 정의하여 분리, 모듈화한 것이다.

결국 위 예시의 경우 `shelters.js`의 `router` 모듈의 라우트가 `'/shelters'`, `'/shelters/new'` 가 되는 것.

또한 예시처럼 라우터 모듈안에 미들웨어를 호출하여 특정 라우트에 대해서만 미들웨어를 적용시킬 수 있다.

**[Express Router]**

https://expressjs.com/en/4x/api.html#router <br>
https://expressjs.com/en/guide/routing.html

**[Router 객체 쓰임새 예시]**

https://itecnote.com/tecnote/node-js-difference-between-app-use-and-router-use-in-express/

## router.route() 메서드로 라우터 통합하기

`express.router()` 객체를 통해 라우터를 관리하기 쉽게 분리하였다.

분리한 `router` 객체에서 `router.route()` 메서드를 사용하여 중복된 경로의 라우터들을 통합하여 가독성을 높이고 코드 관리를 용이하게 할 수 있다.

```
// 기존 코드, 라우트 핸들러는 controllers 폴더에 따로 분리해놓은 상태이다.
router.get('/', catchAsyncError(campground.index));

router.get('/new', isLoggedIn, campground.renderCampgroundNew);

router.post('/', isLoggedIn, validateCampground, catchAsyncError(campground.createNewCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsyncError(campground.deleteCampground));

router.get('/:id', catchAsyncError(campground.renderCampgroundDetail));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(campground.renderCampgroundEdit));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsyncError(campground.editCampground));
```

위 코드처럼 동일한 라우트의 라우터들이 여럿 있는 경우 가독성이 떨어질 수 있다. 따라서 다음과 같이 `router.route()` 메서드를 사용해 코드를 정리해주었다.

```
router.route('/')
  .get(catchAsyncError(campground.index)) // 캠핑장 페이지
  .post(isLoggedIn, validateCampground, catchAsyncError(campground.createNewCampground)); // 새 캠핑장 추가

// 새 캠핑장 추가 페이지
router.get('/new', isLoggedIn, campground.renderCampgroundNew);

router.route('/:id')
  .get(catchAsyncError(campground.renderCampgroundDetail)) // 특정 캠핑장 세부화면
  .put(isLoggedIn, isAuthor, validateCampground, catchAsyncError(campground.editCampground)) // 특정 캠핑장 내용 수정
  .delete(isLoggedIn, isAuthor, catchAsyncError(campground.deleteCampground)); // 캠핑장 삭제(mongoose 미들웨어로 달려있던 리뷰도 모두 삭제)

// 특정 캠핑장 내용 수정 페이지
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(campground.renderCampgroundEdit));
```

# Express로 쿠키 보내기

Express에선 `res.cookie(name, value [, options])` 메서드를 사용해 간편하게 응답 헤더에 쿠키를 설정할 수 있다. 또한 `[options]` 값으로 위에서 봤던 쿠키 속성을 포함한 여러 가지 옵션을 지정할 수도 있다.

다음은 Express로 쿠키를 설정하는 예시이다.

```
res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })

res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
```

<!-- http 무상태 프로토콜, 상태 프로토콜
https://byjus.com/gate/difference-between-stateless-and-stateful-protocol/
 -->

# cookie-parser로 요청 쿠키 파싱하기

`cookie-parser` 미들웨어를 통해 문자열로 전송되는 요청 헤더의 쿠키를 파싱하여 `req.cookies`에 쿠키 이름과 값을 프로퍼티로 갖는 자바스크립트 객체를 채워넣어 참조할 수 있다.

또 부가적으로 `cookieParser(secret, options)`에 `secret` 문자열 값을 전달해 서명된 쿠키를 만들수도 있다.

<!-- `secret` 문자열은 `req.secret`에 할당된다?  -->

`cookie-parser`은 npm 모듈로 터미널에서 쉽게 다운받을 수 있다.

```
npm install cookie-parser
```

다음은 `cookie-parser` 사용 예시이다.

```
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// 클라이언트에 쿠키 전송
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

# 서명된 쿠키(signed cookies)

Express에서 `cookie-parser`를 사용해 서명된 쿠키를 전송할 수 있다.

서명된 쿠키란 쿠키가 변조 되지 않았음을 확인하기 위한 방법으로 편지를 밀랍으로 봉인하듯 `cookieParser(secret, options)`의 첫 번째 인수로 지정한 `secret`값을 쿠키의 서명으로 사용하고 또 요청 헤더로 전송된 서명된 쿠키를 파싱한다(지정하지 않으면 서명된 쿠키를 파싱하지 않음).

암호화와는 다르며 클라이언트(브라우저)가 보낸 쿠키 원본 데이터와 서버가 받은 데이터가 일치하는지(중간에 누군가 변경시키지 않았는지) 확인하는 용도로 사용된다.

<!--
서명된 쿠키를 사용하면 `XSS(cross-site sciprting)` -->

```
// 서명된 쿠키 예시를 위한 간단한 문자열
app.use(cookieParser('secretCookie!!'))

app.get('/cookie', (req, res) => {
  res.cookie('name', 'example!', { signed: true })
  res.send('cookie!');
})
```

서명된 쿠키는 `req.cookies`가 아닌 `req.singedCookies` 프로퍼티에 서명되지 않은 형태로 할당된다.

```
app.use(cookieParser('secretCookie!!'))

// 서명된 쿠키과, 서명되지 않은 쿠키 전송
app.get('/cookie', (req, res) => {
  res.cookie('name', 'example!', {signed: true})
  res.cookie('fruit', 'orange!')
  res.send('cookie!');
})

// req.cookies로 쿠키 확인 -> 서명된 쿠키는 포함되지 않는다
app.get('/notsingedcookie', (req, res) => {
  console.log(req.cookies)
  res.send('cookie!');
})

>> { fruit: 'orange!' }
-------------------------------------------------
// req.signedCookies로 쿠키 확인 -> 서명된 쿠키만 포함되어있다
app.get('/singedcookie', (req, res) => {
  console.log(req.signedCookies)
  res.send('cookie!');
})

>> [Object: null prototype] { name: 'example!' }
```

개발자 도구에서 쿠키를 추가하거나, 값을 변경할 수 있는데 서명된 쿠키의 값을 변경할 경우 값이 `res.singedCookies`의 값이 `false`로 설정되며, `secret` 문자열로 인코딩 된 부분을 다 지워버리면 서명된 쿠키로 취급되지 않아 아예 `req.cookies`에 할당된다(변경되었다는 것을 알 수 있음).

**[NPM cookie-parser]**

https://www.npmjs.com/package/cookie-parser

<!-- 서명된 쿠키 값은 다른 객체에 있다?-->

<!--
# HMAC -->
