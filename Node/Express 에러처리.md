# Express 에러 처리

Express에서 에러 처리란 동기, 비동기로 동작하는 코드에서 발생하는 에러를 처리하는 것을 말한다.

Express 기본 에러 핸들러가 내장되어 있고 필요에 따라 사용자 정의 에러 핸들러를 작성할 수도 있다.

# 에러 캐치하기

## 동기(synchronous) 코드

라우트 핸들러나 미들웨어 안에서 동기적으로 작동되는 코드에서 발생한 에러는 따로 조취를 취하지 않아도 Express가 알아서 catch하고 처리한다(잘못된 코드 문법으로 인한 에러, 직접 Throw한 에러 혹은 `'route'`가 아닌 인수로 `next()` 호출).

```
// 에러 Throw한 경우
app.get('/error', (req, res) => {
  throw new Error('throwed error')
});

>> Error: throwed error
    // 스택 추적(stack trace)
    at C:\Users\Administrator\Desktop\morgan\index.js:37:9
    at Layer.handle [as handle_request] (C:\Users\Administrator\Desktop\morgan\node_modules\express\lib\router\layer.js:95:5)
      .
      .
      .

// 선언되지 않은 객체 참조
app.get('/error', (req, res) => {
  chicken.fly();
});

>> ReferenceError: chicken is not defined
    at C:\Users\Administrator\Desktop\morgan\index.js:37:3
    at Layer.handle [as handle_request]
      .
      .
      .
```

## 비동기(synchronous) 코드

라우트 핸들러, 미들웨어 안에서 비동기적으로 동작하는 함수에서 발생하는 에러는 반드시 해당 에러 객체를 `next()`메서드 인수로 전달하여 호출해줘야 한다(안그러면 에러 핸들러가 catch하지 못함).

```
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      next(err) // Express에게 에러 객체 전달
    } else {
      res.send(data)
    }
  })
})

// 혹은 다음과 같이 return next(err)로 next() 메서드 이후 코드가 실행되지 않게 해준다. 
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      return next(err) // Express에게 에러 객체 전달
    } 
    res.send(data)
  })
})
```

### +

만약 `next()` 메서드를 `'route'`를 제외한 어떤 값이든 인수로 전달하여 호출한다면 Express는 해당 요청을 에러로 간주하고 남은 에러 처리 미들웨어가 아닌 모든 라우터, 미들웨어를 건너뛴다.

```
app.get('/error', (req, res, next) => {
  next('에러!')               // next()에 'route'가 아닌 값을 전달하여 호출한 경우 에러로 간주
}, (req, res, next) => {      // 에러 처리가 아닌 미들웨어는 skip된다.
  res.send('2번째 미들웨어')
});

app.use((err, req, res, next) => {  // 다음 에러 처리 미들웨어에 에러 내용이 전달된다.
  res.send(err + '입니다.')
});

클라이언트 출력 >> 에러!입니다.
```

`next('route')`와 같이 `'route'`를 전달하여 호출하는 경우 라우터에 연결된 나머지 미들웨어를 건너뛴다.

```
router.get('/', (req, res, next) => {
  next('route');
}, (req, res, next) => {
  console.log('실행되지 않습니다');
  next();
}, (req, res, next) => {
  console.log('실행되지 않습니다');
  next();
});

router.get('/', function(req, res) {
  console.log('실행됩니다');
  res.render('index', { title:'Express' });
});
```

### [Error Handling in Express]

https://www.geeksforgeeks.org/error-handling-in-express/?ref=lbp

### [Express 공식 문서 Error Handling]

http://expressjs.com/en/guide/error-handling.html

# Express 내장 에러 핸들러(기본 에러 핸들러)

<!-- 에러 처리 내용 전반적으로 헷갈림 -->

Express는 앱에서 발생하는 에러를 처리하는 내장 에러 핸들러를 기본적으로 제공한다. 따라서 사용자가 따로 에러 처리를 정의하지 않아도 기본 에러 핸들러가 라우트 핸들러나 다른 미들웨어에서 발생한 모든 오류를 처리한다(기본적으로 상태 코드 500으로 클라이언트에 응답).

`next()` 함수에 에러를 전달한 후 따로 사용자 정의 에러 핸들러로 처리하지 않았다면 자동으로 내장 에러 핸들러로 처리되며 스택 추적 내용과 함께 클라이언트측에 에러가 전달된다. 프로덕션 환경(배포 환경)에서는 스택 추적이 포함되지 않는다.

```
스택 추적(stack trace) - 예외가 발생한 시점의 메서드 호출 목록(호출 스택)을 보여주는 것.
프로덕션 환경(production environment) - 완성된 소프트웨어가 배포되고 실행되는 컴퓨터 환경. 배포 환경이라고도 한다.
```

에러가 기록되면 응답에 다음과 같은 정보들이 응답에 추가된다.

- 에러 객체의 `err.status`혹은 `err.statusCode` 값이 `res.statusCode`에 저장된다. 상태 코드 값이 4xx나 5xx 범위를 벗어나면 500으로 저장된다.
- 상태 코드에 따라 `res.statusMessage` 값이 저장된다.
- 프로덕션 환경에 있을 때 응답 body는 HTML 형태의 상태 코드 메시지이며 프로덕션 환경이 아닌 경우는 `err.stack`이다.
- 모든 응답 헤더는 `err.hearders` 객체로 지정된다.

**기본 에러 미들웨어는 미들웨어 함수 스택의 맨 마지막에 추가된다.**

# 사용자 정의 에러 핸들러

Express에서 사용자가 직접 에러 처리 미들웨어 함수를 정의할 수 있다.

에러 처리 미들웨어를 정의한 경우 앱에서 발생하는 에러는 내장 에러 처리 핸들러가 아닌 정의한 에러 처리 미들웨어가 캐치한다.

사용자 정의 에러 핸들러는 다른 미들웨어와 동일한 형식에 **`err`를 포함한 4개의 인수**를 전달 받는다.

```
// 4개의 인수를 받아야 에러 처리 미들웨어로 인식된다.
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

**사용자 정의 에러 핸들러 미들웨어는 다음과 같이 다른 모든 라우터나 `app.use()` 호출 이후에 정의 한다**(그래야 모든 미들웨어에서 발생한 에러를 캐치하기 때문).

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
// 마지막에 정의
app.use((err, req, res, next) => {
  // logic
})
```

사용자 정의 에러 핸들러에서 `next(err)`로 다음 에러 핸들러에 에러를 전달하지 않은 경우 에러에 대한 응답을 해줘야 한다. 그렇지 않으면 다른 미들웨어와 마찬가지로 요청이 중단되고 가비지 컬렉션의 대상이 되지 않으며 내장 에러 처리 미들웨어로도 처리되지 않는다.

사용자 에러 핸들러를 정의했더라도 `next(err)`를 거듭하여 호출해 주면 내장 에러 핸들러로 처리하게 할 수 있다.

# 사용자 정의 에러 클래스

Express에서 자주 쓰이는 에러를 처리하는 패턴. DB와 상호작용, 사용자 인증 등과 같이 다양한 에러 상황에 응답하기 위해 하나의 사용자 정의 에러 클래스를 만들어 에러 객체로 사용한다.

```
// js 내장 Error 클래스를 확장한 사용자 정의 에러 클래스 AppError.js
class AppError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}
module.exports = AppError;
```

위와 같이 사용자 정의 에러 클래스를 하나의 파일로 생성한다.

```
// index.js
const AppError = require('const AppError = require('./AppError');')

// 간이 패스워드 인증 미들웨어
const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === 'chickennugget') {
    next();
  } else {
    throw new AppError('Password Required', 401);
  }
};

// 라우터
app.get('/secret', verifyPassword, (req, res) => {
  res.send('MY SECRET IS: Sometimes I wear headphones in public so I dont have to talk to anyone');
});

GET /secret 요청 결과
>>Error: Password Required
    at verifyPassword (C:\Users\Administrator\Desktop\morgan\index.js:14:9)
    at Layer.handle [as handle_request] (C:\Users\Administrator\Desktop\morgan\node_modules\express\lib\router\layer.js:95:5)
     .
     .
```

쿼리 스트링에 패스워드 전달없이 /secret 으로 GET 요청한 결과 정의한 에러 클래스의 `message`가 브라우저 화면에 출력되고, 개발자 도구 console에는 에러 인스턴스의 `status` 프로퍼티 값 `401`이 에러코드로 출력된다.

이렇게 출력되는 이유는 내장 에러 핸들러의 특징에 있다. Express 내장 에러 핸들러는 에러가 기록되면 에러 객체의 `err.status`혹은 `err.statusCode` 값을 응답 객체의 `res.statusCode`에 저장한다(4xx, 5xx 범위를 벗어난 값이면 500으로 설정).

즉, 위에서 Error 클래스를 상속받고 `status`, `message` 프로퍼티를 갖는 에러 클래스 객체를 생성해 throw 하였고, 내장 에러 핸들러가 그것을 캐치하여 프로퍼티 값들을 응답 상태코드, 메시지로 설정해 클라이언트에 응답한 것이다(참고로 자바스크립트 내장 Error 클래스는 `status` 프로퍼티를 갖고있지 않다).

다음과 같이 throw한 사용자 정의 에러 인스턴스를 사용자 정의 에러 핸들러에서 받아 처리할 수도 있다.

```
app.use((err, req, res, next) => {
  const { status = 500, messgae = 'Something Went Wrong'} = err;
  res.status(status).send(message);
});
```

에러 객체에 `err.headers` 사용자 정의 헤더를 추가하여 Express 에러 핸들러가 헤더로 응답하도록 할 수도 있다.

# 비동기 에러 처리를 위한 유틸리티 함수

Mongoose Model 객체의 쿼리 메서드는 비동기로 동작하는 경우가 많다. Express 라우트 핸들러 내에서 `Model.findById(id)`같은 비동기 함수를 호출하고 결과를 받아 처리하기 위해선 동기적으로 동작시킬 필요가 있는데, 이 때 `async/await`을 사용하며 다음과 같이 `try/catch`를 통해 에러를 처리해준다. 

```
app.get('/products/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);       // Mongoose 비동기 쿼리
    if (!product) {
      throw new AppError('Product Not Found', 404);   // 사용자 정의 에러 클래스
    }
  } catch (e) {
      next(e);
  }
})
```

위와 같이 모든 비동기 함수를 포함하는 라우트 핸들러에서 `try/catch`를 작성하는 것은 번거롭다. 이러한 문제를 해소하기 위해 비동기 콜백을 감싸는 함수를 만들어 사용할 수 있다.

```
// async 함수 내에서 에러 발생 시 try/catch 문을 사용해 에러 처리를 하지 않으면 async 함수는 발생한 에러를 값으로 갖는 rejected 프로미스 반환한다.
// async 라우트 핸들러를 호출하는 함수를 반환하는 래퍼함수를 사용하여 명시적으로 라우트 핸들러를 호출해준다.
// -> 명시적으로 호출을 해줘야 프로미스 후속 처리 메서드를 사용할 수 있기 때문에
const catchAsyncError = fn => {
  return function (req, res, next) {
      fn(req, res, next).catch(err => next(err));
  };
};

// try/catch 없이 에러를 체크할 수 있다.
app.get('/campgrounds/:id/edit', catchAsyncError(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));
```

참고로 현재 베타 버전인 Express5 에선 위와같이 처리해주지 않아도 프로미스를 반환하는 비동기 미들웨어, 라우트 핸들러에서 reject하거나 에러가 발생된 경우 자동으로 `next(value)`함수를 호출해 처리해준다. 

# Mongoose 에러 구분하기

모든 Mongoose 에러에는 name 프로퍼티가 있어서 ValidationError, CastError 등 다양한 이름을 갖고 있다. 따라서 다음과 같이 특정 Mongoose 에러를 선별하여 에러에 따른 로직을 만들 수도 있다.

```
const handleValidationErr = err => {
    console.dir(err);
    // 실제 앱에서는 훨씬 더 많은 작업을 수행한다..
    return new AppError(`Validation Failed...${err.message}`, 400);
};

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.log(err.name);
    // 특정 유형의 Mongoose 에러 선별
    if (err.name === 'ValidationError') err = handleValidationErr(err);
    next(err);
});

app.use((err, req, res, next) => {
    const { status = 500, message = '에러 발생' } = err;
    res.status(status).send(message);
});
```


# joi 모듈

데이터 스키마 유효성 검증을 위한 npm 모듈

