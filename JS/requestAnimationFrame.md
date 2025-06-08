- [✅ Window.requestAnimationFrame이란?](#-windowrequestanimationframe이란)
  - [✅ 왜 사용하는가?](#-왜-사용하는가)
  - [✅ 사용 시 이점](#-사용-시-이점)
  - [✅ 기본 사용법 예시](#-기본-사용법-예시)
  - [🚀 최종 요약](#-최종-요약)
- [requestAnimationFrame 최적화 패턴](#requestanimationframe-최적화-패턴)
  - [✅ 1. 중복 호출 방지 패턴](#-1-중복-호출-방지-패턴)
  - [✅ 2. 상태 변경 감지 후 갱신 패턴](#-2-상태-변경-감지-후-갱신-패턴)
  - [✅ 3. cancelAnimationFrame 활용](#-3-cancelanimationframe-활용)
  - [🚀 최종 요약](#-최종-요약-1)

# ✅ Window.requestAnimationFrame이란?

| 항목 | 설명                                                                                                          |
| :--- | :------------------------------------------------------------------------------------------------------------ |
| 정의 | 브라우저에게 "다음 리페인트(repaint) 직전에 이 함수를 호출해줘"라고 요청하는 API                              |
| 특징 | - 브라우저 렌더링 주기(화면 새로고침 주기, 보통 1초에 60번 = 60fps)에 맞춰 콜백 실행<br>- 비동기적으로 실행됨 |

## ✅ 왜 사용하는가?

| 이유                  | 설명                                                                            |
| :-------------------- | :------------------------------------------------------------------------------ |
| 렌더링 타이밍 최적화  | 브라우저가 다음 화면을 그리기 직전에만 작업을 처리해서, 부드러운 화면 전환 가능 |
| 과도한 연산 방지      | 필요 없는 작업은 스킵하고, 최소한의 연산만 실행 (백그라운드 탭에서는 자동 중지) |
| 성능 최적화           | 60fps 유지에 유리 (애니메이션, 인터랙션을 자연스럽게 만듦)                      |
| Reflow/Repaint 효율화 | 레이아웃 계산과 화면 그리기를 브라우저 스케줄에 맞춰서 묶어 처리                |

## ✅ 사용 시 이점

| 이점               | 설명                                                          |
| :----------------- | :------------------------------------------------------------ |
| 프레임 드랍 방지   | 렌더링 타이밍을 브라우저가 최적 제어하므로 화면 끊김이 줄어듦 |
| 배터리 효율 향상   | 백그라운드 탭에서는 실행을 멈춰 CPU 소모 절감                 |
| 코드 간결화        | 매 프레임마다 자연스럽게 애니메이션 갱신 가능                 |
| 성능 최적화에 유리 | 필요할 때만 화면 갱신 → 무의미한 계산 줄임                    |

## ✅ 기본 사용법 예시

```
function updateAnimation() {
// 애니메이션 로직 (예: 위치 이동, 색상 변화 등)
moveBox();

// 다음 프레임 예약
requestAnimationFrame(updateAnimation);
}

// 애니메이션 시작
requestAnimationFrame(updateAnimation);
```

## 🚀 최종 요약

requestAnimationFrame은 "브라우저 렌더링 타이밍에 딱 맞춰 콜백을 실행해서, 부드럽고 효율적으로 화면을 갱신"하는 API다.
성능 최적화, 부드러운 애니메이션, 배터리 절약까지 전부 가능하다.

# requestAnimationFrame 최적화 패턴

| 패턴                                  | 설명                                                            | 코드 예시 |
| :------------------------------------ | :-------------------------------------------------------------- | :-------- |
| 1. 중복 호출 방지 (Throttle처럼 쓰기) | requestAnimationFrame을 여러 번 연속 호출해도 1번만 처리하게 함 | 아래 참고 |
| 2. 상태 변경 감지 후 갱신             | 실제 값이 변할 때만 화면 갱신 (불필요한 렌더링 방지)            | 아래 참고 |
| 3. cancelAnimationFrame 활용          | 필요 없어졌을 때 애니메이션 중단 (메모리, 연산 낭비 방지)       | 아래 참고 |

## ✅ 1. 중복 호출 방지 패턴

(여러 이벤트가 동시에 터져도 requestAnimationFrame을 한 번만 예약)

```
let rafId = null;

function onScrollOrResize() {
  if (rafId) return; // 이미 예약돼 있으면 무시

  rafId = requestAnimationFrame(() => {
    updateUI(); // 실제 렌더링 작업
    rafId = null; // 완료 후 초기화
  });
}

window.addEventListener('scroll', onScrollOrResize);
window.addEventListener('resize', onScrollOrResize);
```

👉 효과: 스크롤/리사이즈 이벤트가 수십 번 터져도 1초에 60번만 부드럽게 처리!

## ✅ 2. 상태 변경 감지 후 갱신 패턴

(값이 진짜 바뀌었을 때만 화면 업데이트)

```
let currentX = 0;

function updatePosition(newX) {
  if (newX === currentX) return; // 값이 안 바뀌었으면 무시

  currentX = newX;
  requestAnimationFrame(() => {
    moveElementTo(currentX);
  });
}
```

👉 효과: 똑같은 값을 계속 갱신하지 않아서 낭비 줄임!

## ✅ 3. cancelAnimationFrame 활용

(애니메이션 취소할 때 사용)

```
let rafId = null;

function startAnimation() {
  function step() {
    moveElement();
    rafId = requestAnimationFrame(step);
  }

  rafId = requestAnimationFrame(step);
}

function stopAnimation() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}
```

👉 효과: 페이지 이동, 모달 닫기 같은 경우에 쓸데없는 애니메이션 계산 중단!

## 🚀 최종 요약

requestAnimationFrame 최적화 핵심 = "중복 호출 막기", "실제 변경 있을 때만 갱신", "불필요하면 cancel하기"
