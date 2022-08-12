# Mongoose?
MongoDB Shell없이 Node, Javascript를 MongoDB에 연결시켜주는 툴
단순 연결뿐 아니라 유용한 도구, 메서드들도 포함하고 있어서 MongoDB를 더 쉽게 사용할 수 있게 한다.

MongoDB 자체적으로 애플리케이션 언어마다 MongoDB를 연결할 수 있는 드라이버를 제공하긴 한다. 하지만 좀 더 다양한 기능을 제공하는 Mongoose를 사용하여 연결해 볼 것!

# Mongoose 쓰는 이유?

Mongoose 홈 페이지에는 다음과 같은 문구가 있다.
```
node.js를 위한 우아한 mongodb 객체 모델링
```

Mongoos는 MongoDB의 **ODM(Object Document Mapper)** 이다(관계형 데이터베이스에선 ORM(Object Ralation Mapper)이라고 한다.). 

ODM 혹은 ORM은 데이터베이스와 프로그래밍 언어 간의 호환되지 않는 데이터를 변환하는 프로그래밍 기법, 툴을 말하는데 Mongoose는 MongoDB의 ODM으로서 데이터나 문서를 javascript 객체로 매핑해주는 역할을 한다.

javascript로 매핑된 객체에 메서드를 추가하여 유효성 검사를 하거나 기본 스키마를 정의하여 데이터가 해당 스키마를 따르도록 만들거나 복잡한 쿼리를 하는 등 MongoDB에서 제공하는 기본 드라이버 이상의 기능들을 제공한다.

하지만 Mongoose로 할 수 있는 일은 Mongoose없이도 가능하긴 하다! 다만 직접 만들어야되는 다양한 기능들을 Mongoose가 제공해주는 것.

<!-- 일반적으로 솔루션을 선택할 때, 당신은 제공되는 기능과 "커뮤니티 활동" (다운로드, 공헌도, 버그 리포트, 문서 퀄리티 등) 모두를 고려해야 한다. 몽구스는 가장 유명한 ORM이며, MongoDB를 사용한다면 몽구스는 합리적인 선택이다. -->

<!--  ODM/ORM을 사용하면 개발 및 유지 보수 비용이 절감된다. 네이티브 쿼리 언어에 친숙하거나 퍼포먼스가 중요한 것이 아니라면, ODM 사용을 추천. -->

<!-- Mongoose 쓰는이유? 아주 간단히 요약하면 MongoDB에서 제공하는 기본 드라이버 이상의 기능을 제공한다고 함 보충 필요-->


# Mongoose를 MongoDB에 연결하기

## 1. Mongoose NPM으로 설치(Mongoose는 NPM 패키지이다.)
```
npm install mongoose --save
```

## 2. 프로젝트에 MongoDB 연결
```
// Mongoose 불러오기
const mongoose = require('mongoose');

// Mongoose는 promise를 지원하며 connect()는 promise를 return한다.
main().then(s => console.log('success'))
      .catch(err => console.log(err));

async function main() {
  // 로컬에 실행 중인 27017 포트의 몽고db 연결. 도메인 뒤의 movieapp는 연결 할 db 이름.
  await mongoose.connect('mongodb://localhost:27017/movieapp');
}
```

## 3. 스키마 정의, 모델 생성 후 문서 저장ㅎ기

Mongoose로 MongoDB 데이터를 사용, 접근하려면
데이터를 정의하는 모델을 만들어야하는데 그러려면 우선 스키마를 정의해줘야 한다. 

여기서 모델(model)이란 몽구스의 도움으로 생성되는 자바스크립트 클래스로 MongoDB 컬렉션의 스키마(schema)를 토대로 만들어진 클래스(생성자)를 말하며 모델의 인스턴스가 곧 문서(document)가 된다.

### 스키마?
관계형 데이터베이스에서의 스키마는 데이터베이스 구조와 제약조건에 대한 명세, 즉 구체적인 설계도 정도로 보면 된다.

Mongoose에서 스키마란 MongoDB에 저장되는 document의 Data 구조, 즉 필드 타입에 관한 정보를 JSON 형태로 정의한 것으로 RDBMS의 테이블 정의와 유사한 개념이다.

<!-- rdb에서 테이블 정의와 스키마는 다른건가? 같은건가? -->
### 예시 코드
```
// 스키마 정의
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String
});

// 모델명과 스키마 전달. 여기서 모델명은 반드시 대문자 시작, 단수형이어야 한다. 
// 그러면 Mongoose는 자동으로 소문자 복수형의 값을 컬렉션 이름으로 사용한다(아래의 경우'movies').
const Movie = mongoose.model('Movie', movieSchema);

// Document 생성
const usualSuspects = new Movie({ title: 'Usual Suspects', year: 1995, score: 9.5, rating: 'R' });

// DB에 저장
usualSuspects.save();
```

### Document 여러 개 삽입하기
위에서 본 단일 문서 저장과 달리 `model.inserMany()`로 삽입시 MongoDB에 바로 연결되어 `save()`없이 바로 저장됨(여러 개를 삽입하는 경우가 일반적이진 않은듯). 

또한 promise 객체를 반환한다.

### [몽구스 스키마 정의, 모델 생성]
https://mongoosejs.com/docs/guide.html#models

### [몽구스 빠른 시작 가이드]
https://mongoosejs.com/docs/index.html


<!-- ### Document 찾기


모델 정의

몽구스 CRUD

스키마 제약조건



-----
모델 인스턴스 & 정적 메서드

몽구스 미들웨어


몽구스 버츄얼(virtuals)? -->