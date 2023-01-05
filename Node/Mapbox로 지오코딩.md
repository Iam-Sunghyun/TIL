# 지오 코딩(Geocoding)이란?

위치 명칭으로 경도, 위도의 좌표 값을 얻는 것을 지오코딩이라고 한다.

고유 명칭이나 개별이름 등을 가지고 경도, 위도의 좌표 값을 얻는 것을 지오코딩)이라고 하고, 반대로 위도와 경도 값으로부터 고유 명칭을 얻는 것은 리버스 지오코딩(reverse geocoding)이라고 한다.

지도 정보는 서비스는 Google maps, OpenStreetMap, 카카오 Maps, 네이버 Maps 등 다양한 것들이 있는데 프로젝트에선 Mapbox라고 하는 지도 서비스를 사용할 것.

거의 무료이며 다양한 기능을 제공하여 사용자가 원하는 대로 지도를 스타일링하기 좋다.
<!-- mapbox gl js? - A JavaScript library that uses WebGL to render interactive maps from vector tiles and Mapbox styles. -->

**[Google maps vs Mapbox]**

https://www.softkraft.co/mapbox-vs-google-maps/

# Mapbox 지오코딩 실습

Mapbox 지오코딩 절차는 다음과 같다.

1. 사용자가 게시물 작성.
2. 게시물 작성 시 입력한 위치 이름으로 경도, 위도 좌표 가져와(Mapbox api 사용) MongoDB에 저장.
3. 좌표 정보로 웹 페이지 지도에 핀으로 표시.

REST api로 Mapbox 서버에 직접 요청하여 `.json` 형태도 전송받을 수도 있지만 Mapbox에서 제공하는 npm Nodejs sdk를 다운받아 사용할 것.

# Mapbox 등록하기

Mapbox는 자격 증명(credential)으로 토큰을 사용하는데 Mapbox 맵핑 라이브러리는 사용자 클라이언트 브라우저 자바스크립트로 동작하기 때문에 사용자 브라우저의 자바스크립트로 Mapbox에 토큰을 전달해줘야 한다(서버 사이드에서 사용하기 위한 시크릿 토큰도 있다).

우선 Mapbox 회원가입 후 기본으로 제공되는 공용 자격 증명 토큰을 `.env` 파일에 저장해준다.

```
// .env
MAPBOX_TOKEN=pk.eyJ1IjoiaWFtc3VuZ2h5dW4iLCJhIjoiY2xjaXl1bG93MHgwOTN2cG5sZm5wZTIxZSJ9.dQOHNQ5OJcyhPSGc2IWDzA
```

# Mapbox Nodejs sdk 사용하기

우선 `mapbox-sdk-js`를 다운로드 받는다.

```
npm install @mapbox/mapbox-sdk
```

`mapbox-sdk-js` API 응답을 받기위한 절차는 다음과 같다.

1. `mapbox-sdk-js` 객체 생성.
2. 필요한 요청 생성.
3. `send()`로 요청 전송.

## `mapbox-sdk-js` 클라이언트 객체 생성

프로젝트에 필요한 것은 정방향 지오코딩이므로 `'@mapbox/mapbox-sdk/services/geocoding'` 모듈을 불러와 `.env`에 저장한 토큰을 전달해준다.

```
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
mapboxToken({ accessToken: mapBoxToken });
```
## 필요한 요청 생성 및 전송

위치 이름을 기반으로 경도/위도 좌표 값을 받아와야 하기 때문에 `forwardGeocode()` 메서드로 요청을 생성하고, `send()`로 전송한다.

요청 메서드는 `MapiRequest` 객체를 생성하고 `send()`로 전송한다. 요청에 대한 응답으로 프로미스를 반환하는데 요청 성공 시 `MapiResponse` 객체를, 실패 시 `MapiError` 객체를 반환한다.

```
geocodingClient.forwardGeocode({
  query: 'America, CA',
  limit: 1
})
  .send()
  .then(response => {
    const match = response.body;
  });
```

**[Mapbox sdk javascript docs]**

https://github.com/mapbox/mapbox-sdk-js

https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode

