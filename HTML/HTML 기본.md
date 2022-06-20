# 목차
+ [HTML이란?](https://github.com/Iam-Sunghyun/TIL/edit/main/HTML/HTML%20%EA%B8%B0%EB%B3%B8.md#html%EC%9D%B4%EB%9E%80)
+ [HTML 문서의 구조](https://github.com/Iam-Sunghyun/TIL/edit/main/HTML/HTML%20%EA%B8%B0%EB%B3%B8.md#html-%EB%AC%B8%EC%84%9C%EC%9D%98-%EA%B5%AC%EC%A1%B0)
+ [HTML 시맨틱 요소(Sementic Elements)](https://github.com/Iam-Sunghyun/TIL/edit/main/HTML/HTML%20%EA%B8%B0%EB%B3%B8.md#html-%EC%8B%9C%EB%A7%A8%ED%8B%B1-%EC%9A%94%EC%86%8Csementic-elements)
+ [HTML 테이블(table)](https://github.com/Iam-Sunghyun/TIL/edit/main/HTML/HTML%20%EA%B8%B0%EB%B3%B8.md#html-%ED%85%8C%EC%9D%B4%EB%B8%94table)


# HTML이란?
**HTML(hyper text markup language)** 은 1989~1990년 학술 논문의 구조를 표현하고, 초기 인터넷에 그 내용을 공유하기 위해 생겨난 **마크업 언어**이다. 태그를 이용해 구조를 지정한다.

+ 문서에 사인펜으로 마킹하는것처럼 HTML 태그가 하나의 마킹이 되어 문서 형식을 표현하는 것.



## HTML과 HTML5의 차이점?

**HTML5는 HTML을 정의하는 가장 발전된 표준**. 즉 최신 형태의 HTML으로 다양한 최신 웹 서비스를 위한 기능들을 포함한다. (오디오, 비디오, 3D그래픽, 웹 스토리지, Javascript API 등)

<br>

**[HTML과 HTML5 차이]**

+ https://www.scaler.com/topics/difference-between-html-and-html5/

+ https://www.javatpoint.com/html-vs-html5

<br>

# HTML 문서의 구조
```<!DOCTYPE html> ..... </html>``` 까지 HTML문서 기본 골자를 **상용구(boilerplate)** 라고 한다.
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My test page</title>
  </head>
  <body>
    <p>This is my page</p>
  </body>
</html>
```

### 요소 몇가지

+ ```<!DOCTYPE html>``` - HTML문서의 유형을 표시하는 것(HTML5).
+ ```<head></head>``` - 검색 결과에 노출 될 키워드, 홈페이지 설명, CSS 스타일, 문자 인코딩 형식 등 문서에 관한 메타데이터를 담고 있다.
+ ```<body></body>``` - 텍스트, 이미지, 오디오, 비디오 등 웹 페이지에 표시될 내용들이 들어감.

<br>

## 블록 레벨 요소 vs 인라인 요소

HTML에는 크게 2가지 종류의 요소가 있다.
+ **블록 레벨 요소(Block-level elements)** - 블록을 생성하는 요소. 한 라인을 다 차지한다. 블록 레벨 요소에는 중첩 될 수 있지만, 인라인 요소에는 중첩 될 수 없다.
  + **ex)** ```<h1~6>```, ```<p>```, ```<div>``` ...

+ **인라인 요소** - 한 라인 안에 포함되는 요소. 줄바꿈이 발생하지 않음.
  + **ex)** ```<img>```, ```<a>```, ```<span>``` ...


## ```<span>``` vs ```<div>```

두 태그 모두 제네릭 컨테이너(요소를 담아내는 것)로 ```<span>```은 인라인 요소, ```<div>```는 블록 레벨 요소라는 차이가 있고, 요소를 그룹화하는데 사용한다.

+ 불필요해보이는 컨테이너를 왜 사용하는가? -> 문서 단락을 구분 지을 수 있고, 콘텐츠를 그룹화해 css 스타일을 지정하기 용이하다.

<br>

## 엔티티 코드(Entity Code) 

**특수한 문자나 예약어를 표기하는데 사용**, 앰퍼센드(&)로 시작해 세미콜론(;)으로 끝난다.

엔티티 코드 없이 예약어같은 것을 사용해도 출력엔 문제가 없을 수 있으나, 문서를 열었을 때는 에러가 표시될 수 있다.

따라서 특수 문자, 예약어에는 엔티티 코드를 사용한다.

<br>

**[HTML 문서의 구조]**

+ https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Getting_started#html_%EB%AC%B8%EC%84%9C%EC%9D%98_%EA%B5%AC%EC%A1%B0
+ https://developer.mozilla.org/ko/docs/Web/HTML/Element

  
**[엔티티 코드 리스트]**  
+ https://dev.w3.org/html5/html-author/charref

<br>


# HTML 시맨틱 요소(Sementic Elements)

말 그대로 **의미가 담겨있는 요소, 마크업을 뜻함**.

HTML5 시맨틱 요소가 있기 전엔 ```<div> <span> <p>``` 등과 같은 태그로  구획을 구분했는데, 이러한 태그만으로는 그 의미나 기능을 알기 어렵다.


## 시맨틱 요소(태그)의 필요성

1. 크롤링 프로그램과 같은 다른 프로그램을 사용해 페이지에 접근 할 경우 태그로 원하는 콘텐츠의 위치를 쉽고 빠르게 특정할 수 있다.

2. 스크린 리더 같은 접근성을 위한 도구를 사용하는 사람들이 페이지를 탐색할 때 표지판이 되어줄 수 있다.

3. 페이지의 요소들이 의미로 구분되기 때문에 가독성이 좋다.

결론적으로 **접근성**과 **가독성**에 좋고 **SEO(Search Engine Optimization)에 있어서 필수**이다.

<br>

**[의미론적 요소들(Sementic elements)]**
+ https://developer.mozilla.org/ko/docs/Glossary/Semantics#%EC%9D%98%EB%AF%B8%EB%A1%A0%EC%A0%81_%EC%9A%94%EC%86%8Celement%EB%93%A4

<br>


# HTML 테이블(table)

말 그대로 행과 열을 가진 2차원 표를 말함. 

90년대~ 2000년대 초 지금보다 요소의 배치가 까다로웠을 시절 웹사이트 레이아웃(요소들을 배치하는 것)을 위해 사용되었음. 

현재 이러한 방식으로 테이블을 사용하는 것은 best practice가 아니며 실제 표를 보여줘야 할 때나, 표 형식의 콘텐츠 배열이 필요할 때 사용함.


## 테이블 요소의 콘텐츠

+ ```<caption>``` - 표의 제목을 설정한다.<br>
+ ```<th>``` - 테이블 헤더(테이블 칼럼(열) 제목)를  정의한다.<br>
+ ```<td>``` - 데이터를 포함하는 표의 셀을 정의함.<br>
+ ```<tr>``` - 테이블의 행을 의미한다.<br>

```<thead> <tfoot> <tbody>``` 와 같은 태그들은 논리적 섹션 구분용으로, 시맨틱 요소같은 역할을 한다(표가 복잡하다면 중요할 듯).

 이 외에도 ```<col> <colgroup>```등이 있고, 속성 또한 여러가지가 있다.

```
<table>
<caption>Alien football stars</caption> // 테이블 제목 표시 
 <thead> // 헤더 영역 표시
   <tr>  // 테이블의 행을 의미
      <th rowspan="2">Player</th>  // <셀을 해당 테이블 셀 그룹(열)의 헤더로 정의
      <th scope="col">Gloobles</th> 
      <th colspan="2">Za'taak</th>  // rowspan, colspan은 행과 열이 차지하는 크기를 지정
   </tr>
 </thead>
 <tbody> // 바디 표시
   <tr>
      <th scope="row">TR-7</th>
      <td>7</td>   // 데이터를 포함하는 표의 셀을 정의
      <td>4,569</td>
   </tr>
 </tbody>
</table>
```

<br>


**[HTML 테이블 태그, 속성 list]**  

+ https://www.scaler.com/topics/html/table-attributes-in-html/

+ https://developer.mozilla.org/ko/docs/Web/HTML/Element/table

