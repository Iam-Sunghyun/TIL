**목차**
- [Passport.js 라이브러리로 인증(Authentication)하기](#passportjs-라이브러리로-인증authentication하기)
  - [1. 스키마에 `passport-local-mongoose` 모듈 적용하기](#1-스키마에-passport-local-mongoose-모듈-적용하기)
  - [2. passport/passport-local 설정하기](#2-passportpassport-local-설정하기)
- [회원가입 및 로그인](#회원가입-및-로그인)
  - [User.register(user, password, cb)로 사용자 등록](#userregisteruser-password-cb로-사용자-등록)
  - [passport.authenticate(strategy, options)로 인증](#passportauthenticatestrategy-options로-인증)
  - [isLoggedIn 미들웨어로 로그인 상태 유지](#isloggedin-미들웨어로-로그인-상태-유지)
  - [req.logout()으로 로그아웃](#reqlogout으로-로그아웃)

# Passport.js 라이브러리로 인증(Authentication)하기

Passport.js는 Node.js 앱에 인증을 추가해주는 유용한 라이브러리로 Twitter, FaceBook, Google로 로그인 등 500가지가 넘는 다양한 인증 방식을 제공하여 직접 구현하지 않고도 앱의 사용자 인증 방식을 확장하기 쉽다는 장점이 있다.

여러 방식 중 가장 기본적인 방법인 사용자가 입력한 이름(id)과 비밀번호로 인증하는 `passport-local`을 사용해 볼 것인데, 이것 그대로 사용하지 않고 Mongoose를 통한 `passport-local` 인증 구현을 더 간편하게 해주는 Mongoose 플러그인 `passport-local-mongoose`를 사용할 것이다.

`passport-local-mongoose`를 사용하기 위해선 다음 세 가지 모듈이 필요하다.

<!-- 

passport -> 사용자 인증을 위한 기반 모듈. passport.authenticate() 미들웨어로 사용자 인증

passport-local -> passport.use()에 전달할 stretegy 객체(new LocalStrategy(verify function))를 생성하기 위한 모듈인데, passport-local-mongoose를 사용하면 User.createStrategy() 모델 정적 메서드로 대체됨. 그냥 passport-local-mongoose의 의존성 모듈로서 필요한듯. 

passport-local-mongoose -> local strategy 인증을 위한 mongoose 모델에 여러 인스턴스(도큐먼트)/모델 메서드 추가해줌. DB에 사용자 등록 시 User.register(user, password, cb)을 사용하였음

-->

```
> npm install passport mongoose passport-local-mongoose
```

## 1. 스키마에 `passport-local-mongoose` 모듈 적용하기

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
또한 username이 중복 값인지 자동으로 체크한다고 한다!


## 2. passport/passport-local 설정하기

`passport`, `passport-local` 두 가지를 사용한 설정 방식은 다음과 같이 `passport-local` 생성자 함수(LocalStrategy)에 인증 함수(verify)를 전달하여 `strategy` 객체를 `passport.use()`에 적용시켜 줘야한다. 

```
var LocalStrategy = require('passport-local');
var passport = require('passport');

// SQL db의 경우 예시
var strategy = new LocalStrategy(function verify(username, password, cb) {
  db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
});

passport.use(strategy)
```

하지만 0.2.1 이후 버전의 `passport-local-mongoose`를 사용하면 사용자 모델에 추가되는 `User.createStrategy()` 메서드로 다음과 같이 설정이 매우 간소화 된다.

```
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: { . . . }
});
userSchema.plugin(passportLocalMongoose);
-----------------------------------------------
const passport = require('passport');
const User = require('./models/user');

// passport-local-mongoose 0.2.1이상 버전의 createStrategy() 메서드는 new LocalStrategy()(올바른 옵션의 passport-local 객체 생성)의 역할을 한다.
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 
```

**[passport-local-mongoose]**

https://www.npmjs.com/package/passport-local-mongoose

https://github.com/saintedlama/passport-local-mongoose#api-documentation

https://darrengwon.tistory.com/189

**[passport.js]**

https://www.npmjs.com/package/passport

https://www.passportjs.org/concepts/authentication/downloads/html/

**[Top 5 JavaScript User Authentication Libraries for 2022]**

https://linuxhint.com/top-5-javascript-user-authentication-libraries-2022/#b1

# 회원가입 및 로그인

## User.register(user, password, cb)로 사용자 등록

다음은 `passport-local-mongoose`의 `User.register(user, password, cb)` 메서드를 이용한 회원가입 절차이다. 5.0.0 이후 버전에선 `serializeUser()`, `deserializeUser()`를 제외한 모든 인스턴스/정적 메서드는 프로미스를 반환하기 때문에 `async/await`을 사용할 수 있다(콜백이 없는 경우에만).

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
`passport.authenticate()` 미들웨어는 요청에 전송된 자격증명(credential)을 인증한다. 인증에 성공하면 `req.user` 프로퍼티에 인증된 사용자가 저장되며, 로그인 세션이 생성된다.



## isLoggedIn 미들웨어로 로그인 상태 유지 

## req.logout()으로 로그아웃