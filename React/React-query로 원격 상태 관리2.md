# `react-hook-form`으로 폼 데이터 유효성 검사하기

`{...register()}`의 두 번째 인수로 옵션 객체를 전달해줄 수 있는데 옵션 객체의 `required`과 같은 프로퍼티를 전달하여 폼 요소 유효성 검사를 실시하고 에러가 발생한 상태에서 폼 submit 시 보여줄 에러 메시지를 설정할 수 있다.

그리고 submit 시 호출되는 `handleSubmit`의 첫 번째 인수로 전달한 함수는 폼 요소 유효성 검사 결과로 에러가 발생할 시 호출되지 않고, 에러 객체를 수신하는 두 번쨰로 전달한 함수가 호출된다.

아래 예시에서 `id=maxCapacity` 요소의 값이 입력되지 않았거나, 1보다 작은 경우 지정한 메시지가 값으로 설정된다.

참고로 유효성 검사는 폼이 submit 될 때, 그리고 입력 값이 변경될 때마다 일어났다.

```
function CreateCabinForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("숙소 등록 성공");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  // handleSubmit에 전달 할 에러 핸들러
  function onError(err) {
    console.log(err);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "내용을 입력해주세요.",
          })}
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "내용을 입력해주세요.",
            min: {
              value: 1,
              message: "1 이상 값을 입력해주세요",
            },
          })}
        />
      </FormRow>
        .
        .
        .
    </Form>
  );
}

export default CreateCabinForm;
--------------------------------
// console.log(err)
>>{name: {…}, maxCapacity: {…}, regularPrice: {…}, description: {…}}
▼ description:
    message:
    "내용을 입력해주세요."
    ref: textarea#description.sc-cwHqhk.eNLcmR
    type: "required"
    [[Prototype]]: Object
    maxCapacity: {type: 'required', message: '내용을 입력해주세요.', ref: input#maxCapacity.sc-kpDprT.bTmvMW}
    name: {type: 'required', message: '내용을 입력해주세요.', ref: input#name.sc-kpDprT.bTmvMW}
    regularPrice: {type: 'required', message: '내용을 입력해주세요.', ref: input#regularPrice.sc-kpDprT.bTmvMW}
    [[Prototype]]: Object
```

# `validate` 프로퍼티 - 사용자 정의 유효성 검사 함수로 유효성 검사하기

`validate` 프로퍼티에 함수 전달하여 사용자 정의 유효성 검사를 할 수 있다.

`validate` 함수의 인수로는 해당 폼 요소의 값이 전달 되며 함수가 참을 반환하면 유효성 검사 성공, 문자열을 반환할 경우 에러 메시지로 간주한다.

```
function CreateCabinForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("숙소 등록 성공");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  function onError(err) {
    console.log(err);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "내용을 입력해주세요.",
            min: {
              value: 1,
              message: "1 이상 값을 입력해주세요",
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "내용을 입력해주세요.",
            validate: (value) => value > 100 || "에러 메시지",
          })}
        />
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
```

만약 다른 필드의 값과 비교해서 유효성 검사를 하고 싶을 땐 어떻게 해야 할까? 이때 `useForm` 훅이 반환하는 `getValues` 함수가 반환하는 객체로 다른 폼 요소의 값을 참조할 수 있다.

```
const { register, handleSubmit, reset, getValues } = useForm();

 <Form onSubmit={handleSubmit(onSubmit, onError)}>
    <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "내용을 입력해주세요.",
            min: {
              value: 1,
              message: "1 이상 값을 입력해주세요",
            },
          })}
        />
    </FormRow>
    <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "내용을 입력해주세요.",
            validate: (value) =>
              value <= getValues().regularPrice || "할인 가격은 정가를 넘을 수 없습니다.",
          })}
        />
    </FormRow>
      .
      .
```

# 등록한 에러 메시지 참조하기

`useForm` 훅이 반환하는 `formState` 객체로 폼 요소의 상태를 참조할 수 있다. `formState` 객체는 폼 요소 전체의 상태를 담고 있다.

이 `formState` 객체의 `errors` 프로퍼티를 통해 유효성 검사에 통과하지 못한 폼 요소를 식별하고 에러 메시지를 참조할 수 있다.

```
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;
    .
    .
    .
<Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "이름을 입력해주세요.",
          })}
        />
        // useForm의 formState.errors 참조
        {errors?.name?.message && <Error>{errors.name.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          defaultValue={1}
          {...register("maxCapacity", {
            required: "내용을 입력해주세요.",
            min: {
              value: 1,
              message: "1 이상 값을 입력해주세요",
            },
          })}
        />
        {errors?.maxCapacity?.message && <Error>{errors.maxCapacity.message}</Error>}
      </FormRow>
    </Form>
  );
}
```
