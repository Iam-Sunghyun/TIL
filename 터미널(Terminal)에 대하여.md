<!-- ## 백엔드 콘텐츠에 대하여 (node, Express DB auth 등등) -->

# 터미널(Terminal)이란?

컴퓨터가 훨씬 컸던 시절 컴퓨터에 연결해 데이터의 입력 및 표시를 처리하는 전자 통신 하드웨어 장치였으며 이러한 물리적 터미널을 콘솔(console)이라고도 불렀다.
```
터미널은 통신 프로세스의 종료를 나타내는 ‘terminate’에서 유래한 전자적 관점의 용어이다. 유닉스시대의 터미널은 전신기(teleprinter) 스타일의 타자기를 의미하며, 읽기 및 쓰기 이외의 여러 추가 명령(ioctls)을 구현하는 하드웨어 기기였다.
```
지금은 물리 장치가 아닌 텍스트로 명령어를 실행해 컴퓨터와 상호작용 할 수 있는 명령어 입출력 환경을 말한다. 정확히는 **UNIX 계열(리눅스, macOS 포함) 운영체제에서 명령어를 입력하기 위한 CLI를 말하며 쉘을 실행하기 위한 wrapper 역할을 한다.**

<!-- **윈도우에선 파워 쉘, cmd(명령 프롬프트)가 터미널과 같은 개념.** -->

## 터미널 명령어 일부

|명령어|기능|
|:---:|:---:|
|`cd`|디렉토리 이동|
|`touch`|빈 파일 생성|
|`ls`|디렉토리 목록 확인|
|`mkdir`|새 디렉토리 생성|
|`rm`|파일, 디렉토리 삭제|
|`cp`|파일 복사|
|`mv`|파일 이동 및 이름 변경|

<br>

**[터미널 명령어]** <br>
https://yadon079.github.io/2021/etc/linux-command<br>
https://www.hostinger.com/tutorials/linux-commands<br>


<!-- touch, ls는 유닉스 계열 운영체제 명령어이기 때문에 cmd에서 실행되지 않았다.
따라서 cmd(명령 프롬프트)에서는 echo $null >> filename으로, 파워쉘(윈도우 파워쉘)에서는 New-Item 생성해주었다.

cmd, 윈도우 파워쉘과 리눅스, 맥 명령어가 일부 다른 듯. 윈도우엔 쉘이 없는것인가?
-> 유닉스 계열 운영체제(리눅스 맥os)는 유닉스 쉘(bash shell, z shell 등)이 내장되어있다. -->


# 터미널과 같은 CLI를 알아야하는 이유?

1. 작업 속도. 능숙하게 다룬다면 한번의 명령어 입력으로 여러 명령을 실행할 수도 있다(여러개의 파일을 한번에 생성한다던지 등). 이것보다 좀 더 주된 이유는 다음에 있다.

2. 접근 권한. 터미널은 컴퓨터에 모든 액세스 권한 비슷한 것 제공해준다. 예를들면 보통은 접근이 금지되어있는 소프트웨어나 숨김 파일, 운영 체제 일부 등 추가적인 액세스 권한을 얻을 수 있다. 이것은 장단점이 될 수 있는데 미숙한 사용으로 인해 변경해선 안될 부분을 변경하거나 파일을 실수로 삭제해버리는 등 문제가 될 위험도 있기 때문이다.

3. 여러 백엔드 소프트웨어(DB, Node, Express 등)들이 터미널과 같은 CLI를 기반으로 동작한다. 


# 헷갈리는 용어 간단 정리

아래는 모두 비슷한 개념에 대한 용어들이긴 하지만 동일한 용어는 아니다.

## 파워 쉘(power shell), 명령 프롬프트(cmd)

윈도우의 기본 CLI 환경이 명령 프롬프트(cmd)이고 추가적인 기능으로 향상된 버전이 파워 쉘이다.

유닉스 계열 운영체제의 터미널, 쉘과 달리 하나의 완전한 스크립팅 환경인듯.

## 쉘(shell)?


쉘은 터미널에서 실행되는 소프트웨어로 쉽게 말해 터미널을 통해 사용자가 입력하는 명령어를 전달 받아 기계어로 변역하여 커널에 전달하는 역할을 하는 명령어 해석기를 말한다.

터미널은 곧 명령을 입력하는 쉘을 실행하기 위한 토대라고 볼 수 있으며 운영 체제 주변의 가장 바깥쪽 계층이기 때문에 쉘(shell, 껍데기)이라는 이름이 붙었다.

다양한 종류의 쉘들이 있고 바꿔서 사용할 수 있으며, 각각 사용하는 이유가 다 따로 있다(bash, zshell 가장 많이 사용한다고 함).

<br>

**[커널, 쉘과 터미널 차이]**<br>
https://hanamon.kr/%ED%84%B0%EB%AF%B8%EB%84%90-%EC%BD%98%EC%86%94-%EC%89%98-%EB%AA%85%EB%A0%B9%EC%A4%84terminal-console-shell-command-line%EC%9D%98-%EC%B0%A8%EC%9D%B4-2/ <br>
https://kimwooseok.com/cs/2021/07/22/CS-Kernel/ <br>

**[쉘 (Shell) 의 정의와 종류]** <br>
https://en.wikipedia.org/wiki/Shell_(computing) <br>
https://unabated.tistory.com/entry/LinuxUnix쉘-Shell-의-정의와-종류 

## 커맨드라인 인터페이스(CLI)

CLI는 명령줄 인터페이스(Commandlind Interface, 명령어 인터페이스)의 약자로 터미널과 같이 텍스트로 명령어를 입출력하는 방식을 말한다.


## 배쉬(bash)

Bash는 Bourne 셸의 무료 소프트웨어 대체품으로 GNU 프로젝트를 위해 Brian Fox가 작성한 Unix 셸 및 명령 언어를 말한다. <br>

**[bash 위키피디아]** <br>
https://en.wikipedia.org/wiki/Bash_(Unix_shell)

## 프롬프트
터미널에서 키보드의 입력을 확인하고 편집할 수 있는 한 줄의 공간을 '프롬프트(Prompt)' 라고 하며, 사용자의 명령 입력 대기 상태를 나타내는 표시(커서)를 말하기도 한다.


<!-- ## Git Bash

git bash도 유닉스 쉘의 한 종류...
윈도우에서 git bash를 사용하는 이유 
https://www.atlassian.com/git/tutorials/git-bash -->










<!-- 
**[유닉스와 리눅스에 대하여]** <br>
https://www.softwaretestinghelp.com/unix-vs-linux/ -->

<!-- 유닉스 계열 운영체제만 쉘을 갖는것인가

윈도우 터미널, 파워쉘, cmd(command prompt, 명령 프롬프트) 모두 쉘인가? - 아닌듯.
cmd보다 파워쉘이 더 기능이 다양하고 윈도우 터미널은 두개를 합쳐놓은 느낌인듯 
<br>
https://junetony.junebest.com/entry/%EB%AA%85%EB%A0%B9-%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8-vs-%ED%8C%8C%EC%9B%8C%EC%89%98-vs-%EC%9C%88%EB%8F%84%EC%9A%B0-%ED%84%B0%EB%AF%B8%EB%84%90-%EC%B0%A8%EC%9D%B4%EC%A0%90 -->

