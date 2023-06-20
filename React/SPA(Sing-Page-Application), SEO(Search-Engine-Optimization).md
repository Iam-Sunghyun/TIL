<h2>목차</h2>

- [SPA(Sing Page Application)이란?](#spasing-page-application이란)
  - [SPA VS MPA (SPA 장점)](#spa-vs-mpa-spa-장점)
- [SPA(Sing Page Application)의 문제점](#spasing-page-application의-문제점)
  - [SEO에 문제가 되는 이유](#seo에-문제가-되는-이유)
- [SPA의 SEO 솔루션](#spa의-seo-솔루션)
  - [Reference](#reference)

# SPA(Sing Page Application)이란?

SPA(Sing Page Application)란 모던 웹 패러다임으로 **단일 페이지로 구성된 웹 애플리케이션을 말한다.** MPA처럼 서버로부터 새로운 페이지를 불러오지 않고 하나의 페이지에서 자바스크립트를 통해 동적으로 페이지를 변경한다.

## SPA VS MPA (SPA 장점)

SPA와 MPA의 가장 큰 차이는 로딩 방식에 있다.

전통적인 **MPA(Multi Page Application)** 는 **요청마다 새로운 전체 페이지를 서버 측에서 렌더링하여 클라이언트에 응답한다.** 이러한 방식은 요청마다 변경이 불필요한 부분까지 계속해서 렌더링하게 되어 비효율적이고 또 클라이언트 측에서는 화면이 잠시 깜빡이는 현상까지 발생하게 된다.

이와 달리 **SPA(Sing Page Application)** 는 클라이언트가 서버에 요청을 하게 되면 **HTML, CSS, js 등 사이트의 모든 필요한 정적 리소스를 최초 한번만 다운로드한다.** 그 다음 페이지 갱신에 필요한 데이터를 `JSON`으로 전달받아(AJAX를 이용) 페이지를 갱신하므로 트래픽을 감소시킬 수 있고, 전체 페이지를 다시 렌더링하는게 하닌 필요한 부분만을 갱신하므로 새로고침이 발생하지 않아 네이티브 앱과 유사한 사용자 경험을 제공할 수 있다.다

모바일 사용이 데스크톱을 넘어선 현재, 트래픽의 감소와 속도, 사용성, 반응성의 향상은 매우 중요한 이슈이다. **SPA의 핵심 가치는 사용자 경험(UX) 향상에 있으며** 부가적으로 애플리케이션 속도의 향상도 기대할 수 있어서 모바일 퍼스트(Mobile First) 전략에 부합한다.

# SPA(Sing Page Application)의 문제점

리액트는 SPA 라이브러리이며 CSR로 동작한다. 여기서 CSR의 대표적인 문제가 있는데 바로 초기 로딩 속도가 느리다는 점과, SEO(Search Engine Optimization)문제이다. 

## SEO에 문제가 되는 이유
<!-- 내용 수정 및 확인 필 -->
웹 사이트 속도가 빨라 사용자 경험 측면에서 우수한 SPA는 사실 SEO 친화적이지 않다. 그 이유는 다음과 같다.

1. **자바스크립트를 통한 페이지 렌더링** <br>
SPA는 하나의 페이지에 여러 페이지를 클라이언트 사이드에서 자바스크립트로 구현하는 방식이기 때문에 자바스크립트를 읽지 못하는 검색엔진에 대해서는 크롤링이 안되어 색인(Indexing)이 되지 않는 문제가 발생할 수 있다. 구글의 경우 크롤링 과정에서 Googlebot이 자바스크립트를 구동하여 읽을 수 있지만 이 또한 서버사이드에서 전혀 렌더링되지 않은 자바스크립트 덩어리를 Googlebot이 렌더링하여 크롤링하는 과정에서 많은 시간이 소요된다.

2. **하나의 Meta Data** <br>
Meta Data 또한 하나의 페이지라는 SPA의 본질적인 특성에서 발생하는 문제다. 아래의 사이트는 SPA 방식으로 제작된 페이지다. MPA페이지와 같이 <Head>부분에 메타 태그를 삽입한 모습을 볼 수 있지만, 안타깝게도 해당 사이트 내의 다른 페이지로 이동하더라도 HTML은 변동되지 않기 때문에 모든 페이지 (단일 페이지이지만)에 동일한 메타 데이터를 삽입하게 되는 상황이 발생한다.

<div style="text-align: center">
<img src="https://www.ascentkorea.com/wp-content/uploads/2021/08/image-8.png" width="500px" height="350px" >
</div>

<br>

1. **크롤러에게는 하나의 페이지** <br>
크롤러는 기본적으로 이미 알려진 페이지를 크롤링한다. 즉, 하나의 페이지에 들어갔을 때 발견되는 URL을 대기열에 저장하고 저장된 URL을 기반으로 다시 크롤링하고 대기열에 저장하고를 반복하여 크롤링하게 된다. 그러나 SPA 방식의 웹사이트의 경우 기본적으로 사이트 내의 페이지로 향하는 href속성을 html에서 사용하지 않고 자바스크립트로 페이지 이동을 구현하기 때문에 크롤러가 사이트에 있는 모든 페이지 (하나의 페이지이지만)의 내용을 크롤링하지 못하는 경우가 발생할 수 있다.


# SPA의 SEO 솔루션
   
위의 문제를 해결하기 위해 아래와 같이 **SSR (Server Side Rendering)** 또는 **동적 렌더링 (Dynamic Rendering)**, 그리고 **History API**를 이용하여 SEO, 즉, 검색 엔진 최적화를 할 수 있다.

1. **SSR (Server Side Rendering)** <br>
만약, 우리 사이트가 구축 전이어서 SEO 구축이 필요한 상황이라면 SPA를 SSR (서버사이드렌더링) 방식으로 구축하여야한다. <br>SPA는 기본적으로 CSR (Client-Side Rendering) 방식으로 구현된다. 즉, 서버에서는 HTML, JS 등 모든 재료를 다운 받은 후 클라이언트 단에서 렌더링을 하는 방식을 취한다. 그러나 SPA이지만 크롤링에 더 친화적인 SSR 방식으로 사이트를 구축하는 것이 SEO의 관점에서 적합한다. 참고로 대표적인 SSR 프레임워크로는 React의 Next.js, Vue의 Nuxt, Angular의 Angular Universal이 있다.

2. **동적 렌더링 (Dynamic Rendering)** <br>
만약 우리 사이트가 이미 SPA의 CSR 방식으로 구현되어있거나, SSR을 사용하지 못한다면, 동적 렌더링 (Dynamic Rendering)을 통해 SEO할 수 있다. <br>동적 렌더링은 서버에서 요청하는 자가 사람인지 크롤러인지 판단하여 사람에게는 HTML과 js 등을 제공하고 크롤러에게는 사전에 렌더링된 HTML 버전의 페이지를 보여주는 방식이다. 즉, 크롤러는 서버에서 이미 렌더링된 HTML 버전의 소스를 손쉽게 읽을 수 있게 된다. <br>동적 렌더링을 하는 방법으로는 react-helmet, prerender-spa-plugin, prerender.io, puppeteer, rendertron 등이 있다.

3. **History API** <br>
History API는 SPA방식의 웹사이트에서 주소가 바뀌지 않는 문제를 해결하기 위해 싱글페이지이지만 주소를 부여하는 기능의 API다. History API는 어떤 렌더링 방식이든지 사용해야 한다. <br>
과거 SPA환경에서 #또는 #!을 통해 주소를 구분하였지만 현재는 History API와 pushState() 방법을 통해 특수문자로 된 주소가 아닌 정적인 URL과 같은 주소를 설정할 수 있게 되었습니다. SEO의 관점에서 이는 크롤링뿐만 아니라 백링크를 얻기 용이하게 되었다고 볼 수 있다.


## Reference

**[SPA의 SEO, 어떻게 해야할까?]**

https://www.ascentkorea.com/seo-for-spa/

**[poiemaweb SPA]**

https://poiemaweb.com/js-spa
