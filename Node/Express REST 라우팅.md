# 목차
- [HTTP 요청 메서드 GET vs POST](#http-요청-메서드-get-vs-post)
  - [GET](#get)
  - [POST](#post)
  - [PUT, PATCH](#put-patch)
- [POST 요청 다루기](#post-요청-다루기)
  - [Express 내장 미들웨어로 요청(request) body 파싱하기](#express-내장-미들웨어로-요청request-body-파싱하기)
    - [`express.json([options])`](#expressjsonoptions)
    - [`express.urlencoded([options])`](#expressurlencodedoptions)
  - [HTTP GET 요청에서 Content-Type](#http-get-요청에서-content-type)
- [REST API](#rest-api)
- [요청 리디렉션(방향 수정)](#요청-리디렉션방향-수정)
  - [uuid 패키지](#uuid-패키지)
- [HTML 폼으로 GET, POST 외 요청 메서드 구현하기(method-override)](#html-폼으로-get-post-외-요청-메서드-구현하기method-override)
  - [methodOverride(getter, [options])](#methodoverridegetter-options)
    - [`getter`에 함수를 전달한 경우](#getter에-함수를-전달한-경우)
    - [`getter`에 문자열을 전달한 경우](#getter에-문자열을-전달한-경우)
  - [쿼리 문자열 값을 이용한 요청 메서드 재정의](#쿼리-문자열-값을-이용한-요청-메서드-재정의)
  - [HTTP 헤더를 이용한 요청 메서드 재정의](#http-헤더를-이용한-요청-메서드-재정의)
  
# HTTP 요청 메서드 GET vs POST

## GET

- 데이터를 요청할 때 전송할 데이터를 URL 쿼리 스트링에 포함시켜 데이터를 전달 한다(body에 담을 수 있긴 함).
- 전송되는 데이터가 URL에 드러나기 때문에 보안 문제가 생길 수 있다.
- GET 요청으로 서버는 요청을 수신할 수만 있고, 상태를 변경할 수 없다. 주로 읽기, 검색같은 상태 변경 없이 데이터 요청하는 경우 사용.
- 요청을 북마크에 저장할 수 있고 URL로 전달하기 때문에 데이터 길이에 제한이 있다.
<!-- - (2048자). -->
- 요청 내용이 브라우저 히스토리에 저장된다.
- 요청 내용이 브라우저 캐시에 저장된다.

## POST

- POST 요청 시 데이터를 HTTP body에 저장해 전달하기 때문에 요청시 전송하는 데이터 크기나 유형에 좀 더 유연하다(보통 HTML 폼을 통해 서버에 전송한다).
- 또한 데이터가 URL에 노출되지 않기 때문에 GET보다 보안에 유리하다.
<!-- 회원가입, 로그인, 댓글 등 개인정보 필요한 경우 사용하는 듯). -->
- 서버에 리소스/데이터를 생성하거나 업데이트하는데 사용한다(주로 Create).
- 요청 내용이 브라우저 히스토리에 저장되지 않는다.
- 요청 내용이 브라우저 캐시에 저장되지 않는다.

<!-- PUT, PTACH, DELETE... -->

## PUT, PATCH

보통 PUT은 데이터 전체를 업데이트(새 버전으로), PATCH는 부분적으로 업데이트(수정, 추가)할 때 사용한다.

**[PUT, PATCH 차이]**

https://www.geeksforgeeks.org/difference-between-put-and-patch-request/

<!-- POST는 -->

**[GET POST 차이]**

https://www.geeksforgeeks.org/difference-between-http-get-and-post-methods/ <BR>

https://velog.io/@songyouhyun/Get%EA%B3%BC-Post%EC%9D%98-%EC%B0%A8%EC%9D%B4%EB%A5%BC-%EC%95%84%EC%8B%9C%EB%82%98%EC%9A%94

**[http 요청 메서드]**

http://www.ktword.co.kr/test/view/view.php?no=3791 <BR>
https://developer.mozilla.org/ko/docs/Web/HTTP/Methods

# POST 요청 다루기

## Express 내장 미들웨어로 요청(request) body 파싱하기

요청 데이터가 Body에 담겨 오는 메서드(POST, PUT...)들은 `req.body` 프로퍼티에 요청 데이터를 담을 수 있다.

`req.body` 기본 값은 `undefined`이다. 아래와 같이 Express 내장 미들웨어로 요청 데이터 파싱 설정을 해줘야 HTTP 요청 메시지 body의 데이터가 `req.body`에 채워져서 사용할 수 있게 된다.

```
// app.use() -> 모든 요청에 대해 미들웨어 함수 실행
app.use(express.json()) // request body에서 json 데이터를 파싱
app.use(express.urlencoded({ extended: true })) // request body에서 암호화된 폼 데이터를 파싱 (x-www-form-urlencoded 데이터)
```

### `express.json([options])`

- `json` 형태로 전송되는 요청 데이터(json 페이로드)를 파싱하는 Express 내장 미들웨어.

### `express.urlencoded([options])`

- `Contetn-Type`이 `application/x-www-form-urlencoded` 인 요청 데이터를 파싱하는 Express 내장 미들웨어.
  여기서 `x-www-form-urlencoded`는 HTML 폼으로 전송되는 요청 데이터의 기본 `Content-Type`으로 암호화된 HTML 폼 데이터를 말한다.

<!-- html폼으로 전송되는 요청 데이터 기본 Content Type이 x-www-form-urlencoded 인듯 -->

- `express.urlencoded({ extended: true })`의 `extended` 옵션은 `x-www-form-urlencoded` 타입의 데이터를 파싱하는 라이브러리를 지정하는 옵션이다. `true`일 경우, `qs` 라이브러리로 파싱을, `false`인 경우 `querystring` 라이브러리로 파싱하겠다는 의미이다.
- 쉽게 말하면 `qs`(true)로 설정한 경우 객체 형태로 전달된 데이터 내에서 중첩 객체를 허용한다는 말이며, `querystring`(false)인 경우에는 허용하지 않는다는 의미이다.

파싱은 Node.js의 `body-parser` 모듈을 기반으로 수행된다.

**[q 라이브러리 vs querystring 라이브러리 파싱 데이터 차이]**

https://intrepidgeeks.com/tutorial/qs-library-vs-querystring-library

<BR>

## HTTP GET 요청에서 Content-Type

HTTP GET 메서드는 데이터가 쿼리 스트링으로 보내지기 때문에 Content-Type이 존재하지 않는다(실제로 확인해보니 GET 요청 헤더에는 Content-Type이 없었다).

HTTP 메소드에 POST, PUT처럼 request body에 data를 보낼때 Content-Type이 필요하다.

axios를 사용해 클라이언트가 서버에서 API요청 시 Content-Type를 application/json으로 지정한다.

<!-- express.json(), express.urlencoded()에 대하여 -->

<br>

**[MDN HTTP]**

https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/GET

**[페이로드란]**

https://ko.wikipedia.org/wiki/%ED%8E%98%EC%9D%B4%EB%A1%9C%EB%93%9C_(%EC%BB%B4%ED%93%A8%ED%8C%85)

# REST API

REST는 HTTP를 기반으로 서버/클라이언트가 통신하기 위한 아키텍처이고, REST 아키텍처의 스타일을 준수한 애플리케이션의 API를 REST API라고 한다.

아래는 RESTful API의 한 예로 기본적인 CRUD를 위한 API이다.

```
// REST API 형식
GET /comments - 모든 comment 가져오기
POST /comments - 새 comment 생성
GET /comments/:id - id와 일치하는 comment 가져오기
PATCH /comments/:id - 특정 comment 업데이트
DELETE /comments/:id - 특정 comment 삭제
```

REST api의 기본적인 원칙 두 가지는 URI는 리소스를 표현하는 데 집중하고, 리소스에 대한 행위는 요청 메서드로 표현하는 것이다.

<!-- rest 이전에는 soap  -->

<BR>

**[REST 아키텍처에 대하여]** <BR>

https://www.codecademy.com/article/what-is-rest <BR>
https://aws.amazon.com/ko/what-is/restful-api/ <BR>
https://www.ibm.com/cloud/learn/rest-apis <BR>
https://blog.postman.com/rest-api-examples/ <BR>

**[그런 REST API로 괜찮은가]**

https://www.youtube.com/watch?v=RP_f5dMoHFc&ab_channel=naverd2

**[REST 참고자료 +a]**

https://gmlwjd9405.github.io/2018/09/21/rest-and-restful.html

# 요청 리디렉션(방향 수정)

POST로 데이터를 추가한 후 `res.send()`로 응답을 하는 경우 응답 페이지가 새롭게 출력돼도 URL은 그대로 머물게 된다. 이 상태에서 새로고침을 하면, '양식 다시 제출 확인' 팝업창이 뜨고 확인을 누를 시 동일한 데이터로 또 다시 POST 요청이 발생하게 된다.

이런 경우 불필요하게 같은 데이터가 계속 추가될 수 있으므로 다른 페이지로 리디렉션이 필요하다(DELETE, UPDATE도 마찬가지).

`res.redirect(status, path)`을 사용해 지정한 URL로 상태코드와 함께 리디렉션한다. 즉 해당 URL로 GET 요청을 전송한다.

리디렉션의 경로는 호스트 이름의 루트를 기준으로 설정할 수 있다.

```
// 댓글 작성 라우트
app.post('/comments', (req, res) => {
  const { username, comment } = req.body;
  comments.push({ username, comment });
  // 요청 리디렉션 -> /comments로 GET 요청
  res.redirect('/comments');
});
```

상태코드를 따로 주지 않을 경우 기본값은 `"302 Found"` 이다.

<BR>

**[요청 리디렉션 res.redirect()]**

https://kirkim.github.io/javascript/2021/09/21/redirect.html<BR>

https://www.geeksforgeeks.org/express-js-res-redirect-function/

## uuid 패키지

무작위 UUID(universally unique identifier)를 생성해주는 npm 모듈.

댓글 작성 라우트에서 댓글 고유의 id를 생성하기 위해 사용해주었다.

**[npm uuid]**

https://www.npmjs.com/package/uuid <br>

**[uuid란?]**

https://ko.wikipedia.org/wiki/%EB%B2%94%EC%9A%A9_%EA%B3%A0%EC%9C%A0_%EC%8B%9D%EB%B3%84%EC%9E%90

# HTML 폼으로 GET, POST 외 요청 메서드 구현하기(method-override)

HTML 폼은 지정한 URL로 `GET`, `POST`요청만 수행할 수 있는데, npm에 있는 `method-override` 모듈을 사용하면 `PUT`, `PATCH`, `DELETE`와 같은 클라이언트에서 지원하지 않는 요청 메서드를 사용할 수 있다(이러한 방법 외에도 클릭 이벤트 리스너에 fetch API, axios와 같은 클라이언트 측 자바스크립트를 통해 요청하는 방법도 있다.).

`method-override` 모듈에는 HTTP 헤더를 이용한 재정의(override)가 있고, 쿼리 값을 이용한 재정의가 있는데 나는 쿼리 값을 사용해볼 것!

## methodOverride(getter, [options])

요청 메서드를 재정의하기 위한 미들웨어 함수로 인수로는 함수, 문자열을 전달할 수 있다.

- `getter` - 어떤 요청에 대해 재정의된 요청 메서드를 조회하는 데 사용하기 위한 말그대로 일종의 getter이며 기본 값은 `'X-HTTP-Method-Override'`이다.

<!-- + options.methods- 메서드 재정의 하고자 하는 요청이 가져야 할 기본 메서드를 설정한다(기본값: ['POST']).  -->

### `getter`에 함수를 전달한 경우

인수에 함수를 전달하여 사용자 정의 로직을 만들 수 있다. 자세한 것은 공식 문서 참조.

### `getter`에 문자열을 전달한 경우

- `getter` 값이 문자열이며 `'X-'`로 시작할 경우 헤더 이름으로 취급되고 해당 헤더는 요청 메서드 재정의에 사용된다.
- 그 외 다른 모든 문자열은 URL 쿼리 문자열 키로 취급된다.

## 쿼리 문자열 값을 이용한 요청 메서드 재정의

쿼리 문자열을 사용해 메서드를 재정의(override)하려면 사용하고자 하는 쿼리 문자열 키를 `methodOverride(getter, [option])` 함수의 첫 번째 인수로 전달한다.

```
var express = require('express')
var methodOverride = require('method-override')
var app = express()

// URL에 ?_method=METHOD 쿼리 문자열을 포함한 POST 요청을 재정의 하기 위함.
// 이름은 자유지만 일반적으로 _method라 명명하여 사용함.
app.use(methodOverride('_method'))
```

그 후 원하는 경로에 대한 요청을 `POST` 메서드의 HTML 폼 `action` URL에 지정한 쿼리 문자열 키와 요청 메서드를 값으로 전달하여 재정의 한다.

```
// /resource 경로에 대한 POST 요청이지만 DELETE로 재정의 되었다.
<form method="post" action="/resource?_method=DELETE">
  <button type="submit">Delete resource</button>
</form>
```

## HTTP 헤더를 이용한 요청 메서드 재정의

HTTP 헤더를 이용한 재정의는 사용할 헤더 이름을 `methodOverride(getter, [option])` 함수의 첫 번째 인수 값을 `'X-...'` 형태로 지정하여 해당 헤더를 메서드를 재정의하는 데 사용한다.

```
var express = require('express')
var methodOverride = require('method-override')
var app = express()

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))
```

그 후 다음과 같이 지정한 헤더 이름으로 메서드를 재정의한다.

```
var xhr = new XMLHttpRequest()
xhr.onload = onload
xhr.open('post', '/resource', true)
xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE')
xhr.send()

function onload () {
  alert('got response: ' + this.responseText)
}
```

**[method-override 패키지]**

http://expressjs.com/en/resources/middleware/method-override.html

<!-- 슬러그?중첩라우트? -->

<!-- 폼(form)과 Express
-Express 앱에 데이터를 전송하고 파싱해서 사용하기


 -->
