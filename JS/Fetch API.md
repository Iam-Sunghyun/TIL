# Fetch API 후속 처리

`fetch()` 프로미스는 네트워크에 오류가 있었거나, 서버의 CORS 설정이 잘못된 경우 TypeError로 거부(reject)된다.

그러나 이 두 경우는 권한처럼 설정의 문제고, 404와 같은 응답은 네트워크 오류가 아니므로 거부하지 않고 이행(resolve) 된다. 

`fetch()`가 성공했는지를 정확히 알아내려면 프로미스의 이행 여부를 확인한 후, `Response.ok` 속성의 값이 `true`인지 확인하거나 `Response.status` 코드를 확인하여 후속 처리를 해줘야 한다.

**[MDN fetch API]**

https://developer.mozilla.org/ko/docs/Web/API/Fetch_API