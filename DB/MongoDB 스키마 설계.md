<!-- # SQL 데이터베이스 관계 개요 (下) -->

# MongoDB 일대N 관계 데이터 모델링

MongoDB에서 일대다 관계의 데이터를 모델링하는 경우 크게 2가지 방법으로 모델링할 수 있고 각자 장단점을 갖고있다.

+ 임베딩(embedding) 방식
+ 레퍼런스(reference, 참조) 방식
  + 자식 참조
  + 부모 참조
  + 상호 참조 

### 데이터 모델링이란?
```
데이터 모델링은 업무 수행 시 발생하는 데이터를 정확하고 효율적으로 데이터베이스에 저장하기 위해 데이터 구조를 설계하는 과정을 의미한다.
-> 데이터베이스에 저장하고자 하는 대상을 추상화 하고(개념적 모델링) 컴퓨터에 저장할 수 있는 형태를 설계하는 것.
```

# 임베디드(embedded) 방식

## One-to-Few
일대다 관계 중 단일 문서와 적은 수의 다수가 연결된 관계를 말한다.

문서의 프로퍼티에 다른 데이터를 직접 포함시켜(embed) 표현한다(특정 문서안에 다른 스키마를 갖는 하위 문서를 프로퍼티에 포함시키는 것).

임베디드(embedded) 방식이라고도 하며 포함시키려는 데이터의 크기가 작고 관계가 단순할 때 사용. 도큐먼트나 쿼리가 직관적이고 간단하며 조회 성능이 좋다. 

하지만 데이터 중복으로 인해 불일치가 발생하거나(여러 문서에 중복 저장된 한 데이터를 모두 갱신하지 못할 수 있음) 포함된 데이터가 증가할수록 입출력 성능이 저하될 수 있고 MongoDB 문서 최대크기(16Mb)를 초과하여 저장이 불가능해 질 수도 있다. 

또한 복잡 데이터들의 관계가 복잡하거나 계층구조를 갖는 경우 관리하기 어려워진다.

조회 성능이 중요하고 데이터 중복에 따른 데이터 불일치 문제가 발생하지 않거나 업데이트가 과도하게 발생하지 않는 업무에 적합하다.

### ex) 사용자의 주소 정보에 여러 값을 저장
```
> db.person.find()
[
  {
    name: 'Kate Monster',
    ssn: '123-456-7890',
    addresses : [
      { street: '123 Sesame St', city: 'Anytown', cc: 'USA' },
      { street: '123 Avenue Q', city: 'New York', cc: 'USA' }
    ]
  },
  {
    name: 'vitaly laletin',
    ssn: '222-336-5342',
    addresses : [
      { street: '552 maple St', city: 'henesis', cc: 'mpworld' },
      { street: '123 Avenue Q', city: 'New York', cc: 'USA' }
    ]
  }
]
```

# 참조(reference) 방식

참조(reference) 방식은 데이터가 중복되지 않도록 데이터 성격별로 컬렉션을 분리 후 참조하는 데이터 불일치가 발생하지 않는 정규화 모델이다. 성격별로 데이터를 분리하여 참조하는 방식이기 때문에 임베디드 방식 보다 비교적 도큐먼트 크기 증가가 적다. 또한 데이터 추가/변경으로 인한 도큐먼트 구조에 미치는 영향이 적다.

하지만 참조가 많은 도큐먼트나 대규모의 도큐먼트를 조회하는 경우 참조를 통해 2차 쿼리가 발생하므로 처리량 증가에 따른 조회 성능이 떨어질 수 있다.

조회 성능보다는 데이터 무결성이 중요한 경우, 데이터의 관계가 복잡하거나 계층 구조를 갖는 경우 적합하다.

## One-to-Many

앞서 본 One-to-Few 보다 더 많은 다수와의 관계를 말한다. 

이런 경우 부모 문서 안에 데이터를 직접 임베드하는 게 아닌 자식 도큐먼트의 참조(reference)를 저장하는 방식을 사용하는데(자식 참조라고도 한다) 참조용 값으로는 보통 문서 id를 저장한다.

부모 도큐먼트와 관계를 갖는 자식 도큐먼트를 찾기 쉽고 참조 데이터가 부모 도큐먼트에 모여있기 때문에 관리하기 편하다. 다만 부모 도큐먼트에 업데이트가 집중되고(자식 도큐먼트 추가/삭제같은 연산을 할 때 마다 매번 업데이트 필요), 자식 도큐먼트가 많은 경우 최대 크기를 초과하거나 조회 성능이 떨어질 수 있다.

부모 도큐먼트에 발생하는 부하 및 크기 증가를 고려하여 자식 도큐먼트가 적게 생성되는 업무에 적합하다.

### ex)
```
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [     // 자식 도큐먼트들의 참조 배열
        ObjectID('AAAA'),    // 아래의 #4 grommet 도큐먼트 id 참조 
        ObjectID('F17C'),    // 또 다른 자식 도큐먼트 id 참조
        ObjectID('D2AA'),
          .
          .
          .
    ]
}

 > db.parts.findOne()
{
    _id : ObjectID('AAAA'),
    partno : '123-aff-456',
    name : '#4 grommet',
    qty: 94,
    cost: 0.94,
    price: 3.99
}    
```
## One-to-Squillions

자식 참조의 경우도 자식 도큐먼트가 너무 많아지게 되면 조회 성능이나 도큐먼트 최대 크기를 초과하는 등 문제가 발생할 수 있다고 했다.

따라서 다음과 같이 부모 도큐먼트에 자식 도큐먼트의 참조를 저장하는게 아닌, 개별 자식 도큐먼트에 부모 도큐먼트의 참조를 저장하는 방법을 사용할 수도 있다. 부모 참조라고도 한다.

자식 도큐먼트에서 부모 도큐먼트를 쉽게 찾을 수 있고 자식 도큐먼트 추가/삭제로 인한 부모 업데이트가 없다. 다만 부모 도큐먼트와 관계를 갖는 모든 자식 도큐먼트를 조회 해야될 때 소요시간이 증가할 수 있다.

이력 또는 로그 데이터와 같이 자식 도큐먼트가 많이 생성되는 업무에 적합하다.

```
> db.hosts.findOne()
{
    _id : ObjectID('AAAB'),
    name : 'goofy.example.com',
    ipaddr : '127.66.66.66'
}

>db.logmsg.findOne()
{
    time : ISODate("2014-03-28T09:42:41.382Z"),
    message : 'cpu is on fire!',
    host: ObjectID('AAAB')       // 부모 도큐먼트에 대한 참조 저장
}
```

## [MongoDB 데이터 모델링]
https://meetup.toast.com/posts/276

## [MongoDB 웹사이트 MongoDB 스키마 디자인 가이드(1,2,3부)]
https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-3

### [MongoDB 스키마 디자인]
https://etloveguitar.tistory.com/106


# Mongoose Populate

<!-- ??????????????????????  -->

MongoDB에는 join 연산과 비슷한 기능의 `$lookup` 집합 연산자를 제공하는데 Mongoose에도 다른 컬렉션의 문서를 참조할 수 있게 해주는 `populate()` 메서드를 제공한다. 

Mongoose `Population`(채워넣기)은 도큐먼트의 특정 경로(참조)를 다른 컬렉션의 도큐먼트로 자동으로 교체해준다.

### 사용 예시
```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   name: String,
   email: String,
   blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog"}] // 채워넣을 프로퍼티의 스키마 타입을 ObjectId로, 참조할 모델을 ref 옵션 값에 지정해줬다(몽구스 모델 생성시 전달한 이름). 
});

const BlogSchema = new Schema({
   title: String,
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   body: String,
   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
})

const User = mongoose.model("Author", UserSchema);
const Blog = mongoose.model("Blog", BlogSchema);

Blog.find({ title: 'populate practice' }).then((d) => console.log(d));

// 그냥 출력
>> [
  {
    _id: new ObjectId("63120d5809058506f5485a22"),
    title: 'populate practice',
    user: new ObjectId("63120bd0b1013f378f3906d1"), // 참조 값만 출력됨.
    body: 'blah blah',
    comments: [],
    __v: 0
  }
]

```
### populate()로 도큐먼트를 채워넣은 경우
```
Blog.find({ title: 'populate practice' })
    .populate('user')     // 채워넣을 프로퍼티 지정
    .then((d) => console.log(d));

>> [
  {
    _id: new ObjectId("63120d5809058506f5485a22"),
    user: {         // 참조 값과 일치하는 도큐먼트가 채워넣기(population) 되었다.
      _id: new ObjectId("63120bd0b1013f378f3906d1"),
      name: 'sunghyun',
      email: '123@321.com',
      blogs: [],
      __v: 0
    },
    body: 'function String() { [native code] }',
    comments: [],
    __v: 0
  }
]
```

### 채워진 도큐먼트의 특정 필드만 출력하기

다음과 같이 `populate()`의 두 번째 인수를 전달하여 채워진 도큐먼트의 특정 필드만 선택할 수 있다.
```
Blog.find({ title: 'populate practice' })
    .populate('user', 'name')    // 채워진 user필드 도큐먼트에서 name필드만 반환  
    .then((d) => console.log(d));

>> [
  {
    _id: new ObjectId("63120d5809058506f5485a22"),
    title: 'function String() { [native code] }',
    user: { _id: new ObjectId("63120bd0b1013f378f3906d1"), name: 'sunghyun' },   // name: 'sunghyun'이 반환됨.
    body: 'function String() { [native code] }',
    comments: [],
    __v: 0
  }
]
```

### [geeksforgeeks populate]
https://www.geeksforgeeks.org/mongoose-populate-method/

### [Mongoose Populate]
https://mongoosejs.com/docs/populate.html 



<!-- # 상호 참조와 역정규화 (Denormalization)?

역정규화 (Denormalization)란 성능을 위해 데이터 중복 저장하는 것. 

https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-2 참조
-->