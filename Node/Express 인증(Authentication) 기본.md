**목차**
- [인증(Authentication) vs 권한 부여(Authorization) (上)](#인증authentication-vs-권한-부여authorization-上)
- [비밀번호 암호화 하는 법 (上)](#비밀번호-암호화-하는-법-上)
  - [암호화된 해시 함수(cryptographic hash function) (中)](#암호화된-해시-함수cryptographic-hash-function-中)
  - [Password Salt (中)](#password-salt-中)
  - [Bcrypt? (上)](#bcrypt-上)
- [npm bcrypt 모듈로 비밀번호 해시하는 방법](#npm-bcrypt-모듈로-비밀번호-해시하는-방법)
- [bcrypt 모듈로 직접 비밀번호 해시해보기](#bcrypt-모듈로-직접-비밀번호-해시해보기)
  - [솔트 생성 및 확인](#솔트-생성-및-확인)
  - [사용자의 암호 대조(확인)해보기](#사용자의-암호-대조확인해보기)
- [Express로 Authentication 구현해보기 (中)](#express로-authentication-구현해보기-中)
  - [사용자 등록](#사용자-등록)
  - [로그인](#로그인)
- [세션으로 로그인 상태 유지하기](#세션으로-로그인-상태-유지하기)
  - [로그아웃](#로그아웃)
  - [로그인 미들웨어](#로그인-미들웨어)
  - [mongoose Model 정적(static) 메서드, 미들웨어(middleware)로 리팩토링](#mongoose-model-정적static-메서드-미들웨어middleware로-리팩토링)

# 인증(Authentication) vs 권한 부여(Authorization) (上)

**인증(Authentication)**이란 특정 사용자가 누구인지 확인하거나, 사용자가 본인이 맞는지 확인하는 과정을 말한다. 보통 웹에서는 아이디와 암호를 이용해 확인하는데 이외에도 얼굴인식, 지문인식, OTP 등 여러 가지 보안 질문을 통해서 이뤄지기도 한다.

인증과 혼동되기도 하는 **권한 부여(Authorization)**는 말 그대로 특정 사용자가 할 수 있는 행동을 지정하는 것(권한을 부여하는 것)을 말한다. -> 접근 가능한 대상이나 편집, 삭제가 가능한 대상 등 웹 사이트에서 접근(acess)할 수 있는 대상을 지정하는 것.

보통 권한 부여는 사용자 인증 후 일어나게 된다.

**[Authentication vs. Authorization]**

https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization

**[인증과 인가 (권한 부여) 비교]**

https://www.okta.com/kr/identity-101/authentication-vs-authorization/
 
# 비밀번호 암호화 하는 법 (上)

사용자 인증을 위한 사용자 정보를 저장할 때, 사용자의 비밀번호를 절대 있는 그대로 저장해선 안된다. 이유는 단순히 누군가 DB에 접근했을 경우 비밀번호가 그대로 노출되기 때문.

따라서 비밀번호를 저장할 때 암호화가 필수적인데 **해시 함수**를 사용해 암호화를 해볼 것이다.

<!-- 자격 증명(credential)? -> 말 그대로 자격 증명하는 것. 웹에선 보통 아이디 비밀번호, 그 외에는 지문인식, 등등 여러가지가 있다 -->

## 암호화된 해시 함수(cryptographic hash function) (中)

**해시 함수**란 임의의 크기 입력 값을 고정된 크기 값으로 변환해주는 함수를 말한다.

**암호화된 해시 함수(cryptographic hash function**는 해시 값과 원래 입력 값의 관계를 찾기 어려운 성질을 갖는 해시 함수를 말하는데 비밀번호 저장용 암호화 해시 함수가 가져야 할 특성은 다음과 같다.

1. **단방향 함수(one-way function)** 이어야 한다. <br> 즉, 해시 값을 입력 값으로 알아내는 것이 불가능해야 한다.
   
2. **입력 값에 작은 변화가 있을 때, 출력 값이 크게 변해야 한다(눈사태 효과)**. <br> 그렇지 않으면 여러 무작위 입력으로 결과를 대조하여 입력 값을 찾아낼 위험이 생기기 때문.  
   
3. **결정적이어야 한다**. <br> 즉, 동일한 입력에 대해 항상 동일한 출력을 반환해야 한다. -> 당연한 것이다. 그렇지 않다면 입력 값을 식별할 수 없을 것이다.
   
4. **충돌이 거의 없다시피 해야 한다**. <br> 그렇지 않고 서로 다른 비밀번호가 동일한 해시 값을 만들어 낸다면 큰 문제가 될 것.
   
5. 비밀번호 저장용 해시 함수는 **느려야 한다!** <br> 빠른 해시 함수를 사용하게 되면 오히려 빠른 속도로 수 천만, 수 백억의 암호로 해싱을 시도하여 입력 값을 맞춰 버리는 경우가 생길 수 있다(-> 브루트 포스, 완전 탐색, 무차별 대입 검색). 따라서 고의적으로 느린 해시 함수를 사용해 이러한 시도를 늦추는 것. 물론 비밀번호 저장용이 아닌 해시 함수는 빠른 것이 좋다. 한 예로 서명된 쿠키 예제에서 사용된 해시 함수는 SHA-256으로 매우 빠른 해시 함수인데 이러한 함수를 단일 반복으로 사용한다면 비밀번호 저장용으로는 적합하지 않다.


**[위키피디아 암호화 해시 함수]**

https://ko.wikipedia.org/wiki/%EC%95%94%ED%98%B8%ED%99%94_%ED%95%B4%EC%8B%9C_%ED%95%A8%EC%88%98

https://en.wikipedia.org/wiki/Cryptographic_hash_function


**[좋은 암호화 해시 함수]**

https://crypto.stackexchange.com/questions/24/what-makes-a-hash-function-good-for-password-hashing

https://www.thesslstore.com/blog/what-is-a-hash-function-in-cryptography-a-beginners-guide/

## Password Salt (中)

패스워드 솔트란 암호를 해싱할 때 암호를 역설계 하거나 암호를 유추하는 것을 어렵게 하기 위한 방법이다.

그 전에 우선 비밀번호에 대하여 이해해야 하는 세 가지는 다음과 같다.

1. 대부분의 사람들은 여러 웹사이트에 같은 비밀번호를 사용한다.
2. 서로 다른 사람들의 비밀번호가 같은 경우가 많다.
3. 비밀번호를 저장할 때 사용되는 해시 알고리즘은 단 몇 개뿐이다(그 중 하나로 Bcrypt를 사용해볼 것). 

2번의 경우 발생하는 문제 -> 여러 사용자의 비밀번호가 동일한 해시 값을 만들어 낸다. 여러 사용자의 비밀번호 해시 값이 동일하다면 이것은 단순한 비밀번호일 가능성이 높은데 이것을 보고 비밀번호를 캐내려는 사람이 인터넷 상에서 쉽게 얻을 수 있는 자주 사용하는 비밀번호 값 목록을 입력해 봄으로서 우연히 비밀번호를 알아낸다면(혹은 레인보우 테이블을 이용해 해시된 암호로 원래 암호를 알아낸다면), 수 많은 동일한 비밀번호를 사용하는 사용자들의 계정 정보가 유출 될 수 있다.

<!-- (공격자가 해시 알고리즘이 뭔지 안다는 가정 하에)? -->

이러한 경우를 방지하기 위한 방법이 **Password Salt** 이다.

패스워드 솔트의 개념은 아주 간단하다. 암호를 해싱할 때 임의의 값(솔트)을 추가하여 해싱하는 것. 예를들어 비밀번호가 'password'라면 'passwordDog'처럼 'Dog'라는 솔트를 치는 것이다. 이렇게 하여 서로 다른 사용자가 동일한 비밀번호를 사용하는 경우에도 각자 다른 솔트를 사용해 데이터베이스에 다른 암호 해시 값을 저장할 수 있게 된다.

**Password salt**를 사용하려면 당연히 해시 값마다 사용 된 솔트를 알고 있어야 한다. 그래야 사용자가 비밀번호를 입력했을 때 솔트를 추가한 상태로 해싱하여 데이터베이스에 저장된 값과 대조해 볼 수 있기 때문.


**[위키피디앝 암호 솔트(salt)]**

https://ko.wikipedia.org/wiki/%EC%86%94%ED%8A%B8_(%EC%95%94%ED%98%B8%ED%95%99)

## Bcrypt? (上)

많이 사용되는 암호화 해시 함수 중 하나로 레인보우 테이블(해시함수(MD-5, SHA-1, SHA-2 등)를 사용하여 만들어낼 수 있는 값들을 대량으로 저장한 표) 공격 방지를 위해 솔트를 사용하는 해시 함수이다. 

npm에는 `bcrypt`와 `bcryptjs`가 있는데 node.js를 대상으로 만들어진 `bcrypt` 모듈을 사용해 볼 것이다(`bcrypt`는 c++로 구현되어 있어 속도가 더 빠르고 `bcyprtjs`는 브라우저에서도 실행 가능하다는 차이가 있다).


# npm bcrypt 모듈로 비밀번호 해시하는 방법

우선 `bcrypt` 모듈을 설치 해준다.

```
npm i bcrypt
```

`bcrypt`로 암호화하는 방법으로는 **비동기, 동기 방식 둘 다 가능한데 문서에서 추천하는 비동기 방식으로 암호화해 볼 것이다.**

`bcrypt` 모듈로 암호화하기 위해 암호 솔트(password salt)를 생성하는 **`genSalt()` 메서드**와 생성한 솔트와 비밀번호를 조합하여 해시 암호를 반환하는 **`hash()` 메서드**를 사용한다.

다음은 npm `bcyprt` 문서에 나와있는 **콜백 함수를 사용한 비동기 방식 예시**이다.

```
const bcrypt = require('bcrypt');

// 콜백을 통한 솔트 생성 및 암호 해싱 과정
// Technique 1 (솔트 생성, 암호 해싱 과정을 별개의 분리 된 함수로 처리하는 방법):
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // 해시 값을 암호 DB에 저장 ...
    });
});

// Technique 2 (하나의 함수로 솔트 자동 생성 및 해싱하는 방법):
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // 해시 값을 암호 DB에 저장 ...
});

----------------------------------------------------
// 콜백을 통한 입력 비밀번호와 비밀번호 DB 해시 값 확인 과정
// 여기서 hash는 비밀번호 데이터베이스에서 가져온 해시 값
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result는 확인 결과에 따라 true/false 값을 갖는다.
});

bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false ...
});
```

`genSalt()` 메서드의 첫 번째 인수(`saltRounds`)는 `Bcrypt`의 핵심 기능인 해시 함수의 난이도(복잡도)를 설정하기 위한 변수라고 보면 된다(12 언저리 값을 많이 사용한다고 함).

<!-- 난이도를 설정한다는 게 구체적으로 뭐지? -->

해시 난이도를 올리면 해싱에 소요되는 시간이 증가하고 낮을수록 빠른 속도로 처리되는데 해싱에 적절한 시간은 250 밀리초 정도이다.

다음은 **프로미스를 사용하여 비동기로 암호화한 예시**이다.

```
const bcrypt = require('bcrypt');

// 프로미스를 통한 암호 해싱 과정
bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
    // Store hash in your password DB.
});
--------------------------------------------
// 프로미스를 통한 입력 암호와 DB에 해시된 암호 확인(대조) 과정
bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
    // result == true ...
});

bcrypt.compare(someOtherPlaintextPassword, hash).then(function(result) {
    // result == false ...
});

// async/await를 사용한 암호 확인 과정
async function checkUser(username, password) {
    // ... 사용자 이름(ID)가 유효한지, 유효하다면 사용자 정보 인출(해시된 암호 포함하는) 및 기타 코드
       ...
    const match = await bcrypt.compare(password, user.passwordHash); // 암호 대조

    if(match) {
        // 로그인 성공!
    } else {
        //...
    }
}
``` 

# bcrypt 모듈로 직접 비밀번호 해시해보기

## 솔트 생성 및 확인

bcrypt의 콜백을 허용하는 비동기 메서드에 콜백 함수를 전달하지 않으면 프로미스를 반환한다(동기적으로 동작하는 메서드는 Sync가 붙는다). 따라서 async/await을 사용할 수 있다.

```
const hashPassword = async (pw) => {
    // saltRounds '12'으로 암호 솔트 생성 후 해시
    const salt = await bcrypt.genSalt(12); 
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt);
    console.log(hash);
};

hashPassword('example');

>> $2b$12$cXR3TfMiGM6b7BHh78.YYe
   $2b$12$cXR3TfMiGM6b7BHh78.YYeELJP2Kaht2Mi7T2yhRltTKp0tJvIpje
```

위 예시에서 `bcrypt.genSalt(12)` 메서드에 `saltRounds` 값 12을 전달하여 무작위 솔트를 생성하였다. 여기서 `saltRounds` 값(12)이 생성된 솔트를 추가하여 입력 값을 Bcrypt로 암호화 할 때 해시를 몇 회 반복해야 하는지를 결정한다(기본 값은 10이다). 

따라서 `saltRounds` 값에 100을 넣는다 한들 솔트 생성 속도 차이는 달라지지 않는다. 다만 실제로 비밀번호에 솔트를 추가해 bcrypt로 해싱할 때 입력한 `saltRounds` 크기에 따라 속도 차이가 발생한다.

<!-- 그렇다면 생성한 암호 해시를 저장했다면 입력 값과 어떻게 대조하는가 -->

## 사용자의 암호 대조(확인)해보기

사용자가 입력한 암호를 데이터베이스의 해시 값과 대조할 때에는 위의 예시에서도 나왔던 **`compare()` 메서드**를 사용한다.

다음은 비밀번호가 'example'이라고 가정한 간단한 예제로 비교할 해시 값을 직접 전달하였다.

```
const login = async (pw, hashedPw) => {
  // 입력 암호(pw)와 암호 DB에 저장된 해시 값(hashedPw)를 인수로 전달하여 값을 대조하고, 일치하면 true 불일치면 false를 반환한다.
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log('정확한 비밀번호입니다');
  } else {
    console.log('잘못된 비밀번호입니다.');
  }
};

login('example', '$2b$12$ZqDrbengGgyh9gGwzVXEJuqu2fP34B3BOLOJk0601lkH3Q6e9MEsS');
login('example123', '$2b$12$ZqDrbengGgyh9gGwzVXEJuqu2fP34B3BOLOJk0601lkH3Q6e9MEsS');

>> '정확한 비밀번호입니다'
   '잘못된 비밀번호입니다.'
```

**[npm bcrypt 모듈]**

https://www.npmjs.com/package/bcrypt

**[위키피디아 Bcrypt]**

https://en.wikipedia.org/wiki/Bcrypt

# Express로 Authentication 구현해보기 (中)

```
npm i express mongoose ejs bcrypt
```
## 사용자 등록

간단한 데모이므로 로직을 확인하기 쉽게 라우트 핸들러에 모든 코드를 담아 작성하였다.

```
// 사용자 등록 (반드시 POST 메서드로 전송!)
app.post('/register', async (req, res) => {
  const { userName, password } = req.body;
  const dbID = await userModel.findOne({ userName }); 

  // 중복된 아이디가 아니라면 계정 생성
  if (!dbID.length) {
    const hash = await bcrypt.hash(password, 12); // bcrypt 모듈로 암호 해시

    // mongodb 도큐먼트 생성 및 저장
    const newUser = new userModel({
      userName,
      hashedPassword: hash
    })
    await newUser.save();

    // 플래시 메시지
    req.session.success = '회원가입 성공';
    res.redirect('login');
  } else {
    req.session.duplicate = '중복된 아이디 입니다.'; 
    res.redirect('register');
  }
});
```
## 로그인
```
// 사용자 로그인
app.post('/login', async (req, res) => {
  const { id, password } = req.body;
  const user = await userModel.findOne({ userName: id });

  // compare() 메서드로 암호 대조
  const validPassword = await bcrypt.compare(password, user.hashedPassword);

  // 입력 비밀번호가 DB 값과 일치한다면
  if (validPassword) {
    res.send('로그인 성공!!!!!');
  } else {
    res.send('로그인 실패');
  }
});
```
<!-- bcrypt로 암호화한 비밀번호를 compare() 메서드로 확인한다... -->

# 세션으로 로그인 상태 유지하기

세션을 이용해 로그인 상태를 유지하고, 로그인 해야 볼 수 있는 페이지에 대한 접근 권한을 부여해볼 것.

첫 번째는 특정 페이지에 접근 시 사용자의 로그인 여부를 확인해야 하는데 이 때 세션을 사용한다.

```
// 사용자 로그인
app.post('/login', async (req, res) => {
  const { id, password } = req.body;
  const user = await userModel.findOne({ userName: id });
  const validPassword = await bcrypt.compare(password, user.hashedPassword);

  // 입력 비밀번호가 DB 값과 일치한다면
  if (validPassword) {
    // 사용자의 세션(req.session)에 DB의 사용자 정보 도큐먼트 _id 저장(로그인 확인을 위한 값)
    req.session.user_id = user._id;
    res.send('로그인 성공!!!!!');
  } else {
    res.send('로그인 실패');
  }
});

// 비로그인은 볼 수 없는 페이지
app.get('/secret', (req, res) => {

  // 세션 값으로 로그인 여부를 확인한다
  if (!req.session.user_id) {
    req.session.login = '로그인 해주세요.'
    res.redirect('login');
  } else {
    res.send('환영합니다.');
  }
});
```

위 예시는 간단한 데모이다. 로그인 성공 시 Mongodb의 해당 사용자 `_id`값을 `req.session.user_id`에 저장하고, 로그아웃 전까지 유지한다. 로그인이 필요한 페이지에서 `req.session.user_id`를 검사하는 것으로 로그인 여부를 확인하고 페이지에 접근을 제어할 수 있게 되었다.


## 로그아웃

로그아웃은 단순하다. 앞서 저장한 세션에 `user_id` 값을 삭제해주면 된다.

```
// 로그아웃(GET 메서드만 아니면 됨)
app.post('/logout', (req, res) => {
  if (req.session.user_id) {
    delete req.session.user_id; // or req.session.user_id = null;
    req.session.logout = '로그아웃 성공'; // 플래시 메시지
  } else {
    req.session.logout = '로그인 되어있지 않습니다.';
  }
  res.redirect('login');
});
```

위와 같이 `null`을 할당하거나, `delete` 로 값을 삭제해줄 수도 있고, 삭제해야될 사용자 정보가 많은 경우 `express-session`의 `req.session.destroy(callback)` 메서드로 세션 전체를 파기하는 방법을 사용하는 경우도 있다.

## 로그인 미들웨어

사용자의 로그인 여부를 확인해야 하는 경우가 여럿 있을 수 있다. 이런 경우 로그인 확인 미들웨어를 따로 작성하는 것으로 로그인이 필요한 페이지마다 재사용할 수 있다(자주 사용하는 패턴).

로그인 확인 미들웨어는 간단하다. 위의 라우트 핸들러에 작성한 코드를 모듈로 분리하기만 하면 된다. 만약 로그인이 안되어있다면 플래시 메시지와 함께 로그인 페이지로 리디렉션하고, 로그인 되어있는 경우 `next()`를 호출하여 다음 미들웨어에 제어권을 넘기는 구조이다.

```
// ./utils/loginCheck.js
const loginCheck = (req, res, next) => {
  if (!req.session.user_id) {
    req.session.login = '로그인 해주세요.'
    res.redirect('login');
  } else {
    next();
  }
};

module.exports = loginCheck;
---------------------------------
// const loginCheck = require('./utils/loginCheck.js');

// 비로그인은 볼 수 없는 페이지
app.get('/secret', loginCheck, (req, res) => {
  res.send('환영합니다.');
});
```


## mongoose Model 정적(static) 메서드, 미들웨어(middleware)로 리팩토링

로그인과 사용자 등록 일부 로직을 mongoose **Model 정적 메서드, 미들웨어**를 사용하여 리펙토링 해본다.

먼저 로그인 코드의 암호 대조 부분을 **정적 메서드**로 작성하여 코드를 간소화 해보았다.
```
// 기존 코드
app.post('/login', async (req, res) => {
  const { id, password } = req.body;
  const user = await userModel.findOne({ userName: id });
  const validPassword = await bcrypt.compare(password, user.hashedPassword);
  if (validPassword) {
    // 로그인 유지를 위해 해당 사용자의 세션(req.session)에 _id(db에 저장된 값) 저장
    req.session.user_id = user._id;
    res.send('로그인 성공!!!!!');
  } else {
    res.send('로그인 실패');
  }
});
---------------------------------------
// userSchema 스키마에 정적 메서드 추가
userSchema.statics.validation = async function (userName, password) {
  const user = await this.findOne({ userName });
  const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
  return isValidPassword ? user : false;
}

module.exports = mongoose.model('User', userSchema);
----------------------------------------
// 리팩토링 후 코드
// 모듈 로드
const userModel = require('./model/user.js');

// 사용자 로그인
app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  // Model 정적 메서드로 암호 대조
  const foundUser = await userModel.validation(id, password);

  // 입력 비밀번호가 DB 값과 일치한다면
  if (foundUser) {
    // 사용자의 세션(req.session)에 DB의 사용자 정보 도큐먼트 _id 저장(로그인 확인을 위한 값)
    req.session.user_id = foundUser._id;
    res.send('로그인 성공!!!!!');
  } else {
    res.send('로그인 실패');
  }
});
```

mongoose 스키마 객체의 statics 프로퍼티에 정적 메서드를 정의하여 코드를 좀 더 간결하게 축소하였다.

다음은 **mongoose 미들웨어**를 통해 사용자 등록시 입력한 비밀번호를 자동으로 암호화 해시하는 코드를 작성해본다. 

```
// 기존 사용자 등록 라우트 핸들러
app.post('/register', async (req, res) => {
  const { id, password } = req.body;
  const dbID = await userModel.findOne({ userName: id }); 

  // 중복된 아이디가 아니라면 계정 생성
  if (!dbID) {
    const hash = await bcrypt.hash(password, 12); // bcrypt 모듈로 암호 해시

    // mongodb 도큐먼트 생성 및 저장
    const newUser = new userModel({ userName: id, password });
    await newUser.save();

    req.session.success = '회원가입 성공'; // 플래시 메시지
    req.session.user_id = newUser._id; // 가입 성공시 따로 로그인 없이 자동 로그인 유지를 위해 사용자의 세션에 _id 저장 후 리디렉션
    res.redirect('login');
  } else {
    req.session.duplicate = '중복된 아이디 입니다.'; 
    res.redirect('register');
  }
});
-----------------------------
// userSchema 스키마에 암호 해시 document 미들웨어 추가
userSchema.pre('save', async function (next) {

  // document.prototype.isModified() -> 도큐먼트의 특정 필드가 변경되었을 경우(인수로 전달한 값) return true
  // 비밀번호가 아닌 값을 변경하고 save()하는 경우 불필요하게 암호가 또 해시되는 것을 방지하기 위함
  if (!this.isModified('password')) return next(); // return next()로 다음 메서드로 제어권 넘기고 코드 종료
  
  this.password = await bcrypt.hash(this.password, 12); // document 미들웨어의 this는 미들웨어를 트리거하는 메서드(여기선 save())를 호출한 도큐먼트가 할당된다
  next(); // 다음 pre 미들웨어가 있다면 제어권 넘김. 없다면 save() 메서드 호출   
});
-----------------------------
// 사용자 등록 
app.post('/register', async (req, res) => {
  const { id, password } = req.body;
  const dbID = await userModel.findOne({ userName: id }); 

  // 중복된 아이디가 아니라면 계정 생성
  if (!dbID) {
    const newUser = new userModel({ userName: id, password }); // mongodb 도큐먼트 생성
    await newUser.save(); // 저장 시 자동으로 암호 해시

    req.session.success = '회원가입 성공'; // 플래시 메시지
    req.session.user_id = newUser._id; // 가입 성공시 따로 로그인 없이 자동 로그인 유지를 위해 사용자의 세션에 _id 저장 후 리디렉션
    res.redirect('login');
  } else {
    req.session.duplicate = '중복된 아이디 입니다.'; 
    res.redirect('register');
  }
});
```
