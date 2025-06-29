- [쿠키(cookie)](#쿠키cookie)
  - [쿠키 속성(cookie attribute)](#쿠키-속성cookie-attribute)
    - [MDN에서 말하는 쿠키!](#mdn에서-말하는-쿠키)
  - [Reference](#reference)

# 쿠키(cookie)

HTTP는 웹에서 서버 애플리케이션과 클라이언트 애플리케이션이 HTML문서와 같은 리소스들을 주고받을 때 사용되는 애플리케이션 계층 프로토콜이다.

HTTP는 클라이언트에 대한 상태 정보를 유지하지 않는 **무상태(stateless, 비상태) 프로토콜**이다. 즉 특정 클라이언트가 몇 초 동안 같은 요청을 2번 했을 경우, 첫 번째 요청에 이미 응답한 적이 있더라도 서버는 이전에 한 요청에 대한 정보를 저장하지 않으므로 두 번째 요청에 대해 또 같은 응답을 보낸다.

즉 무상태 프로토콜은 **각각의 요청을 독립적인 작업으로 보며(같은 브라우저의 요청인지 알지 못함), 통신할 때 상태정보를 요구하지 않는 통신 프로토콜** 이다. 이러한 특징은 서버 설계를 간편하게 하고, 동시에 수천 개의 TCP 연결을 다룰 수 있는 웹 서버를 만들 수 있게 하였다.

그러나 사용자를 식별하기 위해 상태를 유지하는 것이 웹사이트 사용에 있어서 필요할 때가 있다. 예를 들면 사용자에 따라 맞는 콘텐츠를 제공하는 경우(웹사이트 테마 설정 등) 혹은 로그인 지속, 쇼핑몰 장바구니, 게임 스코어 등 세션 관리를 위해서, 사용자의 웹사이트 사용 기록을 기록하고 분석하기 위해서다.

이럴 때 무상태 프로토콜인 HTTP는 **쿠키(cookie)** 라고 하는 텍스트 조각을 통해 사용자를 식별할 수 있게 해준다(세션과 함께 사용).

**쿠키는 'name=zerocho'와 같이 키=값 쌍의 요소들로 이루어진 작은 텍스트 파일이다(문자열만 저장할 수 있다).** 클라이언트(웹 브라우저)에 저장되며 웹 사이트에 처음 접속할 시 서버에 의해 생성되고, HTTP 응답 메시지 `Set-cookie` 헤더에 포함되어 전송된다. 그 후에 쿠키는 같은 웹 사이트(서버)에 접속할 시 요청 메시지의 `Cookie` 헤더에 포함되어 전송된다.

```
// 응답 메시지에 담긴 쿠키
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]
```

```
// 요청 메시지에 담긴 쿠키
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

## 쿠키 속성(cookie attribute)

`Set-cookie` 헤더에는 부가적으로 `secure`, `HttpOnly` 등 여러 속성을 지정할 수 있는데 종류는 다음과 같다.

|              제목               |                                                                                                                                                                                                                                                           내용                                                                                                                                                                                                                                                            |
| :-----------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|             Expires             |                                                                                                                                                                                         쿠키 만료기간을 날짜 형식으로 나타낸다. Expires 혹은 Max-Age를 지정하지 않으면 **세션 쿠키(클라이언트(브라우저) 종료시 제거됨)** 가 된다.                                                                                                                                                                                         |
|             Max-Age             |                                                                                                                                                                                 쿠키 만료까지 남은 시간(초)을 나타낸다. 0 또는 음수를 설정한 경우 쿠키를 즉시 만료시킨다. Expires와 Max-Age 둘 다 설정된 경우 Max-Age가 우선순위가 높다.                                                                                                                                                                                  |
|             Domain              |                                                                쿠키가 전송되게 될 domain(도메인)을 지정한다. 생략하면 이 속성은 기본적으로 하위 도메인(서브 도메인)을 포함하지 않는 현재 문서 URL의 도메인으로 설정되며 해당 도메인에서만 접근할 수 있다.<br> 도메인이 명시되면, 명시된 도메인을 포함한 서브 도메인에서도 쿠키에 접근할 수 있다(ex) `domain=site.com` 설정 시 -> `forum.site.com`과 같은 서브 도메인에서도 접근할 수 있고 요청시 전송됨).                                                                 |
|              Path               |                                                                                                Domain과 마찬가지로 쿠키의 유효범위를 정의하는 속성. Cookie 헤더를 전송하기 위하여 요청되는 URL 내에 반드시 존재해야 하는 경로를 설정한다. <br>ex) Path=/docs; -> /docs, /docs/Web/, /docs/Web/HTTP 모두 매치됨.<br>Path가 설정된 경우 Path가 일치하는 경우에만 쿠키를 전송하고 명시하지 않은 경우 기본값은 현재 경로이다.                                                                                                 |
|            HttpOnly             |                              XSS(Cross-Site Scripting, (공격자의 자바스크립트를 대상 클라이언트(브라우저)에 삽입해 실행시킴) 방어를 위한 옵션. <br>이 속성은 클라이언트(브라우저)측 JavaScript 코드가 쿠키에 접근하지 못하게 하는 속성으로 공격자가 XSS 공격이 성공한 경우 쿠키를 훔치는 것을 방지한다.<br>-> 클라이언트측에서 `document.cookie`로 쿠키에 접근할 수 있는데, HttpOnly 속성이 설정된 경우 접근할 수 없다. 또한 클라이언트측에서 생성한 쿠키는 HttpOnly 속성을 설정할 수 없다.                               |
|             Secure              |                                                                                                                                                                               true로 설정된 경우 암호화된 연결의 요청(HTTPS, WSS)에만 쿠키를 포함한다. 암호화되지 않은 일반 텍스트로 전송하는(HTTP, WS) 경우 헤더에 쿠키가 포함되지 않는다.                                                                                                                                                                               |
| SameSite<br>(Lax, Strict, None) | HTTP 응답 헤더의 SameSite속성을 사용하면 쿠키를 자사(first-party) 또는 동일 사이트 컨텍스트 Set-Cookie로 제한해야 하는지 여부를 설정한다. <br>아직 실험단계에 있어 모든 브라우저에서 제공되진 않는다고 함(크롬에서만 제공되는듯).<br> 자사 쿠키(first-party cookie), 타사 쿠키(third-party cookie)에 관한 것은 아래 참고 <br> https://seob.dev/posts/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%BF%A0%ED%82%A4%EC%99%80-SameSite-%EC%86%8D%EC%84%B1/ <br> https://en.wikipedia.org/wiki/HTTP_cookie#Third-party_cookie 참고 |

### MDN에서 말하는 쿠키!

```
과거엔 클라이언트 측에 정보를 저장할 때 쿠키를 주로 사용하곤 했습니다.
쿠키를 사용하는 게 데이터를 클라이언트 측에 저장할 수 있는 유일한 방법이었을 때는 이 방법이 타당했지만,
지금은 modern storage APIs를 사용해 정보를 저장하는 걸 권장합니다.
모든 요청마다 쿠키가 함께 전송되기 때문에, (특히 mobile data connections에서) 성능이 떨어지는 원인이 될 수 있습니다.
정보를 클라이언트 측에 저장하려면 Modern APIs의 종류인 웹 스토리지 API (localStorage와 sessionStorage) 와 IndexedDB를 사용하면 됩니다.
```

## Reference

**[RFC 6265 The Set-Cookie Header attribute]**

https://www.rfc-editor.org/rfc/rfc6265#section-5.2

**[javascript info 쿠키]**

https://ko.javascript.info/cookie

**[위키피디아 쿠키]**

https://en.wikipedia.org/wiki/HTTP_cookie

**[MDN HTTP 쿠키]**

https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies (내용 좀 더 긴 영어 버전)

https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies (한글 버전)

**[NHN Meetup! 쿠키에 대해]**

https://meetup.toast.com/posts/172

**[쿠키 장단점]**

https://www.webcodeexpert.com/2013/03/what-is-cookie-advantages-and.html

**[쿠키 보안 취약점]**

https://velog.io/@seaworld0125/WEB-%EC%BF%A0%ED%82%A4%EC%9D%98-%EB%B3%B4%EC%95%88-%EC%B7%A8%EC%95%BD%EC%A0%90%EA%B3%BC-%EB%8C%80%EC%9D%91%EB%B0%A9%EB%B2%95

https://www.appsecmonkey.com/blog/cookie-security

https://quadrantsec.com/security-issues-cookies/

https://appcheck-ng.com/cookie-security

**[참고. OWASP TOP 10 - 웹 애플리케이션 주요 보안 취약점]**

https://owasp.org/www-project-top-ten/

https://www.igloo.co.kr/security-information/%ED%95%9C%EB%B0%9C-%EC%95%9E%EC%84%9C-%EC%82%B4%ED%8E%B4%EB%B3%B4%EB%8A%94-owasp-top-10-2021-draft/
