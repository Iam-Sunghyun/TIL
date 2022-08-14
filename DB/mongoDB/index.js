// Mongoose 불러오기
const mongoose = require('mongoose');

// Mongoose는 promise를 지원하며 connect()는 promise를 return한다.
main().then(s => console.log('success'))
      .catch(err => console.log(err));

async function main() {
  // 로컬에 실행 중인 27017 포트의 몽고db 연결. 도메인 뒤의 movieapp는 연결 할 db 이름.
  await mongoose.connect('mongodb://localhost:27017/movieapp');
}

// 스키마 정의
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String
});

// 모델명과 스키마 전달하여 모델 생성. 여기서 모델명은 반드시 대문자 시작, 단수형이어야 한다. 
// 그러면 Mongoose는 자동으로 소문자 복수형의 값을 컬렉션 이름으로 사용한다(아래의 경우'movies').
const Movie = mongoose.model('Movie', movieSchema);

// Document 생성
const usualSuspects = new Movie({ title: 'Usual Suspects', year: 1995, score: 9.5, rating: 'R' });

// DB에 저장
usualSuspects.save();