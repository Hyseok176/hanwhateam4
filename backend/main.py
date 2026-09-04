# backend/main.py
# 한화 방산 미래전략실 - FastAPI & React 통합 메인 애플리케이션

import os
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from . import config, collector, analyzer

# 상태 관리
class ServerState:
    news: list[dict] = []
    conflicts: list[dict] = []
    matching: list[dict] = []
    last_synced_at: Optional[str] = None
    is_syncing: bool = False

state = ServerState()

async def sync_and_analyze():
    if state.is_syncing:
        return
    state.is_syncing = True
    print('[FastAPI] 데이터 동기화 및 상관분석 시작...')
    try:
        data = await collector.refresh_all()
        state.news = data['news']
        state.conflicts = data['conflicts']
        state.matching = analyzer.analyze_conflicts_and_weapons(state.conflicts, state.news)
        state.last_synced_at = data['updatedAt']
        print(f'[FastAPI] 동기화 완료: 뉴스 {len(state.news)}건, 분쟁 {len(state.conflicts)}건, 매칭 {len(state.matching)}건')
    except Exception as e:
        print(f'[FastAPI] 동기화 오류: {e}')
    finally:
        state.is_syncing = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 기존 캐시 로드 또는 즉시 동기화
    cached_news = collector.get_cached_news()
    cached_conflicts = collector.get_cached_conflicts()

    if cached_news and cached_conflicts:
        print('[FastAPI] 기존 로컬 캐시를 초기 로드합니다.')
        state.news = cached_news
        state.conflicts = cached_conflicts
        state.matching = analyzer.analyze_conflicts_and_weapons(cached_conflicts, cached_news)
        from datetime import datetime
        state.last_synced_at = datetime.utcnow().isoformat() + 'Z'
    else:
        await sync_and_analyze()
    yield

app = FastAPI(
    title="Hanwha Defense Intelligence API",
    description="한화 방산 미래전략실 지정학 리스크 & 소요 무기 매칭 시스템 (FastAPI + React)",
    version="2.0.0",
    lifespan=lifespan
)

# CORS 설정 (Vite React 개발 서버 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReportRequest(BaseModel):
    provider: Optional[str] = 'openai'
    apiKey: Optional[str] = ''
    model: Optional[str] = 'gpt-4o'
    syncInterval: Optional[int] = 0

class TestLLMRequest(BaseModel):
    apiKey: str
    model: Optional[str] = 'gpt-4o'

# --- REST API 엔드포인트 ---

@app.get('/api/status')
async def get_status():
    high_count = len([m for m in state.matching if m.get('intensity') == 'High'])
    return {
        'status': 'online',
        'lastSyncedAt': state.last_synced_at,
        'newsCount': len(state.news),
        'conflictsCount': len(state.conflicts),
        'highRiskCount': high_count,
        'isSyncing': state.is_syncing
    }

@app.post('/api/sync')
async def trigger_sync():
    await sync_and_analyze()
    return {
        'success': True,
        'message': '데이터 동기화 및 매칭 분석이 완료되었습니다.',
        'lastSyncedAt': state.last_synced_at,
        'newsCount': len(state.news),
        'conflictsCount': len(state.conflicts)
    }

@app.get('/api/conflicts')
async def get_conflicts(region: Optional[str] = None, intensity: Optional[str] = None):
    results = state.conflicts
    if region and region != 'ALL':
        results = [c for c in results if region in c.get('regionKo', '') or region in c.get('regionEn', '')]
    if intensity and intensity != 'ALL':
        if intensity == 'Low':
            results = [c for c in results if c.get('intensity') in ['Low', 'Elevated']]
        else:
            results = [c for c in results if c.get('intensity') == intensity]
    return results

@app.get('/api/news')
async def get_news(tag: Optional[str] = None, search: Optional[str] = None):
    results = state.news
    if tag and tag != 'ALL':
        results = [n for n in results if tag in n.get('tags', [])]
    if search:
        q = search.lower()
        results = [n for n in results if q in n.get('title', '').lower() or q in n.get('description', '').lower()]
    return results

@app.get('/api/matching')
async def get_matching(slug: Optional[str] = None, region: Optional[str] = None, intensity: Optional[str] = None):
    results = state.matching
    if slug:
        results = [m for m in results if m.get('slug') == slug]
    if region and region != 'ALL':
        results = [m for m in results if region in m.get('regionKo', '')]
    if intensity and intensity != 'ALL':
        if intensity == 'Low':
            results = [m for m in results if m.get('intensity') in ['Low', 'Elevated']]
        else:
            results = [m for m in results if m.get('intensity') == intensity]
    return results

@app.get('/api/portfolio')
async def get_portfolio():
    return config.HANWHA_DEFENSE_PORTFOLIO

@app.post('/api/report')
async def create_report(req: ReportRequest):
    try:
        report = await analyzer.generate_strategic_report(state.matching, state.news, req.model_dump())
        return {'success': True, 'report': report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/test-llm')
async def test_llm_route(req: TestLLMRequest):
    result = await analyzer.test_llm_connection(req.apiKey, req.model)
    return result

# --- React Static Files Hosting ---
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

if os.path.exists(FRONTEND_DIST):
    print(f"[FastAPI] React 프론트엔드 서빙 활성화: {FRONTEND_DIST}")
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    print(f"[FastAPI] 경고: FRONTEND_DIST 폴더가 존재하지 않습니다: {FRONTEND_DIST}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
