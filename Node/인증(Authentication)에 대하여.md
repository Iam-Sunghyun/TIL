- [인증(Authentication) vs 권한 부여(Authorization) (上)](#인증authentication-vs-권한-부여authorization-上)
- [비밀번호 암호화 하는 법 (上)](#비밀번호-암호화-하는-법-上)
  - [암호화된 해시 함수(cryptographic hash function) (中)](#암호화된-해시-함수cryptographic-hash-function-中)
- [Password Salt (中)](#password-salt-中)
- [Bcrypt? (上)](#bcrypt-上)
  - [bcrypt 모듈로 비밀번호 해시하는 방법](#bcrypt-모듈로-비밀번호-해시하는-방법)
  - [bcrypt 모듈로 직접 비밀번호 해시해보기](#bcrypt-모듈로-직접-비밀번호-해시해보기)
    - [솔트 생성 및 확인](#솔트-생성-및-확인)
    - [암호 대조(확인)하기](#암호-대조확인하기)
- [Express Auth 구현해보기 (中)](#express-auth-구현해보기-中)

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

<!-- 자격 증명(credential)? -->

## 암호화된 해시 함수(cryptographic hash function) (中)

**해시 함수**란 임의의 크기 입력 값을 고정된 크기 값으로 변환해주는 함수를 말한다.

**암호화된 해시 함수(cryptographic hash function**는 해시 값과 원래 입력 값의 관계를 찾기 어려운 성질을 갖는 해시 함수를 말하는데 비밀번호 저장용 암호화 해시 함수가 가져야 할 특성은 다음과 같다.

1. **단방향 함수(one-way function)** 이어야 한다. <br> 즉, 해시 값을 입력 값으로 알아내는 것이 불가능해야 한다.
   
2. **입력 값에 작은 변화가 있을 때, 출력 값이 크게 변해야 한다(눈사태 효과)**. <br> 그렇지 않으면 여러 무작위 입력으로 결과를 대조하여 입력 값을 찾아낼 위험이 생기기 때문.  
   
3. **결정적이어야 한다**. <br> 즉, 동일한 입력에 대해 항상 동일한 출력을 반환해야 한다. -> 당연한 것이다. 그렇지 않다면 입력 값을 식별할 수 없을 것이다.
   
4. **충돌이 거의 없다시피 해야 한다**. <br> 그렇지 않고 서로 다른 비밀번호가 동일한 해시 값을 만들어 낸다면 큰 문제가 될 것.
   
5. 비밀번호 저장용 해시 함수는 **느려야 한다!** <br> 빠른 해시 함수를 사용하게 되면 오히려 빠른 속도로 수 천만, 수 십억의 암호로 해싱을 시도하여 입력 값을 맞춰 버리는 경우가 생길 수 있다(-> 브루트 포스, 완전 탐색, 무차별 대입 검색). 따라서 고의적으로 느린 해시 함수를 사용해 이러한 시도를 늦추는 것. 물론 비밀번호 저장용이 아닌 해시 함수는 빠른 것이 좋다. 한 예로 서명된 쿠키 예제에서 사용된 해시 함수는 SHA-256으로 매우 빠른 해시 함수다. 이러한 함수는 비밀번호 저장용으로는 적합하지 않다.



**[암호학적 해시 함수란]**

http://cryptostudy.xyz/crypto/article/5-%EC%95%94%ED%98%B8%ED%95%99%EC%A0%81-%ED%95%B4%EC%8B%9C%ED%95%A8%EC%88%98


**[위키피디아 암호화 해시 함수]**

https://ko.wikipedia.org/wiki/%EC%95%94%ED%98%B8%ED%99%94_%ED%95%B4%EC%8B%9C_%ED%95%A8%EC%88%98

# Password Salt (中)

패스워드 솔트란 암호를 해싱할 때 암호를 역설계 하거나 암호를 유추하는 것을 어렵게 하기 위한 방법이다.

그 전에 우선 비밀번호에 대하여 이해해야 하는 세 가지는 다음과 같다.

1. 대부분의 사람들은 여러 웹사이트에 같은 비밀번호를 사용한다.
2. 서로 다른 사람들의 비밀번호가 같은 경우가 많다.
3. 비밀번호를 저장할 때 사용되는 해시 알고리즘은 단 몇 개뿐이다(그 중 하나로 Bcrypt를 사용해볼 것). 

2번의 경우 발생하는 문제 -> 여러 사용자의 비밀번호가 동일한 해시 값을 만들어 낸다. 여러 사용자의 비밀번호 해시 값이 동일하다면 이것은 단순한 비밀번호일 가능성이 높은데 이것을 보고 비밀번호를 캐내려는 사람이 인터넷 상에서 쉽게 얻을 수 있는 자주 사용하는 비밀번호 값 목록을 입력해 봄으로서 우연히 비밀번호를 알아내 역방향 조회 테이블을 만들어 낸다면, 수 많은 동일한 비밀번호를 사용하는 사용자들의 계정 정보가 유출 될 수 있다(공격자가 해시 알고리즘이 뭔지 안다는 가정 하에).

이러한 경우를 방지하기 위한(역방향 조회 테이블을 만들 수 없게) 방법이 **Password Salt** 이다.

패스워드 솔트의 개념은 아주 간단하다. 암호를 해싱할 때 임의의 값(솔트)을 추가하여 해싱하는 것. 예를들어 비밀번호가 'password'라면 'passwordDog'처럼 'Dog'라는 솔트를 치는 것이다. 이렇게 하여 서로 다른 사용자가 동일한 비밀번호를 사용하는 경우에도 각자 다른 솔트를 사용해 데이터베이스에 다른 암호 해시 값을 저장할 수 있게 된다.

**Password salt**를 사용하려면 당연히 해시 값마다 사용 된 솔트를 알고 있어야 한다. 그래야 사용자가 비밀번호를 입력했을 때 솔트를 추가한 상태로 해싱하여 데이터베이스에 저장된 값과 대조해 볼 수 있기 때문.

**[위키피디아 암호화 해시 함수]**

https://en.wikipedia.org/wiki/Cryptographic_hash_function#SHA-3

**[위키피디앝 암호 솔트(salt)]**

https://ko.wikipedia.org/wiki/%EC%86%94%ED%8A%B8_(%EC%95%94%ED%98%B8%ED%95%99)

# Bcrypt? (上)

많이 사용되는 암호화 해시 함수 중 하나로 레인보우 테이블(해시함수(MD-5, SHA-1, SHA-2 등)를 사용하여 만들어낼 수 있는 값들을 대량으로 저장한 표) 공격 방지를 위해 솔트를 사용하는 해시 함수이다. 

npm에는 `bcrypt`와 `bcryptjs`가 있는데 node.js를 대상으로 만들어진 `bcrypt` 모듈을 사용해 볼 것이다(`bcrypt`는 c++로 구현되어 있어 속도가 더 빠르고 `bcyprtjs`는 브라우저에서도 실행 가능하다는 차이가 있다).


## bcrypt 모듈로 비밀번호 해시하는 방법

우선 `bcrypt` 모듈을 설치 해준다.

```
npm i bcrypt
```

`bcrypt`로 암호화하는 방법으로는 **비동기, 동기 방식 둘 다 가능한데 문서에서 추천하는 비동기 방식으로 암호화해 볼 것이다.**

`bcrypt` 모듈로 암호화하기 위해 암호 솔트(password salt)를 생성하는 **`genSalt()` 메서드**와 생성한 솔트와 비밀번호를 조합하여 해시 암호를 반환하는 **`hash()` 메서드**를 사용할 것이다.

다음은 npm `bcyprt` 문서에 나와있는 **콜백 함수를 사용한 비동기 방식 예시**이다.

```
const bcrypt = require('bcrypt');

// 솔트 생성 및 암호 해싱 과정
// Technique 1 (솔트 생성, 암호 해싱 과정을 별개의 분리 된 함수로 처리하는 방법):
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});

// Technique 2 (하나의 함수로 솔트 자동 생성 및 해싱하는 방법):
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
});

----------------------------------------------------
// 입력 비밀번호와 비밀번호 DB 해시 값 확인 과정
// 여기서 hash는 비밀번호 데이터베이스에서 가져온 해시 값.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});

bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
});

```

`genSalt()` 메서드의 첫 번째 인수(`saltRounds`)는 `Bcrypt`의 핵심 기능인 해시 함수의 난이도를 설정하기 위한 변수라고 보면 된다(12 언저리 값을 많이 사용한다고 함).

<!-- 난이도를 설정한다는 게 구체적으로 뭐지? -->

해시 난이도를 올리면 해싱에 소요되는 시간이 증가하고 낮을수록 빠른 속도로 처리되는데 해싱에 적절한 시간은 250 밀리초 정도이다.

다음은 **프로미스를 사용하여 비동기로 암호화한 예시**이다.

```
const bcrypt = require('bcrypt');

// 암호 해싱 과정
bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
    // Store hash in your password DB.
});
--------------------------------------------
// 암호 확인 과정
bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
    // result == true
});

bcrypt.compare(someOtherPlaintextPassword, hash).then(function(result) {
    // result == false
});
``` 

## bcrypt 모듈로 직접 비밀번호 해시해보기

### 솔트 생성 및 확인
```
// bcrypt의 비동기 메서드에 콜백 함수(솔트 생성 후 자동으로 실행 할)를 전달하지 않으면 프로미스를 반환한다. 따라서 async/await을 사용할 수 있다.
const hashPassword = async (pw) => {
    // saltRounds '10'으로 암호 솔트 생성
    const salt = await bcrypt.genSalt(10); 
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt);
    console.log(hash);
};

hashPassword();

>> $23en$wieNOIUnqwWEjeoI4ecjW9y.gTUqVU
   $23en$wieNOIUnqwWEjeoI4ecjW9y.gTUqVU.eewjie302Eewj0JRJFR94jn.wkej@38
```

위 예시에서 `bcrypt.genSalt(10)` 메서드에 `saltRounds` 값 10을 전달하여 무작위 솔트를 생성하였다. 여기서 `saltRounds` 값(10)이 생성된 솔트를 추가하여 입력 값을 Bcrypt로 암호화 할 때 몇 회 해시해야 하는지를 결정한다. 

따라서 `saltRounds` 값에 100을 넣는다 한들 솔트 생성 속도 차이는 달라지지 않는다. 다만 실제로 비밀번호에 솔트를 추가해 bcrypt로 해싱할 때 입력한 `saltRounds` 크기에 비례해 속도 차이가 발생한다.

<!-- 그렇다면 생성한 암호 해시를 저장했다면 입력 값과 어떻게 대조하는가 -->

### 암호 대조(확인)하기

**[npm bcrypt 모듈]**

https://www.npmjs.com/package/bcrypt

**[위키피디아 Bcrypt]**

https://en.wikipedia.org/wiki/Bcrypt

# Express Auth 구현해보기 (中)