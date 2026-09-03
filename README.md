# 한화 방산 미래전략실 글로벌 트렌드 분석 & 소요 무기 매칭 시스템

**데일리방산 RSS 피드**와 **Armed Conflicts 29개 분쟁 데이터**를 실시간 수집 및 상관분석하여 지정학적 위기 지수(GRI) 산출 및 한화 방산 10대 핵심 무기체계 소요 매칭을 수행하는 웹 인텔리전스 대시보드입니다.

---

## 🛠️ 기술 스택 (Tech Stack)

* **Backend**: Python 3.11, FastAPI, Uvicorn, httpx (비동기 I/O), xmltodict, pydantic
* **Frontend**: React 18, Vite, Leaflet, Lucide React, Modern Tactical Dark CSS
* **Data Sources**:
  * 데일리방산 최신 뉴스 RSS (`https://www.dailydefense.co.kr/rss/allArticle.xml`)
  * Armed Conflicts 29개 글로벌 활성 분쟁 JSON (`https://armedconflicts.org/data/{slug}.json`)

---

## 📂 프로젝트 구조

```
c:\team4
├── backend/                  # FastAPI 백엔드
│   ├── main.py               # REST API & React SPA 정적 서빙
│   ├── collector.py          # 데일리방산 RSS + 29개 분쟁 JSON 비동기 수집기
│   ├── analyzer.py           # 지정학 리스크 지수(GRI) 산출 & 한화 무기 매칭 AI 엔진
│   └── config.py             # 한화 방산 포트폴리오 & 29개 분쟁 메타데이터
│
├── frontend/                 # React 프론트엔드 (Vite SPA)
│   ├── src/
│   │   ├── App.jsx           # 최상위 상태 관리 및 뷰 전환
│   │   ├── components/       # UI 컴포넌트 (Map, Matrix, News, Portfolio, Modals)
│   │   └── index.css         # 다크 택티컬 커맨드 디자인
│   ├── dist/                 # 컴파일된 프로덕션 빌드 (FastAPI가 직접 서빙)
│   └── vite.config.js        # Vite 프록시 설정
│
├── data_cache/               # 실시간 수집 데이터 로컬 캐시 (news.json, conflicts.json)
├── py_runtime/               # 로컬 Python 3.11 런타임
├── requirements.txt          # 파이썬 의존성 패키지 목록
├── start.bat                 # 원클릭 원터치 실행 배치 파일
└── stop.bat                  # 원클릭 서버 안전 종료 배치 파일
```

---

## 🚀 실행 및 종료 방법

### 1. 원클릭 실행 (Start)
**`start.bat`** 파일을 더블클릭하면 백엔드와 프론트엔드가 실행되고 브라우저(`http://localhost:8000`)가 자동으로 열립니다.

### 2. 원클릭 종료 (Stop)
**`stop.bat`** 파일을 더블클릭하면 8000번 포트(FastAPI) 및 5173번 포트(Vite)에서 실행 중인 프로세스가 깔끔하고 안전하게 자동 종료됩니다.

### 3. 터미널 수동 실행
```bash
# FastAPI 백엔드 + React SPA 단일 실행
py_runtime\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
브라우저 접속: **`http://localhost:8000`**

### 4. 프론트엔드 개발 모드 (Vite HMR Hot-Reloading)
```bash
# 터미널 1: FastAPI 백엔드
py_runtime\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

# 터미널 2: React Vite 개발 서버
cd frontend
npm run dev
```
브라우저 접속: **`http://localhost:5173`**
