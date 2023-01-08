**목차**

- [지오 코딩(Geocoding)이란?](#지오-코딩geocoding이란)
- [Mapbox 지오코딩 실습](#mapbox-지오코딩-실습)
  - [Mapbox 등록하기](#mapbox-등록하기)
  - [Mapbox Nodejs sdk 사용하기](#mapbox-nodejs-sdk-사용하기)
    - [`mapbox-sdk-js` 클라이언트 객체 생성](#mapbox-sdk-js-클라이언트-객체-생성)
    - [필요한 요청 생성 및 전송](#필요한-요청-생성-및-전송)
    - [응답 객체(`MapiResponse`) 확인](#응답-객체mapiresponse-확인)
  - [GeoJSON 객체 MongoDB 저장하기](#geojson-객체-mongodb-저장하기)
  - [지도 렌더링하기](#지도-렌더링하기)
  - [지도에 마커로 표시하기](#지도에-마커로-표시하기)
  - [Mapbox GL JS 자바스크립트 모듈 분리](#mapbox-gl-js-자바스크립트-모듈-분리)
  - [지도 팝업 커스터마이징](#지도-팝업-커스터마이징)


# 지오 코딩(Geocoding)이란?

위치 명칭으로 경도, 위도의 좌표 값을 얻는 것을 지오코딩이라고 한다.

고유 명칭이나 개별이름 등을 가지고 경도, 위도의 좌표 값을 얻는 것을 '지오코딩'이라고 하고, 반대로 위도와 경도 값으로부터 고유 명칭을 얻는 것은 '리버스 지오코딩(reverse geocoding)'이라고 한다.

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

## Mapbox 등록하기

Mapbox는 자격 증명(credential)으로 토큰을 사용하는데 Mapbox 맵핑 라이브러리(지도 렌더링)는 사용자 클라이언트 브라우저 자바스크립트로 동작하기 때문에 사용자 브라우저의 자바스크립트로 Mapbox에 토큰을 전달해줘야 한다(서버 사이드에서 사용하기 위한 시크릿 토큰도 있다).

우선 Mapbox 회원가입 후 기본으로 제공되는 공용 자격 증명 토큰을 `.env` 파일에 저장해준다.

```
// .env
MAPBOX_TOKEN=pk.eyJ1IjoiaWFtc3VuZ2h5dW4iLCJhIjoiY2xjaXl1bG93MHgwOTN2cG5sZm5wZTIxZSJ9.dQOHNQ5OJcyhPSGc2IWDzA
```

## Mapbox Nodejs sdk 사용하기

그 후 `mapbox-sdk-js`를 다운로드 받는다.

```
npm install @mapbox/mapbox-sdk
```

`mapbox-sdk-js` API 응답을 받기위한 절차는 다음과 같다.

1. `mapbox-sdk-js` 객체 생성.
2. 필요한 요청 생성.
3. `send()`로 요청 전송.

### `mapbox-sdk-js` 클라이언트 객체 생성

프로젝트에 필요한 것은 정방향 지오코딩이므로 `'@mapbox/mapbox-sdk/services/geocoding'` 팩토리 함수를 불러와 `.env`에 저장한 토큰을 전달하여 호출해주면 요청을 생성할 수 있는 서비스 클라이언트 객체가 생성된다.

```
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN; });
```

### 필요한 요청 생성 및 전송

위치 이름을 기반으로 경도/위도 좌표 값을 받아와야 하기 때문에 mapbox 서비스 객체의 `forwardGeocode()` 메서드로 요청을 생성하고, `send()`로 전송한다.

요청 메서드는 `MapiRequest` 객체를 생성하고 `send()`로 전송한다. 요청에 대한 응답으로 프로미스를 반환하는데 요청 성공 시 `MapiResponse` 객체를, 실패 시 `MapiError` 객체를 반환한다.

```
geoCoder.forwardGeocode({
  query: 'America, CA',
  limit: 1 // 검색된 위치 개수 한도
})
  .send()
  .then(response => {
    const match = response.body;
  });
```

### 응답 객체(`MapiResponse`) 확인

아래는 Mapbox 응답 객체 `MapiResponse`(`GeoJSON`)의 `body`이며 `features` 프로퍼티에 검색 결과가 저장되어 있다. 요청 생성 시 전달한 `limit` 값을 1로 두었기 때문에 하나의 검색 결과만 담고있다.

이 중 필요한 것은 응답 `features`의 `geometry` 프로퍼티에 저장된 경도/위도 값이다.

```
geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  })
  .send()
  .then(res => console.log(res.body));

>[
  {
    type: 'FeatureCollection',
    query: ['paris', 'france'],
    features: [
      {
        id: 'place.894029',
        type: 'Feature',
        place_type: ['region', 'place'],
        relevance: 1,
        properties: { short_code: 'FR-75', wikidata: 'Q90' },
        text: 'Paris',
        place_name: 'Paris, France',
        bbox: [2.224224923, 48.815606901, 2.4697091, 48.9020121],
        center: [2.3483915, 48.8534951],
        geometry: { type: 'Point', coordinates: [2.3483915, 48.8534951] },
        context: [{ id: 'country.8781', short_code: 'fr', wikidata: 'Q142', text: 'France' }],
      },
    ],
    attribution:
      'NOTICE: © 2022 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare.',
  },
];
```

**[Mapbox Search-Geocoding docs]**

https://docs.mapbox.com/api/search/geocoding/

**[Mapbox sdk javascript docs]**

https://github.com/mapbox/mapbox-sdk-js

https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode

## GeoJSON 객체 MongoDB 저장하기

단순히 경도/위도 값을 문자열처럼 저장하면 될 것 같지만 그렇지 않다.

Mapbox의 정방향 지오코딩 응답 객체는 **`GeoJSON` 객체**인데 이것은 위치 정보를 표시하기 위한 개방형 표준으로 `JSON` 형식을 기반으로 하는 객체이다(아래 링크 참조).

`GeoJSON` 객체의 지리 정보는 `features` 프로퍼티에 배열 형태로 저장되어 있다. `features` 배열의 각 요소(객체)는 `geometry`와 `properites`로 구성되어 있는데 `geometry`에 저장되는 객체는 **좌표 타입(type)**과 **경도/위도 좌표(coordinates)** 값을 저장하고 `properties`는 위치에 대한 부가적인 정보들을 저장한다.

아래 예시는 `GeoJSON FeatureCollection` 타입의 예시이다.
```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {   // 좌표 정보
        "type": "Point",
        "coordinates": [102.0, 0.5]
      },
      "properties": {  // 부가 정보
        "prop0": "value0"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
        ]
      },
      "properties": {
        "prop0": "value0",
        "prop1": 0.0
      }
    },
  ]
}
```

좌표 타입에는 `Point`,`LineString`, `Polygon` 등 다양한 종류가 있으며 프로젝트에서 사용되는 타입은 `Position`으로 좌표를 하나의 점으로 나타낸다.

좌표 정보를 굳이 `GeoJSON` 형식으로 저장하는 이유는 `MongoDB`에서 `GeoJSON`을 위한 다양한 쿼리를 제공하기 때문.

우선 `campground` 모델에 `GeoJSON` 객체를 저장할 필드를 추가해줘야 하는데 `Mongoose`에서 `GeoJSON`의 `geometry` 객체를 저장하기 위한 스키마 정의 방법을 제공한다.

```
// campground 스키마
const CampgroundSchema = new mongoose.Schema({
    title: String,
    image: [imageSchema],
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    price: Number,
    description: String,
    location: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});
```

새 게시물을 생성하는 라우트 핸들러에서 Mapbox 응답 객체의 `geoData.body.features[0].geometry`를 도큐먼트에 추가해준다.

```
module.exports.createNewCampground = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  await campground.save();
    .
    .
    .
};
```

새로 생성된 캠핑장 게시물을 확인해보면 `geometry` 객체가 제대로 저장된 것을 확인할 수 있다.  

```
  .
  .
console.log(campground);

>{
    title: '123',
    geometry: { type: 'Point', coordinates: [ 2.3483915, 48.8534951 ] },
    price: 123,
    description: '123',
    location: 'Paris, France',
    review: [],
    _id: new ObjectId("63b7384c7ef6bbceed093c98"),
    image: [],
    author: new ObjectId("6391dffd8a918d7d291e8007"),
    __v: 0
  }
```
<!-- mapbox 지도 정보 가져오는 메커니즘? -->

**[Mongoose Using GeoJSON]**

https://mongoosejs.com/docs/geojson.html

**[MongoDB Geospatial Queries]**

https://www.mongodb.com/docs/manual/geospatial-queries/

**[RFC 7946 GeoJSON]**

https://www.rfc-editor.org/rfc/rfc7946

**[위키피디아 GeoJSON]**

https://en.wikipedia.org/wiki/GeoJSON


## 지도 렌더링하기

Mapbox GL JS는 클라이언트 사이드 자바스크립트 라이브러리로, 클라이언트 브라우저에서 상호작용 가능한 지도를 렌더링할 수 있다(클라이언트 사이드 렌더링).

우선 Mapbox GL JS css, js를 CDN URL을 bolierplate.ejs <head> 태그에 넣어준다.
<!-- ejs-mate layout에 추가해줬기 때문에 지도가 표시되지 않는 페이지에서도 참조를 하게되어 비효율적이다. 하지만 구현을 우선으로 하기 때문에 일단 스킵  -->

```
<script src='https://api.mapbox.com/mapbox-gl-js/v2.12.0/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v2.12.0/mapbox-gl.css' rel='stylesheet' />
```

지도를 렌더링하고자 하는 페이지에는 다음 코드를 삽입해준다.

```
// 지도가 출력되는 컨테이너
<div id='map' style='width: 400px; height: 300px;'></div>

// 지도 설정 자바스크립트
<script>
mapboxgl.accessToken = '<%= process.env.MAPBOX_TOKEN %>';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: [-74.5, 40], // starting position [lng, lat]
zoom: 9, // starting zoom
});
</script>
```

렌더링하고자 하는 위치에 <div id='map'..> 요소를 넣어주고, `mapboxgl.Map` 클래스 인스턴스를 생성해준다. 

인스턴스 생성 시 필요한 최소 매개변수는 다음과 같다.

+ `accessToken`: Mapbox GL JS 지도를 Mapbox 계정과 연결하기 위한 토큰.
+ `container`: 지도가 배치될 HTML 요소 `id`. 위의 예에서 <div id='map'...></div>에 지도가 렌더링 된다.
+ `style`: 맵에 포함된 타일셋과 타일셋 의 스타일 지정 방법 을 결정하는 데 사용되는 맵 스타일 의 스타일 URL 입니다 . 위의 예는 Mapbox Streets v11 스타일을 사용합니다.
+ `center`: 지도의 시작 위치 좌표로 [경도(longitude), 위도(latitude)] 순으로 할당한다.
+ `zoom`: 지도를 초기 확대/축소 수준. 정수 값으로 설정한다.
  
**[Mapbox GL JS guides]**

https://docs.mapbox.com/mapbox-gl-js/guides/

**[Mapbox GL?]**

https://docs.mapbox.com/help/glossary/mapbox-gl/


## 지도에 마커로 표시하기

웹 페이지에 렌더링한 지도에 기본 마커를 추가하는 코드이다.

```
<script>
mapboxgl.accessToken = '<%= process.env.MAPBOX_TOKEN %>';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: campground.geometry.coordinates, // 중앙 위치 설정 [lng, lat]
zoom: 9, // 줌 설정
});

// 기본 마커를 생성하고 map에 추가한다.
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates) // 마커 위치
.addTo(map);
</script>
```

**[Mapbox GL JS Add a default marker to a web map]**

https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/

<!-- 지도 서비스로 데이터를 받아오는 로직을 이해하기 위한 데모이기에 실제로는 사용자로부터 입력 받는 법이나 편의를 위한 스타일 등등 고려해야할 것이 많다 -->

## Mapbox GL JS 자바스크립트 모듈 분리

```
// ejs 구문이 있는 자바스크립트를 모듈로 분리하고 <script src="">로 불러오면 읽어 들이지 못한다.
// 그 이유는 요청이 왔을 때 서버 측 ejs 템플릿 엔진이 템플릿의 ejs 코드를 읽어 들이면서 표준 HTML로 변환하고 클라이언트에 전송하는데(텍스트로)
// <script src="/js/validateForm.js"></script>와 같이 스크립트 태그로 자바스크립트를 불러오는 부분은
// 클라이언트 브라우저에 전송되고 나서 서버로 요청하고 응답받아 실행 되는데 클라이언트 측에선 ejs 구문을 해석하지 못하기 때문에 값이 제대로 할당되지 않는다.
// 따라서 ejs로 토큰을 참조하는 부분('<%= process.env.MAPBOX_TOKEN %>')을 템플릿에 미리 넣고 변수에 할당하여(데이터를 서버에서 클라이언트로 넘기는 것)
// 아래의 자바스크립트가 클라이언트 브라우저에서 참조할 수 있게 한다.
mapboxgl.accessToken = mapToken;
console.log(campground)
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);
```


## 지도 팝업 커스터마이징


**[Mapbox Markers and controls popup]**

https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup