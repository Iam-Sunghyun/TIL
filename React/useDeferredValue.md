<h2>목차</h2>

- [`useDeferredValue`란?](#usedeferredvalue란)
  - [`<Suspense>`와 함께 사용 할 경우?](#suspense와-함께-사용-할-경우)
  - [`memo`로 추가 최적화하기](#memo로-추가-최적화하기)
- [로딩 중 표시하기](#로딩-중-표시하기)
- [`useDeferredValue`와 `useTransition`의 차이점](#usedeferredvalue와-usetransition의-차이점)
- [`useDeferredValue`과 디바운싱(debouncing)의 차이점은?](#usedeferredvalue과-디바운싱debouncing의-차이점은)
  - [`useDeferredValue`와 디바운싱을 함께 쓰는 경우](#usedeferredvalue와-디바운싱을-함께-쓰는-경우)

# `useDeferredValue`란?

리액트 18v에서 도입된 **값 자체의 업데이트를 지연 시키는 훅**으로 긴급하지 않은 부분의 렌더링을 지연 시키고자 할 때 사용 한다.

`useDeferredValue`에 전달된 값은 즉시 업데이트 되지 않고, 다른 우선순위 높은 업데이트를 먼저 완료한 후 업데이트 된다. 또한 새 값으로 업데이트 전에는 이전 값을 즉시 반환하여, 사용자에게 빈 화면이 보이는 것을 방지한다.

**`useDeferredValue`에 새 값이 전달되면(`Object.is`로 비교) 우선 이전 값으로 렌더링하고, 그 다음 백그라운드에 지연된 값(업데이트 값)으로 렌더링을 예약한다**. 예약된 렌더링은 이전 값으로 렌더링 후 화면에 커밋 된 후 실행된다.

만약 백그라운드 렌더링 중에 새 값이 계속 입력되어 `useDeferredValue`가 업데이트 되는 경우 백그라운드 렌더링이 중단(취소)되며 새로운 렌더링이 새 값으로 백그라운드에 예약된다(디바운싱 같은 느낌). 또한 `useDeferredValue`로 인한 백그라운드 리렌더링은 화면에 커밋될 때까지 `effect`를 실행하지 않는다.

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
import { use } from 'react';
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
// data.js -> 대략적인 패턴
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

위 예시에선 사용자가 입력하는 텍스트(`query`)와 지연된 텍스트(`deferredQuery`)를 분리하여, 입력 중에도 이전 값으로 UI가 렌더링 되고, 목록 필터링은 입력이 끝난 후 느리게 업데이트 된다.

즉, `deferredQuery` 값에 의존하는 `<SearchResults />` 컴포넌트의 경우 가장 최신 값으로 된 백그라운드 렌더링이 실행 완료되기 전 까지 이전 값으로 렌더링 되어 화면에 보여지게 된다.

## `<Suspense>`와 함께 사용 할 경우?

만약 `<Suspense>`와 함께 사용할 경우 `useDeferredValue` 자체는 백그라운드 렌더링이 진행 중에도 **fallback**이 렌더링 되지 않고 이전 값으로 렌더링 된다. 왜냐하면 `<Suspense>`의 경우 렌더링 중 데이터 불가 상태 감지 시 렌더링을 fallback으로 전환하는데, `useDeferredValue`의 경우 이전 UI가 이미 있는 상태이기 때문에 `<Suspense>`가 작동하지 않는다.

<!-- 하지만 useDeferredValue로 지연된 값이 use()나 데이터 로딩을 일으키는 컴포넌트에 전달되면, 그 컴포넌트는 Suspense에 의해 로딩(또는 이전 UI 유지) 동작을 겪는다. -->

<!--
좀 더 자세히 — 언제 fallback이 보이고 언제 안 보이나

1. 직접 use()로 데이터 불러오는 컴포넌트에 즉시 값이 들어가면 해당 컴포넌트가 데이터를 기다리면 Suspense가 fallback을 보여줌.

2. 값을 useDeferredValue로 지연시켜 전달하면 React는 이전에 커밋된 UI(이전 결과) 를 유지한 채로 새 렌더를 백그라운드에서 준비한다.
따라서 fallback이 보이지 않고(보일 수도 있지만 보통은 안 보임), 준비가 끝나면 UI를 한 번에 교체(commit)한다.

3.결론: useDeferredValue 자체는 Suspense fallback을 유발하지 않음.
Suspense가 동작하는 상황(데이터가 unresolved 상태)과 useDeferredValue가 만든 “지연”은 서로 다른 레이어의 메커니즘이다. -->

<h2>정리</h2>

| 단계                    | 일반 `<Suspense>`  | `useDeferredValue`                |
| ----------------------- | ------------------ | --------------------------------- |
| 새로운 데이터 요청 시작 | 바로 fallback 표시 | 이전 UI 유지                      |
| 데이터 로딩 중          | fallback 렌더링됨  | 이전 UI 계속 보임                 |
| 데이터 로딩 완료        | 새 UI 렌더링       | 새 UI 렌더링 (지연된 값으로 교체) |

</br>

## `memo`로 추가 최적화하기

위 예시의 `SearchResults` 컴포넌트를 `memo`로만 감싸줘도 지연된 렌더링이 완료되기 전까지 동일한 이전 값을 `props`로 받기 때문에 불필요한 렌더링을 줄일 수 있다.

# 로딩 중 표시하기

위 예시에서 사용자는 네트워크 응답 시간이 길어져도 `<Suspense>`의 fallback이 작동하지 않기 때문에 이를 식별 할 수 없다.

이때 아직 새 값이 로딩 중인 것을 명확하게 알리기 위해 다음과 같이 작성하여 시각적 표시를 추가해 줄 수 있다.

```
// 항상 새 값이 저장 된 query와 deferredQuery 비교
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

# `useDeferredValue`와 `useTransition`의 차이점

<!--  -->

두 훅은 React 18의 동시성(concurrent) 렌더링으로 가능해진 기능이며, UI가 끊기지 않도록 상태 업데이트를 부드럽게 처리하는 데 사용된다.

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

<h2></h2>

- 복잡한 여러 상태 관리 → `useTransition`

- 입력값 하나의 지연만 필요 → `useDeferredValue`

</br>

# `useDeferredValue`과 디바운싱(debouncing)의 차이점은?

| 구분                | `useDeferredValue`                                                 | **Debounce (ex: `lodash.debounce`)**                         |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| **지연의 대상**     | **렌더링(UI 업데이트)**                                            | **함수 실행 자체**                                           |
| **동작 시점**       | 값이 변경된 **후**, React 렌더링 중 지연 발생                      | 값이 변경된 **즉시가 아니라**, 일정 시간 “입력 없을 때” 실행 |
| **지연 방식**       | React의 **Concurrent Rendering**을 이용한 “낮은 우선순위 업데이트” | 타이머(`setTimeout`) 기반의 단순한 시간 지연                 |
| **목적**            | UI 응답성을 유지하면서 무거운 렌더링을 늦추기                      | 과도한 요청(fetch, API call 등) 줄이기                       |
| **React 인식 여부** | ✅ React가 스케줄링 제어                                           | ❌ React는 타이머 내부 동작을 모름                           |
| **Suspense 연동**   | ✅ 가능 (`use()`와 함께)                                           | ❌ 불가능                                                    |
| **취소 시점**       | 새 값이 들어오면 이전 렌더링 취소                                  | 새 입력이 들어오면 이전 타이머 clear됨                       |

결론은 `useDeferredValue`는 “렌더링 지연”이고, `debounce`는 “실행 지연”이다.
`useDeferredValue`는 React 내부 우선순위 스케줄링에 속하고, `debounce`는 단순한 시간 기반 제어이기 때문에 React는 그 내부를 모른다.

## `useDeferredValue`와 디바운싱을 함께 쓰는 경우

```
function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const debouncedFetch = useMemo(() =>
    debounce((q) => fetchResults(q), 300), []
  );

  useEffect(() => {
    debouncedFetch(deferredQuery);
  }, [deferredQuery]);

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
```

- `useDeferredValue`: 렌더링 스케줄 최적화
- `debounce`: API 호출 횟수 제어

둘을 조합하면 UI는 부드럽고, 네트워크 낭비도 없음.
