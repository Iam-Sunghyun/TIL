const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // UUID(범용 고유 식별자, universally unique identifier)를 만들기 위한 모듈
const methodOverride = require('method-override');


// 템플릿 엔진, 디렉토리 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 요청 데이터 파싱(body-parser)
app.use(express.json()); // request body에서 json 데이터를 파싱
app.use(express.urlencoded({ extended: true })); // request body에서 암호화된 HTML 폼 데이터를 파싱 (x-www-form-urlencoded 데이터)

// 메소드 재정의를 위한 method-override 모듈 쿼리 문자열 키 설정
app.use(methodOverride('_method'));

// 임시 데이터베이스  
let comments = [
  {
    id: uuidv4(),
    username: 'micheal',
    comment: 'lol that is so funny!',
  },
  {
    id: uuidv4(),
    username: 'iwantjob',
    comment: 'give me a job',
  },
  {
    id: uuidv4(),
    username: 'hey',
    comment: 'Plz delete your account, micheal',
  },
  {
    id: uuidv4(),
    username: 'onlysayswoof',
    comment: 'woof woof woof',
  },
];

// 포트 3000에 서버 연결, 요청 대기
app.listen(port, () => {
  console.log('On port 3000. server listening...');
});

// 홈 페이지 아무거나
app.get('/', (req, res) => {
  res.send('Home');
});

// 댓글 창 (index.ejs)
app.get('/comments', (req, res) => {
  res.render('comments/index', { comments });
});

// 댓글 작성 화면 출력 (new.ejs)
app.get('/comments/new', (req, res) => {
  res.render('comments/new', { comments });
});

// 댓글 추가 (new.ejs) 및 리디렉션
app.post('/comments', (req, res) => {
  const { username, comment } = req.body;
  comments.push({ id: uuidv4(), username, comment });
  // 요청 리디렉션
  res.redirect('comments');
});

// 특정 댓글 조회 (show.ejs)
app.get('/comments/:id', (req, res) => {
  const { id } = req.params;
  const comment = comments.find(c => c.id === id);
  if (!comment) {
    res.send('Comment not found ');
  }
  res.render('comments/show', { comment });
});

// 댓글 수정 페이지 (edit.ejs)
app.get('/comments/:id/edit', (req, res) => {
  const { id } = req.params;
  const comment = comments.find(c => c.id === id);
  res.render('comments/edit', { comment });
});

// 댓글 데이터 수정 및 리디렉션 
app.patch('/comments/:id', (req, res) => {
  const { id } = req.params;
  const newComment = req.body.comment;

  // 실제 개발에선 아래와 같이 객체의 상태를 변경하는 것은 지양해야 한다.
  const foundComment = comments.find(c => c.id === id);
  foundComment.comment = newComment;

  // 리디렉션
  res.redirect('/comments');
});

// 댓글 삭제 및 리디렉션
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  comments = comments.filter(c => c.id !== id);

  // 리디렉션
  res.redirect('/comments');
});


// 아래 부터는 request 객체 내용 확인용 간단 코드
app.get('/tacos', (req, res) => {
  const { meat, qty } = req.query;
  console.log(req.headers, req.query, req.body);  // req.body는 빈 객체로 출력 됨
  res.send(`we need ${meat} ${qty}`);
});

// post 요청 라우팅
app.post('/tacos', (req, res) => {
  const { meat, qty } = req.body;
  console.log(req.headers, req.body);   // req.body에 폼 요소의 데이터가 전달 됨
  res.send(`meat : ${meat} , qty : ${qty}`);
});

// put 요청 라우팅
app.put('/tacos', (req, res) => {
  const { meat, qty } = req.body;
  console.log(req.headers, req.body);
  res.send(`meat : ${meat} , qty : ${qty}`);
});
