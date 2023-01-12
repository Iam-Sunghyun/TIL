**목차**
- [Passport.js 라이브러리로 인증(Authentication)하기](#passportjs-라이브러리로-인증authentication하기)
  - [1. Mongoose 스키마에 `passport-local-mongoose` 모듈 적용하기](#1-mongoose-스키마에-passport-local-mongoose-모듈-적용하기)
  - [2. `passport`/`passport-local` 설정하기](#2-passportpassport-local-설정하기)
    - [`passport` 기본 설정하기](#passport-기본-설정하기)
    - [`passport`에 `passport-local` 전략(strategy) 설정](#passport에-passport-local-전략strategy-설정)
    - [`passport-local-mongoose`를 사용한 strategy 간소화](#passport-local-mongoose를-사용한-strategy-간소화)
    - [세션 저장/불러오기 방식 결정](#세션-저장불러오기-방식-결정)
- [회원가입 및 로그인](#회원가입-및-로그인)
  - [User.register(user, password, cb)로 사용자 등록](#userregisteruser-password-cb로-사용자-등록)
  - [passport.authenticate(strategy, options)로 인증](#passportauthenticatestrategy-options로-인증)
  - [isLoggedIn 미들웨어로 로그인 확인](#isloggedin-미들웨어로-로그인-확인)
  - [req.logout()으로 로그아웃](#reqlogout으로-로그아웃)
  - [returnTo 프로퍼티 - 원래 요청 페이지로 리디렉션하기](#returnto-프로퍼티---원래-요청-페이지로-리디렉션하기)

# Passport.js 라이브러리로 인증(Authentication)하기

Passport.js는 Node.js 앱에 인증을 추가해주는 유용한 라이브러리로 Twitter, FaceBook, Google로 로그인 등 500가지가 넘는 다양한 인증 방식을 제공하여 직접 구현하지 않고도 앱의 사용자 인증 방식을 확장하기 쉽다는 장점이 있다.

여러 방식 중 가장 기본적인 인증 방식인 사용자가 입력한 이름(id)과 비밀번호로 인증하는 `passport-local`을 사용해 볼 것인데, 이것 그대로 사용하지 않고 Mongoose를 통한 `passport-local` 인증 구현을 더 간편하게 해주는 Mongoose 플러그인 `passport-local-mongoose`를 함께 사용할 것이다.

`passport-local-mongoose`를 사용하기 위해선 다음 세 가지 모듈이 필요하다.

<!-- 

passport -> 사용자 인증을 위한 기반 모듈. passport.authenticate() 미들웨어로 사용자 인증

passport-local -> passport.use()에 전달할 stretegy 객체(new LocalStrategy(verify function))를 생성하기 위한 모듈인데, passport-local-mongoose를 사용하면 User.createStrategy() 모델 정적 메서드로 대체됨. 그냥 passport-local-mongoose의 의존성 모듈로서 필요한듯. 

passport-local-mongoose -> local strategy 인증을 위한 mongoose 모델에 여러 인스턴스(도큐먼트)/모델 메서드 추가해줌. DB에 사용자 등록 시 User.register(user, password, cb)을 사용하였음

-->

```
> npm install passport mongoose passport-local-mongoose
```

## 1. Mongoose 스키마에 `passport-local-mongoose` 모듈 적용하기

<!-- `Passport`는 요청을 인증하기 위해 웹 애플리케이션 내에서 미들웨어로 사용된다. . -->

사용자 스키마에 `Schema.prototype.plugin()` 메서드를 이용해 `passport-local-mongoose` 모듈을 적용시켜 여러 인증 메서드들을 추가해준다.

```
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'require email'],
    unique: true,        
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
```
적용된 스키마에는 username, hash, salt 값이 `passport-local-mongoose`에 의해 자동으로 추가 되며 해당 필드에는 순서대로 사용자 이름, 암호화된 비밀번호, 솔트 값이 저장된다.
또한 `User.register(user, password, cb)`으로 사용자 등록 시에(DB에 저장) username이 중복 값인지 자동으로 체크한다고 한다.


## 2. `passport`/`passport-local` 설정하기

`passport`, `passport-local`를 사용하기 위해선 다음 3가지 준비가 필요한데 
순서대로 필요한 설정을 작성해본다.

+ 미들웨어 설정
+ 전략(strategy) 설정
+ 세션 설정


### `passport` 기본 설정하기

우선 전략 상관없이 `Express`같은 connect-style 기반 앱에서  `passport`를 사용하기 위해 공통적으로 필요한 설정들이다(connect-style이란 미들웨어를 사용하는 확장하기 쉬운 node.js 서버 프레임워크 스타일을 말한다). 

npm 문서에 나와 있는 예시 코드를 앱 환경(프로젝트에선 `express` 4.x )에 맞게 적용시켜준다.

```
// npm에 나와있는 예시 코드
const app = express();
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')()); // express-session 1.5.0 이후 버전 사용하면 필요 없음.
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
-------------------------
↓
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
```

**[NPM connect?]**

https://www.npmjs.com/package/connect

### `passport`에 `passport-local` 전략(strategy) 설정

다음은 `passport-local` 생성자 함수(LocalStrategy)에 verify 콜백 함수를 전달해줘야 한다. verify 콜백은 자격증명(credential)과 `done()` 메서드에 접근 권한을 갖는 함수이다.  

이렇게 생성한 `strategy` 객체를 `passport.use()`에 적용시켜준다.

(전략마다 양식의 차이가 있는데 다음은 `passport-local`의 예시이다.)

```
const LocalStrategy = require('passport-local');
const passport = require('passport');

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

### `passport-local-mongoose`를 사용한 strategy 간소화

하지만 0.2.1 이후 버전의 `passport-local-mongoose`를 사용하면 사용자 모델에 추가되는 `User.createStrategy()` 메서드로 다음과 같이 설정이 매우 간소화 된다.

```
// userModel.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: { . . . }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
-----------------------------------------------
// app.js
const passport = require('passport');
const User = require('./models/userModel');

// passport-local-mongoose 0.2.1이상 버전의 createStrategy() 메서드는 new LocalStrategy()(올바른 옵션의 passport-local 객체 생성)의 역할을 한다.
passport.use(User.createStrategy());
```

### 세션 저장/불러오기 방식 결정

로그인 세션을 유지하기 위해 세션에 사용자 정보를 직렬화, 역직렬화 한다. 즉 `serializeUser()`, `deserializeUser()`을 통해 세션에 사용자 정보를 저장하고 불러오는 방식을 결정한다. 

```
// 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
------------------------------------
// passport-local-mongoose 사용으로 간소화
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 
```

# 회원가입 및 로그인

## User.register(user, password, cb)로 사용자 등록

다음은 `passport-local-mongoose`의 `User.register(user, password, cb)` 메서드를 이용한 회원가입 절차이다. 

5.0.0 이후 버전에선 `serializeUser()`, `deserializeUser()`를 제외한 모든 인스턴스/정적 메서드는 프로미스를 반환하기 때문에 `async/await`을 사용할 수 있다(콜백이 없는 경우에만).

```
// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await User.register(new User({ username, email }), password);   // passport-local-mongoose 모델 static 메서드
    req.flash('success', '회원가입 성공!');
    res.redirect('/campgrounds');
  } catch (e) {
    req.flash('error', e.message);
    console.log(e)
    res.redirect('/users/signup');
  }
});
```

`User.register(user, password, cb)` 메서드는 `username` 값이 유일한 값인지 체크한다.

## passport.authenticate(strategy, options)로 인증

`passport.authenticate(strategy, options)` 미들웨어로 로그인한다.

```
// 로그인
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }),
  (req, res) => {
    req.flash('success', `${req.body.username}님 환영합니다!`);
    res.redirect('/campgrounds');
  }
);
```
`passport.authenticate()` 미들웨어는 요청 body에 전송된 자격증명(username, password)으로 인증한다. 인증에 성공하면 내부에서 `req.login()` 메서드를 호출하여 로그인 세션을 생성하며 인증된 사용자 객체가 `req.user` 프로퍼티에 저장된다.


## isLoggedIn 미들웨어로 로그인 확인

로그인 확인은 `req.isAuthenticated()`를 통해 이루어지는데 세션(`req.session`)에 저장된 `passport` 로그인 세션을 확인하여 `true`/`false`를 반환한다. 

즉, `passport.authenticate()`로 인증이 성공적으로 이루어져 로그인 세션이 생성된 사용자의 경우에만 `true`를 반환하는 것이다.

```
// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인이 필요합니다.");
    return res.redirect("/users/login");
  }
  next();
};
----------------------------
// campgroundRouter.js
const isLoggedIn = require('../middleware');

// 새 캠핑장 생성 라우터
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});
```

## req.logout()으로 로그아웃

`req.logout(cb)` 메서드에 콜백을 전달하여 호출하여 로그인 세션을 삭제하고 로그아웃한다.

```
// authRouter.js
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) next(err);
    req.flash('success', '로그아웃 되었습니다.');
    res.redirect('/campgrounds');
  });
})
```

## returnTo 프로퍼티 - 원래 요청 페이지로 리디렉션하기

현재 상태는 로그인하지 않는 사용자가 새 게시물 작성시 로그인 페이지로 리디렉션 되고, 로그인을 완료하면 다시 홈 페이지로 이동한다. 

편의를 위해 로그인 후 새 게시물 작성 페이지로 리디렉션 되도록 코드를 수정한다.

```
// middleware.js
// 로그인 확인용 미들웨어
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // 로그인한 사용자가 아니라면 세션에 요청 페이지 url 저장(리디렉션을 위해)
    req.session.returnTo = req.originalUrl;
    req.flash("error", "로그인이 필요합니다.");
    return res.redirect("/users/login");
  }
  next();
};
-------------------------
// authRouter.js
// POST 로그인 
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: '아이디 혹은 비밀번호가 다릅니다.', keepSessionInfo : true }),
  (req, res) => {
    // 리디렉션할 페이지가 있는지 체크. 없으면 홈으로 이동
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', `${req.body.username}님 환영합니다!`);
    res.redirect(redirectUrl);
  }
);
```

`isLoggedIn` 미들웨어는 로그인이 안되어있는 경우 로그인 페이지로 리디렉션 하는데, 이때 요청 URL을 담고있는 `req.originalUrl` 값을 세션(`req.session.returnTo`)에 저장한 후(로그인 성공했다면 요청했던 페이지로 리디렉션 하기 위해) 로그인 페이지로 리디렉션 한다.

그 후 로그인이 완료되면 `req.session.returnTo`에 저장했던 원래 요청 페이지로 리디렉션한다.

`isLoggdeIn` 미들웨어의 `returnTo` 프로퍼티는 로그인이 요구되는 페이지에서 리디렉션을 통해 로그인하는 경우에만 유효하고 로그인 링크를 클릭하여 로그인하는 경우는 `/campgrounds`로 이동한다.



**[passport-local-mongoose]**

https://www.npmjs.com/package/passport-local-mongoose

https://github.com/saintedlama/passport-local-mongoose#api-documentation

https://darrengwon.tistory.com/189

**[passport.js]**

https://www.npmjs.com/package/passport

https://www.passportjs.org/concepts/authentication/downloads/html/

**[passport-local]**

https://www.passportjs.org/packages/passport-local/

**[Top 5 JavaScript User Authentication Libraries for 2022]**

https://linuxhint.com/top-5-javascript-user-authentication-libraries-2022/#b1