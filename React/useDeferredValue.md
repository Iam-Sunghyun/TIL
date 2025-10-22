<h2>목차</h2>

- [`useDeferredValue`란?](#usedeferredvalue란)
- [`useDeferredValue`와 `useTransition`의 차이점](#usedeferredvalue와-usetransition의-차이점)
- [디바운싱(debouncing)과 차이점은?](#디바운싱debouncing과-차이점은)

# `useDeferredValue`란?

리액트 18v에서 도입된 **값 자체의 업데이트를 지연 시키는 훅**으로 긴급하지 않은 부분의 리렌더링을 지연 시키고자 할 때 사용 한다.

`useDeferredValue`에 전달된 값은 즉시 업데이트 되지 않고, 해당 값이 다른 우선순위 높은 업데이트를 먼저 완료한 후 업데이트 된다. 또한 새 값으로 업데이트 전에는 이전 값을 즉시 반환하여, 사용자에게 빈 화면이 보이는 것을 방지한다.

**`useDeferredValue`에 새 값이 전달되면(`Object.is`로 비교) 우선 이전 값으로 렌더링하고, 그 다음 백그라운드에 지연된 값(업데이트 값)으로 렌더링을 예약한다**. 예약된 렌더링은 이전 값으로 렌더링 후 화면에 커밋 된 후 실행된다.

만약 백그라운드 렌더링 중에 새 값이 계속 입력되어 `useDeferredValue`의 인수가 업데이트 되는 경우 백그라운드 렌더링이 중단(취소)되며 새로운 렌더링이 백그라운드에 예약된다(디바운싱 같은 느낌).

```
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

아래와 같이 검색 창에 입력되는 텍스트처럼 자주 업데이트 되는 값에 사용하기 좋다.

```
// App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
-------------------------------
// SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
----------------------------------
// data.js
const cache = new Map();

export function fetchData(url) {
  let promise = cache.get(url);
  if (!promise) {
    promise = fetch(url)
      .then(r => r.json())
      .then(data => {
        cache.set(url, data);
        return data;
      });
    cache.set(url, promise);
  }
  return cache.get(url);
}
```

사용자가 입력하는 텍스트(`query`)와 지연된 텍스트(`deferredQuery`)를 분리하여, 입력 중에도 이전 값으로 UI가 렌더링 되고, 목록 필터링은 입력이 끝난 후 느리게 업데이트 된다.

<!-- 또한 검색 값 업데이트를 지연 시켜  렌더링 중에 UI를 유지할 수 있다. -->

`deferredQuery` 값에 의존하는 `<SearchResults />` 컴포넌트의 경우 가장 최신 값으로 된 백그라운드 렌더링이 실행 완료되기 전 까지(사용자 입력이 끝날 때 까지) 이전 값으로 렌더링 되어 화면에 보여지게 된다.

만약 `<Suspense>`와 함께 사용할 경우 통합되어 지연된 렌더링이 진행 중에도 **fallback**이 렌더링 되지 않고 이전 값으로 렌더링 된다.

# `useDeferredValue`와 `useTransition`의 차이점

두 훅은 React 18의 동시성(concurrent) 렌더링을 위한 기능이며, UI가 끊기지 않도록 상태 업데이트를 부드럽게 처리하는 데 사용된다.

| 비교 항목      | `useTransition`                               | `useDeferredValue`                         |
| -------------- | --------------------------------------------- | ------------------------------------------ |
| 도입 버전      | React 18                                      | React 18                                   |
| 지연 대상      | 상태 업데이트 함수 (`setState`)               | 값 (`value`)                               |
| 사용 방식      | `startTransition(() => setState(...))`        | `useDeferredValue(value)`                  |
| 제어 수준      | 명시적 (어떤 업데이트를 지연시킬지 지정 가능) | 암묵적 (값의 전달을 자동 지연)             |
| 반환값         | `[isPending, startTransition]`                | `deferredValue`                            |
| 로딩 상태 확인 | `isPending`으로 가능                          | 직접 비교 필요 (`deferredValue !== value`) |
| 주 사용 사례   | 여러 상태를 동시에 관리할 때                  | 단일 입력값 렌더링이 느릴 때               |
| 코드 복잡도    | 약간 높음                                     | 간단함                                     |

<h2>요약</h2>

- 복잡한 여러 상태 관리 → `useTransition`

- 입력값 하나의 지연만 필요 → `useDeferredValue`

</br>

# 디바운싱(debouncing)과 차이점은?

고정 지연 없음 : 디바운싱과 달리 `useDeferredValue`은 고정된 시간 지연이 없다. 메인 렌더링이 완료된 직후 백그라운드 작업을 시작한다.
