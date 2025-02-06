- [Web Audio API의 기본적인 메커니즘](#web-audio-api의-기본적인-메커니즘)
- [1. 오디오 컨텍스트 (AudioContext)](#1-오디오-컨텍스트-audiocontext)
  - [주의사항](#주의사항)
- [2. 오디오 노드 (AudioNode)](#2-오디오-노드-audionode)
  - [주요 노드 유형](#주요-노드-유형)
  - [2.1 오디오 소스 노드 (Source Nodes)](#21-오디오-소스-노드-source-nodes)
    - [`OscillatorNode` (신호 발생기)](#oscillatornode-신호-발생기)
    - [`AudioBufferSourceNode` (오디오 파일 재생)](#audiobuffersourcenode-오디오-파일-재생)
    - [`MediaElementAudioSourceNode` (`<audio>` 또는 `<video>` 요소와 연결)](#mediaelementaudiosourcenode-audio-또는-video-요소와-연결)
  - [2.2 오디오 프로세싱 노드 (Processing Nodes)](#22-오디오-프로세싱-노드-processing-nodes)
    - [`GainNode` (볼륨 조절)](#gainnode-볼륨-조절)
    - [`BiquadFilterNode` (이퀄라이저 필터)](#biquadfilternode-이퀄라이저-필터)
    - [`ConvolverNode` (리버브 효과)](#convolvernode-리버브-효과)
  - [2.3. 오디오 출력 노드 (Destination Node)](#23-오디오-출력-노드-destination-node)
- [3. 오디오 그래프 (Audio Graph)](#3-오디오-그래프-audio-graph)
- [4. 실시간 오디오 분석 (`AnalyserNode`)](#4-실시간-오디오-분석-analysernode)
- [5. 실시간 오디오 처리](#5-실시간-오디오-처리)
- [6. 이벤트 및 콜백](#6-이벤트-및-콜백)
- [7. 성능 최적화](#7-성능-최적화)
- [8. 크로스 브라우저 지원](#8-크로스-브라우저-지원)

# Web Audio API의 기본적인 메커니즘

# 1. 오디오 컨텍스트 (AudioContext)

`AudioContext`는 Web Audio API의 핵심 객체로, 모든 오디오 노드와 오디오 처리가 이루어지는 환경을 제공한다.

모든 오디오 작업은 `AudioContext` 내에서 이루어지며, `AudioContext`를 통해 오디오 소스, 효과, 출력 노드 등을 생성할 수 있다.

하나의 웹 페이지에서 여러 개의 `AudioContext`를 생성할 수 있지만, 일반적으로 하나의 컨텍스트를 사용한다.

```
const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // 모든 브라우저 호환을 위함
```

### 주의사항

일부 브라우저는 사용자 상호작용(예: 버튼 클릭) 없이 오디오 컨텍스트를 자동으로 시작하지 않는다. 이를 해결하려면 다음과 같이 사용자 상호작용 후 컨텍스트를 재개해야 한다.

```
document.querySelector('button').addEventListener('click', () => {
  audioContext.resume().then(() => {
    console.log('오디오 컨텍스트가 재개되었습니다.');
  });
});
```

# 2. 오디오 노드 (AudioNode)

오디오 노드는 오디오 그래프를 구성하는 기본 단위다. 각 노드는 특정한 오디오 처리 기능을 수행하며, 다른 노드들과 체인 형태로 연결되어 원하는 사운드를 만들 수 있다.

**노드들은 `connect()` 메서드를 통해 서로 연결된다.**

## 주요 노드 유형

- **소스 노드 (Source Node)** - 오디오 데이터를 생성한다.

  예: `AudioBufferSourceNode` (오디오 파일 재생), `OscillatorNode` (주파수 신호 생성), `MediaElementAudioSourceNode`.

- **처리 노드 (Processing Node)** - 오디오 데이터를 변형하거나 효과를 적용한다.

  예: `GainNode` (볼륨 조절), `BiquadFilterNode` (필터 적용), `DelayNode` (지연 효과).

- **출력 노드 (Destination Node)** - 최종적으로 사운드를 출력하는 노드. 오디오 데이터가 이 노드에 도달하면, 브라우저는 데이터를 사용자의 오디오 출력 장치(스피커, 헤드폰 등)로 전송한다.

  예: `AudioContext.destination`

## 2.1 오디오 소스 노드 (Source Nodes)

소스 노드는 오디오 데이터를 생성하는 역할을 한다.
웹 브라우저에서 사용할 수 있는 주요 소스 노드는 다음과 같다.

### `OscillatorNode` (신호 발생기)

오실레이터(Oscillator)는 주파수를 생성하는 노드다.
사인파, 사각파, 삼각파 등의 신호를 만들 수 있다.

```
const oscillator = audioContext.createOscillator();
oscillator.type = 'sine'; // 사인파 (기본값)
oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440Hz (A4음)
oscillator.start(); // 사운드 시작
oscillator.stop(audioContext.currentTime + 2); // 2초 후 정지
```

**오실레이터의 주요 속성**

- type: 'sine', 'square', 'sawtooth', 'triangle' 선택 가능
- frequency: 주파수 설정 (Hz 단위)

### `AudioBufferSourceNode` (오디오 파일 재생)

MP3, WAV 같은 오디오 파일을 불러와서 재생할 때 사용한다.

```
async function playAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}

playAudio('audio.mp3');
--------------------------------
fetch('audio-file.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  });
```

**오디오 파일 로드 과정**

1. `fetch()`를 사용하여 오디오 파일을 가져온다.
2. `decodeAudioData()`로 바이너리 데이터를 오디오 버퍼로 변환한다.
3. `AudioBufferSourceNode`를 생성하고 buffer에 연결한다.
4. `start()`를 호출하여 재생한다.

### `MediaElementAudioSourceNode` (`<audio>` 또는 `<video>` 요소와 연결)

HTML `<audio>` 또는 `<video>` 태그의 소리를 Web Audio API로 가져올 수 있다.

```
<audio id="audioElement" src="song.mp3" controls></audio>
-------------------------------
const audioElement = document.getElementById('audioElement');
const track = audioContext.createMediaElementSource(audioElement);
track.connect(audioContext.destination);
```

## 2.2 오디오 프로세싱 노드 (Processing Nodes)

프로세싱 노드는 오디오 신호를 수정하거나 효과를 추가하는 역할을 한다.

### `GainNode` (볼륨 조절)

`GainNode`는 오디오의 음량(볼륨)을 조절하는 노드다.

```
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5; // 볼륨을 50%로 줄임
source.connect(gainNode);
gainNode.connect(audioContext.destination);
---------------------------------------------
const gainNode = audioContext.createGain();
gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // 볼륨 50%
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
```

**`gainNode.gain.setValueAtTime(value, time)`**

- value: 0.0 (무음) ~ 1.0 (최대 볼륨)
- time: 적용할 시간 (`audioContext.currentTime` 기준)

### `BiquadFilterNode` (이퀄라이저 필터)

이 노드는 특정 주파수를 필터링하여 오디오를 변형할 수 있다.

```
const filter = audioContext.createBiquadFilter();
filter.type = 'lowpass'; // 저주파 필터
filter.frequency.setValueAtTime(1000, audioContext.currentTime); // 1000Hz 이하만 통과
oscillator.connect(filter);
filter.connect(audioContext.destination);
```

**필터 유형**

- `lowpass`: 특정 주파수 이하만 통과 (베이스 부스트)
- `highpass`: 특정 주파수 이상만 통과 (고음 강조)
- `bandpass`: 특정 주파수 대역만 통과

### `ConvolverNode` (리버브 효과)

`ConvolverNode`를 사용하면 잔향 효과(리버브)를 추가할 수 있다.

```
const convolver = audioContext.createConvolver();
// IR (Impulse Response) 파일을 로드하여 convolver.buffer에 설정
oscillator.connect(convolver);
convolver.connect(audioContext.destination);
```

## 2.3. 오디오 출력 노드 (Destination Node)

최종적으로 오디오를 브라우저의 스피커로 출력하려면 `audioContext.destination`에 연결해야 한다.

```
oscillator.connect(audioContext.destination);
```

# 3. 오디오 그래프 (Audio Graph)

오디오 노드들은 서로 연결되어 오디오 그래프를 형성한다(`connect()` 사용). 이 그래프는 오디오 데이터가 소스에서 처리 노드를 거쳐 최종 출력까지 흐르는 경로를 정의한다.

예를 들어, 오디오 파일을 재생하고 볼륨을 조절하는 간단한 그래프는 다음과 같이 구성할 수 있다.

```
const source = audioContext.createBufferSource();
const gainNode = audioContext.createGain();

// 오디오 그래프 구성
source.connect(gainNode);
gainNode.connect(audioContext.destination);
```

오디오 재생이 끝난 후에는 노드 연결을 해제하여 메모리 누수를 방지해야 한다.

```
source.onended = () => {
  source.disconnect();
  gainNode.disconnect();
};
```

# 4. 실시간 오디오 분석 (`AnalyserNode`)

`AnalyserNode`를 사용하면 오디오 신호를 실시간으로 분석할 수 있다.
이 데이터는 주파수 분석(FFT) 또는 웨이브폼 분석에 사용되며 시각화에 유용하다.

```
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048; // FFT(고속 푸리에 변환) 크기 설정

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

source.connect(analyser);
analyser.connect(audioContext.destination);

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray); // 주파수 데이터 가져오기
  // 데이터를 시각화하는 코드 추가
}
draw();
```

# 5. 실시간 오디오 처리

`ScriptProcessorNode` 또는 `AudioWorklet`을 사용하여 JavaScript로 실시간 오디오 처리를 구현할 수 있다. 이를 통해 사용자 정의 오디오 효과를 만들 수 있다.

# 6. 이벤트 및 콜백

Web Audio API는 오디오 재생 상태를 모니터링하거나 특정 이벤트에 반응할 수 있는 이벤트와 콜백을 제공합니다. 예를 들어, onended 이벤트를 사용해 재생이 끝났을 때 작업을 수행할 수 있습니다.

```
source.onended = () => {
  console.log('오디오 재생이 끝났습니다.');
};
```

# 7. 성능 최적화

Web Audio API는 하드웨어 가속을 활용하여 고성능 오디오 처리를 지원합니다. 그러나 복잡한 오디오 그래프를 구성할 때는 성능을 고려해야 합니다.

# 8. 크로스 브라우저 지원

Web Audio API는 대부분의 최신 브라우저에서 지원되지만, 일부 구형 브라우저에서는 지원되지 않을 수 있습니다. 필요한 경우 폴리필이나 대체 방안을 고려해야 합니다.
