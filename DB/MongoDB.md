# 데이터베이스(Database) 필요성 간략하게

데이터베이스를 사용할 경우 파일로 저장하는 것보다 많은 장점이 있다.

1. 데이터를 지속하기 위해(보존).
2. 데이터를 효율적으로(구조화) 저장, 압축하여 관리나 접근하기 쉽게 한다.
3. 데이터 무결성, 중복을 최소화할 수 있다.
4. DBMS로 접근 권한을 설정하여 데이터를 좀 더 안전하게 관리할 수 있다(보안).
5. but 대량의 데이터를 다룰 경우 어려울 수 있음.


# SQL, NoSQL?

## SQL(Structed Query Language)

SQL은 MySQL, Postgres, SQLite, Oracle, MSSQL(Microsoft Sql Server) 등 관계형 데이터베이스에서 사용되는 질의 언어를 말한다.

관계형 데이터베이스에 데이터를 저장하기 위해선 스키마와 테이블을 세팅이 필요하며 저장되는 데이터 또한 스키마 규격에 맞아야 한다(정형화된 데이터 저장가능).

<!-- SQL, NOSQL. 특징 차이 장단점 적합한 곳 https://azderica.github.io/00-db-nosql/ -->

## NoSQL

NoSQL은 SQL같은 쿼리 언어를 사용하지 않고 Document, graph, 키/값 같이 다양한 유형으로 저장하는 모든 비관계형 데이터베이스를 말한다.

관계형 DB와 달리 스키마나 관계가 없으므로 유연하고 확장하기 쉽다.

NoSQL 데이터베이스로는 MongoDB, Couch DB, Neo4j, Cassandra, Redis 등 여러가지가 있다.

일반적으로 문서(Document) 형식에 많이들 데이터를 저장하는데 `xml`, `json`, `yaml` 등과 같은 익숙한 형식들(반정형 데이터)도 문서 형식에 포함된다.

<!-- MongoDB같은 Nosql은 어디에 적합할까? -스키마가 정형적이지 않거나 자주변동될때, 휘발성 있는(로그같은 것) 데이터 저장할 때? -->

<!-- 반정형 비정형 정형데이터? -->

### [문서 지향 데이터베이스]
https://en.wikipedia.org/wiki/Document-oriented_database

### [NoSQL 데이터베이스]
https://ko.wikipedia.org/wiki/NoSQL



# MongoDB란

### [MongoDB란?]
https://poiemaweb.com/mongdb-basics
https://www.mongodb.com/docs/manual/introduction/



# 왜 MongoDB 인가?

MongoDB는 NoSQL, 문서 지향 데이터베이스이며 관계형 데이터베이스에서 필요한 개념들이나 SQL을 배울 필요없어 빠르게 사용해볼 수 있다. 게다가 자바스크립트 문법으로 이루어져 있기 때문에 사용하기 더욱 좋다. 
<!-- express와 작업하기도 좋다고함-왜지? --> 

또한 매우 유명한 nosql db이기때문에 튜토리얼, 가이드 등 참고할만한 자료들이 웹 상에 아주 많이 있다(이거는 다른 DB들도 많이 해당되긴 하지만).

자바스크립트를 배우는 입장이라면 가장 먼저 접할 백엔드 소프트웨어인 nodejs, express와 호환이 좋아서 공부흐름을 이어가기도 좋다!

<!-- MongoDB 장점, 쓸만한 이유에 대하여 좀더 간결히 정리 -->

### [RDB와 MongoDB 비교]
https://poiemaweb.com/mongdb-basics

## MongoDB 설치

공식 홈페이지와 추가로 가이드를 보면서 커뮤니티 서버로 설치하였고 MongoDB Shell도 별도로 설치 해주었음.

### [MongoDB 설치 참고자료]
https://zarkom.net/blogs/how-to-install-mongodb-for-development-in-windows-3328
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/



# MongoShell

말 그대로 쉘같은 역할을 하는 명령어 환경. MongoShell 명령어로 세 데이터베이스를 생성하거나, 보안, 접근 권한 설정 등 MongoDB와 상호작용하기 위한 명령어 입력 환경이다.

자바스크립트 구문을 사용하기 때문에 자바스크립트 메서드들을 사용할 수도 있다!
<!-- 내용 보충 필요 -->

### [몽고db 쉘이란? (공식홈페이지 짧은 설명)]
https://www.mongodb.com/docs/mongodb-shell/


# DB 생성

use [name] -> name 명령어로 DB 전환, 생성할 수 있다. 

DB가 없는 경우 새로운 데이터를 입력할 때까지 대기하다가 새로운 데이터가 저장되면 DB가 생성되어 show dbs 명령어 입력시 DB 리스트에 출력된다.


<!-- !!BSON이란? 부터 다시보기!! -->





Mongo inserts, updates, deletions, finding/querying
