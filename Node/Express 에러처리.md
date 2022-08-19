# Express 내장 에러 핸들러

<!-- 에러 처리 내용 전반적으로 헷갈림 -->
Express는 앱에서 발생하는 에러를 처리하는 내장 에러 핸들러를 기본적으로 제공한다. 따라서 사용자가 따로 에러 처리를 정의하지 않아도 기본 에러 핸들러가 라우트 핸들러나 다른 미들웨어에서 발생한 모든 오류를 처리한다(기본적으로 상태 코드 500으로 클라이언트에 응답).

next() 함수에 에러를 전달한 후 사용자 정의 에러 핸들러로 처리하지 않으면 자동으로 내장 에러 핸들러로 처리된다.

기본 에러 미들웨어는 미들웨어 함수 스택의 맨 마지막에 추가된다.

# 사용자 정의 에러 핸들러

Express에서 사용자가 직접 에러 처리 미들웨어 함수를 정의할 수 있다. 다른 미들웨어와 동일한 형식에 `err`를 포함한 4개의 인수를 전달 받는다.

```
// 4개의 인수를 받아야 에러 처리 미들웨어로 인식된다.
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

에러 핸들러 미들웨어는 다음과 같이 다른 모든 라우터나 `app.use()` 호출 다음에 정의해야 한다.
```
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
 .
 .
 .
app.use((err, req, res, next) => {
  // logic
})
```

사용자 정의 에러 핸들러에서 `next()`를 호출하지 않는 경우 에러에 대한 응답을 해줘야 한다. 안그러면 다른 미들웨어와 마찬가지로 요청이 중단되고 가비지 컬렉션의 대상이 되지 않으며 내장 에러 처리 미들웨어로도 처리되지 않는다.

사용자 에러 핸들러 실행 후에 내장 에러 핸들러로 처리하고 싶으면 `next(err)`과 같이 메서드에 `err`를 전달해주면 된다.

# 사용자 정의 에러 클래스

Express에서 에러를 처리하는 패턴 중 하나. 다양한 에러 상황에 응답하기 위해 하나의 클래스로 만들어 사용.

# 몽구스 Errors

# 비동기 에러 처리하기