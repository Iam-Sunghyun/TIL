**목차**
- [Passport.js 라이브러리로 인증(Authentication)하기](#passportjs-라이브러리로-인증authentication하기)
  - [1. 스키마에 `passport-local-mongoose` 모듈 적용하기](#1-스키마에-passport-local-mongoose-모듈-적용하기)
  - [2. passport/passport-local 구성하기](#2-passportpassport-local-구성하기)

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

사용자 스키마에 `Schema.prototype.plugin()` 메서드를 이용해 `passport-local-mongoose` 모듈을 적용시켜 준다.

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


## 2. passport/passport-local 구성하기

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

// passport-local-mongoose 0.2.1이상 버전의 createStrategy() 메서드는 new LocalStrategy()(올바른 옵션의 passport-local 객체)의 역할을 한다.
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