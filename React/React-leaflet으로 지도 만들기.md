<h2>목차</h2>

- [React-leaflet](#react-leaflet)
  - [필수 패키지 설치](#필수-패키지-설치)
  - [`leaflet` CDN으로 CSS 및 JS 로드하기](#leaflet-cdn으로-css-및-js-로드하기)
  - [지도 컨테이너 지정](#지도-컨테이너-지정)
- [도시 리스트 데이터 마커(Marker)로 표시하기](#도시-리스트-데이터-마커marker로-표시하기)
- [도시 항목 클릭시 도시(마커) 위치로 이동하기](#도시-항목-클릭시-도시마커-위치로-이동하기)
- [지도 클릭으로 지도 정보 저장하기](#지도-클릭으로-지도-정보-저장하기)
- [`Geolocation API`로 사용자 위치 가져오기](#geolocation-api로-사용자-위치-가져오기)

# React-leaflet

<!-- 수정 -->

`Leaflet`는 지도를 구현하는 가장 큰 오픈 소스 자바스크립트 라이브러리이다. 이 `Leaflet`을 리액트 친화적으로(컴포넌트로) 사용할 수 있게 하기 위한 라이브러리가 바로 `React-Leaflet`이다. `React Leaflet`은 `Leaflet` 위에 구축된 것과 같으므로 둘 다 설치해야 한다.

이것은 기본적으로 지도를 구현하는 가장 큰 오픈 소스

라이브러리입니다.

**[React-leaflet]**

https://react-leaflet.js.org/

## 필수 패키지 설치

`react`, `react-dom`, `leaflet`를 필수 종속성으로서 설치해줘야 하고 추가로 `react-leaflet` 패키지를 설치해줘야 한다. 리액트가 설치되어 있다면 `leaflet`과 `react-leaflet`만 설치해준다.

```
npm install leaflet react-leaflet
```

`react-leaflet`은 다음과 같이 ESM import로 설치 없이 외부 CDN(cdn.esm.sh)에서 불러올 수도 있다.

```
import { MapContainer } from 'https://cdn.esm.sh/react-leaflet/MapContainer'
import { TileLayer } from 'https://cdn.esm.sh/react-leaflet/TileLayer'
import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks'
```

## `leaflet` CDN으로 CSS 및 JS 로드하기

`leaflet`을 직접 설치하지 않고 다음과 같이 `unpkg`, `cdnjs`, `jsDelivr`과 같은 무료 CDN에서 불러오는 방법도 있다.

```
 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
```

```
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
```

CSS의 경우 다음과 같이 직접 import 해줄 수도 있다.

```
@import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
```

## 지도 컨테이너 지정

<!-- 수정 -->

지도를 출력하고자 하는 컴포넌트에 `react-leaflet`의 지도 컨테이너 컴포넌트를 불러온다(`<MapContainer />`와 `<TileLayer />`). `<MapContainer />`의 여러 `prop`에 지도 설정 값들을 지정할 수 있다.

```
// Map.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import styles from './Map.module.css';

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]); // 테스트용 [위도(latitude), 경도()longitude]

  return (
    <div className={styles.mapContainer} >
      <MapContainer className={styles.map} center={mapPosition} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {/* 지도 마커 */}
        <Marker position={ mapPosition }>
          <Popup>
            마커 팝업. <br />
            테스트
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
```

# 도시 리스트 데이터 마커(Marker)로 표시하기

<!-- 수정 -->

도시 리스트에 저장된 도시 정보들을 지도에 마커로 표시한다. 도시 데이터는 간이 `json-server` 서버로부터 `fetch`하여 `context`에 저장했었기 때문에 전역에서 접근할 수 있다. `context`에서 가져온 도시 데이터(`cities`)의 위도, 경도 값을 각 `<Marker />` 컴포넌트의 `position` `prop`에 설정하여 반환해준다.

```
// Map.jsx
function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities(); // CitiesContext로 부터 도시 데이터 가져오기

  return (
    <div className={styles.mapContainer}>
      <MapContainer className={styles.map} center={mapPosition} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {/* 지도 마커 key와 position 값 설정 */}
        { cities.map(({ id, position }) => (
          <Marker key={id} position={[position.lat, position.lng]}>
            <Popup>
              마커 팝업. <br />
              테스트
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
```

# 도시 항목 클릭시 도시(마커) 위치로 이동하기

도시 리스트에서 특정 도시를 클릭하면 해당 도시 정보가 표시되고 지도 위치가 해당 도시로 이동한다.

도시 리스트에서 특정 항목을 클릭하면 `CitiesContext` 컨텍스트의 `currentCity`가 업데이트 됐었는데 이를 기반으로 지도의 위치를 이동시켜주면 된다.

이때 `react-leaflet`의 지도 객체를 참조하기 위해 `react-leaflet`에서 제공되는 `useMap()` 훅을 사용한다. `useMap()`훅은 `<MapContainer />` 하위에 작성되어 `leaflet`의 `Map` 객체를 반환하는데 이 객체의 메서드에 위도 경도 값을 전달하여 지도의 마커 위치를 갱신해줄 수 있다.

사용 방법은 아래 예시와 같은데 우선 `useMap()`을 사용하는 사용자 정의 컴포넌트를 정의하여 `<MapContainer />` 컨테이너 내부에 위치시켜준다.

```
// Map.jsx
function Map() {
  const { cities, currentCity } = useCities(); // CitiesContext 컨텍스트 참조

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={ styles.map }
        // 현재 클릭한 도시 항목이 없다면 기본 값으로 위도(북위) 37 경도 127
        center={[currentCity.position?.lat || 37, currentCity.position?.lng || 127]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {/* 지도 마커 */}
        {cities.map(({ id, position, cityName, emoji, notes }) => (
          <Marker key={id} position={[position.lat, position.lng]}>
            <Popup>
              <span>{emoji}</span>
              {cityName}
            </Popup>
          </Marker>
        )) }
        <ChangeMarker position={[currentCity.position?.lat || 37,currentCity.position?.lng || 127]} ></ChangeMarker>
      </MapContainer>
    </div>
  );
}

// 임의의 이름으로 useMap 사용하는 컴포넌트 정의
function ChangeMarker({ position }) {
  const map = useMap(); // leaflet Map 객체 반환
  map.setView(position); // 지도 위치 설정
  return null;  // 따로 반환하는 컴포넌트는 없음
}

export default Map;
```

# 지도 클릭으로 지도 정보 저장하기

<!-- 수정 -->

`useMapEvents()` 훅을 사용하여 지도 객체에 이벤트 핸들러 함수를 등록할 수 있다. 이벤트 핸들러 함수의 인수로는 `LeafletEventHandlerFnMap` 객체가 전달되어 여러가지 프로퍼티를 참조할 수 있다.

이것 역시 컴포넌트를 정의하여 `<MapContainer />` 하위에서 사용해줘야 한다.

```
  .
  .
 return (
    <div className={styles.mapContainer}>
      <Button type='position' onClick={ getPosition }>
        {isLoading ? '가져오는 중...' : '내 위치 가져오기'}
      </Button>
      <MapContainer className={styles.map} center={mapPosition} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {/* 지도 마커 */}
        {cities.map(({ id, position, cityName, emoji, notes }) => (
          <Marker key={id} position={[position.lat, position.lng]}>
            <Popup>
              <span>{emoji}</span>
              {cityName}
            </Popup>
          </Marker>
        ))}
        <ChangeMarker position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// Map 객체에 이벤트 핸들러 등록을 위한 커스텀훅
function DetectClick() {
  const navigate = useNavigate();

  // Map 객체에 이벤트 핸들러 등록
  useMapEvents({
    click: (e) => {
      // form으로 이동하면서 이벤트 객체(LeafletEventHandlerFnMap)의 클릭 위치 값을 쿼리스트링으로 전달
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`, { replace: true });
    },
  });
}
```

# `Geolocation API`로 사용자 위치 가져오기

다음과 같이 `Geolocation API`를 사용해 사용자 위치 정보를 가져오는 로직을 커스텀 훅으로 정의하여 코드를 분리하여 관리할 수 있다. `Geolocation API` 브라우저에서 제공되는 API로 `navigator.geolocation`을 통해 접근할 수 있다.

```
import { useState } from 'react';

// GeoLocation API를 통해 위치 정보 가져오는 커스텀 훅
export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState([37, 127]);
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation) return setError('Your browser does not support geolocation');

    setIsLoading(true);
    // 현재 위치 가져오는 Geolocation API 메서드, 성공 시 첫 번째 콜백, 실패 시 두 번째 콜백 실행
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        alert('실패');
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
---------------------------
// Map.jsx
      .
      .
      .
  // onClick 이벤트에 getPosition 등록
  <Button type='position' onClick={ getPosition }>
        {isLoading ? '가져오는 중...' : '내 위치 가져오기'}
  </Button>
```

**[React-Leaflet map event]**

https://leafletjs.com/reference.html#map-event

**[MDN geolocation API]**

https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

**[React-Leaflet]**

https://react-leaflet.js.org/

https://leafletjs.com/reference.html
