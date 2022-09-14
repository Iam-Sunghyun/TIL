# Express Router?

Express Router 객체를 통해 라우터를 분리하고 그룹화하여 앱 구조를 단순화하고 관리(및 확장)하기 쉽게 만들 수 있다(Express의 장점). 보통 별도의 파일에 관련된 라우터들을 정의하여 모듈로 사용하며 큰 규모의 앱이라면 흔히 사용한다.

## Router 객체 생성

`router` 객체는 미들웨어와 라우팅을 수행하는 '미니 앱'이라고도 불리는데 미들웨어처럼 `app.use()`의 인수로 전달하여 앱에 적용시키거나, 다른 라우터의 `use()` 메서드의 인수로 결합하여 사용할 수 있다. 

`Router`객체는 `express.Router()` Express 내장 메서드로 생성할 수 있다.

다음은 Router를 모듈로 작성하고 로드하여 라우터에 결합하는 사용 예시이다.

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
  .

module.exports = router;
-----------------------------------
// index.js
const shelterRoutes = require('./routes/shelters');

app.use('/shelters', shelterRoutes);
```

미들웨어를 적용시키듯이 `app.use()`를 사용하여 적용시켜 주었고, 첫 번째 인수로 라우트의 접두사를 지정한다. 즉, 위 예시의 경우 라우터 모듈의 라우트가 `'/shelters'`, `'/shelters/new'` 가 되는 것.

또한 예시처럼 라우터 모듈안에 미들웨어를 호출하여 특정 라우트에 대해서만 미들웨어를 적용시킬 수 있다.

### [Express Router]
https://expressjs.com/en/4x/api.html#router <br>
https://expressjs.com/en/guide/routing.html
<!-- 
# 쿠키(cookies)

# 서명된 쿠키(signed cookies)
# HMAC -->