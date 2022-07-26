const express = require('express');
const app = express();
const port = 3000;

// 요청 데이터 파싱
app.use(express.json()); // request body에서 json 데이터를 파싱
app.use(express.urlencoded({ extended: true })); // request body에서 암호화된 폼 데이터를 파싱 (x-www-form-urlencoded 데이터)

// get 요청 라우팅
app.get('/', (req, res) => {
  res.send('Home');
});

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

// 포트 3000에 서버 연결, 요청 대기
app.listen(port, () => {
  console.log('On port 3000. server listening...');
});