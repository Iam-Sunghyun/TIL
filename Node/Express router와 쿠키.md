**목차**
- [Express Router?](#express-router)
  - [Router 객체 생성](#router-객체-생성)
  - [router.route() 메서드로 라우터 통합하기](#routerroute-메서드로-라우터-통합하기)
- [쿠키(cookie)](#쿠키cookie)
  - [쿠키 속성(cookie attribute)](#쿠키-속성cookie-attribute)
    - [MDN에서 말하는 쿠키!](#mdn에서-말하는-쿠키)
  - [Reference](#reference)
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


# 쿠키(cookie)

<!-- 일단 여기 정리하고, 나중에 http 파일로 따로 빼던지 하자. -->

HTTP는 웹에서 서버 애플리케이션과 클라이언트 애플리케이션이 HTML문서와 같은 리소스들을 주고받을 때 사용되는 애플리케이션 계층 프로토콜이다.

HTTP는 클라이언트에 대한 상태 정보를 유지하지 않는 **무상태(stateless, 비상태) 프로토콜**이다. 즉 특정 클라이언트가 몇 초 동안 같은 요청을 2번 했을 경우, 첫 번째 요청에 이미 응답한 적이 있더라도 서버는 이전에 한 요청에 대한 정보를 저장하지 않으므로 두 번째 요청에 대해 또 같은 응답을 보낸다.

즉 무상태 프로토콜은 **각각의 요청을 독립적인 작업으로 보며(같은 브라우저의 요청인지 알지 못함), 통신할 때 상태정보를 요구하지 않는 통신 프로토콜** 이다. 이러한 특징은 서버 설계를 간편하게 하고, 동시에 수천 개의 TCP 연결을 다룰 수 있는 웹 서버를 만들 수 있게 하였다.

그러나 사용자를 식별하기 위해 상태를 유지하는 것이 웹사이트 사용에 있어서 필요할 때가 있다. 예를 들면 사용자에 따라 맞는 콘텐츠를 제공하는 경우(웹사이트 테마 설정 등) 혹은 로그인 지속, 쇼핑몰 장바구니, 게임 스코어 등 세션 관리를 위해서, 사용자의 웹사이트 사용 기록을 기록하고 분석하기 위해서다. 

이럴 때 무상태 프로토콜인 HTTP는 **쿠키(cookie)** 라고 하는 텍스트 조각을 통해 사용자를 식별할 수 있게 해준다(세션과 함께 사용).

**쿠키는 'name=zerocho'와 같이 키=값 쌍의 요소들로 이루어진 작은 텍스트 파일이다.** 클라이언트(웹 브라우저)에 저장되며 웹 사이트에 처음 접속할 시 서버에 의해 생성되고, HTTP 응답 메시지 `Set-cookie` 헤더에 포함되어 전송된다. 그 후에 쿠키는 같은 웹 사이트(서버)에 접속할 시 요청 메시지의 `Cookie` 헤더에 포함되어 전송된다.

```
// 응답 메시지에 담긴 쿠키
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]
```

```
// 요청 메시지에 담긴 쿠키
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

## 쿠키 속성(cookie attribute)

`Set-cookie` 헤더에는 부가적으로 `secure`, `HttpOnly` 등 여러 속성을 지정할 수 있는데 종류는 다음과 같다.

|제목|내용|
|:---:|:---:|
|Expires|쿠키 만료기간을 날짜 형식으로 나타낸다. 지정하지 않으면 **세션 쿠키(클라이언트 종료시 세션 종료와 함께 제거됨)** 가 된다.|
|Max-Age|쿠키 만료까지 남은 시간(초)을 나타낸다. 0 또는 음수를 설정한 경우 쿠키를 즉시 만료시킨다. Expires와 Max-Age 둘 다 설정된 경우 Max-Age가 우선순위가 높다.|
|Domain|쿠키가 전송될 호스트를 지정한다. 생략하면 이 속성은 기본적으로 하위 도메인(서브 도메인)을 포함하지 않는 현재 문서 URL이 호스트로 설정된다.<br> 도메인이 명시되면, 서브 도메인들은 항상 포함된다.|
|Path|Domain과 마찬가지로 쿠키의 유효범위를 정의하는 속성. Cookie 헤더를 전송하기 위하여 요청되는 URL 내에 반드시 존재해야 하는 경로를 설정한다. <br>ex) Path=/docs; -> /docs, /docs/Web/, /docs/Web/HTTP 모두 매치됨.<br>Path가 설정된 경우 Path가 일치하는 경우에만 쿠키를 전송하고 명시하지 않은 경우 `Set-Cookie` 헤더를 전송한 서버의 경로를 사용한다.|
|HttpOnly|XSS(Cross-Site Scripting, (공격자의 자바스크립트를 대상 클라이언트(브라우저)에 삽입해 실행시킴) 방어를 위한 옵션. <br>이 속성은 클라이언트(브라우저)측 JavaScript 코드가 쿠키에 접근하지 못하게 하는 속성으로 공격자가 XSS 공격이 성공한 경우 쿠키를 훔치는 것을 방지한다.<br>-> 클라이언트측에서 `document.cookie`로 쿠키에 접근할 수 있는데, HttpOnly 속성이 설정된 경우 접근할 수 없다. 또한 클라이언트측에서 생성한 쿠키는 HttpOnly 속성을 설정할 수 없다.|
|Secure|true로 설정된 경우 암호화된 연결의 요청(HTTPS, WSS)에만 쿠키를 포함한다. 암호화되지 않은 일반 텍스트로 전송하는(HTTP, WS) 경우 헤더에 쿠키가 포함되지 않는다.|
|SameSite<br>(Lax, Strict, None)|HTTP 응답 헤더의 SameSite속성을 사용하면 쿠키를 자사(first-party) 또는 동일 사이트 컨텍스트 Set-Cookie로 제한해야 하는지 여부를 설정한다. <br>아직 실험단계에 있어 모든 브라우저에서 제공되진 않는다고 함(크롬에서만 제공되는듯).<br> 자사 쿠키(first-party cookie), 타사 쿠키(third-party cookie)에 관한 것은 아래 참고 <br> https://seob.dev/posts/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%BF%A0%ED%82%A4%EC%99%80-SameSite-%EC%86%8D%EC%84%B1/ <br> https://en.wikipedia.org/wiki/HTTP_cookie#Third-party_cookie 참고|


### MDN에서 말하는 쿠키!

```
과거엔 클라이언트 측에 정보를 저장할 때 쿠키를 주로 사용하곤 했습니다. 
쿠키를 사용하는 게 데이터를 클라이언트 측에 저장할 수 있는 유일한 방법이었을 때는 이 방법이 타당했지만, 
지금은 modern storage APIs를 사용해 정보를 저장하는 걸 권장합니다. 
모든 요청마다 쿠키가 함께 전송되기 때문에, (특히 mobile data connections에서) 성능이 떨어지는 원인이 될 수 있습니다.
정보를 클라이언트 측에 저장하려면 Modern APIs의 종류인 웹 스토리지 API (localStorage와 sessionStorage) 와 IndexedDB를 사용하면 됩니다.
```

## Reference

**[RFC 6265 The Set-Cookie Header attribute]**

https://www.rfc-editor.org/rfc/rfc6265#section-5.2

**[javascript info 쿠키]**

https://ko.javascript.info/cookie

**[위키피디아 쿠키]**

https://en.wikipedia.org/wiki/HTTP_cookie

**[MDN HTTP 쿠키]** 

https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies (내용 좀 더 긴 영어 버전)

https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies (한글 버전)

**[NHN Meetup! 쿠키에 대해]**

https://meetup.toast.com/posts/172

**[쿠키 장단점]**

https://www.webcodeexpert.com/2013/03/what-is-cookie-advantages-and.html

**[쿠키 보안 취약점]**

https://velog.io/@seaworld0125/WEB-%EC%BF%A0%ED%82%A4%EC%9D%98-%EB%B3%B4%EC%95%88-%EC%B7%A8%EC%95%BD%EC%A0%90%EA%B3%BC-%EB%8C%80%EC%9D%91%EB%B0%A9%EB%B2%95

https://www.appsecmonkey.com/blog/cookie-security

https://quadrantsec.com/security-issues-cookies/

https://appcheck-ng.com/cookie-security

**[참고. OWASP TOP 10 - 웹 애플리케이션 주요 보안 취약점]**

https://owasp.org/www-project-top-ten/

https://www.igloo.co.kr/security-information/%ED%95%9C%EB%B0%9C-%EC%95%9E%EC%84%9C-%EC%82%B4%ED%8E%B4%EB%B3%B4%EB%8A%94-owasp-top-10-2021-draft/

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
