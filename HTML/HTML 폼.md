# 목차
+ [HTML 폼(Form)](https://github.com/Iam-Sunghyun/TIL/blob/main/HTML/HTML%20%ED%8F%BC.md#html-%ED%8F%BCform)
+ [HTML 폼 유효성 검사](https://github.com/Iam-Sunghyun/TIL/blob/main/HTML/HTML%20%ED%8F%BC.md#html-%ED%8F%BC-%EC%9C%A0%ED%9A%A8%EC%84%B1-%EA%B2%80%EC%82%AC)


# HTML 폼(Form)

**HTML 폼(양식)** 이란 말 그대로 **입력 양식** 을 뜻하며, 사용자 입력을 위한 HTML 요소들을 담는 태그이다. 

사용자 이름, 이메일 주소 또는 기타 필수 정보와 같이 **사용자가 입력한 정보를 수집하고 서버로 전송(HTTP 요청)하는 데 주로 사용된다.**  

보통은 웹 서버 전송이 목적이지만 웹 페이지가 데이터를 사용하기 위한 경우도 있다.

HTML의 폼 태그 안에는 체크박스, 라디오 버튼, 입력 텍스트 필드, 비밀번호 필드 등 사용자의 입력을 받는 요소들이 포함되며 웹사이트의 모든 등록 또는 로그인/가입 페이지에서 볼 수 있다.

다음은 `form`요소 형식과 필수 속성들이다.
## 예시
```
<form action="양식 전송 위치(url)" method="get"></form>
```
+ `action` - 데이터를 보낼 URL을 지정한다.

+ `method` - 어떤 HTTP 방식을 사용할 것인지 지정한다.(GET 이나  POST)

# 자주 사용하는 HTML 폼 요소

## ```<input>```

**가장 자주 쓰이고 강력한 HTML 폼 요소**이다. type 속성 값에 따라 20가지가 넘는 폼 요소를 만들 수 있으며 기본 값은 "text"이다.

### 속성 몇가지
+ ```type``` - 요소의 타입을 지정한다.<br>
+ ```id``` - 요소의 id를 지정한다.<br>
+ ```name``` - 폼 요소의 이름을 지정한다. name 속성은 폼(form)이 제출된 후 서버에서 폼 데이터(form data)를 참조하기 위해 사용되거나, 자바스크립트에서 요소를 참조하기 위해 사용된다.
+ ```value``` - 폼 요소의 값. name/value 속성은 name=value 형태로 짝이 되어 서버에 전송된다. 

<br>

## ``` <label>```

요소를 설명하는 역할을 한다.
```<input>``` 요소와 연결하게 되면 연결된 label의 텍스트를 클릭해도 ```<input>```요소가 활성화 된다.

스크린 리더를 사용할 경우 ```<input>``` 요소에 연결된 label 내용을 설명 해 이해를 돕는다.

for 속성에 요소의 id를 입력해 연결하거나, label 태그 안에 중첩시켜 연결 할 수 있다.(전자를 주로 사용)

```
<div class="preference1">
    <label for="cheese">Do you like cheese?</label>
    <input type="checkbox" name="cheese" id="cheese1">x
</div>

<div class="preference2">
    <label>Do you like cheese?
    <input type="checkbox" name="cheese" id="cheese2">
    </label>
</div>
```

<br>

## 체크박스, 라디오 버튼 

체크박스 - ```<input type="checkbox" name="이름" id="id" checked>``` 


라디오 버튼 - ```<input type="radio" name="이름" id="id" value="요소의 값">```


체크박스와 달리 라디오 버튼은 아래와같이 동일한 name 값으로 버튼들을 그룹화하여 1가지 항목만 선택하게 할 수 있다.
```
<fieldset>
    <legend>Select a maintenance drone:</legend>

    <div>
      <input type="radio" id="huey" name="drone" value="huey"
             checked>
      <label for="huey">Huey</label>
    </div>

    <div>
      <input type="radio" id="dewey" name="drone" value="dewey">
      <label for="dewey">Dewey</label>
    </div>

</fieldset>
```

## ```<select>``` 


흔히 알고 있는 드롭다운 메뉴이다. 옵션 태그로 항목을 구성한다.
```
<select name="select" id="select">
    <option value="1">example1</option>
    <option value="2">example2</option>
</select>
```

## ```<input type="range">```
```
input type="range" min="최소 값" max="최대 값" step="단위" value="최초 값" name="이름" id="id"
```
```<input type="number">``` 또한 같은 속성을 사용한다.

<br>

## ```<textarea>``` 
```
<textarea name="이름" id="id" cols="최초 열" row="최초 행" placeholder="hint">
```
텍스트를 입력 할 수 있는 영역을 생성한다.

<br>

## ```<button>```

폼 뿐만 아니라 어디에서나 사용 할 수 있는 버튼 요소.

```<button>``` type의 기본 값은 "submit"으로 form 내부에서 사용 할 경우 클릭 시 action이 가리키는 위치로 폼 데이터를 전송한다. 일반적인 버튼으로 사용하고 싶다면 type="button" 해주면 된다.

```<input>```요소 또한 type을 "submit"으로 지정하면 폼을 전송 할 수 있다. 다만 버튼 이름을 변경하려면 텍스트만 바꿔주면 되는 ```<button>```과 달리 value="버튼 이름" 형태로 속성에 입력해줘야 한다.

이 외에도 엔터 키를 이용해 폼 데이터를 전송 할 수도 있다.


### 구글 검색 이용해보기

```
<h2>Search google</h2>
  <form action="https://www.google.com/search">
    <input type="text" name="query" id="1">
    <button>Search google</button>
  </form>
```
검색어 입력 후 버튼 클릭 시 url은 ```https://www.google.com/search?query="입력 값(검색 내용)"```과 같이 action URL과 ? 구분자 뒤에 양식 데이터를 이어 붙여서 전송한다.


<br>

**[MDN input type]** <br>
https://developer.mozilla.org/ko/docs/Web/HTML/Element/Input#%3Cinput%3E_%EC%9C%A0%ED%98%95

**[HTML 폼 요소가이드]**

https://developer.mozilla.org/ko/docs/Learn/Forms#html_%EC%9A%94%EC%86%8C


<br>

# HTML 폼 유효성 검사

입력에 제한을 추가하거나 하여 입력된 데이터가 유효한 값인지 검사하는 것. 

EX) 특수 문자를 포함해야 되는 비밀번호, 아이디 최대 길이 제한 등

클라이언트 측 유효성 검사도 경우도 있고, 서버 측에서 검사하는 경우도 있다.

## 클라이언트 측 유효성 검사

별도의 자바스크립트 코드 없이 사용할 수 있는 HTML 기본 validation 속성들이 있다. 

일부 입력 요소는 유효성 검사가 내장되어 있다. ex) input type="email", "tel" , "url" ....

pattern 속성을 통해 검증하고 싶은 패턴을 정규표현식으로 지정 할 수도 있다.

+ ```required``` - 속성을 명시하여 필수 입력 값으로 만든다.
+ ```minlength```, ```maxlength``` - 최소, 최대 입력 가능 값을 지정한다.
+ ```min```, ```max``` 숫자 입력 유형의 최소값 및 최대값을 지정한다.
+ ```type``` - 데이터가 숫자, 이메일 주소 또는 기타 특정 사전 설정 유형이어야 하는지 여부를 지정한다.
+ ```pattern``` - 입력된 데이터가 따라야 하는 패턴을 정의하는 정규식을 지정한다.

<br>

**[클라이언트 측 유효성 검사]** 
+  https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
