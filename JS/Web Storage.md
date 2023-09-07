<h2>목차</h2>

- [클라이언트 브라우저에 데이터를 저장하는 방법](#클라이언트-브라우저에-데이터를-저장하는-방법)
  - [브라우저에 데이터를 저장했을 때 이점](#브라우저에-데이터를-저장했을-때-이점)
- [Web Storage란?](#web-storage란)
  - [LocalStorage와 SessionStorage](#localstorage와-sessionstorage)
  - [Reference](#reference)


# 클라이언트 브라우저에 데이터를 저장하는 방법

웹 개발자는 다음 웹 기술을 사용하여 브라우저에 데이터를 저장할 수 있다.

| 기술  | 설명  |
|---|---|
| **쿠키**  | HTTP 쿠키는 웹 서버와 브라우저가 페이지 탐색에서 상태 정보를 기억하기 위해 서로 보내는 작은 텍스트 데이터 조각으로 요청 헤더에 포함되어 전송되기 떄문에 많은 데이터를 저장하기에 적합하지 않다. |
| **웹 스토리지** | Web Storage API는 `localStorage` 및 `sessionStorage`를 포함하여 문자열 전용 키/값 쌍을 저장하기 위한 웹페이지용 메커니즘 제공한다. 동기적으로 동작한다.  |
| **IndexedDB**  | `IndexedDB`는 좀 더 복잡한 대용량 데이터 구조를 브라우저에 저장하고 고성능 검색을 위해 인덱싱하기 위한 웹 API이다. 비동기적으로 동작한다. |
| **Cache API**  | Cache API는 웹 페이지 로드 속도를 높이는 데 사용되는 HTTP 요청 및 응답 개체 쌍에 대한 영구 스토리지 메커니즘을 제공한다.  |
| **원본 개인 파일 시스템(OPFS)**  | OPFS는 페이지 원본에 대한 전용 파일 시스템을 제공하며 디렉토리와 파일을 읽고 쓰는 데 사용할 수 있다.  |

위의 내용 외에도 브라우저는 하나의 출처(origin)에 대해 WebAssembly 코드 캐싱과 같이 다른 유형의 데이터를 저장하기도 한다.

또한 **브라우저 내에서 각 출처(origin)에 대해 분리된 데이터 저장소가 있으며**(브라우저에 로드된 각 개별 웹 주소 마다) 한 웹 사이트에서 **다른 웹 사이트의 브라우저 저장소 데이터를 사용하려고 한다면 불가능하다**(기본적인 보안인 셈).

**[MDN What technologies store data in the browser?]**

https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#what_technologies_store_data_in_the_browser


## 브라우저에 데이터를 저장했을 때 이점

많은 데이터를 저장하기 적합하지 않은 쿠키를 제외하면, 클라이언트 저장소를 사용할 경우 클라이언트 측에 데이터를 유지한다는 점에서 다음과 같은 이점이 있다.

+ **네트워크 트래픽 감소**<BR>쿠키와 달리 HTTP 요청 헤더에 포함되지 않으므로 요청 메시지 크기가 커지지 않는다. 또 클라이언트에 저장된 데이터를 사용하여 응답 시 필요한 데이터가 줄어든다.
+ **사이트 기본 설정 개인화**<BR> 사용자가 선택한 사용자 정의 위젯, 색 구성표 또는 글꼴 크기와 같은 웹 페이지 설정 유지.
+ **이전 사이트 활동 데이터 유지**<BR> 이전 세션의 장바구니 내용 저장, 사용자가 이전에 로그인했는지 기억 등.
+ **오프라인 상태에서 데이터 사용**<BR> 데이터와 자산(asset)을 로컬에 저장하여 웹 페이지를 더 빨리(잠재적으로 더 저렴하게) 다운로드하거나 네트워크 연결 없이 사용할 수 있다. 또 네트워크 연결 끊김으로 인한 작업 손실 방지.
+ **RPC 호출의 캐시 데이터**

# Web Storage란?

Web Storage는 HTML5이 호환되는 브라우저에서 사용할 수 있는 브라우저 내에 데이터를 저장하기 위한 클라이언트 측 저장소이다.

HTML5가 지원되지 않는 이전 브라우저에선 쿠키를 이용해 브라우저에 데이터를 저장했었는데 쿠키는 도메인당 20개 정도, 각각 4KB의 용량으로 제한된다. 반면 Web Storage는 브라우저에서 출처(origin) 당 `LocalStorage`와 `SessionStorage` 각각 약 5MB를 저장할 수 있다.

## LocalStorage와 SessionStorage

웹 스토리지 객체(web storage object)인 `localStorage`와 `sessionStorage`를 통해 브라우저 내에 키-값 쌍을 저장할 수 있게 해준다. 둘 다 약 5MB로 제한되며 각 출처(origin)마다 연결되어있다. 두 객체는 다음과 같은 특성을 갖는다.

`window.sessionStorage`
+ 각각의 출처(origin)에 대해 독립적인 저장 공간을 페이지 세션이 유지되는 동안(브라우저 또는 탭이 닫힐 때까지만) 저장된다.
+ 데이터를 절대 서버로 전송하지 않는다.

`window.localStorage`
+ 브라우저를 닫았다 열어도 데이터가 남아있다.
+ 유효기간 없이 데이터를 저장하고, JavaScript를 사용하거나 브라우저 캐시 또는 로컬 저장 데이터를 지워야만 사라진다.

또한 두 객체는 동일한 프로퍼티와 메서드를 갖고있으며 전역 객체에 바인딩 되어있다. 또한 이터러블이 아니다.

+ `setItem(key, value)` – 키-값 쌍을 저장
+ `getItem(key)` – 키에 해당하는 값을 반환
+ `removeItem(key)` – 키와 해당 값을 삭제
+ `clear()` – 모든 데이터 삭제
+ `key(index)` – 인덱스(index)에 해당하는 키를 반환
+ `length` – 저장된 항목의 개수를 반환

사용 방식에 대한 예제는 [자바스크립트 인포](https://ko.javascript.info/localstorage) 참고.

## Reference

**[MDN Client-side storage]**

https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage

**[MDN Web storage API]**

https://developer.mozilla.org/ko/docs/Web/API/Web_Storage_API


**[Localstorage vs Sessionstorage]**

https://www.xenonstack.com/insights/local-vs-session-storage-vs-cookie

**[Storage for the web]**

https://web.dev/storage-for-the-web/



