**목차**
- [Passport.js 라이브러리로 인증(Authentication)하기](#passportjs-라이브러리로-인증authentication하기)
  - [1. 스키마에 `passport-local-mongoose` 모듈 적용하기](#1-스키마에-passport-local-mongoose-모듈-적용하기)
  - [2. Passport 구성하기](#2-passport-구성하기)

# Passport.js 라이브러리로 인증(Authentication)하기

Passport.js는 Node.js 앱에 인증을 추가해주는 유용한 라이브러리로 Twitter, FaceBook, Google로 로그인 등 500가지가 넘는 다양한 인증 방식을 제공하여 직접 구현하지 않고도 앱의 사용자 인증 방식을 확장하기 쉽다는 장점이 있다.

여러 방식 중 가장 기본적인 방법인 사용자가 입력한 이름(id)과 비밀번호로 인증하는 `passport-local`을 사용해 볼 것인데, 이것 그대로 사용하지 않고 Mongoose를 통한 `passport-local` 인증 구현을 더 간편하게 해주는 Mongoose 플러그인 `passport-local-mongoose`를 사용할 것이다.

`passport-local-mongoose`를 사용하기 위해선 다음 세 가지 모듈이 필요하다.

```
> npm install passport mongoose passport-local-mongoose
```

## 1. 스키마에 `passport-local-mongoose` 모듈 적용하기

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


## 2. Passport 구성하기

```
const passport = require('passport');
const LocalStrategy = require('passport-local');.

app.use(passport.initialize());
```

**[passport.js 개념]**

https://www.passportjs.org/concepts/authentication/downloads/html/

**[passport-local-mongoose]**

https://www.npmjs.com/package/passport-local-mongoose

**[Top 5 JavaScript User Authentication Libraries for 2022]**

https://linuxhint.com/top-5-javascript-user-authentication-libraries-2022/#b1