# 인증(Authentication) vs 권한 부여(Authorization) (上)

**인증(Authentication)**이란 특정 사용자가 누구인지 확인하거나, 사용자가 본인이 맞는지 확인하는 과정을 말한다. 보통 웹에서는 아이디와 암호를 이용해 확인하는데 이외에도 얼굴인식, 지문인식, OTP 등 여러 가지 보안 질문을 통해서 이뤄지기도 한다.

인증과 혼동되기도 하는 **권한 부여(Authorization)**는 말 그대로 특정 사용자가 할 수 있는 행동을 지정하는 것(권한을 부여하는 것)을 말한다. -> 접근 가능한 대상이나 편집, 삭제가 가능한 대상 등 웹 사이트에서 접근(acess)할 수 있는 대상을 지정하는 것.

보통 권한 부여는 사용자 인증 후 일어나게 된다.


https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization

https://www.okta.com/kr/identity-101/authentication-vs-authorization/
 
# 비밀번호를 저장하지 않는 법 (上)

사용자 인증을 위한 사용자 정보를 저장할 때, 사용자의 비밀번호를 절대 있는 그대로 저장해선 안된다. 이유는 단순히 누군가 DB에 접근했을 경우 비밀번호가 그대로 노출되기 때문.

따라서 비밀번호를 저장할 때 암호화가 필수적인데 **해시 함수**를 사용해 암호화를 해볼 것이다.

<!-- 자격 증명(credential)? -->

# 암호화된 해시 함수(cryptographic hash function) (中)

**해시 함수**란 임의의 크기 입력 값을 고정된 크기 값으로 변환해주는 함수를 말한다.

**암호화된 해시 함수(cryptographic hash function**는 해시 값과 원래 입력값의 관계를 찾기 어려운 성질을 갖는 해시 함수를 말한다.

암호화 데모에서 사용해 볼 암호화 해시 함수의 특성은 **단방향 함수(one-way function)** 라는 것. 즉 해시 값을 입력 값으로 복호화 하는 것이 불가능하다.


http://cryptostudy.xyz/crypto/article/5-%EC%95%94%ED%98%B8%ED%95%99%EC%A0%81-%ED%95%B4%EC%8B%9C%ED%95%A8%EC%88%98

https://ko.wikipedia.org/wiki/%EC%95%94%ED%98%B8%ED%99%94_%ED%95%B4%EC%8B%9C_%ED%95%A8%EC%88%98

# Bcrypt? (上)

# Password Salt (中)

# Express Auth 구현해보기 (中)