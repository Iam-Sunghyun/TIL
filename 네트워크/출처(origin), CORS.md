<h2>목차</h2>

- [출처(origin)란?](#출처origin란)
  - [동일한 출처 예시](#동일한-출처-예시)
  - [다른 출처 예시](#다른-출처-예시)
- [CORS(Cross Origin Resource Sharing, 교차 출처 리소스 공유)](#corscross-origin-resource-sharing-교차-출처-리소스-공유)
  - [Reference](#reference)

# 출처(origin)란?

웹 콘텐츠의 출처(origin)는 URL의 **스킴(프로토콜)**, **호스트(도메인)**, **포트**로 정의된다. 두 객체의 스킴, 호스트, 포트가 모두 일치하는 경우 같은 출처를 가졌다고 말한다. 

<div style="text-align: center">
  <img src="./img/uri.png" width="650px" heigth="550px" style="margin: 0 auto"/>
  <p style="color: gray">(https://hanseul-lee.github.io/2020/12/24/20-12-24-URL/)</p>
</div>

## 동일한 출처 예시

URL의 경로는 다르지만 스킴(http), 호스트 네임(example.com), 포트가 같기 때문에 동일한 출처(origin)이다.

+ `http://example.com/app1/index.html` 
+ `http://example.com/app2/index.html`

서버가 HTTP 콘텐츠를 기본적으로 포트 80을 통해 전달하기 때문에 동일한 출처이다.

+ `http://example.com:80` 
+ `http://example.com`


## 다른 출처 예시

아래는 서로 다른 스키마(프로토콜)을 사용하므로 다른 출처이다.

+ `http://example.com/app1`
+ `https://example.com/app2`

프로토콜은 같지만 호스트 네임이 다르기 때문에 다른 출처이다.

+ `http://example.com`
+ `http://www.example.com`
+ `http://myapp.example.com`

동일한 프로토콜에 동일한 호스트 네임을 갖지만 포트 번호가 다르므로 다른 출처이다.

+ `http://example.com`
+ `http://example.com:8080`


# CORS(Cross Origin Resource Sharing, 교차 출처 리소스 공유)

<!-- 보충 필요 -->
출처가 다른 곳에 자원을 요청하는 것을 교차 출처 요청(Cross-Origin Request)이라고 한다.

그런데 다른 출처(origin)에서의 자원을 호출하는 행위에 제한이 없을 경우 안전하지 않다. CORS (Cross-Origin Resource Sharing)는 서로 다른 출처 간 자원 호출을 승인하거나 차단하는 것을 결정하는 것을 말한다.

특정 교차 도메인 간(cross-domain) 요청, 특히 Ajax 요청은 동일-출처 보안 정책에 의해 기본적으로 금지된다.

## Reference

**[MDN 출처(origin)란]**

https://developer.mozilla.org/ko/docs/Glossary/Origin

**[MDN CORS]**

https://developer.mozilla.org/ko/docs/Glossary/CORS