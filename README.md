# object-storage

1. 프로젝트 개요

이번 프로젝트는 사용자가 로그인 후 파일을 업로드하고, 다운로드 링크를 발급받아 다른 사람과
공유할 수 있는 오브젝트 스토리지 서비스를 구현한 것이다.
사용자는 파일에 대해 공개, 비공개, 비밀번호 보호 중 하나를 선택해서 접근 권한을 설정할 수
있으며, 본인이 업로드한 파일 목록을 확인하거나 삭제할 수도 있다.
백엔드는 Node.js로 구성되어 있고, JWT 기반 인증을 사용해 로그인한 사용자만 파일 업로드가
가능하도록 했다.
프론트엔드는 간단한 웹 UI로 구성되어 있으며, 사용자가 파일을 선택하고 권한을 설정한 뒤 업
로드할 수 있도록 구현하였다.
파일 자체는 서버 내 저장소에 저장되며, 파일에 대한 메타데이터(이름, 용량, 소유자, 업로드 시
간 등)는 JSON 파일을 통해 따로 관리한다.
또한, 발급된 다운로드 링크는 이미지나 PDF 파일의 경우 <img>, <a> 태그를 통해 바로 웹 페이
지에서 사용할 수 있도록 HTTP 헤더 설정도 포함시켰다.

2. 코드 제출물 디렉토리 구조

<img width="590" height="651" alt="image" src="https://github.com/user-attachments/assets/4b14e037-11e0-40a2-8185-87faeb9a300b" />

3. 개발환경 구축, 빌드, 배포

3.1 개발환경 구축
3.1.1 Node.js 설치 (버전 18 기준)

sudo apt update

sudo apt install -y curl

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install -y nodejs

3.1.2 프로젝트 폴더 전송
VSCode로 개발한 object-storage 폴더를 scp 또는 SFTP로 Ubuntu 서버에 복사함.
scp -r object-storage ubuntu@<서버IP>:~

3.2 빌드
cd ~/object-storage/backend
npm install

3.3 배포
node server.js
