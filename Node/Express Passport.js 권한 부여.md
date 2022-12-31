**목차**
- [사용자 권한 부여](#사용자-권한-부여)
  - [1. 게시물 모델(mongoose model)에 작성자 필드 추가](#1-게시물-모델mongoose-model에-작성자-필드-추가)
  - [2. 게시물에도 작성자 정보 저장](#2-게시물에도-작성자-정보-저장)
  - [3. 사용자 확인하여 수정/삭제 버튼 표시 및 숨기기](#3-사용자-확인하여-수정삭제-버튼-표시-및-숨기기)
  - [서버 측에서 한번 더 사용자 확인하기](#서버-측에서-한번-더-사용자-확인하기)
  

# 사용자 권한 부여

## 1. 게시물 모델(mongoose model)에 작성자 필드 추가

특정 게시물에 삭제/수정 권한을 부여하기 위해서는 게시물과 사용자를 대조해볼 수 있는 프로퍼티가 필요하다.

그래서 우선 게시물 스키마에 게시물 작성자 정보를 저장할 `author` 필드를 추가해준다.

해당 필드는 `populate()`를 위해 사용자 `_id` 값만 저장하여 준다.

```
const CampgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, <- 추가된 필드
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] 
});
```

## 2. 게시물에도 작성자 정보 저장

게시물 작성 시에도 해당 게시물에 작성자(현재 로그인 사용자) 정보를 저장한다.

```
router.post('/', isLoggedIn, validateCampground, catchAsyncError(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;  <- 사용자 _id 저장
  await campground.save();  
  req.flash('success', '새 캠핑장이 추가되었습니다.');
  res.redirect(`/campgrounds`);
}));
```

## 3. 사용자 확인하여 수정/삭제 버튼 표시 및 숨기기

게시물 작성자에 한하여 게시물에 접근 권한을 설정한다. 

현재 로그인 중이라면 사용자 정보가 할당되어 있을 `req.user` 객체를 게시물의 작성자 필드(`campground.author`)와 비교하여 출력되는 템플릿을 다르게 한다.

템플릿 내에서 사용하기 위해 `res.locals`에 사용자 객체를 할당 해주었고 객체 비교는 mongoose 도큐먼트 메서드인 `Document.prototype.equals()`를 사용하였다(`equals()` 메서드는 같은 `_id` 값을 갖는 경우 동일한 도큐먼트로 취급한다). 

```
// app.js 
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error'); 
    next();
})
---------------------------------
// show.ejs (게시물 세부화면) campground는 render시 전달되는 게시물 객체
 <!-- 로그인 사용자 권한부여 -->
      <% if(currentUser && campground.author.equals(currentUser._id)) { %> 
        <div class="card-body">
          <a class="card-link btn btn-info" href="/campgrounds/<%=campground._id%>/edit">수정</a>
          <form class="d-inline" action="/campgrounds/<%=campground._id%>?_method=DELETE" method="POST">
            <button class="btn btn-danger">삭제</button>
          </form>
        </div>
      <% } %>
```

## 서버 측에서 한번 더 사용자 확인하기

게시물 작성자가 아닌 사용자의 경우 캠핑장 게시물 세부 페이지에 수정/삭제 버튼이 보이지 않는다.

하지만 로그인한 상태에서 postman이나 브라우저 주소창으로 수정/삭제 url로 요청을 전송하면 버튼이 없더라도 접근이 가능하다(isLoggedIn 미들웨어로 로그인 여부만 확인하는 상태). 

따라서 서버 측에서 로그인 여부만 아니라, 해당 게시물 작성자인지 다시 한번 확인하여 라우트를 보호해줄 필요가 있다.

```
// middleware.js
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campgroundModel');

// 로그인 확인용 미들웨어 
      .
      .
      .

// 게시물 작성자와 현재 로그인 유저 확인 미들웨어(웹 페이지가 아닌 postman, ajax로 요청된 경우 사용자 확인을 위함)
module.exports.isAuthor = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate('author');
  if (req.user && !campground.author.equals(req.user)) {
    return next(new ExpressError('권한이 없습니다', 400));
  }
  next();
};
------------------------------------------
// campgroundRouter.js
// 특정 캠핑장 내용 수정 페이지
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'not found page!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}));
```