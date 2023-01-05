**목차**
- [MongoDB에 이미지 저장하는 방법](#mongodb에-이미지-저장하는-방법)
  - [클라이언트에서 서버로 이미지 파일 전송 시 알아야 할 것](#클라이언트에서-서버로-이미지-파일-전송-시-알아야-할-것)
- [실습](#실습)
- [HTML 폼에서 서버로 파일 보내기](#html-폼에서-서버로-파일-보내기)
- [Multer 모듈로 전송받은 파일 파싱하기](#multer-모듈로-전송받은-파일-파싱하기)
- [이미지 파일 Clodinary에 저장하기](#이미지-파일-clodinary에-저장하기)
  - [Cloudinary에 등록하기](#cloudinary에-등록하기)
  - [Cloudinary에 이미지 업로드하기](#cloudinary에-이미지-업로드하기)
  - [API 자격 증명(credential) 환경변수 설정](#api-자격-증명credential-환경변수-설정)
  - [Dotenv로 Cloudinary API 자격 증명(credential) 외부화](#dotenv로-cloudinary-api-자격-증명credential-외부화)
    - [`.env` 파일에 자격 증명(credential) 저장 및 확인하기](#env-파일에-자격-증명credential-저장-및-확인하기)
  - [Cloudinary 모듈 인스턴스 설정](#cloudinary-모듈-인스턴스-설정)
  - [multer-strorage-cloudinary로 통합하여 이미지 업로드](#multer-strorage-cloudinary로-통합하여-이미지-업로드)
  - [이미지 파일 URL MongoDB에 저장하기](#이미지-파일-url-mongodb에-저장하기)
- [이미지 preview 및 삭제 구현하기](#이미지-preview-및-삭제-구현하기)
  - [edit 페이지 폼 수정하기](#edit-페이지-폼-수정하기)
  - [MongoDB 도큐먼트에서 이미지 삭제](#mongodb-도큐먼트에서-이미지-삭제)
  - [Cloudinary에 업로드된 이미지 삭제](#cloudinary에-업로드된-이미지-삭제)
- [썸네일에 가상 속성 추가하기](#썸네일에-가상-속성-추가하기)

# MongoDB에 이미지 저장하는 방법

## 클라이언트에서 서버로 이미지 파일 전송 시 알아야 할 것

1. HTML 기본 Form은 서버에 파일을 보낼 수 없다. 따라서 Form을 바꿔줘야 됨.
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

# HTML 폼에서 서버로 파일 보내기

기본 HTML 폼을 사용하면 파일이 제대로 전송되지 않기 때문에 몇 가지 단계를 거쳐야 한다.

1.  `<form>` `method`를 POST로 설정해준다. -> 파일을 URL에 담아 전송하는 것은 불가능하기 때문. 
2.  `<form>` `enctype` 어트리뷰트의 값을 `multipart/form-data`로 설정해준다. `enctype` 어트리뷰트로 요청 헤더의 `Content-type` 값을 설정할 수 있으며 HTML폼의 'POST' 요청에서만 사용할 수 있다(참고로 폼 데이터 기본 값은 `application/x-www-form-urlencoded`였다).
3.  `<input type="file">` 폼 요소를 통해 사용자가 업로드 하고자 하는 파일을 전달 받는다.

<!-- Content-type은 http 메시지 헤더의 필드이고, media-type은 여기에 들어가는 값들로 말 그대로 데이터 형식을 의미(application/...) MIME type은 media type의 구 명칭. Content-type 헤더에는 media-type과 charset=UTF-8 같은 문자 인코딩 방식, 그리고 boundary를 값으로 갖는다. Content-type의 데이터 형식(media type)은 크게 10가지인데 enctype으로 설정할 수 있는 media type 값은 3가지다!
-> application/x-www-form-urlencoded
   text/plain
   multipart/form-data
 -->

**[What's the difference between mediatype, contenttype and mimetype?]**

https://stackoverflow.com/questions/9258108/whats-the-difference-between-mediatype-contenttype-and-mimetype

**[HTML Form enctype 속성에 대하여]**

<!-- HTML 폼(<form>)의 enctype 속성과 multipart/form-data 의 의미 -->
https://blogpack.tistory.com/1088 

https://developer.mozilla.org/ko/docs/Web/HTML/Element/form#attr-enctype

**[MDN 일반적인 MIME-type들]**

https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

**[MDN Content-type]**

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type

# Multer 모듈로 전송받은 파일 파싱하기

요청 body에 전송되는 `multipart/form-data` 데이터를 사용하려면 추가로 미들웨어를 사용해 파싱해줘야 한다. 

`multipart/form-data` 데이터를 다루기 위한 미들웨어는 여러 가지가 있으며 프로젝트에선 **Multer**를 사용해볼 것이다.

우선 npm 모듈 **Multer**을 다운로드 해준다.

```
> npm install --save multer
```

Multer는 요청 메시지에 담긴 `multipart/form-data` 데이터를 파싱하여 `body` 객체와 `file` 혹은 `files` 객체를 `request`에 추가시키는데 `body`에는 폼의 텍스트 필드 값을 담고있고, `file/files`는 폼으로 전송한 파일 데이터를 담고있다.

주의할 것은 다음과 같이 반드시 HTML 폼에 `enctype="multipart/form-data"`를 설정해주고 `<input type="file">`으로 사용자가 파일을 업로드할 수 있게 해야한다는 것!

```
<form action="/example" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" multiple /> // 여러 파일을 전송하려면 multiple 어트리뷰트를 추가해준다.
</form>
```
**[MDN input type="file"]**

https://developer.mozilla.org/ko/docs/Web/HTML/Element/Input/file

<br>

아래 코드는 `Multer` 사용 예제인데 절차는 다음과 같다.

우선 `Multer` 모듈을 불러오고 `options`을 전달하여 객체를 생성한다. 만약 옵션 개체를 생략하면 파일이 메모리에 보관되고 디스크에 기록되지 않는다.

그 후 `upload.single(fieldname)`, `upload.array(fieldname)` 등 `Multer` API로 요청에 전송된 `multipart/form-data` 파일을 파싱해 요청 객체에 추가한다.

단일 파일의 경우 `req.file`에 저장되고, 여러 파일은 `req.files`에 저장된다.

```
const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) // dest, storage로 파일을 저장할 위치를 지정한다. 이 코드는 로컬 저장하는 경우의 예시인데 실제로는 로컬에 직접 저장하는 경우가 많지 않다고 한다.

const app = express()

// 인수로 전달한 'image'는 fieldname으로 파일 전송 폼의 name 값이다.
app.post('/profile', upload.single('image'), function (req, res, next) {
  // req.file에 폼 name="image"로 전송된 단일 파일이 저장 됨.
  // req.body will hold the text fields, if there were any
})

app.post('/photos/upload', upload.array('image', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})
------------------------------------------
// req.files 객체 확인
console.log(req.files);

>[
  {
    fieldname: 'image',
    originalname: 'ë\x85¸ë¸\x8Cë\x9E\x9Cë\x93\x9C ë\x83\x89ë\x8F\x99 ì\x82¼ê²¹ì\x82´.JPG',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    path: 'https://res.cloudinary.com/dowpf7g5p/image/upload/v1672756165/CampInfo/cpuaqu0mkwqkendx3ick.jpg',
    size: 31572,
    filename: 'CampInfo/cpuaqu0mkwqkendx3ick'
  }
]
```

**[npm Multer document]**

https://github.com/expressjs/multer/blob/master/doc/README-ko.md


# 이미지 파일 Clodinary에 저장하기

## Cloudinary에 등록하기

먼저 Cloudinary에 계정을 생성하면 클라우드 스토리지가 생성되는데, 클라우드 이름, 그리고 API키와 API Secret키를 자격 증명(credential)으로서 사용한다.

```
Cloudinary는 일부 무료로 제공되나, 사용량을 초과하면 유료로 전환해야 한다. 
이런 경우 신용카드같은 결제를 위한 요소를 연결해야 하는데 만약 API 자격 증명을 앱에 직접 넣어 Git Hub에 push라도 하게 되면 다른 사람에게 노출될 수 있다(다른 사람에게 사용되어 비용이 많이 발생할 수도 있음).
따라서 Cloudinary뿐 아니라 다른 서비스를 사용하더라도 API 크리덴셜을 앱에 직접 넣지 않도록 주의할 것.
```

## Cloudinary에 이미지 업로드하기

`Multer`로 요청에 전송된 `multipart/form-data` 파일을 파싱했었다.
그 다음은 `Multer`로 파싱한 파일을 Cloudinary에 좀 더 쉽게 업로드하기 위해 `Multer Storage Cloudinary`라고 하는 npm 모듈을 사용해 볼 것이다. 

업로드 절차는 다음과 같으며 `Multer`, `Cloudinary`, `Multer Storage Cloudinary` 세 모듈을 사용한다.

1. multer로 파싱한 파일을 cloudinary에 업로드
2. cloudinary로부터 파일 정보를 가져와 multer에 추가(req.file/req.files)
3. 라우트 핸들러에서 파일 정보 객체에 접근하여 추가 처리해줌

우선 필요한 모듈들을 다운로드한다.

```
> npm i cloudinary multer-storage-cloudinary
```

## API 자격 증명(credential) 환경변수 설정

그다음 터미널에서 다음과 같이 `CLOUDINARY_URL` **환경변수 값을 설정**해준다. 대응되는 값들은 Cloudinary 웹 사이트 대쉬보드의 product environment credentials에서 확인할 수 있다.

```
// Windows
> CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

프로젝트에선 `dotenv`로 `.env` 파일에 자격 증명을 정의하여 외부화 할 예정이므로 위처럼 터미널을 통해 환경변수 설정은 따로 하지 않았다.

**[위키피디아 Environment varialble]**

https://en.wikipedia.org/wiki/Environment_variable

## Dotenv로 Cloudinary API 자격 증명(credential) 외부화

`dotenv`는 별도의 의존성이 없는 모듈로 로컬의 `.env` 파일로부터 환경변수를 불러와 `process.env`에 할당하는 모듈이다(`dotenv`가 `.env` 파일에 정의한 값들을 환경변수화). 

이 모듈로 애플리케이션 코드가 아닌 `.env` 파일에 자격 증명을 저장하여 자격 증명을 찾거나 업데이트하기 쉬워지고, 또 버전 관리 시스템에 자격 증명 파일을 둘 필요가 없어져 깃허브 같은 공개 소스 저장소에서 오픈 소스 프로젝트를 운영할 때 자격 증명 보안을 걱정하지 않아도 된다.

우선 dotenv를 설치해준다.

```
> npm install dotenv --save
```

### `.env` 파일에 자격 증명(credential) 저장 및 확인하기

그다음 `.env` 파일에 API 키, 암호와 같은 자격 증명을 다음과 같은 형식으로 저장해준다. 

```
// .env
CLOUDINARY_CLOUD_NAME=dowpf7g5p
CLOUDINARY_KEY=157928963436911
CLOUDINARY_SECRET=t2E6fQ_mc9cBgKb_UJKJ8uGfqrk
```

`dotenv` 모듈을 로드하여 `config()` 메서드를 호출하면 현재 디렉토리에서 이름이 `.env`인 파일을 탐색한다. 그 후 `.env` 파일에 정의했던 변수들을 가져와 `process.env`에 할당한다.

```
// app.js
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log(process.env.CLOUDINARY_KEY);
console.log(process.env.CLOUDINARY_SECRET);

> 157928963436911
> t2E6fQ_mc9cBgKb_UJKJ8uGfqrk
```

**[npm dotenv document]**

https://www.npmjs.com/package/dotenv

## Cloudinary 모듈 인스턴스 설정

`cloudinary`의 계정과 연결하기 위해 필요한 필수 매개변수들을 입력해준다(각 변수들은 `.env` 파일에 정의한 값이다).

```
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
```

## multer-strorage-cloudinary로 통합하여 이미지 업로드

필요한 모듈들을 `multer-storage-cloudinary`로 통합하여 Cloudinary에 파일을 업로드한다. 

```
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');
 
const app = express();

// cloudinary 계정 연결을 위한 객체
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// multer-storage-cloudinary 객체
const storage = new CloudinaryStorage({
  // cloudinary 계정과 연결하기 위한 cloudinary 객체
  cloudinary: cloudinary, 
  // cloudinary에 저장 시 사용되는 옵션
  params: {  
    folder: 'some-folder-name',
    format: async (req, file) => 'png', 
    public_id: (req, file) => 'computed-filename-using-request',
  },
});

// multer-storage-cloudinary 객체를 전달하여 파싱한 파일 저장 위치를 cloudinary로 설정함
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), function (req, res) {
  res.json(req.file);
});
```


**[Cloudinary Nodejs Quick Start]**

https://cloudinary.com/documentation/node_quickstart

**[npm Multer-Storage-Cloudinary]**

https://www.npmjs.com/package/multer-storage-cloudinary


## 이미지 파일 URL MongoDB에 저장하기

파일 URL을 저장, 참조하기 위해 campground 모델에 image 필드를 추가해준다.

```
const CampgroundSchema = new mongoose.Schema({
    title: String,
    // 이미지 정보 필드 추가
    image: [{
      url: String,
      filename: String
    }],
    price: Number,
    description: String,
    location: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});
```

전송되는 폼 데이터(multipart/form-data)는 `Multer`로 파싱 후 텍스트 필드는 `req.body`에, 파일은 `req.file/req.files`에 저장된다.

`Multer` API 호출 시 파일 전송 폼의 name을 인수로 전달해줘야 한다. 아래 코드에선 `upload.array(fieldname)`을 호출하여 여러 파일을 전송받아 `req.files`에 저장한다.

```
router.route('/')
  .get(catchAsyncError(campground.index)) // 캠핑장 페이지
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsyncError(campground.createNewCampground)); // 새 캠핑장 추가
```

라우트 핸들러에서 `req.files`에 접근, URL을 도큐먼트에 저장해준다.

```
module.exports.createNewCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  // 이미지 데이터 저장
  campground.image = req.files.map(f => ({
    url: f.path,
    filename: f.filename
  }));
  campground.author = req.user._id; 
  await campground.save();
  req.flash('success', '새 캠핑장이 추가되었습니다.');
  res.redirect(`/campgrounds`);
};
```

# 이미지 preview 및 삭제 구현하기

사용자가 업로드한 게시물의 이미지 수정 페이지에서 파일 미리보기, 삭제 기능을 구현해본다.


## edit 페이지 폼 수정하기

우선 부트스트랩 `img-thumbnail` 클래스 사용해 preview 이미지를 출력하고 삭제할 이미지 선택 수단으로 체크박스(`.form-check` 클래스)를 추가해준다.

체크박스 값은 `image.filename`으로 MongoDB 도큐먼트와 Cloudinary에서 업로드된 파일을 삭제할 때 사용할 값이다.

```
// edit.ejs
<form class="needs-validation" action="/campgrounds/<%=campground._id%>?_method=PUT" method="POST" enctype="multipart/form-data" novalidate>
  .
  .
<div class="mb-3">
  <% campground.image.forEach((img, i) => { %>
    // 이미지 출력
    <img class="img-thumbnail" src="<%= img.url %>" alt="" style="width: 100%; height: 450px">
    // 체크박스. 각각 체크 박스의 값들은 삭제를 위한 값으로 image.filename이다
    <div class="form-check mb-2">
      <input class="form-check-input" type="checkbox" id="image-<%= i %>" name="deleteImage[]" value="<%= img.filename %>">
      <label class="form-check-label" for="image-<%= i %>">삭제</label>
    </div>
  <% }) %> 
</div>
  .
  .
</form>
```

## MongoDB 도큐먼트에서 이미지 삭제

먼저 라우트 핸들러에서 사용자가 선택한 이미지를 `campground` 도큐먼트의 `image` 필드에서 삭제해준다.

삭제 로직에서 MongoDB 쿼리 연산자 `$in`을 사용하여 사용자가 삭제하고자 하는 이미지 filename과 일치하는 image 필드 배열의 요소를 선택하였고, 선택된 요소들을 업데이트 연산자 `$pull`로 삭제해주었다.

```
module.exports.editCampground = async (req, res) => {
   const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    .
    .
  if(req.body.deleteImage.length !== 0){
  // $pull 연산자로 지정된 조건과 일치하는 campground 도큐먼트의 image 필드 배열의 요소들을 제거
  // 삭제 요소 조건은 image의 filename이 deleteImage[]의 요소 값과 일치하는 경우(deleteImagep[]의 요소는 사용자가 수정 페이지에서 체크박스로 체크한 이미지의 filename이다)
    campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } });
  }
  req.flash('success', '캠핑장 업데이트 완료!');
  res.redirect(`/campgrounds/${campground._id}`);
};
```

**[MongoDB docs - 연산자 'Reference' 카테고리 참조]**

https://www.mongodb.com/docs/manual/

## Cloudinary에 업로드된 이미지 삭제

`cloudinary.uploader.destroy(public_id, options).then(callbacks)` 메서드로 `cloudinary` 저장소에 저장된 이미지 파일을 삭제해준다.

인수 `public_id`는 `cloudinary`에 저장된 `폴더/고유식별자` 형태이다.
```
if (req.body.deleteImage && req.body.deleteImage.length !== 0) {
    for (const filename of req.body.deleteImage) {
      // cloudinary에서 삭제
      await cloudinary.uploader.destroy(filename);
    }
    .
    .
  }
```

삭제 작업을 요약하면 우선 HTML 폼 체크박스로 사용자가 삭제할 이미지를 입력 받아 요청 body의 `delete[]` 프로퍼티에 요소로 전송받았다. 전송받은 데이터와 일치하는 캠핑장 도큐먼트의 image 필드 요소들을 삭제한 후, `cloudinary` API를 사용해 파일 저장소인 `cloudinary`에서도 삭제해줌으로서 완전히 삭제를 구현하였다.

**[Cloudinary References > Upload API]**

https://cloudinary.com/documentation/cloudinary_references


# 썸네일에 가상 속성 추가하기

cloudinary transformation API를 사용해 참조할 이미지를 변환한 상태로 전송받을 수 있다.


**[Cloudinary Transformation API]**

https://cloudinary.com/documentation/transformation_reference

<!-- 위 과정들은 이미지 업로드 데모로 실제 프로덕션 단계로는 부족하다. 실제로는 업로드 갯수, 용량 등 업로드에 제한을 두어야 안전할 것. -->

<!-- 
https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data#a_special_case_sending_files -->