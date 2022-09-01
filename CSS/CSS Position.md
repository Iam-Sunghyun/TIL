# Position 속성

문서 내에서 요소의 위치를 설정하기 위한 속성. 

`position` 속성 값과, 추가로 `top`, `left`, `right`, `bottom` 좌표 값을 설정해 최종 위치를 지정한다.

기본 값은 `static`으로 위치 지정이 안된 상태로 취급된다.

## Position 속성 값

Postion 속성의 값으로는 아래 5가지가 있다.

`static` - 문서 흐름대로 위치함. `position`의 기본 값으로 위치 지정이 안된  것으로 취급된다. 따라서 `top`, `left`, `right`, `bottom`위치 영향 안받음.

`relative(상대 위치)` - 요소를 일반적인 문서 흐름에 따라 배치하고 자기 자신 위치를 기준으로 상대적으로 이동한다.

`absolute(절대 위치)` - 문서 흐름에서 제거 되어 페이지에서 공간도 차지 하지 않게 된다(부유 상태인 것처럼). 가장 가까운 위치 지정 조상 요소(static 제외)에 대해 상대적으로 배치한다. 단, 조상 중 위치 지정 요소가 없다면 초기 컨테이닝 블록(<body>)을 기준으로 이동한다.

`fixed(고정 위치)` - absolute 처럼 요소를 일반적인 문서 흐름에서 제거 되어 페이지 레이아웃에 공간이 배정되지 않는다. 브라우저의 viewport를 기준으로 좌표 속성(top, bottom, left, right)을 사용하여 위치를 이동시킨다. 즉 해당 요소가 항상 페이지의 같은 위치에 출력되게 된다(네비게이션 바 구현할 때 사용). 단, 요소의 조상 중 하나가 transform, perspective, filter 속성 중 어느 하나라도 none이 아니라면 viewport가 아닌 그 조상 요소를 기준으로 이동한다.

fixed 선언 시, block 요소의 width는 inline 요소와 같이 content에 맞게 변화되므로 필요에 따라 적절한 width를 지정해 주도록 하자.

`sticky` - 가장 가까이에 있는 스크롤 되는 조상 요소와 표 관련 요소를 포함한 컨테이닝 블록(가장 가까운 블록 레벨 조상)을 기준으로 top, right, bottom, left의 값에 따라 오프셋을 적용해 위치시킨다.

+ 오프 셋(off set)? -> 상대적인 위치 차이(분야나 상황별로 여러가지로 해석되나 여기선 이정도가 적당한 듯.)

<br>

**[poienmaweb 요소의 위치 정의]** <br>
https://poiemaweb.com/css3-position

**[MDN Position]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/position