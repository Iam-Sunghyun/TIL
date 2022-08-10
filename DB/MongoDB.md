# 데이터베이스(Database) 필요성 간략하게

데이터베이스를 사용할 경우 파일로 저장하는 것보다 많은 장점이 있다.

1. 데이터를 지속하기 위해(보존).
2. 데이터를 효율적으로(구조화) 저장, 압축하여 관리나 접근하기 쉽게 한다.
3. 데이터 무결성, 중복을 최소화할 수 있다.
4. DBMS로 접근 권한을 설정하여 데이터를 좀 더 안전하게 관리할 수 있다(보안).


# SQL, NoSQL?

## SQL(Structed Query Language)

SQL은 MySQL, Postgres, SQLite, Oracle, MSSQL(Microsoft Sql Server) 등 관계형 데이터베이스에서 사용되는 질의 언어를 말한다.

관계형 데이터베이스에 데이터를 저장하기 위해선 스키마와 테이블을 세팅이 필요하며 저장되는 데이터 또한 스키마 규격에 맞아야 한다(정형화된 데이터 저장).

## NoSQL

NoSQL은 SQL같은 쿼리 언어를 사용하지 않고 Document, graph, 키/값 같이 다양한 유형으로 저장하는 모든 비관계형 데이터베이스를 말한다.

관계형 DB와 달리 스키마나 관계가 없으므로 유연하고 확장하기 쉽다.

NoSQL 데이터베이스로는 MongoDB, Couch DB, Neo4j, Cassandra, Redis 등 여러가지가 있다.

일반적으로 문서(Document) 형식에 많이들 데이터를 저장하는데 `xml`, `json`, `yaml` 등과 같은 익숙한 형식들(반정형 데이터)도 문서 형식에 포함된다.

<!-- MongoDB같은 Nosql은 어디에 적합할까? -스키마가 정형적이지 않거나 자주변동될때, 휘발성 있는(로그같은 것) 데이터 저장할 때? -->

<!-- 반정형 비정형 정형데이터? -->

### [SQL, NOSQL비교]
https://azderica.github.io/00-db-nosql/ <br>
https://gyoogle.dev/blog/computer-science/data-base/SQL%20&%20NOSQL.html

### [문서 지향 데이터베이스란?]
https://en.wikipedia.org/wiki/Document-oriented_database

### [NoSQL 데이터베이스]
https://ko.wikipedia.org/wiki/NoSQL



# MongoDB란

JSON과 유사한 BSON 형식의 NoSQL 문서 지향 데이터베이스이다(BSON은 JSON 형식의 문서를 바이너리 형태로 인코딩한 형태이다.).

<!-- ## BSON과 JSON 비교

JSON은 텍스트 기반 형식이므로 텍스트 파싱이 느릴 수 있다.

bson은 내부적으로 binary 형태이므로 파싱이 더 빠르다

bson이 더 많은 자료형을 지원한다.

 -->

### [JSON BSON 비교]
https://www.mongodb.com/json-and-bson
https://www.mongodb.com/basics/bson
https://www.educba.com/json-vs-bson/

### [BSON 공식 문서]
https://bsonspec.org/

### [MongoDB란?]
https://poiemaweb.com/mongdb-basics
https://www.mongodb.com/docs/manual/introduction/
https://ko.wikipedia.org/wiki/%EB%AA%BD%EA%B3%A0DB


# 왜 MongoDB 인가?

MongoDB는 NoSQL, 문서 지향 데이터베이스이며 관계형 데이터베이스에서 필요한 개념들이나 SQL을 배울 필요없어 빠르게 사용해볼 수 있다. 게다가 자바스크립트 문법으로 이루어져 있기 때문에 사용하기 더욱 좋다. 
<!-- express와 작업하기도 좋다고함-왜지? --> 

또한 매우 유명한 nosql db이기때문에 튜토리얼, 가이드 등 참고할만한 자료들이 웹 상에 아주 많이 있다(이거는 다른 DB들도 많이 해당되긴 하지만).

자바스크립트를 배우는 입장이라면 가장 먼저 접할 백엔드 소프트웨어인 nodejs, express와 호환이 좋아서 공부흐름을 이어가기도 좋다!

<!-- MongoDB 장점, 쓸만한 이유에 대하여 좀더 간결히 정리 -->

### [RDB와 MongoDB 비교]
https://poiemaweb.com/mongdb-basics

## MongoDB 설치

공식 홈페이지와 추가로 가이드를 보면서 커뮤니티 에디션 6.0버전으로 설치하였고 MongoDB Shell도 별도로 설치 해주었음.

### [MongoDB 설치 및 실행 참고자료]
https://zarkom.net/blogs/how-to-install-mongodb-for-development-in-windows-3328
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/

### [MongoDB Shell 설치]
https://www.mongodb.com/docs/mongodb-shell/install/#std-label-mdb-shell-install

# MongoShell

말 그대로 쉘같은 역할을 하는 명령어 환경. MongoShell 명령어로 세 데이터베이스를 생성하거나, 보안, 접근 권한 설정 등 MongoDB와 상호작용하기 위한 명령어 입출력 환경이다.

MongoShell 기본 명령어 외에도 자바스크립트 구문을 사용하기 때문에 자바스크립트 코드를 실행할 수도 있다!
<!-- 내용 보충 필요 -->


### [MongoDB Shell 명령어]
https://jinshine.github.io/2018/06/10/MongoDB/%EA%B8%B0%EB%B3%B8%EC%A0%81%EC%9D%B8%20%EB%AA%85%EB%A0%B9%EC%96%B4/

### [MongoDB Shell이란? (공식홈페이지 짧은 설명)]
https://www.mongodb.com/docs/mongodb-shell/


# MongoDB CRUD 명령

## MongoDB Shell 실행

MongoDB Shell로 MongoDB와 상호작용하려면 우선 MongoDB를 실행해야 하는데 `mongod.exe` 파일을 실행하거나 설치과정에서 생성한 `StartMongod.bat` 파일로 실행한다. 설치 참고자료 참조.

그 후 `mongosh` 명령어로 쉘을 실행한다.


## DB 전환 및 생성

`use [name]` 명령어로 DB 전환, 생성할 수 있다. 

```
use animalShelter
```

이름과 동일한 DB가 있는 경우 해당 DB로 전환되고, DB가 없는 경우 따로 생성할 필요없이 해당 DB에 새로운 데이터를 저장하면 DB가 자동으로 생성된다.

### DB 리스트 출력

`show dbs` 명령어로 DB 리스트를 확인할 수 있다.
```
show dbs

>> admin          40.00 KiB
   animalShelter  48.00 KiB
   config         72.00 KiB
   local          72.00 KiB
```

### 현재 DB 확인
```
db

>>> animalShelter
```


# DB 컬렉션에 데이터 삽입(생성)

문서(Document)를 컬렉션(Collection)에 삽입한다. 컬렉션이 현재 존재하지 않는 경우 삽입 작업으로 컬렉션이 생성된다.

### 문서 삽입
```
// 단일 삽입
db.dogs.insertOne(
  { name: "charlie", age: 3, breed: "corgi", catFriendly: true }
  )

// 여러 개 삽입
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])
```
### 컬렉션 확인
```
show collections

>> dogs
   inventory
```

`db.collection.find()` 명령어로 컬렉션에 삽입한 Document를 확인해보면 
```
db.dogs.find()

>> [
  {
    _id: ObjectId("62f397c71e84175d33aebcf8"),
    name: 'charlie',
    age: 3,
    breed: 'corgi',
    catFriendly: true
  }
]
```
`_id` 필드가 삽입되어 있는 걸 알 수 있다. 

MongoDB에서 컬렉션에 저장된 각 문서에는 기본 키 역할을 하는 고유한 _id 필드가 필요한데 문서 삽입 시 `_id` 필드를 따로 지정하지 않으면 MongoDB 드라이버가 `ObjectId` 자료형 값을 자동으로 생성하여 삽입한다.


# DB 컬렉션에서 문서 읽어오기(쿼리)

### db.collection.find(query, projection)
+ `query` - 문서 검색 조건. 생략하면 모든 문서를 읽는다.
+ `projection` - 검색 조건에 일치하는 문서에서 반환할 필드를 지정함.

```
use animalShelter

db.dogs.find()
```

필요에 따라 `query` 매개변수로 문서 검색 조건을 걸 수 있고, `projection`매개변수로 쿼리와 일치하는 문서들 중 반환할 필드를 지정할 수도 있다.

`query`에 쿼리 연산자를 사용하면 좀 더 구체적인 조건을 만들 수 있다(예를 들면 값 범위 지정). 

```
// dogs 컬렉션에 breed: "corgi" 인 문서들 중 age 필드만 읽어오기
db.dogs.find({ breed:"corgi" }, { age: true })

// dogs 컬렉션에 breed: "corgi" 인 문서들 중 age 필드만 제외하여 읽어오기
db.dogs.find({ breed:"corgi" }, { age: false })
```

<!-- 커서? -->

### [db.collection.find(query, projection) 매개변수 사용법] <br>
query 매개변수 https://www.mongodb.com/docs/mongodb-shell/crud/read/  <br>
projection 매개변수 https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find


# DB 업데이트하기


Mongo inserts, updates, deletions, finding/querying
