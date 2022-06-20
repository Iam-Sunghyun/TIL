# HTML 폼(Form)

**HTML 폼(양식)** 이란 말 그대로 **입력 양식** 을 뜻하며, 사용자 입력을 위한 HTML 요소들을 담는 빈 요소(empty elements)이다. 

사용자 이름, 이메일 주소 또는 기타 필수 정보와 같이 **사용자가 입력한 정보를 수집하고 서버로 전송(HTTP 요청)하는 데 사용된다.** 

HTML의 폼에는 체크박스, 라디오 버튼, 입력 텍스트 필드, 비밀번호 필드 등이 포함되며 웹사이트의 모든 등록 또는 로그인/가입 페이지에서 볼 수 있다.

```
<form action="양식 전송 위치(uri)" method="get"></form>
```

# HTML 폼 요소

## ```<input>```

가장 자주 쓰이고 강력한 HTML 폼 요소이다. type 어트리뷰트 값에 따라 20가지가 넘는 폼 컨트롤을 만들 수 있으며 기본 값은 "text"이다.

### 속성 몇가지
+ ```type``` - 요소의 타입을 지정한다.<br>
+ ```id``` - 요소의 id를 지정한다.<br>
+ ```name``` - 폼 요소의 이름을 지정한다. name 속성은 폼(form)이 제출된 후 서버에서 폼 데이터(form data)를 참조하기 위해 사용되거나, 자바스크립트에서 요소를 참조하기 위해 사용된다.

<br>

## ``` <label>```

요소를 설명하는 역할을 한다.
```<input>``` 요소와 연결하게 되면 연결된 label의 텍스트를 클릭해도 ```<input>```요소가 활성화 된다.

스크린 리더를 사용할 경우 ```<input>``` 요소에 연결된 label을 설명 해 이해를 돕는다.

for 어트리뷰트에 요소의 id를 입력해 연결하거나, label 태그 안에 중첩시켜 연결 할 수 있다.(전자를 주로 사용)

```
<div class="preference">
    <label for="cheese">Do you like cheese?</label>
    <input type="checkbox" name="cheese" id="cheese">
</div>
```

<br>

## ```<button>```

어디에서나 사용 할 수 있는 버튼 요소. form 내부에서 사용 할 경우 ```<button>``` type의 기본 값은 "submit"으로, 클릭 시 action이 가리키는 위치로 폼 데이터를 전송한다. 
일반적인 버튼으로 사용하고 싶다면 type="button" 해주면 된다.

```<input>```요소 또한 type을 "submit"으로 지정하면 폼을 전송 할 수 있다. 다만 버튼 이름을 변경하려면 텍스트만 바꿔주면 되는 ```<button>```과 달리 value="버튼 이름" 형태로 어트리뷰트에 입력해줘야 한다.

이 외에도 엔터 키를 이용해 폼 데이터를 전송 할 수도 있다.

### 구글 검색 이용해보기

```
<h2>Search google</h2>
  <form action="https://www.google.com/search">
    <input type="text" name="query" id="1">
    <button>Search google</button>
  </form>
```
검색어 입력 후 버튼 클릭 시 url은 ```https://www.google.com/search?query="검색내용"```과 같이 변경된다.



**[HTML 폼 요소가이드]**

+ https://developer.mozilla.org/ko/docs/Learn/Forms
