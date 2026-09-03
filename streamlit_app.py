# streamlit_app.py
# 한화 방산 부문 미래전략실 - 글로벌 안보 정세 및 무기체계 인텔리전스 플랫폼 (Streamlit Cloud 배포용)

import os
import sys
import asyncio
import streamlit as st
import folium
from streamlit_folium import st_folium

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from backend import config, collector, analyzer

# Page Config
st.set_page_config(
    page_title="한화 방산 미래전략실 인텔리전스",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Tactical Styling
st.markdown("""
<style>
    .main {
        background-color: #070B14;
        color: #F0F4F8;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        background-color: #0E1626;
        border-radius: 6px;
        padding: 8px 16px;
        color: #9BA9BD;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .stTabs [aria-selected="true"] {
        background-color: rgba(255, 107, 0, 0.15) !important;
        border-color: #FF6B00 !important;
        color: #FF6B00 !important;
        font-weight: 700;
    }
    .metric-card {
        background: #0E1626;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 12px 16px;
        text-align: center;
    }
    .weapon-card {
        background: rgba(18, 28, 48, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
        height: 100%;
    }
    .news-card {
        background: #0E1626;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 10px;
    }
    .badge-orange {
        background: rgba(255, 107, 0, 0.18);
        color: #FF6B00;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .badge-cyan {
        background: rgba(0, 240, 255, 0.15);
        color: #00F0FF;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# Data Initialization
@st.cache_data(ttl=600)
def load_initial_data():
    news = collector.get_cached_news()
    conflicts = collector.get_cached_conflicts()
    if not news or not conflicts:
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            res = loop.run_until_complete(collector.refresh_all())
            news = res['news']
            conflicts = res['conflicts']
        except Exception as e:
            pass
    matching = analyzer.analyze_conflicts_and_weapons(conflicts, news)
    return news, conflicts, matching

news_data, conflicts_data, matching_data = load_initial_data()
portfolio_data = config.HANWHA_DEFENSE_PORTFOLIO

# Sidebar
with st.sidebar:
    st.image("https://www.hanwha.com/resources/images/common/img_logo.png", width=160)
    st.title("미래전략실 AI 통제국")
    st.caption("한화에어로스페이스 · 한화시스템 · 한화오션")
    
    st.divider()
    
    st.subheader("⚙️ AI 전략 엔진 설정")
    ai_provider = st.selectbox("분석 엔진 선택", ["내장 전략 엔진 (무료/로컬)", "OpenAI GPT API"])
    
    openai_key = ""
    model_choice = "gpt-4o-mini"
    if ai_provider == "OpenAI GPT API":
        openai_key = st.text_input("OpenAI API Key", type="password", placeholder="sk-proj-...")
        model_choice = st.selectbox("GPT 모델", ["gpt-4o-mini (추천)", "gpt-4o", "gpt-3.5-turbo"])
        model_choice = model_choice.split()[0]
        
        if st.button("🔌 API 연결 테스트"):
            if not openai_key:
                st.error("API 키를 입력하세요.")
            else:
                with st.spinner("연결 확인 중..."):
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    res = loop.run_until_complete(analyzer.test_llm_connection(openai_key, model_choice))
                    if res.get('success'):
                        st.success(f"✅ {res['message']} (총 {res.get('totalTokens', 0)} 토큰)")
                    else:
                        st.error(f"❌ {res.get('message')}")
                        
    st.divider()
    st.subheader("📊 시스템 상태")
    st.write(f"• 활성 분쟁지: **{len(conflicts_data)}개국**")
    st.write(f"• 데일리방산 뉴스: **{len(news_data)}건**")
    st.write(f"• 한화 무기체계: **{len(portfolio_data)}종**")
    
    if st.button("🔄 최신 데이터 실시간 동기화"):
        with st.spinner("뉴스 및 분쟁 데이터를 갱신하고 있습니다..."):
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(collector.refresh_all())
            st.cache_data.clear()
            st.rerun()

# Top Header
st.title("🛡️ 한화 방산 글로벌 안보 정세 및 무기체계 인텔리전스")
st.markdown("전 세계 29개 분쟁 지역의 지정학적 리스크 지수(GRI)와 데일리방산 뉴스를 융합하여, 한화 3사의 최적 무기체계를 정밀 매칭하고 AI 안보 전략을 제시합니다.")

# Top Metrics Bar
col1, col2, col3, col4 = st.columns(4)
high_risk_count = sum(1 for c in conflicts_data if c.get('intensity') == 'High')
col1.metric("고위험(High) 격전지", f"{high_risk_count}개국", delta="상시 모니터링")
col2.metric("글로벌 감시 분쟁", f"{len(conflicts_data)}개 지역", delta="전 대륙 커버")
col3.metric("실시간 방산 뉴스", f"{len(news_data)}건 수집", delta="데일리방산 RSS")
col4.metric("한화 무기체계", f"{len(portfolio_data)}종", delta="육·해·공·우주")

st.write("")

# Tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "🗺️ 리스크 맵 & 분쟁지 현황",
    "🛡️ 한화 18대 무기체계 스펙트럼",
    "📰 데일리방산 실시간 뉴스",
    "🎯 분쟁-무기 매칭 매트릭스",
    "📊 AI 안보 전략 보고서"
])

# ----------------- TAB 1: RISK MAP -----------------
with tab1:
    st.subheader("🌐 글로벌 활성 분쟁 및 지정학적 리스크 지수 (GRI)")
    
    filter_intensity = st.radio("위험도 필터", ["전체", "High (고위험)", "Medium (중위험)", "Low (저위험)"], horizontal=True)
    
    displayed_conflicts = conflicts_data
    if "High" in filter_intensity:
        displayed_conflicts = [c for c in conflicts_data if c.get('intensity') == 'High']
    elif "Medium" in filter_intensity:
        displayed_conflicts = [c for c in conflicts_data if c.get('intensity') == 'Medium']
    elif "Low" in filter_intensity:
        displayed_conflicts = [c for c in conflicts_data if c.get('intensity') == 'Low']

    # Interactive Map
    m = folium.Map(location=[25.0, 30.0], zoom_start=2, tiles="CartoDB dark_matter")
    for c in displayed_conflicts:
        locs = c.get('locations', [])
        lat = locs[0].get('latitude', 20.0) if locs else 20.0
        lng = locs[0].get('longitude', 20.0) if locs else 20.0
        intensity = c.get('intensity', 'Medium')
        color = '#FF3B30' if intensity == 'High' else ('#FF9500' if intensity == 'Medium' else '#00F0FF')
        radius = 8 if intensity == 'High' else 5
        
        folium.CircleMarker(
            location=[lat, lng],
            radius=radius,
            color=color,
            fill=True,
            fill_color=color,
            fill_opacity=0.7,
            popup=f"<b>{c.get('titleKo')}</b><br>위험도: {intensity}<br>GRI: {c.get('griScore', 60)}"
        ).add_to(m)
        
    st_folium(m, width=None, height=450)
    
    st.markdown("#### 📋 감시 분쟁지 상세 현황")
    for c in displayed_conflicts:
        match_item = next((m for m in matching_data if m.get('slug') == c.get('slug')), None)
        top_w = match_item['matchedWeapons'][:2] if match_item and match_item.get('matchedWeapons') else []
        top_w_str = ', '.join([w['nameKo'] for w in top_w]) if top_w else '복합 솔루션'
        
        with st.expander(f"🔴 [{c.get('regionKo', '')}] {c.get('titleKo')} - GRI 지수: {c.get('griScore', 60)} ({c.get('intensity')})"):
            st.write(f"• **주요 교전지/전장**: {c.get('mainTheaters') or '해당 지역 일대'}")
            st.write(f"• **주요 한화 소요 무기**: **{top_w_str}**")
            if match_item and match_item.get('matchedNews'):
                st.write(f"• **최근 연관 뉴스 ({len(match_item['matchedNews'])}건)**:")
                for n in match_item['matchedNews'][:3]:
                    st.markdown(f"  - [{n['title']}]({n['link']}) ({n.get('pubDate', '')})")

# ----------------- TAB 2: PORTFOLIO SPECTRUM -----------------
with tab2:
    st.subheader("🛡️ 한화 방산 육·해·공·우주 18대 핵심 무기체계 포트폴리오")
    st.caption("한화에어로스페이스 · 한화시스템 · 한화오션 3사의 글로벌 수출 주력 체계 및 전장 소요 대응 라인업")
    
    c1, c2 = st.columns([3, 1])
    with c1:
        cat_filter = st.radio(
            "카테고리 분류",
            ["전체", "화력/기동", "정밀유도", "방공/요격", "해양/함정", "항공/센서", "우주/무인"],
            horizontal=True
        )
    with c2:
        search_kw = st.text_input("🔍 무기체계 검색", placeholder="이름, 제조사, 키워드...")
        
    filtered_p = portfolio_data
    if cat_filter != "전체":
        filtered_p = [p for p in filtered_p if cat_filter.split('/')[0] in p.get('category', '') or cat_filter.split('/')[-1] in p.get('category', '')]
    if search_kw:
        q = search_kw.lower()
        filtered_p = [p for p in filtered_p if q in p['nameKo'].lower() or q in p['company'].lower() or q in p['description'].lower() or any(q in k.lower() for k in p.get('keywords', []))]

    st.write(f"총 **{len(filtered_p)}**개 체계 표시 중")
    
    # Render Grid
    cols = st.columns(3)
    for idx, p in enumerate(filtered_p):
        col = cols[idx % 3]
        with col:
            st.markdown(f"""
            <div class="weapon-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="badge-orange">{p['category']}</span>
                    <span style="font-size:0.75rem; color:#00F0FF; font-weight:600;">{p['company']}</span>
                </div>
                <h4 style="margin:8px 0 4px 0; color:#F0F4F8;">{p['nameKo']}</h4>
                <div style="font-size:0.75rem; color:#00F0FF; font-family:monospace; margin-bottom:8px;">
                    {p.get('caliber') or p.get('range') or p.get('specs') or ''}
                </div>
                <p style="font-size:0.82rem; color:#9BA9BD; line-height:1.4;">{p['description']}</p>
                <div style="font-size:0.72rem; color:#64748B; font-weight:700; margin-top:8px;">소요 대응 전장 시나리오:</div>
                <div style="font-size:0.75rem; color:#CBD5E1;">{', '.join(p['threatScenarios'])}</div>
                <div style="margin-top:8px; font-size:0.72rem; color:#FF9500;">
                    🎯 타깃 권역: {', '.join(p.get('targetRegions', []))}
                </div>
            </div>
            """, unsafe_allow_html=True)

# ----------------- TAB 3: NEWS FEED -----------------
with tab3:
    st.subheader("📰 데일리방산 실시간 뉴스 인텔리전스 피드")
    st.caption("데일리방산 공식 RSS 피드 수집 및 무기체계/분쟁 태그 자동 연계 분석")
    
    news_search = st.text_input("기사 검색", placeholder="기사 제목, 내용, 태그 검색...")
    
    displayed_news = news_data
    if news_search:
        q = news_search.lower()
        displayed_news = [n for n in displayed_news if q in n['title'].lower() or q in n['description'].lower() or any(q in t.lower() for t in n.get('tags', []))]

    st.write(f"총 **{len(displayed_news)}**건 기사")
    for item in displayed_news:
        with st.container():
            st.markdown(f"""
            <div class="news-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <a href="{item['link']}" target="_blank" style="color:#F0F4F8; font-size:1rem; font-weight:700; text-decoration:none;">
                        {item['title']} ↗
                    </a>
                    <div style="display:flex; gap:4px;">
                        {' '.join([f'<span class="badge-cyan">{t}</span>' for t in item.get('tags', [])])}
                    </div>
                </div>
                <p style="font-size:0.83rem; color:#9BA9BD; margin:6px 0;">{item['description']}</p>
                <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:#64748B;">
                    <span>기자: {item.get('author', '데일리방산')}</span>
                    <span>발행: {item.get('pubDate', '')}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

# ----------------- TAB 4: MATCHING MATRIX -----------------
with tab4:
    st.subheader("🎯 분쟁-한화 무기체계 소요 매칭 매트릭스")
    st.caption("분쟁 격화 수준(Intensity), 지형적 특성, 뉴스 키워드 및 작전 시나리오를 종합 평가한 실시간 매칭표")
    
    for m in matching_data:
        top_weapons = m.get('matchedWeapons', [])
        top_rec_name = (m.get('topRecommendedWeapon') or {}).get('nameKo', '종합 방호 솔루션')
        with st.expander(f"📍 [{m.get('regionKo')}] {m.get('titleKo')} - 1순위 추천: {top_rec_name}"):
            st.write(f"• **전략 요약**: {m.get('strategicSummary')}")
            st.write("• **추천 무기체계 순위 및 매칭 사유**:")
            for w in top_weapons[:4]:
                st.markdown(f"  - **{w['nameKo']}** (적합도 점수: `{w['matchScore']}점` / `{w['company']}`)")
                for r in w.get('reasons', []):
                    st.caption(f"    ↳ {r}")

# ----------------- TAB 5: AI STRATEGIC REPORT -----------------
with tab5:
    st.subheader("📊 한화 방산 부문 미래전략실 경영진 AI 전략 보고서")
    st.caption("지정학적 리스크 지수와 실시간 뉴스 인텔리전스를 종합하여 실행 전략을 브리핑합니다.")
    
    if st.button("🚀 최신 AI 안보 전략 보고서 생성하기", type="primary"):
        with st.spinner("AI가 29개 분쟁과 50건의 뉴스를 분석하여 전략 보고서를 작성하고 있습니다..."):
            custom_cfg = {
                'provider': 'openai' if ai_provider == "OpenAI GPT API" else 'builtin',
                'apiKey': openai_key,
                'model': model_choice
            }
            top_high = [c for c in matching_data if c.get('intensity') == 'High']
            
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            report = loop.run_until_complete(analyzer.generate_ai_strategy_report(matching_data, top_high, custom_cfg))
            
            st.session_state['report'] = report
            
    if 'report' in st.session_state:
        rep = st.session_state['report']
        
        # Telemetry
        tel = rep.get('telemetry', {})
        st.markdown(f"""
        <div style="background:rgba(255,107,0,0.08); border:1px solid rgba(255,107,0,0.25); border-radius:6px; padding:10px 14px; margin-bottom:16px; font-size:0.8rem;">
            분석 엔진: <b>{tel.get('provider')}</b> | 모델: <b>{tel.get('model')}</b> | 
            소모 토큰: <b>총 {tel.get('totalTokens', 0):,} 토큰</b> (입력: {tel.get('promptTokens', 0):,} / 출력: {tel.get('outputTokens', 0):,})
        </div>
        """, unsafe_allow_html=True)
        
        st.header(rep.get('title', '한화 방산 글로벌 안보 전략 보고서'))
        
        st.subheader("1. 경영진 핵심 요약 (Executive Summary)")
        for item in rep.get('executiveSummary', []):
            st.markdown(f"- {item}")
            
        st.subheader("2. 중점 감시 고위험 분쟁지 & 무기 매칭")
        for theater in rep.get('keyTheaters', []):
            st.markdown(f"**[{theater.get('region', '')}] {theater.get('theater', '')}** (GRI: {theater.get('griScore', 80)})")
            st.caption(f"• 제안 체계: {', '.join(theater.get('matchedHanwhaSolution', []))}")
            st.caption(f"• 전략적 시사점: {theater.get('strategicImplication', '')}")
            
        st.subheader("3. 4대 핵심 전략 추진 과제")
        for rec in rep.get('strategicRecommendations', []):
            st.markdown(f"**📌 {rec.get('pillar')}**: {rec.get('action')}")
            
        # Download button
        report_text = f"# {rep.get('title')}\n\n## 1. Executive Summary\n" + "\n".join([f"- {s}" for s in rep.get('executiveSummary', [])])
        st.download_button("📥 보고서 텍스트 다운로드", report_text, file_name="Hanwha_Defense_AI_Strategy_Report.md")
