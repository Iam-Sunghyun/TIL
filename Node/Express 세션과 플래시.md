# 목차
- [세션(session)이란?](#세션session이란)
  - [세션 사용 이유?](#세션-사용-이유)
- [Express 세션 구현하기](#express-세션-구현하기)
  - [`express-session` 세션 미들웨어 생성하기](#express-session-세션-미들웨어-생성하기)
    - [`express-session` options 종류와 예시](#express-session-options-종류와-예시)
  - [`req.session`으로 세션 데이터 접근하기](#reqsession으로-세션-데이터-접근하기)
- [플래시 메시지](#플래시-메시지)
  - [세션과 `connect-flash`로 플래시 메시지 구현하기](#세션과-connect-flash로-플래시-메시지-구현하기)
  - [`res.locals`로 플래시 메시지 사용하기](#reslocals로-플래시-메시지-사용하기)


  
  
# 세션(session)이란?

클라이언트가 웹 서버에 연결되어 있는 상태(사용자가 웹 사이트에 접속하여 종료하기 전까지 상태, 기간) 혹은 연결되어 있는 동안 발생하는 사용자 정보를 서버 측에 저장하는 것을 세션이라 한다.
<!-- 
기본은 DB가 아닌 서버 메모리에 저장되어 영구적인 것이 아니다. 따라서 설정하기 따라 브라우저를 종료하거나 서버를 재시작하면 삭제되기도 하고, 일정 시간(timeout 값) 동안 세션에 입력이 없으면 삭제되게 하기도 한다.
-> 여기서 브라우저를 종료할 때 삭제되는 것은 세션 쿠키인데 혼동하여 설명한 듯?
-->

## 세션 사용 이유?

쿠키의 경우 보통 4KB의 용량 제한과 도메인 당 20개의 개수 제한이 있어서 사용자 정보가 매우 많을 경우 모두 담아내지 못할 수 있다. 또한 클라이언트 측에 저장되어 누구나 쉽게 열어보고 조작할 수 있고, 중요한 정보를 쿠키에 직접 담을 경우 가로채질 수 있다던지(일반적으로 XSS 취약점을 이용해 가로채고, 이것이 세션 하이재킹으로 이어질 수 있음) 보안적인 부분에서 서버 측에 저장하는 것보다 안전하지 않다(쿠키의 보안적인 문제는 Express router와 쿠키.md 참고자료 참고). 

따라서 사용자 정보를 저장하고 식별하기 위해 쿠키와 세션이 함께 사용되는데 보통 쿠키에 세션 키를 저장해 세션 정보 확인용으로 사용한다.

**[쿠키와 세션 요약 정리]**

https://kim1124.tistory.com/1

# Express 세션 구현하기

npm의 `express-session` 모듈로 Express에서 세션을 구현할 수 있다.
```
// express-session 설치
npm i express-session
```

이 모듈을 사용하기 위해선 `cookie-parser` 모듈이 필요했으나 1.5.0 이후 버전부터는 `cookie-parser` 모듈 없이도 쿠키를 자동으로 읽거나 작성하여 Express의 `req`/`res` 객체에 할당한다. 

만약 `cookie-parser`를 사용할 경우 쿠키 서명을 위해 사용한 `secret` 값을 `express-session`의 `secret`과 일치시켜야 서명된 쿠키 사용시 문제가 발생하지 않는다.

## `express-session` 세션 미들웨어 생성하기

`session(options)`으로 인수로 전달한 옵션을 적용한 세션 미들웨어를 생성한다. 세션 데이터는 서버에만 저장되고 쿠키는 세션을 식별하기 위한 ID가 담겨 클라이언트(브라우저)측에 저장된다.

`express-session` 미들웨어를 생성할 때 여러가지 속성을 지정할 수 있는데 그 중에서도 쿠키 서명을 위한 `secret` 속성은 필수 속성이다.

예측하기 어려운 `secret` 값을 사용하여 쿠키의 세션 ID가 노출될 가능성을 줄일 수 있다.

### `express-session` options 종류와 예시

`express-session` 세션 미들웨어를 생성할 때 설정할 수 있는 옵션들이다. 자세한 내용은 아래 [npm express-session 설명서] 링크 참고.

+ genid
+ name
+ proxy
+ resave
+ rolling
+ saveUninitialized
+ secret(필수 옵션)
+ store
+ unset
+ cookie - 쿠키의 속성 지정. 기본 값은`{ path: '/', httpOnly: true, secure: false, maxAge: null }`이다.

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

`express-session`으로 구현한 세션 데이터는 **`MemoryStore`라고 하는 기본 세션 저장소에 저장되며 웹 서버의 메모리에 저장된다.**

개발을 위한 `MemoryStore`의 사용은 문제될 것이 없지만 실제로 배포되는 서버 환경인 production 환경에서의 `MemoryStore` 사용은 적절하지 않다.

그 이유는 `MemoryStore`는 웹 서버의 메모리에 저장되는 것이기 때문에 서버를 재시작 하거나 브라우저를 종료하면 데이터가 사라진다. 또한 여러 대의 서버 상에서(로드 밸런싱)의 Session data 공유도 `MemoryStore`에서는 불가능하다 -> 특정 서버의 메모리에만 사용자 정보가 저장되어있다면 다른 서버로 응답하게 되는 경우 사용자 정보를 조회할 수 없게 된다. 

따라서 실제 production 환경에서는 세션 데이터를 Redis, MongoDB와 같은 DB를 사용하여 영속적으로 관리하는 것이 일반적이라고 한다.

참고로 `MemoryStore` 이외에도 Redis, mongo 등 호환되는 여러가지 세션 저장소가 있다.

**[poiemaweb express session]**

https://poiemaweb.com/express-session-handling

**[npm express-session 설명서]**

https://www.npmjs.com/package/express-session

# 플래시 메시지

플래시는 **단일 요청에 대한 데이터를 저장하는데 사용되는 세션의 특수 영역**을 말하며 **플래시 데이터는 단일 요청에 대해서만 생성(사용)되고 제거되는 세션 데이터이다.** 

플래시는 완료 메시지나 확인 메시지 같은 알림용 메시지를 저장하기 위해 자주 사용되는데 **세션에 저장되고 가장 먼저 렌더링된 페이지에 표시된 다음 폐기된다.** -> 특정 동작을 수행하고 다른 페이지로 리디렉션되기 전에 세션에 메시지를 추가하여 리다이렉트된 페이지에 출력 후 세션에서 제거된다(새로고침 시 페이지에서 더이상 출력되지 않음).


<!-- 플래시 메시지는 세션을 이용하여 간단하게 구현할 수 있다. -->
<!-- 다양한 용도로 사용됨. --> 

## 세션과 `connect-flash`로 플래시 메시지 구현하기

세션과 `connect-flash` 모듈을 사용해 플래시 메시지를 구현해본다. 

```
// connect-flash 설치
npm i connect-flash
```

`connect-flash` 미들웨어를 호출하면 `req` 객체는 `flash()` 메서드를 호출할 수 있게 되고 세션에 플래시 메시지를 저장할 수 있게 된다.

```
// 새로운 데이터를 추가하고 성공 메시지를 플래시에 저장, 출력하는 예제

// 모듈 로드
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = { secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }

// express-session, connect-flash 미들웨어 호출
app.use(session(sessionOptions));
app.use(flash());

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms, message: req.flash('success') }) // 플래시 메시지에 접근하기 위해 키만 전달하여 req.flash() 호출
})

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    req.flash('success', 'Successfully made a new farm!'); // 키와 값을 인수로 전달하여 세션에 데이터 저장
    res.redirect('/farms')
})
```

**[세션과 플래시]**

https://memphis-cs.github.io/rails-tutorial-2019/deets-sessions/

**[npm connect-flash]**

https://www.npmjs.com/package/connect-flash



## `res.locals`로 플래시 메시지 사용하기


`res.locals` 프로퍼티를 사용해 `res.render()`로 렌더링되는 템플릿 내에서 사용할 수 있는 변수를 설정할 수 있다. `res.locals`에 추가된 변수는 단일 요청/응답 주기에서만 사용할 수 있으며 요청 간에 공유되지 않는다.
<!-- 요청 간에 공유되지 않는 것이 무슨소리? -->

```
const session = require('express-session');
const flash = require('connect-flash');

// express-session, connect-flash 미들웨어 호출
const sessionOptions = { secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    // req.flash() 호출하여 res.locals에 플래시 메시지 저장
    // 다음에 res.render()로 렌더링되는 템플릿에서 messages를 지역변수처럼 사용 가능하다
    res.locals.messages = req.flash('success'); 
    next();
})

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms }) // 
})

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    req.flash('success', 'Successfully made a new farm!'); // 키와 값을 인수로 전달하여 세션에 데이터 저장
    res.redirect('/farms')
})
---------------------------------------
// /views/farms/index.ejs
<body>
    <%= messages %>   // res.render()로 전달하지 않은 변수이지만 res.locals에 추가한 값이므로 템플릿 내에서 지역변수처럼 사용할 수 있는 것
    <h1>All Farms</h1>
    <ul>
        <% for(let farm of farms) { %>
        <li><a href="/farms/<%=farm._id%>"><%= farm.name %></a> </li>
        <% }%>
    </ul>
    <a href="/farms/new">Add Farm</a>
</body>
```

위 예제에서 `res.locals`에 값을 추가하여 `res.render()`에 따로 값을 일일히 전달하지 않고도 렌더링할 템플릿 안에서 변수를 사용할 수 있었다. 

위에선 연습용으로 단순히 문자열을 저장했지만 보통 HTML 태그(div, 부트스트랩 경고창 등)을 사용해 템플릿에 띄우는 게 일반적이다.

**[express res.locals]**

https://expressjs.com/en/4x/api.html#res.locals
