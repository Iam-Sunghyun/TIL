<h2>목차</h2>

- [클라이언트에서 직접 DB에 연결하면 안되는 이유](#클라이언트에서-직접-db에-연결하면-안되는-이유)
  - [Reference](#reference)
- [`fetch API`로 API 서버와 통신하기](#fetch-api로-api-서버와-통신하기)
- [에러 처리하기](#에러-처리하기)
  - [Reference](#reference-1)

# 클라이언트에서 직접 DB에 연결하면 안되는 이유

클라이언트 자바스크립트 코드는 브라우저 개발자 도구에서 확인이 가능하다. 따라서 ID, 비밀번호 같은 자격 증명(credential)을 절대 넣어선 안된다(노출돼도 크게 상관없는 API 키 같은 것들은 제외).

이것은 클라이언트 자바스크립트에서 DB에 직접 연결하지 않는 이유이기도 하다. 데이터베이스 자격 증명이나 쿼리를 브라우저에서 읽을 수 있게 된다면 모든 사용자가 데이터베이스에 접근하거나 쿼리를 조작할 수 있게 되기 때문에 심각한 보안 문제가 발생할 수 있다.

따라서 데이터베이스와 통신할 때는 직접하는 것이 아닌 백엔드를 통해 통신하도록 한다(NodeJS, PHP, ASP.NET 등).

## Reference

**[클라이언트 자바스크립트 코드에서 숨겨야 할 것들]**

https://academind.com/tutorials/hide-javascript-code

**[REST api, GraphQL api]**

<!-- 웹 api란... -->
<!-- 둘 다 서버에 데이터를 요청하기 위한 형식, 서버가 데이터를 노출하는 방식 -->

https://academind.com/tutorials/rest-vs-graphql

# `fetch API`로 API 서버와 통신하기

'SWAPI'라는 웹사이트의 `Star Wars API`를 통해 리액트로 백엔드와 통신하는 법을 알아본다.

리액트도 결국 자바스크립트이기 때문에 특별할 것 없이 `fetch API`나 `axios`와 같은 라이브러리를 통해 서버와 통신한다.

예시에선 `fetch API`를 사용했으며 코드는 매우 간단하다. `fetchHandler` 함수에서 `fetch`로 서버에 요청 후 응답을 받아, 필요한 데이터만 뽑아내 변수에 저장하고 `set` 함수로 컴포넌트의 상태 변수에 업데이트 해준다.

```
// App.js
import React, { useCallback, useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

const SWAPI_URL = 'https://swapi.dev/api/films';

function App() {
  const [fetchedMovies, setFetchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHandler = useCallback(() => {
    setIsLoading(true);
    fetch(`${SWAPI_URL}`)
      .then((res) => res.json())
      .then((data) => {
        const movies = data.results.map((movie) => ({
            title: movie.title,
            episode_id: movie.episode_id,
            release_date: movie.release_date,
            opening_crawl: movie.opening_crawl,
          }))
          .reverse();
        setFetchedMovies(movies);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchHandler}>Fetch Movies</button>
      </section>
      <section>
        {isLoading && '로딩 중...'}
        {!isLoading && fetchedMovies.length === 0 && '영화 정보가 없습니다.' }
        {!isLoading && <MoviesList movies={ fetchedMovies } /> }
      </section>
    </React.Fragment>
  );
}
------------------------------------
// MoviesList.js
import Movie from './Movie';
import classes from './MoviesList.module.css';

const MovieList = (props) => {

  return (
    <ul className={classes['movies-list']}>
      {props.movies.map((movie) => (
        <Movie
          key={movie['episode_id']}
          title={movie.title}
          releaseDate={movie['release_date']}
          openingText={movie['opening_crawl']}
        />
      ))}
    </ul>
  );
};

export default MovieList;
-----------------------------------
// Movie.js
import classes from './Movie.module.css';

const Movie = (props) => {
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
    </li>
  );
};

export default Movie;
```

`App.js`에서 `useCallback`으로 `fetchHandler` 함수를 캐시하여 버튼이 클릭될 때마다 불필요하게 함수가 생성되지 않게 해주었다.

`isLoading` 상태 값에 따라 로딩 메시지를 출력하여 사용자에게 피드백을 줄 수 있도록 하였고, 응답이 완료되었는데 데이터가 없다면 영화 정보가 없다는 대체 문구를 출력한다. 또 버튼을 클릭할 때 마다(api서버에 새 요청할 때 마다) 리스트가 새로고침 되는 것을 보여주기 위해 `MoviesList`를 조건부 출력하였다.

`Star Wars API` 데이터는 `JSON` 형식으로 전달되므로 `Response.json()` 메서드를 통해 응답 body의 데이터를 자바스크립트 객체로 파싱하고 프로미스로 반환하도록 해주었다.

**[Star Wars API]**

https://swapi.dev/

# 에러 처리하기

잘못된 요청이나 서버 측 에러가 있는 경우 무한 로딩에 빠질 수 있다. 이는 곧 좋지 못한 사용자 경험이 된다.

따라서 HTTP 요청 시 응답에 따라 적절한 에러 처리를 해주는 것은 필수이다.

```
import React, { useCallback, useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

// 잘못된 URL 전달
const SWAPI_URL = 'https://swapi.dev/api/film';

function App() {
  const [fetchedMovies, setFetchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // async/await으로 동기적으로 결과를 받아 처리
  const fetchHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetch(`${SWAPI_URL}`);  // await을 사용하면 await 이전의 set 함수도 같이 실행된다

    // 응답 상태 코드 2xx일 경우 나머지 절차 수행
   if (result.ok) {
      const data = await result.json();
      const movies = data.results
        .map((movie) => ({
          title: movie.title,
          episode_id: movie.episode_id,
          release_date: movie.release_date,
          opening_crawl: movie.opening_crawl,
        }))
        .reverse();
      setIsLoading(false);
      setFetchedMovies(movies);
    }
    // 2xx이 아닐 경우 에러 코드 저장
    else {
      setError(result.status);
    }
  }, []);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchHandler}>Fetch Movies</button>
      </section>
      <section>
        {error && `에러 발생 코드: ${JSON.stringify(error)}`}
        {isLoading && !error && '로딩 중...'}
        {!isLoading && fetchedMovies.length === 0 && '영화 정보가 없습니다.'}
        {!isLoading && <MoviesList movies={fetchedMovies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
```

`async/await` 함수를 이용해 `fetch`로부터 응답 객체를 전달 받고, `Response.ok` 프로퍼티를 통해 상태 코드를 확인하고(상태 코드가 200~299 범위이면 `true`) '2xx'가 아닌 경우 에러 코드를 `error` 상태 변수에 저장해준다.

'2xx'인 경우 `Response.json()` 메서드로 응답 body의 `json` 데이터를 자바스크립트 객체로 파싱해주고, 필요한 값만 추출하여 `fetchedMovies`에 저장한다.

절차를 수행한 후 `error` 혹은 `fetchedMovies` 값에 따라 조건에 맞는 페이지를 출력한다.

`fetch`가 반환하는 `Response`는 프로미스이다. 또한 `Response.json()`메서드도 프로미스를 반환하며 비동기적으로 동작하기 때문에 `await`을 사용해줘야 한다는 것 주의.

<!--
프로미스를 반환한다는 것 -> 비동기로 동작한다는 것. -->

추가로 `fetch`가 반환하는 응답(프로미스)은 에러가 발생해도 에러를 `reject`하지 않는다. 네트워크에 오류가 있었거나, 서버의 CORS 설정이 잘못된 경우에만 `TypeError`로 `reject`하며, 응답 코드가 404, 500과 같은 경우에도 `status` 값이 에러 코드일 뿐, 일반적인 응답 객체를 `resolve`한 프로미스를 반환한다.

```
// fetch로 잘못된 경로로 요청했을때 응답
Response {type: 'cors', url: 'https://swapi.dev/api/sfilms', redirected: false, status: 404, ok: false, …}
  body: (...)
  bodyUsed: false
  headers: Headers {}
  ok: false
  redirected: false
  status: 404
  statusText: ""
  type: "cors"
  url: "https://swapi.dev/api/sfilms"
  [[Prototype]]: Response
```

따라서 `fetch`의 응답은 `Response.ok` 프로퍼티를 확인하여 필요에 따라 에러 객체를 직접 `throw` 해줘야한다.

다음은 `fetch`의 에러를 `try/catch`, `then/catch`로 처리하는 예시이다.

```
// async 함수에서 try/catch로 에러 처리
const fetchHandler = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await fetch(`${SWAPI_URL}`);
     // ok 프로퍼티로 응답 상태 확인
    if (!result.ok) {
      throw new Error(result.status);
    }
    const data = await result.json();
    const movies = data.results
      .map((movie) => ({
        title: movie.title,
        episode_id: movie.episode_id,
        release_date: movie.release_date,
        opening_crawl: movie.opening_crawl,
      }))
      .reverse();
    setIsLoading(false);
    setFetchedMovies(movies);
  } catch (e) {
    setError(e);
  }
}, []);
-------------------------------
// then/catch를 사용하는 경우
fetch('flowers.jpg')
  .then((response) => {
    if (!response.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다.');
    }
    return response.blob();
  })
  .then((myBlob) => {
    myImage.src = URL.createObjectURL(myBlob);
  })
  .catch((error) => {
    console.error('fetch에 문제가 있었습니다.', error);
  });
```

## Reference

**[MDN fetch의 성공 여부 확인]**

https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch#fetch%EC%9D%98_%EC%84%B1%EA%B3%B5_%EC%97%AC%EB%B6%80_%ED%99%95%EC%9D%B8

**[MDN HTTP 상태 코드]**

https://developer.mozilla.org/ko/docs/Web/HTTP/Status
