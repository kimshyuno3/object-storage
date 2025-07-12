🗂️ object-storage
사용자가 로그인하여 파일을 업로드하고, 다운로드 링크를 발급받아 다른 사람과 공유할 수 있는 간단한 오브젝트 스토리지 서비스입니다.

📌 1. 프로젝트 개요
로그인한 사용자는 파일 업로드가 가능하고, 각 파일에 대해 다음 중 하나의 접근 권한을 설정할 수 있습니다:

🔓 공개

🔐 비공개

🔑 비밀번호 보호

업로드한 파일은 서버 로컬에 저장되며, 파일 메타데이터(파일명, 크기, 소유자, 업로드 시간 등)는 별도의 JSON 파일로 관리됩니다.

다운로드 링크는 이미지 또는 PDF 파일일 경우, <img> 또는 <a> 태그로 바로 사용할 수 있도록 HTTP 헤더 설정을 포함합니다.

JWT 기반 인증을 통해 로그인한 사용자만 업로드 가능하도록 구현했습니다.

간단한 웹 UI를 통해 사용자가 파일 선택 → 권한 설정 → 업로드를 직관적으로 진행할 수 있습니다.

📂 2. 디렉토리 구조

<img src="https://your-image-url.com/demo.png" width="600"/>

⚙️ 3. 개발환경 구축, 빌드, 배포
3.1 개발환경 구축
3.1.1 Node.js 설치 (Ubuntu 기준 - Node.js v18)
bash
복사
편집
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
3.1.2 프로젝트 폴더 서버로 복사
로컬에서 작성한 프로젝트 폴더(object-storage)를 서버로 전송:

bash
복사
편집
scp -r object-storage ubuntu@<서버IP>:~
3.2 빌드
서버에 접속한 뒤 backend 디렉토리로 이동하여 의존성 설치:

bash
복사
편집
cd ~/object-storage/backend
npm install
3.3 배포
다음 명령어로 Node.js 서버 실행:

bash
복사
편집
node server.js
🔄 필요 시 pm2, forever, screen 등을 이용해 백그라운드 실행 가능

🔐 인증 방식
JWT 기반 로그인 구현

로그인한 사용자만 /upload, /delete 등 보호된 API 접근 가능

📎 다운로드 링크 예시
이미지 파일:
<img src="http://your-domain.com/download/<fileId>"/>

PDF 파일:
<a href="http://your-domain.com/download/<fileId>" target="_blank">열기</a>
