# SQL 데이터베이스 관계 개요 (下)


# MongoDB 일대N 관계 데이터 모델링

MongoDB에서 일대다 관계의 데이터를 모델링하는 경우 크게 2가지 방법으로 모델링할 수 있고 각자 장단점을 갖고있다.

+ 임베딩(embedding) 방식
+ 레퍼런스(reference, 참조) 방식
  <!-- + 부모 참조
  + 자식 참조
  + 상호 참조  -->

### 데이터 모델링이란?
```
데이터 모델링은 업무 수행 시 발생하는 데이터를 정확하고 효율적으로 데이터베이스에 저장하기 위해 데이터 구조를 설계하는 과정을 의미한다.
```

### [MongoDB 데이터 모델링]
https://meetup.toast.com/posts/276

## One-to-Few
일대다 관계 중 단일 문서와 적은 수의 다수가 연결된 관계를 말한다.

문서의 프로퍼티에 다른 데이터를 직접 포함시켜(embed) 표현한다(특정 문서안에 다른 스키마를 갖는 하위 문서를 프로퍼티에 포함시키는 것).

임베디드(Embedded) 방식이라고도 하며 포함시키려는 데이터의 크기가 작고 관계가 단순할 때 사용. 직관적이고 간단하며 조회성능이 좋다. 

하지만 데이터 중복으로 인해 불일치가 발생하거나(여러 문서에 중복 저장된 한 데이터를 모두 갱신하지 못했을 경우) 포함된 데이터가 증가할수록 입출력 성능이 저하될 수 있고 MongoDB 문서 최대크기(16Mb)를 초과하여 저장이 불가능해 질 수도 있다. 

또한 복잡 데이터들의 관계가 복잡하거나 계층구조를 갖는 경우 관리하기 어려워진다.

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
## One-to-Many

앞서 본 One-to-Few 보다 더 많은 다수와의 관계를 말한다. 부모 문서 안에 데이터를 직접 임베드하는 게 아닌 참조(reference)를 저장하는 방식이다. 참조용 값으로는 보통 문서 id를 저장한다.

### ex)
```
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [     // array of references to Part documents
        ObjectID('AAAA'),    // reference to the #4 grommet above
        ObjectID('F17C'),    // reference to a different Part
        ObjectID('D2AA'),
        // etc
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



### [MONGODB 스키마 디자인 6단계]
https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1


# Mongoose Populate

<!-- ??????????????????????  -->

MongoDB에는 join 연산과 비슷한 기능의 `$lookup` 집합 연산자를 제공한다.
Mongoose에도 다른 컬렉션의 문서를 참조할 수 있게 해주는 `populate()` 메서드를 제공한다. 

### ex)
```
const mongoose = require('mongoose');
const { Schema } = mongoose;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }] // ref: 값은 참조할 컬렉션 이름(모델 생성 시 전달한 이름).
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);
```


### [Mongoose Populate]
https://mongoosejs.com/docs/populate.html 