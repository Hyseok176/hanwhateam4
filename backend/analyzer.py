# backend/analyzer.py
# 지정학적 리스크 지수(GRI) 산출, 소요 무기 매칭 및 AI 전략 보고서 생성기 (FastAPI)

import json
from datetime import datetime
import httpx
from . import config

def analyze_conflicts_and_weapons(conflicts: list[dict], news_list: list[dict]) -> list[dict]:
    matching_results = []

    for conflict in conflicts:
        matched_news = []
        slug = conflict.get('slug', '')
        title_ko = conflict.get('titleKo', '')
        title_en = conflict.get('titleEn', '')
        region_ko = conflict.get('regionKo', '')
        intensity = conflict.get('intensity', 'Medium')
        locations = conflict.get('locations', [])

        search_terms = [slug, title_ko, title_en]
        for loc in locations:
            if loc.get('name'):
                search_terms.append(loc['name'])

        # 지역별 특화 연관 검색어
        if 'ukraine' in slug or 'russia' in slug or region_ko == '동유럽':
            search_terms.extend(['우크라이나', '러시아', '동유럽', '나토', '푸틴', '젤렌스키', '쿠르스크'])
        elif any(k in slug for k in ['israel', 'gaza', 'iran', 'lebanon', 'yemen']) or region_ko == '중동':
            search_terms.extend(['이스라엘', '가자', '하마스', '이란', '헤즈볼라', '후티', '홍해', '중동', '중동전쟁'])
        elif any(k in slug for k in ['taiwan', 'china', 'south-china-sea']) or region_ko == '동아시아':
            search_terms.extend(['대만', '중국', '양안', '남중국해', '필리핀', '인도태평양'])
        elif any(k in slug for k in ['kashmir', 'india', 'pakistan']):
            search_terms.extend(['인도', '파키스탄', '카슈미르', '타타'])
        elif 'myanmar' in slug:
            search_terms.extend(['미얀마', '군부'])
        elif any(k in slug for k in ['sudan', 'sahel', 'somalia']):
            search_terms.extend(['아프리카', '수단', '사헬'])

        for news in news_list:
            full_text = (news.get('title', '') + ' ' + news.get('description', '')).lower()
            if any(term.lower() in full_text for term in search_terms if len(term) >= 2):
                matched_news.append(news)

        # 1. GRI (Geopolitical Risk Index) 스코어링 (0 ~ 99)
        base_score = 80 if intensity == 'High' else (60 if intensity == 'Medium' else 40)
        loc_bonus = min(len(locations) * 2, 10)
        news_bonus = min(len(matched_news) * 3, 10)
        gri_score = min(round(base_score + loc_bonus + news_bonus), 99)

        # 2. 소요 무기 매칭 (Weapons Requirement Matching)
        matched_weapons = []
        conflict_type_text = f"{conflict.get('type', '')} {title_en} {title_ko}".lower()

        for weapon in config.HANWHA_DEFENSE_PORTFOLIO:
            match_score = 0
            reasons = []

            # 지역 적합도
            if any(tr in region_ko for tr in weapon['targetRegions']):
                match_score += 35
                reasons.append(f"권역 전략 부합 ({region_ko})")

            # 고강도 전장 대응
            if intensity == 'High' and any(cat in weapon['category'] for cat in ['화력', '방공', '유도']):
                match_score += 30
                reasons.append("전면전 고강도 전장 대응 긴급 소요")

            # 지역 전장 특화 매칭
            if 'ukraine' in slug or 'russia' in slug or region_ko == '동유럽':
                if weapon['id'] in ['K9_THUNDER', 'CHEONMU_MLRS', 'REDBACK_IFV', 'TAIPERS_MISSILE', 'CHEONGUNG_II', 'AERO_TURBOFAN_ENGINE']:
                    match_score += 35
                    reasons.append("동유럽 전선 소모전 대비 NATO 호환 대량 화력/기동/정밀타격 수요 급증")

            if region_ko == '중동' or any(k in slug for k in ['israel', 'iran', 'yemen']):
                if weapon['id'] in ['CHEONGUNG_II', 'L_SAM', 'LASER_AIR_DEFENSE', 'BIHO_HYBRID', 'CHEONHO_AAGW', 'TAIPERS_MISSILE']:
                    match_score += 40
                    reasons.append("탄도탄·자폭드론 복합공습 대응 다층 방공망(M-SAM/레이저/천호) 필수")

            if 'taiwan' in slug or 'south-china-sea' in slug:
                if weapon['id'] in ['KSS_III_SUBMARINE', 'FFX_KDDX_FRIGATE', 'GHOST_COMMANDER_MUMT', 'NAVAL_SYSTEMS', 'SPACE_SAT_DEFENSE', 'KF21_AESA_RADAR', 'CHEONMU_MLRS']:
                    match_score += 45
                    reasons.append("도서 방어 해상봉쇄 돌파 및 수중/수상/공중 통합 해양전투체계(잠수함/구축함/SAR위성/AESA) 최우선")

            if region_ko in ['동남아시아', '아프리카', '남미'] or any(k in slug for k in ['myanmar', 'sahel', 'sudan']):
                if weapon['id'] in ['TIGON_WHEELED_IFV', 'CHEONHO_AAGW', 'FFX_KDDX_FRIGATE', 'TAIPERS_MISSILE']:
                    match_score += 35
                    reasons.append("열대 정글/평원 고기동 정규·비정규전 대응 차륜형 장갑차 및 연안경비함 소요")

            if intensity == 'High' and weapon['id'] in ['UGV_UNMANNED', 'GHOST_COMMANDER_MUMT']:
                match_score += 20
                reasons.append("격전지 병력 손실 최소화를 위한 육·해상 유무인 복합(MUM-T) 자율체계 소요")

            # 뉴스 키워드 연계
            for kw in weapon['keywords']:
                if any(kw in (n.get('title', '') + n.get('description', '')).lower() for n in matched_news):
                    match_score += 15
                    reasons.append(f"최신 방산 뉴스 키워드 [{kw}] 연계")
                    break

            if match_score >= 40:
                matched_weapons.append({
                    'weaponId': weapon['id'],
                    'nameKo': weapon['nameKo'],
                    'company': weapon['company'],
                    'category': weapon['category'],
                    'matchScore': min(match_score, 98),
                    'reasons': list(dict.fromkeys(reasons)),
                    'description': weapon['description'],
                    'threatScenarios': weapon['threatScenarios']
                })

        matched_weapons.sort(key=lambda x: x['matchScore'], reverse=True)

        top_weapon_names = ', '.join([w['nameKo'].split()[0] for w in matched_weapons[:2]])
        intensity_ko = '고위험 전면전 상태' if intensity == 'High' else ('지속적 국지 분쟁' if intensity == 'Medium' else '저강도 긴장')
        summary = f"[{region_ko}] {title_ko}은(는) 현재 {intensity_ko}로, 주요 소요 무기체계는 [{top_weapon_names or '복합 방호체계'}]입니다. 관련 최신 방산 뉴스는 총 {len(matched_news)}건 집계되었습니다."

        matching_results.append({
            'conflictId': conflict.get('id', ''),
            'slug': slug,
            'titleKo': title_ko,
            'titleEn': title_en,
            'regionKo': region_ko,
            'regionEn': conflict.get('regionEn', ''),
            'intensity': intensity,
            'griScore': gri_score,
            'status': conflict.get('status', 'Active'),
            'locations': locations,
            'mainTheaters': conflict.get('mainTheaters', ''),
            'matchedNewsCount': len(matched_news),
            'matchedNews': matched_news[:5],
            'matchedWeapons': matched_weapons,
            'topRecommendedWeapon': matched_weapons[0] if matched_weapons else None,
            'strategicSummary': summary
        })

    matching_results.sort(key=lambda x: x['griScore'], reverse=True)
    return matching_results

def clean_llm_json(raw_text: str) -> str:
    cleaned = raw_text.strip()
    if cleaned.startswith('```'):
        cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned)
        cleaned = re.sub(r'\s*```$', '', cleaned)
    return cleaned.strip()

async def generate_strategic_report(matching_data: list[dict], news_list: list[dict], custom_config: dict = None) -> dict:
    top_high_risks = [m for m in matching_data if m['intensity'] == 'High'][:5]
    custom_config = custom_config or {}
    external_error = None

    # 만약 OpenAI GPT 연동 설정이 있는 경우
    if custom_config.get('apiKey') and custom_config.get('provider') == 'openai':
        try:
            return await call_external_llm(custom_config, matching_data, top_high_risks)
        except Exception as e:
            external_error = str(e)
            print(f'[Analyzer] OpenAI GPT 연동 실패, 내장 추론 엔진으로 폴백: {e}')

    report_date = datetime.now().strftime('%Y년 %m월 %d일')
    high_count = len([m for m in matching_data if m['intensity'] == 'High'])

    return {
        'title': '한화 방산 미래전략실 글로벌 안보 리스크 & 소요 무기 매칭 분석 보고서',
        'generatedAt': datetime.utcnow().isoformat() + 'Z',
        'displayDate': report_date,
        'executiveSummary': [
            f"전 세계 29개 주요 분쟁 지역 중 고위험(High Intensity) 분쟁은 총 {high_count}개 권역으로 집계되었습니다.",
            "우크라이나-러시아 및 중동(이스라엘·이란·홍해) 전선의 장기화로 인해 NATO 및 중동 동맹국을 중심으로 'K9 자주포', '천무 MLRS', '천궁-II 방공망'의 즉시 조달 수요가 최고조를 유지하고 있습니다.",
            "인도-태평양 및 대만 해협/남중국해 긴장 고조에 따라 도서 방어용 CTM-290 전술유도탄, 소형 SAR 정찰위성 및 해양 무인체계(UGV/USV) 수요가 신규 전략 축으로 부상하고 있습니다.",
            "미국 방산 생태계의 생산 능력 한계(안두릴·타타 사례)로 인해 동맹국 기반 공동 생산(Co-production) 및 MRO 협력 모델이 한화 방산의 글로벌 시장 침투 핵심 레버리지로 작동할 전망입니다."
        ],
        'keyTheaters': [
            {
                'theater': t['titleKo'],
                'region': t['regionKo'],
                'griScore': t['griScore'],
                'intensity': t['intensity'],
                'threatProfile': t['mainTheaters'],
                'matchedHanwhaSolution': [w['nameKo'] for w in t['matchedWeapons'][:3]],
                'strategicImplication': f"전장 환경 요인에 따라 {t['matchedWeapons'][0]['nameKo'] if t['matchedWeapons'] else '한화 핵심 화력체계'} 중심의 패키지 수출 및 현지 조립/유지보수(MRO) 파트너십 구축이 유망함."
            } for t in top_high_risks
        ],
        'strategicRecommendations': [
            {
                'pillar': '화력/기동 (Land Systems)',
                'action': '동유럽·인도태평양 중심 K9/천무 탄약 및 유도탄 공급망 현지화와 K10/레드백 패키지 딜 가속화'
            },
            {
                'pillar': '다층 복합 방공 (Air & Missile Defense)',
                'action': '중동(UAE·사우디·이라크) 천궁-II 실전 배치 레퍼런스 기반 L-SAM 및 안티드론 레이저 복합방공 체계 통합 제안'
            },
            {
                'pillar': '해양 및 감시정찰 (Naval & Space C4I)',
                'action': '동남아·중남미 연안 경비 및 대만해협 대응을 위한 초소형 SAR 위성 데이터 링크 + 차세대 함정 전투체계 패키지화'
            },
            {
                'pillar': '글로벌 공급망 및 공동생산 (Co-Production)',
                'action': '미국·인도·호주 등 오커스(AUKUS)/쿼드(QUAD) 권역 내 현지 방산 파트너십을 통한 우회 조달 시장 선점'
            }
        ],
        'telemetry': {
            'provider': '내장 전략 엔진 (Built-in Heuristic AI)',
            'model': 'Hanwha Strategic Engine v2.0',
            'isExternal': False,
            'isFallback': external_error is not None,
            'externalError': external_error,
            'promptTokens': 0,
            'outputTokens': 0,
            'totalTokens': 0
        }
    }

async def call_external_llm(custom_config: dict, matching_data: list[dict], top_risks: list[dict]) -> dict:
    import time
    start_time = time.time()

    prompt = f"""당신은 한화그룹 방산 부문(한화에어로스페이스, 한화시스템, 한화오션) 미래전략실의 수석 안보/방산 전략 컨설턴트입니다.
제공된 전 세계 29개 분쟁 데이터와 최신 데일리방산 뉴스 분석 결과를 바탕으로, 경영진 보고용 최고급 전략 보고서를 JSON 포맷으로 작성하십시오.

[분석 데이터 요약]
- 고위험 분쟁: {'; '.join([f"{r['titleKo']} (GRI: {r['griScore']}, 추천무기: {', '.join([w['nameKo'] for w in r['matchedWeapons'][:2]])})" for r in top_risks])}

반드시 마크다운 백틱(```json) 없이 유효한 순수 JSON 포맷으로만 응답하십시오:
{{
  "title": "보고서 제목",
  "executiveSummary": ["핵심요약 1", "핵심요약 2", "핵심요약 3"],
  "keyTheaters": [{{"theater": "분쟁명", "region": "지역", "griScore": 90, "intensity": "High", "matchedHanwhaSolution": ["무기1", "무기2"], "strategicImplication": "전략적 시사점"}}],
  "strategicRecommendations": [{{"pillar": "분야", "action": "실행전략"}}]
}}"""

    api_key = (custom_config.get('apiKey') or '').strip()
    model_pref = (custom_config.get('model') or '').strip()

    if not api_key:
        raise ValueError('OpenAI API 키가 입력되지 않았습니다.')

    # 404 모델 에러 방지: 사용자 지정 모델 우선, 없거나 404면 대체 모델 순차 시도
    models_to_try = [model_pref] if model_pref else []
    for m in ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = ''
    async with httpx.AsyncClient(timeout=45.0) as client:
        for model in models_to_try:
            try:
                resp = await client.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': model,
                        'messages': [{'role': 'user', 'content': prompt}],
                        'response_format': {'type': 'json_object'}
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    usage = data.get('usage', {})
                    content_str = data['choices'][0]['message']['content']
                    cleaned = clean_llm_json(content_str)
                    report = json.loads(cleaned)
                    report['telemetry'] = {
                        'provider': 'OpenAI GPT',
                        'model': model,
                        'promptTokens': usage.get('prompt_tokens', 0),
                        'outputTokens': usage.get('completion_tokens', 0),
                        'totalTokens': usage.get('total_tokens', 0),
                        'latencyMs': round((time.time() - start_time) * 1000),
                        'isExternal': True
                    }
                    return report
                else:
                    last_error = f"HTTP {resp.status_code} ({model}): {resp.text}"
                    print(f"[OpenAI Call] 모델 {model} 실패: {last_error}")
            except Exception as ex:
                last_error = str(ex)

    raise ValueError(f"OpenAI GPT 호출 실패: {last_error}")

async def test_llm_connection(api_key: str, model_pref: str = None) -> dict:
    api_key = (api_key or '').strip()
    if not api_key:
        return {'success': False, 'message': 'API 키가 입력되지 않았습니다.'}

    models_to_try = [model_pref] if model_pref else []
    for m in ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo']:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = ''
    async with httpx.AsyncClient(timeout=15.0) as client:
        for model in models_to_try:
            try:
                resp = await client.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': model,
                        'messages': [{'role': 'user', 'content': 'Say hello in Korean in 3 words'}],
                        'max_tokens': 15
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    usage = data.get('usage', {})
                    return {
                        'success': True,
                        'message': f'OpenAI GPT API 연결 성공! (활성 모델: {model})',
                        'model': model,
                        'promptTokens': usage.get('prompt_tokens', 0),
                        'outputTokens': usage.get('completion_tokens', 0),
                        'totalTokens': usage.get('total_tokens', 0)
                    }
                else:
                    last_error = f"HTTP {resp.status_code} ({model}): {resp.text}"
            except Exception as ex:
                last_error = str(ex)

    return {'success': False, 'message': f'OpenAI API 연결 실패: {last_error}'}
