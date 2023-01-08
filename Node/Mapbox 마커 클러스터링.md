# 마커 클러스터링이란?

마커 클러스터링(marker clustering)이란 지도에 표시되는 마커가 너무 많은 경우 일정 범위에 있는 마커를 합하여 더 간결하게 표현하는 것을 말한다.

클러스터는 지도상에 출력되는 정보들을 범위별로 묶어서 표시하고 확대할수록 단일 단위가 될 때까지 분할된다.

# Mapbox cluster 출력해보기

클러스터링 로직을 처음부터 직접 구현하는 것은 아니고 Mapbox 클러스터링 가이드를 따라 지도를 만들고, 프로젝트의 데이터를 집어넣어 구현할 것. 

## `index.ejs` 페이지 지도 컨테이너 및 자바스크립트 추가

`index.ejs` 페이지 상단에 지도가 렌더링 될 HTML과 자바스크립트 로드 구문을 넣어준다.

```
// index.ejs
<% layout('layouts/boilerplate') -%>
// 지도 컨테이너
<div id="map" class="mb-3" style="width: 100%; height: 400px"></div>
  .
  .
  .
  .
<script>
  // 클라이언트 측에서는 ejs 구문을 해석하지 못하기 때문에 이런식으로 서버 측에서 변수에 할당 후 클라이언트로 전달한다.
  const mapToken = '<%= process.env.MAPBOX_TOKEN %>'; // 클라이언트 사이드에서 Mapbox 인증을 위해 사용되는 토큰
  const campgrounds = '<%- JSON.stringify(campgrounds) %>'; // Mapbox 지도 클러스터링에 사용할 캠핑장 데이터. 그냥 전송 시 에러가 발생하므로 JSON으로 직렬화 해준다
</script>
<!-- Mapbox GL JS cluster -->
<script src="/js/markerCluster.js"></script> // Mapbox GL JS 내장 cluster함수를 사용해 지도 위에 원형으로 클러스터를 표현하는 자바스크립트
```

**[Mapbox cluster examples]**

https://docs.mapbox.com/mapbox-gl-js/example/?search=cluster

**[Mapbox Create and style clusters]**

https://docs.mapbox.com/mapbox-gl-js/example/cluster/


## Mapbox 클러스터 자바스크립트(`markerCluster.js`) 수정

Mapbox 지도 위에 프로젝트 데이터를 기반으로 한 클러스터를 표현하기 위해 Mapbox 클러스터 자바스크립트에 프로젝트의 데이터를 삽입하고 렌더링 스타일을 지정해준다.

```
// /public/js/markerCluster.js
mapboxgl.accessToken = mapToken; // index.ejs에서 전달한 토큰

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-103.5917, 40.6699],
  zoom: 3,
});

map.on('load', () => {

  // 데이터세트 등록
  map.addSource('campgrounds', {
    type: 'geojson',
    data: { features: JSON.parse(campgrounds) } , // index.ejs에 할당해놓은 campgrounds JSON 데이터 역직렬화하여 전달. 
                                                  // data 값은 GeoJSON 객체의 형식으로 전달해줘야 하기 때문에
                                                  // 일반 배열인 campgrounds 데이터를 GeoJSON처럼 features에 할당한 형태로 전달해준다(단일 데이터의 경우는 그냥 전달).
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  // 클러스터 아이콘 설정
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 15, '#f1f075', 30, '#f28cb1'],
      'circle-radius': ['step', ['get', 'point_count'], 15, 20, 20, 30, 25],
    },
  });

  // 클러스터 숫자 설정
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  });

  // 클러스터링 안된 단일지점 아이콘 설정
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#0080FF',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  });

  // 클러스터 클릭 이벤트 핸들러
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('campgrounds').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
  });

  // 클러스터링 안된 단일지점 클릭 이벤트 핸들러
  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const [title, description, _id] = Object.values(e.features[0].properties);

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(`<a href="/campgrounds/${_id}"><h4>${title}</h4></a><br>${description}`).addTo(map);
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
});
```

**[Mapbox GeoJSON source add example]**

https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource

**[Mapbox API reference - map.addSource()]**

https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addsource

**[Mapbox How to make datasets, tilesets]**

https://docs.mapbox.com/help/getting-started/creating-data/


## 사용자 정의 Popup 추가

위 코드에서 맨 마지막 단일지점 클릭 이벤트 핸들러(`map.on('click', 'unclustered-point', function())`)에 단일 캠핑장을 클릭했을 때 뜨는 팝업에 캠핑장 이름과 설명, 링크를 추가하려고 한다.

`GeoJSON`에서 좌표에 대한 부가정보는 `properties` 프로퍼티에 저장해 사용하는데 `map.addSource()`로 등록한 `campgrounds` 데이터에는 `properties` 프로퍼티가 없어 빈 객체가 할당되어 있다.

따라서 다음과 같이 Mongoose 가상 속성을 사용해 `campgrounds`에 `properties` 프로퍼티를 추가하고 클릭 팝업 창에 필요한 정보들을 참조할 수 있게 한다.

```
// 도큐먼트 JSON 직렬화 시(JSON.stringify()) 가상 속성 포함시키는 옵션
CampgroundSchema.set('toJSON', { virtuals: true });

CampgroundSchema.virtual('properties').get(function () {
  return [this.title, this.description, this._id];
});
```

여기서 중요한 것은 Mongoose 가상 속성을 직렬화, 역직렬화(`JSON.stringify()`, `JSON.parse()`)하는 경우 Mongoose는 가상 속성을 포함시키지 않으므로 `CampgroundSchema.set('toJSON', { virtuals: true });` 설정을 반드시 해줘야 한다.

그런 다음 이벤트 핸들러에서 `properites`를 참조하여 팝업 메서드에 삽입해준다.

```
// 클러스터링 안된 단일지점 클릭 이벤트 핸들러
  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const [title, description, _id] = Object.values(e.features[0].properties);

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // 사용자 정의 팝업 HTML
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(`<a href="/campgrounds/${_id}"><h4>${title}</h4></a><br>${description}`).addTo(map);
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
```

**[Mongoose Virtuals toJson option]**

https://mongoosejs.com/docs/guide.html#toJSON