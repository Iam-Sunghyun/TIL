<!-- # MongoDB Atlas cluster 생성

**[MongoDB official - Get Started with Atlas]**

https://www.mongodb.com/docs/atlas/getting-started/ -->

# DB 생성 및 애플리케이션 연결

<!-- cluster에 DB 생성하고 앱에 연결. DB URL을 로컬DB 연결하듯 연결해준다.

```
// .env
MONGODB_URL=mongodb+srv://sunghyun1160:<비밀번호>@campinfo.wjfnuj7.mongodb.net/?retryWrites=true&w=majority
``` -->
Mongoose를 통해 MongoDB 로컬 저장소와 연결해준다.

```
const dbUrl = process.env.MONGODB_URL; // 'mongodb://localhost:27017/CampInfo'

// MongoDB 연결
mongoose.connect('dbUrl')
    .then(() => {
        console.log("MongoDB 연결 완료");
    }).catch(err => {
        console.log("MongoDB 연결 실패");
        console.log(err);
    });

```

# MongoDB에 세션 저장하기

npm 라이브러리 `express-session`과 `connect-mongo`를 사용해 MongoDB에 세션을 구성한다.

아래 예시에선 간단히 `touchAfter`만 설정하였지만 `connect-mongo`로 세션 데이터 암호화, 세션 만료 날짜 등 더 많은 세션 옵션을 설정할 수 있다.

```
// connect-mongo 세션 정보 생성
const store = MongoStore.create({
  // MongoDB URL
  mongoUrl: '....', //
  
  // 게으른 세션 업데이트(lazy session update)
  // 세션에 변경이 없으면 세션 재저장이 24시간에 한번 씩 이루어짐
  touchAfter: 24 * 3600 
})

// express-session 설정 객체
const sessionConfig = {
  // connect-mongo 세션 정보 객체를 전달하여 세션 저장 위치 설정
  store,
  secret: 'thisIsEasySecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: (1000 * 60 * 60 * 24 * 7),
    httpOnly: true,
    secure: false
  }
}

// express-session
app.use(session(sessionConfig));
```

위와 같이 `express-session` 설정 객체에 `connect-mongo`로 생성한 세션 정보 객체를 전달하여 세션 데이터 저장 위치를 MongoDB로 설정한다.

**[NPM connect-mongo]**

https://www.npmjs.com/package/connect-mongo

## DB 확인

세션 저장 위치를 MongoDB로 설정한 다음 DB를 확인해보면 MongoDB에 `session` 컬렉션이 새롭게 추가되어 세션 정보가 저장되어있다.

메모리가 아닌 DB에 저장하는 것이므로 서버를 재시작하더라도 로그인이 유지된다.

```
CampInfo> show collections
campgrounds
reviews
sessions // 새롭게 생성
users

CampInfo> db.sessions.find()
[
  {
    _id: 'VqWfi3GSbF29g06KdSTqneuhc5AXYs7b',
    expires: ISODate("2023-01-18T06:20:26.530Z"), // 기본 값인 1주일이 설정되어 있다
    lastModified: ISODate("2023-01-11T06:20:26.530Z"),
    session: '{"cookie":{"originalMaxAge":604800000,"expires":"2023-01-18T06:20:26.530Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":"test"},"flash":{}}'
  }
]
```

다른 브라우저(Edge)로 접속하면 별개의 세션이 또 생성된 것을 확인할 수 있다(쿠키는 브라우저간 공유가 안되기 때문).


<!-- # Fly.io로 배포하기

Heroku는 Paas(Platform as a service) 중 하나로 애플리케이션 배포를 쉽고 간단히 할 수 있는 클라우드 플랫폼이다. 

-> 하지만 11월 28일 부로 비용 정책이 변경되어 더이상 프리 티어(Free tier)가 제공되지 않는다. 따라서 `Fly.io`라고 하는 플랫폼 서비스를 이용해볼 것.

링크의 절차대로 따라하다가
https://fly.io/docs/languages-and-frameworks/node/#
```
> flyctl launch
```

명령어 실행하니 아래와 같은 에러 발생.
```
ERROR: failed to launch: determine start command: when there is no default process a command is required
```
packge.json에 다음과 같이 입력해준다

```
"scripts": {
    .
    .
    "start": "node app.js"
  },
```

다시 launch 해주니 아래와 같은 에러 발생. `.env` 파일에 저장했던 환경변수 값을 찾지 못해 발생한 에러.
```
Error: Cannot create a client without an access token
2023-01-11T12:34:40Z   [info]    at NodeClient.MapiClient (/workspace/node_modules/@mapbox/mapbox-sdk/lib/classes/mapi-client.js:25:11)
2023-01-11T12:34:40Z   [info]    at new NodeClient (/workspace/node_modules/@mapbox/mapbox-sdk/lib/node/node-client.js:7:14)
2023-01-11T12:34:40Z   [info]    at createNodeClient (/workspace/node_modules/@mapbox/mapbox-sdk/lib/node/node-client.js:24:10)
        .
        .
        .
```

Fly.io에서 생성한 fly.toml 파일에 다음과 같이 환경변수 설정해준다

```
[env]
  PORT = "8080"
  CLOUDINARY_CLOUD_NAME="dowpf7g5p"
  CLOUDINARY_KEY="...."
  CLOUDINARY_SECRET="..."
  MAPBOX_TOKEN="..."
  MONGODB_URL="..."
    .
    .
    .
```

다시 접속 시도했으나 에러 발생 fly.io에서 제공하는 모니터링 창을 확인해보니 다음과 같은 에러 로그를 확인할 수 있었다.

```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted. .....
```

MongoDB Atlas cluster의 IP 화이트리스트에 fly.io를 넣어주지 않아서 발생했던 것.
fly.io의 배포된 나의 앱 IP를 MongoDB 화이트리스트에 저장해준다.



<!-- fly.io 배포한 앱 수정 후 업데이트 -> 아래 명령어로 재배포

```
flyctl deploy
``` --> -->







<!-- 
**[Fly.io Node app deployment]**

https://fly.io/docs/languages-and-frameworks/node/#

**[Fly.io 환경변수 설정]**

https://fly.io/docs/reference/configuration/#the-env-variables-section

**[Fly.io troubleshooting Deployments]**

https://fly.io/docs/getting-started/troubleshooting/

**[Heroku 대체 서비스들(프리 티어 제공)]**

https://news.hada.io/topic?id=7294 -->

**[개발 관련 프리 티어 서비스 목록]**

https://free-for.dev/#/?id=paas


https://zeddios.tistory.com/1375

