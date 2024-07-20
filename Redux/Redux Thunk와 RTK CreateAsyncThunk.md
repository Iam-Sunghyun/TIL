# RTK API `createAsyncThunk`?

`createAsyncThunk`는 비동기 처리를 위한 RTK의 API로 `Redux-thunk`에 전달할 비동기 함수(thunk)를 호출할 액션 객체를 생성하기 위한 생성자 함수를 생성하기 위해 사용한다.

즉, `createAsyncThunk`은 비동기 작업을 처리하는 `action` 객체를 생성하는 action creator를 반환하는데 `createAsyncThunk`로 생성한 액션 생성자를 호출하여 `action` 객체를 생성해주고, `dispatch` 해주면 비동기 작업이 처리된다.

`createAsyncThunk`는 2가지 인수를 받는다. 첫 번째는 액션 타입명과 두 번째로 리듀서에 대한 페이로드를 반환하는(비동기 처리 로직을 담은) 비동기 함수를 전달해준다. 이때 두 번째 인수는 프로미스를 반환해야 한다.

다음은 간단한 사용 예시이다.

```
<button onClick={() => {
    dispatch(asyncUpFetch());
}}>+ async Thunk </button>
-------------------------
const asyncUpFetch = createAsyncThunk('counterSlice/asynUpFetch', async () => {
    const response = await fetch('https://~~)
    const data = await response.json()
    return data.value
})
```

비동기 처리 상태로는 프로미스와 마찬가지로 3가지가 있는데 `creator.pending`, `creator.fulfilled`, `creator.rejected`가 있다.

이 3가지 상태에 대한 처리 로직은 다음과 같이 `createSlice`의 `extraReducers` 프로퍼티에 전달되는 함수 인수(`builder`)의 `addCase()`로 전달해줘야 한다.

```
const counterSlice = createSlic({
    name: 'counterSlice',
    initialState: {
        value: 0,
        status: 'test',
        error: '',
    },
    extraReducers: (builder) => {
        builder.addCase(asyncUpFetch.pending, (state, action) => {   // pending 일때 동작
            state.status = 'Loading';
        })
        builder.addCase(asyncUpFetch.fulfilled, (state, action) => { // fulfilled 일때 동작
            state.value = action.payload;   // action.payload에는 createAsyncThunk 로 액션 생성자 함수를 생성할 때 2번째 인수로 전달한 비동기 처리 로직의 반환 값이 담긴다.
            state.status = 'complete';
        })
        builder.addCase(asyncUpFetch.rejected, (state, action) => {  // rejected 일때 동작
            state.error = action.error.message
            state.status = 'fail';
        })
    }
})
```

비동기 함수가 성공적으로 `resolve` 하여 `fulfilled` 일때 프로미스 값은 `action.payload`에 담기고 `rejected` 일때 `action.error.message`에 담긴다(에러를 `resolve`한 경우 `action.payload`에 담긴다).

**[RTK createAsyncThunk]**

https://redux-toolkit.js.org/api/createAsyncThunk
