# 한화 방산 미래전략실 글로벌 안보 트렌드 분석 & 18대 무기체계 매칭 인텔리전스 시스템

**한화 방산 미래전략실(Hanwha Defense Intelligence Platform)**은 실시간 **데일리방산 100건 뉴스 피드**와 **Armed Conflicts 29개 글로벌 활성 분쟁 데이터**를 연계·상관 분석하여, 국가별 지정학적 위기 지수(GRI)를 실시간 산출하고 한화 방산 3사(한화에어로스페이스, 한화시스템, 한화오션)의 **18대 핵심 무기체계**에 대한 작전 환경 적합도 및 소요 매칭을 수행하는 통합 엔터프라이즈 인텔리전스 플랫폼입니다.

---

## 🚀 주요 핵심 기능 (Core Features)

1. **글로벌 지정학 리스크(GRI) 분석 & 4대 택티컬 맵**
   * 전 세계 29개 활성 분쟁지별 사상자, 분쟁 형태, 최근 모멘텀 기반 **GRI(Geopolitical Risk Index, 0~100)** 자동 산출
   * 4대 고해상도 맵 테마 지원: **Dark Tactical(택티컬 다크)**, **World Topo(지형 고도)**, **Google Satellite(고해상도 위성)**, **Standard Roadmap(일반 행정망)**
   * 전 맵 100% 한글 지명 표기 및 위험도 필터(High/Medium/Low)별 전장 중심 자동 피팅/클러스터링

2. **한화 방산 3사 통합 18대 핵심 무기체계 포트폴리오**
   * **지상/화력 (한화에어로스페이스)**: K9 자주포(K9A1/A2/A3), 천무 다련장로켓, 레드백 보병전투장갑차, 타이곤 6x6 차륜형 장갑차, 천검(TAIPERS) 전술유도탄
   * **대공/방공 (한화에어로스페이스 / 한화시스템)**: 천궁-II 다기능레이다/발사대, L-SAM 장거리 지대공, 비호복합 대공포, 천호 30mm 차륜형 대공포, 레이저 대공무기(Block-I/II)
   * **해양/함정 (한화오션 / 한화시스템)**: KSS-III 장보고-III 잠수함, FFX/KDDX 호위함·구축함, 함정전투체계(CMS), 해양 유무인 복합체계(Ghost Commander)
   * **항공/우주/미래체계 (한화에어로스페이스 / 한화시스템)**: KF-21 AESA 레이다, 첨단 항공 가스터빈 엔진, 초소형 SAR 위성 & 군 저궤도 통신망, 다목적 무인차량(Arion-SMET)

3. **지형·기후·환경 적합도 분석 엔진 (Terrain & Climate Intelligence)**
   * 29개 분쟁지별 온도 범위(-32°C ~ +50°C), 습도, 험지 유형(안데스 운무림, 사헬 사막, 라테라이트 적색토, 힌두쿠시 고산 협곡 등) 및 특수 안보 위협 데이터베이스
   * 18대 무기체계별 MIL-STD 운용 환경 규격 및 지형 적합도(0~100점), 야전 제약사항 및 맞춤형 대책 패키지(Countermeasure Package) 매칭
   * 전장별 위키미디어 실사 위성/지형 사진 데이터베이스 연동

4. **OpenAI GPT-5.4 기반 C-Level 6대 챕터 전략 인텔리전스 보고서**
   * **Track 1 / Track 2 통합 심층 브리핑**:
     - **Ch 1. 경영진 핵심 안보 요약 (Executive Summary)**
     - **Ch 2. 주요 거점 리스크 및 전개 상황 (Theater Assessment)**
     - **Ch 3. 한화 방산 소요 매칭 및 기회 분석 (Opportunity Matrix)**
     - **Ch 4. 글로벌 방산 위기-무기 매칭 매트릭스 (Tactical Alignment Matrix)**
     - **Ch 5. 실시간 데일리방산 안보 타임라인 (Chronological Intel Timeline)**
     - **Ch 6. 한화 3대 방산 계열사별 액션 플랜 (Strategic Roadmap)**
   * **독립 페이지 뷰(`/report`) & A4 인쇄 최적화 레이아웃** 완비
   * **2단계 캐싱 아키텍처**: 브라우저(LocalStorage) + 서버(인메모리) 캐싱으로 불필요한 토큰 낭비 방지 및 수동 최신화(Refresh) 지원

5. **실시간 데일리방산 100건 뉴스 비동기 수집 & 타임라인**
   * 최신 기사 RSS 파싱 및 과거 기사 순차 완충 수집으로 100건 팩트 데이터베이스 자동 유지
   * 기사별 관련 분쟁 및 한화 무기체계 키워드 자동 인덱싱 및 원문 링크 제공

---

## 🛠️ 기술 스택 (Tech Stack)

* **Backend**: Python 3.11, FastAPI, Uvicorn, httpx (비동기 I/O), xmltodict, pydantic
* **Frontend**: React 19 (`^19.2.8`), Vite 8.2, Leaflet 1.9, Lucide React, Modern Tactical Dark CSS
* **AI & Intelligence**: OpenAI GPT-5.4 Pipeline (프롬프트 그라운딩 18k 토큰 컨텍스트, 6k 토큰 전략 보고서 출력)
* **Data Sources**:
  * 데일리방산 실시간 뉴스 100건 (`https://www.dailydefense.co.kr/rss/allArticle.xml`)
  * Armed Conflicts 29개 글로벌 활성 분쟁 JSON (`https://armedconflicts.org/data/{slug}.json`)
  * 위키미디어 공용 전장 지형 실사 사진 데이터셋

---

## 📂 프로젝트 구조

```
c:\team4
├── backend/                  # FastAPI 백엔드 & AI 분석 파이프라인
│   ├── main.py               # REST API & React SPA 프로덕션 정적 서빙
│   ├── collector.py          # 데일리방산 100건 뉴스 + 29개 분쟁 JSON 비동기 수집기
│   ├── analyzer.py           # GRI 지수 산출, 지형 매칭 & GPT-5.4 C-Level 전략 보고서 엔진
│   ├── config.py             # 한화 방산 18대 포트폴리오, 29개 분쟁 지형/기후 메타데이터
│   ├── cleanup.py            # 시작 시 포트(8000) 충돌 자동 해제 유틸리티
│   └── stop_servers.py       # 종료 시 실행 중인 서버 프로세스 완전 정리 스크립트
│
├── frontend/                 # React 19 프론트엔드 (Vite SPA)
│   ├── src/
│   │   ├── App.jsx           # 최상위 상태 관리, 라우트 감지 및 뷰 전환
│   │   ├── main.jsx          # React 엔트리포인트 & ErrorBoundary 가드
│   │   ├── components/       # 핵심 UI 컴포넌트
│   │   │   ├── Header.jsx            # 상단 글로벌 인텔리전스 헤더 및 브리핑 호출 버튼
│   │   │   ├── ViewNav.jsx           # 지도/매트릭스/뉴스/포트폴리오 뷰 네비게이션
│   │   │   ├── RiskMap.jsx           # Leaflet 4대 테마 인터랙티브 분쟁 지도
│   │   │   ├── MatchingMatrix.jsx    # 분쟁-소요 무기 매칭 매트릭스 & 환경 적합도
│   │   │   ├── NewsFeed.jsx          # 실시간 데일리방산 100건 뉴스 타임라인
│   │   │   ├── PortfolioSpectrum.jsx # 한화 18대 무기체계 기술 스펙트럼
│   │   │   ├── ReportPageView.jsx    # C-Level 전략 보고서 단독 전체 페이지 뷰 (/report)
│   │   │   ├── ReportDocument.jsx    # A4 인쇄 규격 6대 챕터 정식 보고서 문서 뷰어
│   │   │   ├── ReportModal.jsx       # 대시보드 내 보고서 모달 뷰어
│   │   │   ├── SettingsModal.jsx     # OpenAI API Key 설정 및 연결 진단 모달
│   │   │   └── ErrorBoundary.jsx     # UI 충돌 방지 및 안전 렌더링 폴백
│   │   └── index.css         # 다크 택티컬 커맨드 디자인 & 인쇄 전용 CSS (@media print)
│   ├── dist/                 # 프로덕션 빌드 번들 (FastAPI가 단독 서빙)
│   ├── vite.config.js        # Vite 개발 프록시 설정
│   └── package.json          # 프론트엔드 의존성 (React 19, Leaflet 등)
│
├── data_cache/               # 실시간 수집 데이터 로컬 캐시
│   ├── news.json             # 데일리방산 최신 100건 뉴스 데이터
│   ├── conflicts.json        # 29개 글로벌 분쟁 상세 데이터
│   └── verified_photos.json  # 검증된 전장 지형/위성 사진 데이터
│
├── py_runtime/               # 로컬 독립 Python 3.11 런타임
├── Dockerfile                # 컨테이너 기반 배포 명세서
├── requirements.txt          # 파이썬 의존성 패키지 목록
├── start.bat                 # 원클릭 원터치 포털 실행 배치 파일
└── stop.bat                  # 원클릭 서버 안전 완전 종료 배치 파일
```

---

## 🚀 실행 및 운용 가이드

### 1. 원클릭 실행 (Start)
프로젝트 루트의 **`start.bat`** 파일을 더블클릭합니다.
* 8000번 포트 충돌 여부를 자동 확인 및 정리한 후 백엔드 서버를 구동합니다.
* 기본 브라우저에서 대시보드(**`http://localhost:8000`**)가 자동으로 실행됩니다.

### 2. 원클릭 종료 (Stop)
프로젝트 루트의 **`stop.bat`** 파일을 더블클릭합니다.
* 8000번 포트(FastAPI) 및 5173번 포트(Vite)에서 구동 중인 백그라운드 프로세스와 터널을 안전하게 종료합니다.

### 3. C-Level 전략 보고서 열람
* 메인 대시보드 우측 상단 **[C-Level 전략 보고서]** 버튼 클릭 시 모달 뷰어로 즉시 열람할 수 있습니다.
* 모달 내 **[새 창으로 열기]** 버튼 또는 브라우저 주소창에 직접 **`http://localhost:8000/report`** 입력 시 독립된 전체 화면 페이지로 이동하며, 상단 **[PDF / 인쇄]** 버튼을 통해 A4 문서로 즉시 출력/저장할 수 있습니다.

### 4. 수동 실행 (터미널)
```bash
# FastAPI 백엔드 + 프로덕션 React 번들 동시 서빙
py_runtime\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
브라우저 접속: **`http://localhost:8000`**

### 5. 프론트엔드 개발 모드 (Vite HMR Hot-Reloading)
```bash
# 터미널 1: FastAPI 백엔드
py_runtime\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

# 터미널 2: React Vite 개발 서버
cd frontend
npm run dev
```
브라우저 접속: **`http://localhost:5173`** (API는 8000번 포트로 자동 프록시 연결됨)

### 6. Docker 컨테이너 배포
```bash
# 1. 도커 이미지 빌드
docker build -t hanwha-defense-platform .

# 2. 컨테이너 실행
docker run -d -p 8000:8000 --name hanwha-portal hanwha-defense-platform
```
브라우저 접속: **`http://localhost:8000`**
