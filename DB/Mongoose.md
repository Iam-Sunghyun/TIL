# 목차
- [Mongoose란?](#mongoose란)
  - [ODM, ORM?](#odm-orm)
  - [Mongoose 쓰는 이유?](#mongoose-쓰는-이유)
- [Mongoose로 MongoDB에 연결 후 document 생성하기](#mongoose로-mongodb에-연결-후-document-생성하기)
  - [1. Mongoose NPM으로 설치](#1-mongoose-npm으로-설치)
  - [2. 프로젝트에 MongoDB 연결](#2-프로젝트에-mongodb-연결)
  - [3. 스키마 정의, 모델 생성 후 단일 문서 저장하기](#3-스키마-정의-모델-생성-후-단일-문서-저장하기)
    - [스키마(schema)?](#스키마schema)
    - [단일 문서 저장 예시 코드](#단일-문서-저장-예시-코드)
- [Mongoose API](#mongoose-api)
  - [Mongoose에서 쿼리 결과를 처리하는 방법 2가지](#mongoose에서-쿼리-결과를-처리하는-방법-2가지)
  - [Document 여러 개 삽입하기](#document-여러-개-삽입하기)
  - [Document 찾기](#document-찾기)
  - [Document 업데이트 하기](#document-업데이트-하기)
  - [Document 삭제하기](#document-삭제하기)
- [Mongoose 스키마 유효성 검사(validation)](#mongoose-스키마-유효성-검사validation)
  - [업데이트 시 유효성 검사](#업데이트-시-유효성-검사)
  - [유효성 검사 에러 메시지](#유효성-검사-에러-메시지)
- [사용자 정의 메서드를 스키마에 추가하기](#사용자-정의-메서드를-스키마에-추가하기)
  - [인스턴스 메서드 추가(자주 사용)](#인스턴스-메서드-추가자주-사용)
  - [정적 메서드 추가](#정적-메서드-추가)
- [가상 Mongoose(Mongoose Virtuals)](#가상-mongoosemongoose-virtuals)
- [Mongoose 미들웨어](#mongoose-미들웨어)


# Mongoose란?

Mongoose 홈 페이지에는 다음과 같은 문구가 있다.

```
node.js를 위한 우아한 mongodb 객체 모델링
```

Node, Javascript를 사용해 MongoDB 데이터를 다룰 수 있게 연결시켜주는 툴로 Nodejs를 위한 MongoDB의 **ODM(Object Document Mapper)** 이다(관계형 데이터베이스에선 ORM(Object Ralation Mapper)이라고 한다.).

## ODM, ORM?

ODM 혹은 ORM은 데이터베이스와 프로그래밍 언어 간의 호환되지 않는 데이터를 변환하는 프로그래밍 기법, 툴을 말하는데 Mongoose는 MongoDB의 ODM으로서 데이터나 문서를 javascript 객체로 매핑해주는 역할을 한다.

## Mongoose 쓰는 이유?

Mongoose는 Nodejs와 MongoDB를 단순 연결하는 것뿐 아니라 유용한 기능, 메서드들도 포함하고 있어서 유용하다.

MongoDB 자체적으로 애플리케이션 언어마다 MongoDB를 연결할 수 있는 드라이버를 제공하긴 한다. 하지만 좀 더 다양한 기능을 제공하는 Mongoose를 사용하여 연결해 볼 것!

Mongoose를 사용하면 javascript로 매핑된 객체에 메서드를 사용, 추가하여 유효성 검사를 하거나 기본 스키마를 정의하여 데이터가 해당 스키마를 따르도록 만들거나 복잡한 쿼리를 하는 등 MongoDB에서 제공하는 기본 드라이버 이상의 기능들을 사용할 수 있다.

그런데 Mongoose로 할 수 있는 일은 Mongoose없이도 가능하긴 하다! 다만 직접 만들어야되는 다양한 기능들을 Mongoose가 제공해주는 것.

<!-- 일반적으로 솔루션을 선택할 때, 당신은 제공되는 기능과 "커뮤니티 활동" (다운로드, 공헌도, 버그 리포트, 문서 퀄리티 등) 모두를 고려해야 한다. 몽구스는 가장 유명한 ORM이며, MongoDB를 사용한다면 몽구스는 합리적인 선택이다. -->

<!--  ODM/ORM을 사용하면 개발 및 유지 보수 비용이 절감된다. 네이티브 쿼리 언어에 친숙하거나 퍼포먼스가 중요한 것이 아니라면, ODM 사용을 추천. -->

<!-- Mongoose 쓰는이유? 아주 간단히 요약하면 MongoDB에서 제공하는 기본 드라이버 이상의 기능을 제공한다고 함 보충 필요-->

# Mongoose로 MongoDB에 연결 후 document 생성하기

## 1. Mongoose NPM으로 설치

Mongoose는 NPM 패키지로 NPM으로 쉽게 설치할 수 있다.

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

## 3. 스키마 정의, 모델 생성 후 단일 문서 저장하기

Mongoose로 MongoDB 데이터를 사용, 접근하려면 데이터를 정의하는 모델을 만들어야하는데 그러려면 우선 스키마를 정의해줘야 한다.

여기서 모델(model)이란 Mongoose의 도움으로 생성되는 자바스크립트 클래스로 MongoDB 컬렉션의 스키마(schema)를 토대로 만들어진 클래스(생성자)를 말하며 모델의 인스턴스가 곧 문서(document)가 된다.

정리하면 모델은 특정 컬렉션의 문서를 생성하기 위한 클래스이고 모델 생성 시 전달한 문자열이 컬렉션 이름으로, 스키마가 문서 구조가 되는 것이다.

### 스키마(schema)?

데이터베이스에서의 스키마는 데이터베이스의 **데이터 구조와 관계, 제약조건에 대한 명세를 말하는 것으로 데이터의 구체적인 설계구조** 정도로 보면 된다.

Mongoose에서 스키마는 MongoDB에 저장되는 document의 Data 구조, 즉 필드 타입에 관한 정보를 JSON 형태로 정의한 것으로 RDBMS의 테이블 정의와 유사한 개념이다.

각 스키마는 MongoDB 컬렉션에 매핑되고 해당 컬렉션 내 문서의 구조를 정의한다.

### 단일 문서 저장 예시 코드

```
// 스키마 정의
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String
});

// 모델명과 스키마 전달하여 모델 생성. 여기서 모델명은 반드시 대문자 시작, 단수형이어야 한다.
// 그러면 Mongoose는 자동으로 소문자 복수형의 문자열을 컬렉션 이름으로 사용한다(아래의 경우'movies').
const Movie = mongoose.model('Movie', movieSchema);

// Document 생성. movies 컬렉션의 문서가 됨.
const usualSuspects = new Movie({ title: 'Usual Suspects', year: 1995, score: 9.5, rating: 'R' });

// DB에 저장
usualSuspects.save();
```

`Document.prototype.save()`메서드는 비동기로 동작하며 `promise` 객체를 반환한다(저장 시 유효성 검사도 수행함).

**[몽구스 스키마 정의, 모델 생성]**

https://mongoosejs.com/docs/guide.html#schemas

**[몽구스 빠른 시작 가이드]**

https://mongoosejs.com/docs/index.html

# Mongoose API


## Mongoose 쿼리를 실행하는 방법 2가지

첫 번째는 메서드에 **콜백함수를 인수로 전달**한 경우, **쿼리를 비동기적으로 수행**한 후에 결과를 콜백함수에 전달하여 호출한다(콜백함수의 첫 번째 인수는 에러정보, 두 번째 인수는 문서를 전달받는다).

두 번째는, `.then()`, `async/await`을 사용하여 실행하고, 프로미스처럼 후속처리를 해줄 수 있다(쿼리 메서드는 `Query` 객체를 반환하는데 프로미스처럼 `then()`, `async/await`을 사용할 수 있다).

+ exec()를 호출하여 실행시킬 수도 있다!

```
// 결과를 then() 메서드에 전달
Movie.find({year: {$gte: 1995}}).then(res => console.log(res));

// 결과를 콜백 함수의 인수로 전달
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (error, result) {});

// name이 john인 문서에서 name, firends 필드만 반환
await MyModel.find({ name: /john/i }, 'name friends').exec();

```

다음과 같이 콜백과 `then()`을 함께 쓸 경우 쿼리 연산이 중복 실행될 수 있으므로 같이 연속해서 사용하지 말 것.
```
// updateMany()가 3번 호출된다. -> 콜백을 전달해줬기 때문에 쿼리가 즉시 1번 실행 + 2번의 then() 메서드 호출로 쿼리가 실행
const q = MyModel.updateMany({}, { isDeleted: true }, function() {
  console.log('Update 1');
});

q.then(() => console.log('Update 2'));
q.then(() => console.log('Update 3'));
```

또한 쿼리에 `async/await`을 사용하여 동기적으로 결과를 얻을 수도 있는데 여기서도 콜백과 함께 사용할 경우 중복 실행될 수 있다. 아래 예시는 `tags` 배열에 요소를 2번 입력한다.
```
const BlogPost = mongoose.model('BlogPost', new Schema({
  title: String,
  tags: [String]
}));

// await과 콜백이 '함께' 사용됐기 때문에 updateOne() 메서드가 2번 실행된다.
// 따라서 동일한 문자열 값을 tags 배열에 2번 입력하게 되는 셈.
const update = { $push: { tags: ['javascript'] } };
await BlogPost.updateOne({ title: 'Introduction to Promises' }, update, (err, res) => {
  console.log(res);
});
```

따라서 Mongoose 쿼리할 때 콜백과 프로미스(`then()`, `async/await`)는 같이 사용하지 말 것!

만약 쿼리 결과로 프로미스 객체를 반환 받고 싶다면 `exec()`을 호출해 쿼리를 실행해주면 된다. 공식문서에는 `exec()`를 사용하면 더 나은 스택 추적을 제공하니 사용을 권장한다고 되어있다. 
```
// exec()에 콜백 사용
MyModel.find({ name: /john/i }, 'name friends').exec(function (err, result) {
      if (err) {
          // 에러 처리
          return Promise.reject(err);
      }
      // 성공 시 처리
    });

// exec()에 프로미스 후속처리 메서드 사용
MyModel.find({ name: /john/i }, 'name friends')
             .exec().then(function () {
        // 성공 시 처리
    }).catch(function (err) {
        // 에러 처리
    });
```
**[몽구스 Promises]**
https://mongoosejs.com/docs/promises.html

**[몽구스 Queries]**
https://mongoosejs.com/docs/queries.html

## Document 여러 개 삽입하기

- `Model.insertMany([document1, document2, ...], optioins, callback)`

위에서 본 단일 문서 저장과 달리 `Model.insertMany()`로 삽입 시 MongoDB에 바로 연결되어 `save()`없이 바로 저장된다(여러 개를 삽입하는 경우가 일반적이진 않다.).

```
Model.insertMany([
  { title: 'Usual Suspects', year: 1995, score: 9.5, rating: 'R' },
  { title: 'Amadues', year: 1984, score: 9.2, rating: 'R-13' },
  { title: 'Ailen', year: 1979, score: 8.1, rating: 'R' }
  ], function(error, docs) {})
```

만약 삽입할 요소 중 하나라도 유효성 검사를 통과하지 못한다면 전부 삽입되지 않는다.


`Model.insertMany()` 메서드는 `promise` 객체를 반환한다.

## Document 찾기

- `Model.find(filter, projection, options, callback)` - 모든 문서 검색 <br>
- `Model.findOne(filter, projection, options, callback)` - 단일 문서 검색 <br>
- `Model.findById(id, projection, options, callback)` - ID로 검색(Express 작업 시 주로 사용) <br>

위 메서드들은 `'Query'` 객체를 반환하는데 프로미스처럼 `then()`, `async`/`await` 기능을 지원한다(`'Query'`객체가 프로미스는 아님).

메서드 인수로는 반환 받을 값을 지정하는 `projection`을 전달할 수 있고, 추가 옵션이나 콜백 함수를 전달할 수 있도 있다.

```
// Find one adventure whose `country` is 'Croatia', otherwise `null`
await Adventure.findOne({ country: 'Croatia' }).exec();

// using callback
Adventure.findOne({ country: 'Croatia' }, function (err, adventure) {});

// select only the adventures name and length
await Adventure.findOne({ country: 'Croatia' }, 'name length').exec();
```

## Document 업데이트 하기

- `Model.updateOne(filter, update, options, callback)` - 단일 문서 업데이트 <br>
- `Model.updateMany(filter, update, options, callback)` - 여러 문서 업데이트 <br>

위 메서드들은 다음과 같이 업데이트 처리 결과만 반환한다. 즉 업데이트된 데이터나 갱신된 정보를 resolve하지 않는다.

```
 Movie.updateOne({title: 'Usual Suspects'}, {score: 9.5}).then(m => console.log(m));

>>{
  acknowledged: true,
  modifiedCount: 1,
  upsertedId: null,
  upsertedCount: 0,
  matchedCount: 1
}
```

업데이트된 데이터를 반환받고 싶으면 아래와 같은 메서드를 사용하면 되는데, 기본 값이 {new: false}인 options 매개변수 값을 { new: true }로 설정해주면 된다(기본 값으로 둘 경우 업데이트 이전 문서, 즉 쿼리로 검색된 문서가 반환됨).

- `Model.findByIdAndUpdate(id, update, options, callback)` <br>
- `Model.findOneAndUpdate(query, update, options, callback)` <br>

```
Model.findOneAndUpdate({year: {$gte: 1995}}, {year: 1996}, {new: true}).then(d => console.log(d));

>> {
  _id: new ObjectId("62f65bb9a49d6d4a588c0ec8"),
  title: 'Usual Suspects',
  year: 1996,
  score: 9.6,
  rating: 'R',
  __v: 0
}
```

반환 값은 모두 `Query` 객체이다.

## Document 삭제하기

- `Model.deleteOne(query, options, callback)` <br>
- `Model.deleteMany(query, options, callback)` <br>

위 메서드들도 update와 마찬가지로 처리 결과만 반환한다.

```
Movie.deleteOne({title: 'Ailen'}).then(m => console.log(m));

>>{ acknowledged: true, deletedCount: 1 }
```

따라서 삭제된 문서를 반환받기 위해선 다음 메서드들을 사용해줘야 한다.

- `Model.findOneAndDelete(query, options, callback)` <br>
- `Model.findByIdAndDelete(id, options, callback)` <br>

```
Movie.findOneAndDelete({title: 'Amadeus'}).then(m => console.log(m));

>>{
  _id: new ObjectId("62f78d4595676f589f677fe6"),
  title: 'Amadeus',
  year: 1984,
  score: 9.5,
  rating: 'R'
}
```

반환 값은 모두 `Query` 객체이다.

# Mongoose 스키마 유효성 검사(validation)

<!-- operation buffering? -->

스키마를 정의할 때, 다음과 같이 내장 스키마 타입 옵션(제약 조건)을 사용해 유효성 검사를 구체적으로 할 수 있다.

모든 스키마 타입이 사용할 수 있는 공통 옵션이나, 스키마 타입 고유의 옵션을 사용해 유효성 검사를 할 수 있다.

```
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,   // 숫자, 숫자로 형변환 가능한 문자열 모두 가능.
        required: true,
        min: [0, 'Price must be positive ya dodo!'] // 사용자 정의 에러메시지 지정
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String], // 숫자를 삽입해도 문자열로 형변환 후 저장됨.
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L'] // String의 enum 옵션으로 유효한 값 지정
    }
});
```

스키마 제약에 걸리는 경우 `save()`로 저장 시 에러가 발생하고, 스키마에 정의되지 않은 필드를 삽입 시 그 값은 무시된다.


**[스키마 유형, 옵션(제약 조건)]**

https://mongoosejs.com/docs/schematypes.html
<!-- 일부 값들은 자동으로 해당 타입으로 형변환하여 저장된다. -->

## 업데이트 시 유효성 검사

스키마 정의 시 지정한 유효성 검사는 업데이트 시 적용되지 않는다.

예를 들어 `type: number`이며 최소 값이 0이상 옵션을 설정한 price필드의 경우도 음수 값을 업데이트하면 음수가 적용되어버린다.
```
const Product = mongoose.model('Product', productSchema);

// 문제없이 적용 되어버린다.
Product.updateOne({name: 'bike', price: -1})
```

문서 업데이트 시에도 유효성 검사를 적용시키려면 옵션 값으로 `{runValidators: true}` 을 설정해주면 된다.

```
Product.updateMany({}, {price: 0}, {runValidators: true});
```

## 유효성 검사 에러 메시지

Document 형식이 스키마 제약 조건에 어긋나는 경우 다음과 같이 사용자 정의 에러 메시지를 출력하게 할 수 있다(자주 쓰는 방법은 아닌듯).

- 배열 문법 - `min: [6, 'Must be at least 6, got {VALUE}']`
- 객체 문법 - `enum: { values: ['Coffee', 'Tea'], message: '{VALUE} is not supported' }`

Mongoose는 위 예시의 `{VALUE}`를 유효성 검사하는 값으로 바꿔 출력한다.

**[유효성 검사(validation)]**

https://mongoosejs.com/docs/validation.html

# 사용자 정의 메서드를 스키마에 추가하기

## 인스턴스 메서드 추가(자주 사용)

인스턴스 메서드는 스키마 생성 단계에서 인수로 전달하거나, 스키마의 `methods` 프로퍼티에 추가할 수 있는 메서드로 `Model` 프로토타입에 컴파일되는 함수로 **개별 문서(document)들이 사용할 수 있는 메서드이다.**

인스턴스 메서드를 추가하는 방법은 2가지가 있으며 **주의할 것은 화살표 함수로 정의하지 말 것**. 화살표 함수는 this 바인딩이 없으므로 인스턴스 메서드를 호출한 문서 필드에 접근할 수 없다.

```
// 첫 번째 방법. methods 객체에 인스턴스 메서드를 추가하여 스키마 생성 시 2번째 인수로 전달한다.
const productSchema = new mongoose.Schema({ name: String, type: String },
{
  methods: {
    greet() {
      console.log(`this is ${this.name}`);
    }
  }
});

// 두 번째 방법. 생성된 스키마의 methods 프로퍼티에 동적으로 추가하는 방법도 있다(반드시 모델 생성 이전에 추가해줘야 됨).
productSchema.methods.greet = function () {
    console.log(`this is ${this.name}`);
}

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    return this.save();
};

productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat);
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

const a = new Product({ name: 'bike' });
a.greet(); // "this is bike"
```

이런 식으로 사용자 정의 메서드를 추가하여 사용자 인증(authentication)같은 추가 유효성 검사를 구현하기도 한다.

## 정적 메서드 추가

개별 인스턴스(문서)가 아닌 **모델 자체에 바인딩되는 메서드**.

주로 모델이 적용되는 컬렉션의 문서를 효율적으로 생성, 찾기, 업데이트, 삭제하는 작업을 정의하며 3가지 방법으로 정의할 수 있으며 역시 **주의할 점은 화살표 함수로 정의하지 말 것!**

```
// 정적 메서드
// 1. 스키마 생성 시 2번째 인수로 전달하는 방법
// statics 객체에 정적 메서드를 추가하여 전달한다.
const productSchema = new Schema({ name: String, type: String },
{
  statics: {
    // Product 모델의 문서들(products 컬렉션의 문서들) 모두 업데이트
    firesale() { 
      return this.updateMany({}, { onSale: true, price: 0 });
    }
  }
});

// 2. 생성된 스키마의 statics 프로퍼티에 할당하는 방법
productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 });
};

// 3. Model.static() 메서드를 호출하는 방법
productSchema.static('fireSale', function () {
  return this.updateMany({}, { onSale: true, price: 0 });
});

Product.fireSale().then(res => console.log(res))
```

**[스키마 인스턴스 메서드, 정적 메서드]**

https://mongoosejs.com/docs/guide.html#methods

# 가상 Mongoose(Mongoose Virtuals)

DB 스키마에 없는 가상의 프로퍼티를 문서에 추가해 사용할 수 있게 해준다.

getter 함수로 필드 형식을 지정하거나, 여러 필드를 결합하는데 주로 사용하고, setter 함수는 단일 값을 입력받아 분해하여 여러 필드에 저장할 때 유용하게 사용된다.

```
// 스키마에 직접 추가
const personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
},{
  virtuals:{
    fullName:{
      get() {
        return this.name.first + ' ' + this.name.last;
      },
      set(v) {
        this.name.first = v.substr(0, v.indexOf(' '));
        this.name.last = v.substr(v.indexOf(' ') + 1);
      }
    }
  }
});

// virtual 메서드로 추가
personSchema.virtual('fullName').
  get(function() {
    return this.first + ' ' + this.last;
    }).
  set(function(v) {
    this.first = v.substr(0, v.indexOf(' ')); // 참고로 String.prototype.substr() 메서드는 사용 권장하지 않는다.
    this.last = v.substr(v.indexOf(' ') + 1);
  });

// document 생성
const Person = mongoose.model('Person', personSchema);

// 가상 getter 테스트
const tammy = new Person('Person', {first: 'Tammy', last: 'Chow'})
console.log(tammy.fullName);

>> Tammy Chow

// 가상 setter 테스트
tammy.fullName = `Tammy Xiao`;
console.log(tammy.fullName);

>> Tammy xiao
```

`tammy` 문서 스키마에는 없는 가상의 getter, setter 함수를 만들었고 호출해보았다. 


```
tammy.save();
```
위와 같이 문서를 저장한 경우 모델 생성 시 전달한 모델명의 복수형으로 컬렉션을 생성한다(위의 경우 Person -> people).

**[Mongoose Virtuals]**

https://mongoosejs.com/docs/guide.html#virtuals



# Mongoose 미들웨어

Mongoose 미들웨어 함수는 비동기 함수 실행 중 제어가 전달되는 함수로, 특정 비동기 작업 처리 전/후에 자동적으로 실행되는 함수이다.

`pre()`,`post()`로 전/후 작업을 정의할 수 있다.

Mongoose 미들웨어는 모델 생성 이전에 정의해줘야 동작한다.
```
const farmSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Farm must have a name!'] },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});
```
<!-- Mongoose 미들웨어란


특정 메서드 호출 전, 후에 실행되는 것들
.pre()

.post() -->

**[Express와 MongoDB 연결하기 실습.md 참고]**

https://github.com/Iam-Sunghyun/TIL/blob/main/DB/Express%EC%99%80%20MongoDB%20%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0%20%EC%8B%A4%EC%8A%B5.md#mongoose-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%EB%A1%9C-%EC%97%AC%EB%9F%AC-%EB%AA%A8%EB%8D%B8%EC%9D%B4-%EA%B2%B0%ED%95%A9%EB%90%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%82%AD%EC%A0%9C%ED%95%98%EA%B8%B0

**[Mongoose middleware]**

https://mongoosejs.com/docs/middleware.html



