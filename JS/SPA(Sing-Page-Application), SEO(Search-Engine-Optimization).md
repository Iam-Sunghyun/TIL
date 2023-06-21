<h2>목차</h2>

- [SPA(Sing Page Application)이란?](#spasing-page-application이란)
- [SPA VS MPA 비교](#spa-vs-mpa-비교)
  - [MPA(Multi Page Application)](#mpamulti-page-application)
  - [SPA(Sing Page Application)](#spasing-page-application)
  - [Reference](#reference)
- [SPA(Sing Page Application)의 문제점](#spasing-page-application의-문제점)
  - [SEO에 문제가 되는 이유 보충](#seo에-문제가-되는-이유-보충)
- [SPA의 SEO 솔루션](#spa의-seo-솔루션)
  - [Reference](#reference-1)

# SPA(Sing Page Application)이란?

SPA(Sing Page Application)란 모던 웹 패러다임으로 **단일 페이지로 구성된 웹 애플리케이션을 말한다.**

MPA(Multi Page Application)처럼 서버로부터 새로운 페이지를 불러오지 않고 하나의 페이지에서 자바스크립트를 통해 동적으로 페이지를 변경한다. 또한 필요시 AJAX로 서버에 데이터를 요청하여 `json`으로 응답받아 필요한 부분만 갱신한다.

# SPA VS MPA 비교
<!-- 일단 1차 완료 -->
SPA와 MPA의 가장 큰 차이는 페이지 로딩 방식에 있다.

## MPA(Multi Page Application)

전통적인 **MPA(Multi Page Application)** 는 **요청마다 새로운 전체 페이지를 서버 측에서 렌더링하여 클라이언트에 응답한다.** 이러한 방식은 초기 로딩 속도가 빠르지만 요청마다 새로운 페이지를 서버측에서 구성 후 전송하기 때문에 불필요한 부분까지 계속해서 렌더링하게 되어 비효율적이고 또 클라이언트 측에서는 새로고침으로 인해 화면이 잠시 깜빡이는 현상까지 발생하게 된다.

<H3>장점</H3>

+ 검색 엔진 최적화(SEO)에 유리<br>
MPA는 각 페이지에 고유한 URL이 있고 개별적으로 인덱싱할 수 있기 때문에 검색 엔진 결과에서 높은 순위를 차지하는 경향이 있다. 즉, MPA의 각 페이지는 검색 결과에서 독립적으로 순위를 매길 수 있으며 잠재적으로 사이트로 더 많은 트래픽을 유도할 수 있다.
+ 초기 로딩 속도 빠름

<H3>단점</H3>

+ 매번 페이지를 서버에 요청하여 로드하므로 페이지 전환 속도가 느리고 깜빡거림 현상 존재
+ 페이지를 매번 요청하여 응답 받으므로 SPA에 비해 서버 부하가 큼

## SPA(Sing Page Application)

**SPA(Sing Page Application)** 는 클라이언트가 서버에 요청을 하게 되면 **HTML, CSS, js 등 사이트의 모든 필요한 정적 리소스를 최초 한번만 다운로드한다.** 그 다음 페이지 갱신에 필요한 데이터를 `JSON`으로 전달받아(AJAX를 이용) 페이지를 갱신하므로 트래픽을 감소시킬 수 있고, 전체 페이지를 다시 렌더링하는게 아닌 필요한 부분만을 갱신하므로 새로고침이 발생하지 않아 네이티브 앱과 유사한 사용자 경험을 제공할 수 있다.

모바일 사용이 데스크톱을 넘어선 현재, 트래픽의 감소와 속도, 사용성, 반응성의 향상은 매우 중요한 이슈이다. **SPA의 핵심 가치는 사용자 경험(UX) 향상에 있으며** 부가적으로 애플리케이션 속도의 향상도 기대할 수 있어서 모바일 퍼스트(Mobile First) 전략에 부합한다.

<H3>장점</H3>

+ 초기에 필요한 리소스를 모두 다운받고, 필요한 데이터만 요청하여 페이지를 갱신하므로 서버 부하가 적다 
+ 보통 CSR로 동작하므로 최초 로드 후 페이지 전환이 클라이언트 사이드에서 이루어지기 때문에 속도가 빠르다. -> 사용자 경험이 더 좋다
+ 프론트, 백엔드의 분리가 명확하여 코드 유지보수가 쉬워진다
+ 파일 구성이 단순하여 배포가 간단하다

<H3>단점</H3>

+ 검색 엔진 최적화(SEO)에 불리하다<BR>
SPA는 일반적으로 URL이 하나뿐이고(페이지가 변경되어도) 초기 페이지 로드 시 콘텐츠가 제한된다. 이것은 검색 엔진 순위에 영향을 미치기 때문에 검색 엔진 최적화가 어려움

+ 초기 로딩 속도가 느리다

## Reference

**[SPA VS MPA]**

https://cleancommit.io/blog/spa-vs-mpa-which-is-the-king/

https://yojji.io/blog/spa-vs-mpa


# SPA(Sing Page Application)의 문제점
>
리액트는 SPA 라이브러리이며 기본적으로 CSR(Client Side Rendering)로 동작한다. 여기서 CSR의 대표적인 문제가 있는데 바로 초기 로딩 속도가 느리다는 점과, SEO(Search Engine Optimization)문제이다. 

## SEO에 문제가 되는 이유 보충
<!-- 내용 수정 및 확인 필 -->
웹 사이트 속도가 빨라 사용자 경험 측면에서 우수한 SPA는 사실 SEO 친화적이지 않다. 그 이유는 다음과 같다.

1. **자바스크립트를 통한 페이지 렌더링** <br>
SPA는 하나의 빈 페이지에서 여러 페이지를 자바스크립트로 구현하는 방식이기 때문에(클라이언트 사이드에서) 자바스크립트를 읽지 못하는 검색엔진에 대해서는 크롤링이 안되어 색인(Indexing)이 되지 않는 문제가 발생할 수 있다. 구글의 경우 크롤링 과정에서 Googlebot이 자바스크립트를 구동하여 읽을 수 있지만 이 또한 서버 사이드에서 전혀 렌더링되지 않은 자바스크립트 덩어리를 Googlebot이 렌더링하여 크롤링하는 과정에서 많은 시간이 소요된다(또한 콘텐츠가 비동기로 로드되는 경우 누락될 수 있다고 함).

1. **하나의 Meta Data** <br>
Meta Data 또한 하나의 페이지라는 SPA의 본질적인 특성에서 발생하는 문제다. 아래의 사이트는 SPA 방식으로 제작된 페이지다. MPA페이지와 같이 <Head>부분에 메타 태그를 삽입한 모습을 볼 수 있지만, 안타깝게도 해당 사이트 내의 다른 페이지로 이동하더라도 HTML은 변동되지 않기 때문에 모든 페이지 (단일 페이지이지만)에 동일한 메타 데이터를 삽입하게 되는 상황이 발생한다.

<div style="text-align: center">
<img src="https://www.ascentkorea.com/wp-content/uploads/2021/08/image-8.png" width="500px" height="350px" >
</div>

<br>

3. **크롤러에게는 하나의 페이지** <br>
크롤러는 기본적으로 이미 알려진 페이지를 크롤링한다. 즉, 하나의 페이지에 들어갔을 때 발견되는 URL을 대기열에 저장하고 저장된 URL을 기반으로 다시 크롤링하고 대기열에 저장하고를 반복하여 크롤링하게 된다. 그러나 SPA 방식의 웹사이트의 경우 기본적으로 자바스크립트로 페이지 이동을 구현하기 때문에 크롤러가 사이트에 있는 모든 페이지 (하나의 페이지이지만)의 내용을 크롤링하지 못하는 경우가 발생할 수 있다.


# SPA의 SEO 솔루션
   
위의 문제를 해결하기 위해 아래와 같이 **SSR (Server Side Rendering)** 또는 **동적 렌더링 (Dynamic Rendering)**, 그리고 **History API**를 이용하여 SEO, 즉, 검색 엔진 최적화를 할 수 있다.

1. **SSR (Server Side Rendering)** <br>
만약, 우리 사이트가 구축 전이어서 SEO 구축이 필요한 상황이라면 SPA를 SSR(서버 사이드 렌더링) 방식으로 구축하여야 한다. <br>SPA는 기본적으로 CSR (Client-Side Rendering) 방식으로 구현된다. 즉, 서버에서는 HTML, JS 등 모든 재료를 다운 받은 후 클라이언트 단에서 렌더링을 하는 방식을 취한다. 그러나 SPA이지만 크롤링에 더 친화적인 SSR 방식으로 사이트를 구축하는 것이 SEO의 관점에서 적합하다. 참고로 대표적인 SSR 프레임워크로는 React의 Next.js, Vue의 Nuxt, Angular의 Angular Universal이 있다.
<!-- 내용 수정 및 확인 필 -->
2. **사전 렌더링 (pre-rendering)** <br>
만약 우리 사이트가 이미 SPA의 CSR 방식으로 구현되어있거나, SSR을 사용하지 못한다면, 동적 렌더링 (Dynamic Rendering)을 통해 SEO할 수 있다. <br>사전 렌더링은 서버에서 요청하는 자가 사람인지 크롤러인지 판단하여 사람에게는 HTML과 js 등을 제공하고 크롤러에게는 사전에 렌더링된 HTML 버전의 페이지를 보여주는 방식이다. 즉, 크롤러는 서버에서 이미 렌더링된 HTML 버전의 소스를 손쉽게 읽을 수 있게 된다. <br>동적 렌더링을 하는 방법으로는 react-helmet, prerender-spa-plugin, prerender.io, puppeteer, rendertron 등이 있다.

```
구글 홈페이지에선 동적 렌더링은 임시방편이며 장기적인 솔루션으로는 권장하지 않고 있음. 대신 서버 측 렌더링, 정적 렌더링, 하이드레이션을 권장하고 있다.
```
**[developers.google - 크롤링 및 색인 생성 - 동적 렌더링을 사용하여 대처]**

https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering?hl=ko

3. **History API** <br>
History API는 SPA방식의 웹사이트에서 주소가 바뀌지 않는 문제를 해결하기 위해 싱글페이지이지만 주소를 부여하는 기능의 웹 API다. History API는 어떤 렌더링 방식이든지 사용해야 한다. <br>
과거 SPA환경에서 #또는 #!을 통해 주소를 구분하였지만 현재는 History API와 pushState() 방법을 통해 특수문자로 된 주소가 아닌 정적인 URL과 같은 주소를 설정할 수 있게 되었다. SEO의 관점에서 이는 크롤링뿐만 아니라 백링크를 얻기 용이하게 되었다고 볼 수 있다.


## Reference

**[SPA의 SEO, 어떻게 해야할까?]**

https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=ko

https://www.ascentkorea.com/seo-for-spa/

