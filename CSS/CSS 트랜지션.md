# 트랜지션(Transition)

`transition`은 특정 css 속성의 값을 일정 시간에 걸쳐 점진적으로 변화시키는 속성이다. 그 과정에서 일어나는 애니메이션 효과를 설정할 수도 있다.

다음과 같은 하위 속성들로 전환 대상 속성(property), 전환 되는데 걸리는 지속 시간(duration), 대기 시간(delay)을 지정할 수도 있고, 타이밍 함수(timing function)를 설정할 수도 있다.

`transition-property` - 트랜지션을 적용할 대상 속성을 지정한다.<br>
`transition-duration` - 트랜지션이 발생하는 기간을 설정한다.<br>
`transition-timing-function` - 트랜지션 전환 과정에 사용되는 함수를 정의한다. 전환 될 때 애니메이션 효과, 리듬을 설정하는 것. <br>
`transition-delay` - 트랜지션이 시작되기 까지 대기 시간을 설정한다.<br>

```
transition: [대상 속성1] [duration] [timing function] [delay] ....
```

콤마(,)를 이용해 여러 속성에 트랜지션을 한번에 지정할 수 있다.

<br>

### 자잘한 팁

* 트랜지션 설정 시 특정 속성을 명시하는게 좋다고 함. 속성이 여러 개일 경우 예상 못한 전환이 발생할 수 있기 때문.
* 호버(hover) 시 위치 이동 효과를 주고싶은 경우 margin에 offset을 주는 것 보다 transform translate()의 퍼포먼스가 더 좋다고 함.

<!-- # 트랜지션 타이밍 함수(Transition Timing Function) -->



<br>


**[MDN 트랜지션]** <br>
https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Transitions

**[MDN Animatable properties]** <br>
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties

**[타이밍 예시 함수 참고]** <br>
https://easings.net/