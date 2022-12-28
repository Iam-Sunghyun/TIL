**목차**
- [MongoDB에 이미지 저장하기](#mongodb에-이미지-저장하기)
  - [클라이언트에서 서버로 이미지 파일 전송 시 문제점](#클라이언트에서-서버로-이미지-파일-전송-시-문제점)
- [실습](#실습)
  - [1. HTML 폼에서 서버로 파일 보내기](#1-html-폼에서-서버로-파일-보내기)
  - [2. 전송받은 파일 파싱하기](#2-전송받은-파일-파싱하기)
    - [Multer 사용하여 폼으로 전송된 파일 파싱하기](#multer-사용하여-폼으로-전송된-파일-파싱하기)
  - [3. 파일 데이터를 Clodinary에 저장하기](#3-파일-데이터를-clodinary에-저장하기)
  - [4. 참조 URL MongoDB에 저장하기](#4-참조-url-mongodb에-저장하기)

# MongoDB에 이미지 저장하기

## 클라이언트에서 서버로 이미지 파일 전송 시 문제점

1. HTML Form은 서버에 파일을 보낼 수 없다. 따라서 Form을 바꿔줘야 됨(?).
2. 웹 페이지에 이미지를 업로드하기 위해선 어딘가에 사진을 저장해야 되는데 MongoDB의 BSON 도큐먼트는 최대 16MB만 저장 가능하기 때문에 용량이 큰 이미지를 직접 저장하는 것이 불가능(크기가 작은 이미지 데이터는 저장 가능).

따라서 MongoDB에 용량이 큰 이미지 같은 16MB 이상의 파일을 저장하고자 하는 경우 **GridFS**라는 것을 이용하거나, AWS S3, Google Cloud Storage, Backblaze 등과 같은 클라우드 스토리지를 사용하거나, Cloudflare, Fastly 같은 CDN을 사용해 데이터를 저장하고 참조용 URL을 Mongodb에 저장하는 방법을 사용한다.


**[MongoDB GridFS]**

https://www.mongodb.com/docs/manual/core/gridfs/

**[MongoDB 이미지 저장하는 방법]**

https://www.mongodb.com/community/forums/t/process-of-storing-images-in-mongodb/15093/4

<br>

# 실습

프로젝트에선 **GridFS**를 통해 MongoDB에 직접 저장하는 게 아닌 'Cloudinary'라는 이미지, 동영상 관리 서비스(Saas)를 이용해 저장할 것. Cloudinary는 사용하기 쉽고 다양한 API를 제공하기 때문에 유용하다.

작업 과정은 다음과 같다.

1. 파일 전송을 위한 폼(Form)을 생성한다.
2. 서버에 제출된 폼으로부터 파일을 가져온다.
3. 파일 데이터를 Clodinary에 저장하고 참조 URL을 받는다.
4. 해당 참조 URL을 MongoDB에 저장한다.

## 1. HTML 폼에서 서버로 파일 보내기

기본 HTML 폼을 사용하면 파일이 제대로 전송되지 않기 때문에 몇 가지 단계를 거쳐야 한다.

1.  `<form>` `method`를 POST로 설정해준다. -> 파일을 URL에 담아 전송하는 것은 불가능하기 때문. 
2.  `<form>` `enctype` 어트리뷰트의 값을 `multipart/form-data`로 설정해준다. `enctype` 어트리뷰트로 요청 헤더의 `Content-type`(=media type, MIME type) 값을 설정할 수 있으며 'POST' 요청에서만 사용할 수 있다(참고로 폼 데이터 기본 값은 `application/x-www-form-urlencoded`였다).
3.  `<input type="file">` 폼 요소를 통해 사용자가 업로드 하고자 하는 파일을 전달 받는다.

<!-- Content-type의 데이터 형식은 크게 10가지인데 enctype으로 설정할 수 있는 값은 3가지! Content-type은 요청에 전송되는 데이터 형식을 명시함.
 -->

**[<form> enctype 속성에 대하여]**

<!-- HTML 폼(<form>)의 enctype 속성과 multipart/form-data 의 의미 -->
https://blogpack.tistory.com/1088 

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type

**[MDN 일반적인 Content-type]**

https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types


## 2. 전송받은 파일 파싱하기

요청 body에 전송되는 `multipart/form-data` 데이터를 사용하려면 추가로 미들웨어를 사용해 파싱해줘야 한다. 

`multipart/form-data` 데이터를 다루기 위한 미들웨어는 여러 가지가 있으며 프로젝트에선 **Multer**를 사용해볼 것이다.

### Multer 사용하여 폼으로 전송된 파일 파싱하기

우선 npm 모듈 **Multer**을 다운로드 해준다.
```
> npm install --save multer
```

Multer는 요청 메시지에 담긴 `multipart/form-data` 데이터를 파싱하여 `body` 객체와 `file` 혹은 `files` 객체를 `request`에 추가시키는데 `body`에는 폼의 텍스트 필드 값을 담고있고, `file/files`는 폼으로 전송한 파일 데이터를 담고있다.

주의할 것은 다음과 같이 반드시 HTML 폼에 `enctype="multipart/form-data"`를 설정해주고 `<input type="file">`으로 사용자가 파일을 업로드할 수 있게 해야한다는 것!

```
<form action="/example" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
</form>
```

아래 코드는 `Multer` 사용 예제인데 절차는 다음과 같다.

우선 `Multer` 모듈을 불러오고 `options`을 전달하여 객체를 생성한다. 그 후 `upload.single()`, `upload.array()` 등 Multer api로 요청에 전송된 `multipart/form-data` 파일을 파싱해 요청 객체에 추가한다.

```
const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()

// 인수로 전달한 'avatar'는 fieldname으로 파일 전송 HTML 폼 요소의 name 값이다.
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file에 폼 name="avatar"인 단일 파일이 저장 됨.
  // req.body will hold the text fields, if there were any
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})
```

**[npm Multer document]**

https://github.com/expressjs/multer/blob/master/doc/README-ko.md


## 3. 파일 데이터를 Clodinary에 저장하기

## 4. 참조 URL MongoDB에 저장하기

<!-- 
https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data#a_special_case_sending_files -->