# HTTP 요청 메서드 GET vs POST 

## GET

- 데이터를 요청할 때 전송할 데이터를 URL 쿼리 스트링에 포함시켜 데이터를 전달 한다.
  - postman으로 확인해보면 GET요청 메시지 body는 아예 활성화가 되지 않는다.
- 전송되는 데이터가 URL에 드러나기 때문에 보안 문제가 생길 수 있다.
- GET 요청으로 서버는 요청을 수신할 수만 있고, 상태를 변경할 수 없다. 주로 읽기, 검색같은 상태 변경 없이 데이터 요청하는 경우 사용.
- 요청을 북마크에 저장할 수 있고 URL로 전달하기 때문에 데이터 길이에 제한이 있다(2048자 인듯).
- 요청 내용이 브라우저 히스토리에 저장된다.
- 요청 내용이 브라우저 캐시에 저장된다.

## POST

- POST 요청 시 데이터를 HTTP body에 저장해 전달하기 때문에 요청시 전송하는 데이터 크기나 유형에 좀 더 유연하다(보통  HTML 폼을 통해 서버에 전송한다).
- 또한 데이터가 URL에 노출되지 않기 때문에 GET보다 보안에 유리하다.
<!-- 회원가입, 로그인, 댓글 등 개인정보 필요한 경우 사용하는 듯). -->
- 서버에 리소스/데이터를 생성하거나 업데이트하는데 사용한다.
- 요청 내용이 브라우저 히스토리에 저장되지 않는다.
- 요청 내용이 브라우저 캐시에 저장되지 않는다.

<!-- PUT, PTACH, DELETE... -->

<BR>

### [GET POST 차이]

https://www.geeksforgeeks.org/difference-between-http-get-and-post-methods/ <BR>

https://velog.io/@songyouhyun/Get%EA%B3%BC-Post%EC%9D%98-%EC%B0%A8%EC%9D%B4%EB%A5%BC-%EC%95%84%EC%8B%9C%EB%82%98%EC%9A%94

### [http 요청 메서드]

http://www.ktword.co.kr/test/view/view.php?no=3791
https://developer.mozilla.org/ko/docs/Web/HTTP/Methods

# POST 요청 다루기

## 요청(request) body 파싱하기

요청 데이터가 Body에 담겨 오는 메서드(POST, PUT...)들은 `req.body` 프로퍼티에 요청 데이터를 담을 수 있다. 

기본 값은 undefined이고 express 내장 미들웨어로 요청 데이터 구문 분석 방식을 설정해줘야 전달받은 데이터가 `req.body`에 채워져서 사용할 수 있게 된다.

<!-- 아니면 여러가지 형식으로 request.body를 전송할 수 있고??, -->

```
// app.use() -> 모든 요청에 대해 미들웨어 함수 실행
app.use(express.json()) // request body에서 json 데이터를 파싱
app.use(express.urlencoded({ extended: true })) // request body에서 암호화된 폼 데이터를 파싱 (x-www-form-urlencoded 데이터)
```

### `express.json()`

+ `json` 형태로 전송되는 요청 데이터(json 페이로드)를 파싱한다.

### `express.urlencoded({ extended: true })`

+ `Contetn-Type`이 `application/x-www-form-urlencoded` 인 요청 데이터를 파싱한다.
  여기서 `x-www-form-urlencoded`는 HTML 폼으로 전송되는 요청 데이터의 기본 `Content-Type`으로 암호화된 HTML 폼 데이터를 말한다.

<!-- html폼으로 전송되는 요청 데이터 기본 Content Type이 x-www-form-urlencoded 인듯 -->

+ `express.urlencoded()`의 `extended` 옵션은 `x-www-form-urlencoded` 타입의 데이터를 파싱하는 라이브러리를 지정하는 옵션이다. `true`일 경우, `qs` 라이브러리로 파싱을, `false`인 경우 `querystring` 라이브러리로 파싱하겠다는 의미이다. 
+ 쉽게 말하면 `qs`(true)로 설정한 경우 객체 형태로 전달된 데이터 내에서 중첩 객체를 허용한다는 말이며, `querystring`(false)인 경우에는 허용하지 않는다는 의미이다.

파싱은 body-parser을 기반으로 수행된다.

<BR>

### [q 라이브러리 vs querystring 라이브러리 파싱 데이터 차이]

https://intrepidgeeks.com/tutorial/qs-library-vs-querystring-library

## HTTP GET 요청에서 Content-Type

HTTP GET 메서드는 데이터가 쿼리 스트링으로 보내지기 때문에 Content-Type이 존재하지 않는다(실제로 확인해보니 GET 요청 헤더에는 Content-Type이 없었다).

HTTP 메소드에 POST, PUT처럼 request body에 data를 보낼때 Content-Type이 필요하다.

axios를 사용해 클라이언트가 서버에서 API요청 시 Content-Type를 application/json으로 지정한다.

<!-- express.json(), express.urlencoded()에 대하여 -->

<br>

### [MDN HTTP]
https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/GET


### [페이로드란]

https://ko.wikipedia.org/wiki/%ED%8E%98%EC%9D%B4%EB%A1%9C%EB%93%9C_(%EC%BB%B4%ED%93%A8%ED%8C%85)

# REST API

REST는 HTTP를 기반으로 서버/클라이언트가 통신하기 위한 아키텍처이고, REST 아키텍처의 스타일을 준수한 애플리케이션의 API를 REST API라고 한다.

아래는 RESTful API의 한 예로 기본적인 CRUD를 위한 API이다.

### ex)
```
GET /comments - 모든 comment 가져오기
POST /comments - 새 comment 생성
GET /comments/:id - id와 일치하는 comment 가져오기
PATCH /comments/:id - 특정 comment 업데이트
DELETE /comments/:id - 특정 comment 삭제
```
<!-- rest 이전에는 soap  -->

<BR>

### [REST 아키텍처에 대하여] <BR>
https://www.codecademy.com/article/what-is-rest <BR>
https://aws.amazon.com/ko/what-is/restful-api/ <BR>
https://www.ibm.com/cloud/learn/rest-apis <BR>
https://blog.postman.com/rest-api-examples/ <BR>

### [REST 참고자료 +a]
https://gmlwjd9405.github.io/2018/09/21/rest-and-restful.html

# 요청 리디렉션(방향 수정)

POST로 데이터를 추가한 후 `res.send()`로 응답을 하는 경우 응답 페이지가 새롭게 출력돼도 URL은 그대로 머물게 된다. 이 상태에서 새로고침을 하면, '양식 다시 제출 확인' 팝업창이 뜨고 확인을 누를 시 동일한 데이터로 또 다시 POST 요청이 발생하게 된다. 

이런 경우 불필요하게 같은 데이터가 계속 추가될 수 있으므로 리디렉션이 필요하다.

`res.redirect(status, path)`을 사용해 지정한 URL로 상태코드와 함께 리디렉션한다. 즉 해당 URL로 GET 요청을 전송한다.

<!-- redirect 경로는 정확히 어떻게 되는거지? 링크 참고 -->

```
// 댓글 작성 POST 라우트
app.post('/comments', (req, res) => {
  const { username, comment } = req.body;
  comments.push({ username, comment });
  // 요청 리디렉션 -> /comments로 GET 요청
  res.redirect('/comments');
});
```
상태코드를 따로 주지 않을 경우 기본값은 `"302 Found"` 이다.

<BR>

### [요청 리디렉션 res.redirect()]
https://kirkim.github.io/javascript/2021/09/21/redirect.html<BR>

https://www.geeksforgeeks.org/express-js-res-redirect-function/


<!-- 슬러그?중첩라우트? -->

<!-- 폼(form)과 Express
-Express 앱에 데이터를 전송하고 파싱해서 사용하기

메서드 오버라이드(치환)
 -->
