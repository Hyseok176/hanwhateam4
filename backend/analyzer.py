# backend/analyzer.py
# 지정학적 리스크 지수(GRI) 산출, 소요 무기 매칭 및 AI 전략 보고서 생성기 (FastAPI)

import os
import json
import re
import time
from datetime import datetime
import httpx
from . import config

def evaluate_environmental_fit(terrain_info: dict, weapon: dict) -> dict:
    """전장 지형·기후(기온/습도/환경위협)와 무기체계 군용 규격(MIL-STD-810H)을 정밀 비교 평가하여 환경 적합도 및 야전 운용 주의사항을 도출"""
    if not terrain_info or not weapon.get('operatingSpecs'):
        return {
            'overallStatus': 'Optimal',
            'tempStatus': 'Optimal',
            'tempDesc': '규격 충족',
            'humidityStatus': 'Optimal',
            'humidityDesc': '규격 충족',
            'terrainScore': 85,
            'fieldAdvisories': ['표준 전장 환경 수칙 준수 하에 정상 작전 전개 가능.'],
            'fieldConstraints': weapon.get('operatingSpecs', {}).get('fieldConstraints', ''),
            'countermeasurePackage': weapon.get('operatingSpecs', {}).get('countermeasurePackage', '기본 야전 정비 키트')
        }

    specs = weapon['operatingSpecs']
    local_temp = terrain_info.get('tempRange', {'min': -10, 'max': 40})
    local_hum = terrain_info.get('humidity', {'avg': 60, 'max': 85})
    terrain_type = terrain_info.get('terrainType', '')
    hazards = terrain_info.get('specialHazards', [])
    weapon_fit_map = specs.get('terrainFit', {})

    # 1. 운용 기온 평가
    w_t_min = specs.get('tempMin', -40)
    w_t_max = specs.get('tempMax', 50)
    loc_t_min = local_temp.get('min', -10)
    loc_t_max = local_temp.get('max', 40)

    if loc_t_min < w_t_min or loc_t_max > w_t_max:
        temp_status = 'Warning'
        temp_text = f"한계치 초과 위험 (현지 {loc_t_min}°C ~ {loc_t_max}°C / 무기 보증 {w_t_min}°C ~ {w_t_max}°C)"
    elif (loc_t_min - w_t_min <= 8) or (w_t_max - loc_t_max <= 5):
        temp_status = 'Caution'
        temp_text = f"주의 요망 (현지 {loc_t_min}°C ~ {loc_t_max}°C / 무기 보증 {w_t_min}°C ~ {w_t_max}°C)"
    else:
        temp_status = 'Optimal'
        temp_text = f"완전 적합 (현지 {loc_t_min}°C ~ {loc_t_max}°C / 무기 보증 {w_t_min}°C ~ {w_t_max}°C)"

    # 2. 습도 및 강수 평가
    w_hum_max = specs.get('maxHumidity', 95)
    loc_hum_max = local_hum.get('max', 85)
    loc_hum_avg = local_hum.get('avg', 60)

    if loc_hum_max > w_hum_max:
        hum_status = 'Warning'
        hum_text = f"초극고습 위험 (현지 최대 {loc_hum_max}% / 무기 한계 {w_hum_max}%)"
    elif loc_hum_max >= 90 or (w_hum_max - loc_hum_max <= 5):
        hum_status = 'Caution'
        hum_text = f"주의 요망 (현지 최대 {loc_hum_max}% 극고습 / 무기 한계 {w_hum_max}%)"
    else:
        hum_status = 'Optimal'
        hum_text = f"양호 (현지 평균 {loc_hum_avg}%~최대 {loc_hum_max}% / 무기 한계 {w_hum_max}%)"

    # 3. 지형 적합도 점수 산출
    terrain_score = 80
    for key, score in weapon_fit_map.items():
        if key in terrain_type:
            terrain_score = max(terrain_score, score)

    # 4. 현지 지형/기후 맞춤 야전 운용 지침(Advisory) 산출
    advisories = []
    
    # (A) 정글/극고습
    if any(k in terrain_type for k in ['정글', '밀림', '열대']) or loc_hum_max >= 90:
        if weapon['id'] in ['K9_THUNDER', 'CHEONMU_MLRS', 'REDBACK_IFV', 'CHEONGUNG_II', 'CHEONHO_AAGW', 'BIHO_HYBRID']:
            advisories.append(f"열대 정글의 초고온다습(상대습도 {loc_hum_max}%) 환경으로 전자광학(EO/IR) 조준경 렌즈 결로 및 배선 부식 위험이 큽니다. 질소 충전 밀폐 광학계 적용 및 방청 그리스 도포 주기를 50% 단축하십시오.")
        if weapon['id'] == 'TAIPERS_MISSILE':
            advisories.append("밀림 수목 캐노피 및 덩굴로 인해 유선 광섬유 케이블이 나뭇가지에 걸려 단선될 위험이 높으므로, 발사 전 '무선 RF 데이터링크 모드'로 사전 전환해야 합니다.")
        if weapon['id'] == 'UGV_UNMANNED':
            advisories.append("울창한 덤불 및 하층 식생에 자율주행 라이다(LiDAR) 센서 차폐가 발생할 수 있어, 영상 딥러닝 기반 자율주행 모드를 병행 운용해야 합니다.")

    # (B) 사막/극고온/분진
    if any(k in terrain_type for k in ['사막', '사헬']) or loc_t_max >= 44:
        if any(w_id in weapon['id'] for w_id in ['K9', 'REDBACK', 'CHEONHO', 'TIGON', 'CHEONGUNG', 'L_SAM']):
            advisories.append(f"주간 최고 {loc_t_max}°C의 살인적 폭염과 미세 규산염 모래 분진 침투로 인해 엔진 흡기 계통 마모 위험이 큽니다. '2중 사이클론 에어클리너(Air Pre-cleaner)' 및 사막형 고출력 냉각팩 장착이 필수적입니다.")
        if 'LASER' in weapon['id']:
            advisories.append("모래폭풍(Haboob/Shamal) 발생 시 공기 중 부유 입자로 인해 레이저 빔 산란이 발생해 사거리가 40% 이상 저하될 수 있으므로, 광학창 에어커튼을 상시 분사하십시오.")

    # (C) 흑토/라스푸티차(연약지반)
    if any('라스푸티차' in h for h in hazards) or '흑토' in terrain_type:
        if weapon['id'] in ['K9_THUNDER', 'CHEONMU_MLRS']:
            advisories.append("봄/가을 해빙기 흑토 라스푸티차(1m 심층 진흙 수렁) 통과 시 차체 침하를 방지하기 위해 '광폭 궤도 패드(Wide Track Pads)' 장착 및 K10/구난전차(ARV)와의 연계 전개가 요구됩니다.")
        if weapon['id'] in ['CHEONHO_AAGW', 'TIGON_WHEELED_IFV']:
            advisories.append("차륜형 장갑차는 심층 진흙 수렁에서 슬립 위험이 있으므로, 타이어 공기압 자동조절기(CTIS)를 'Mud 모드'로 설정하고 사전 정찰된 포장 도로망 위주로 기동하십시오.")

    # (D) 고산/극저온/설원
    if loc_t_min <= -20 or any(k in terrain_type for k in ['고산', '빙하', '설산']):
        advisories.append(f"영하 {abs(loc_t_min)}°C 혹한 및 해발 3,000m+ 희박 산소로 인해 디젤 엔진 시동 지연 및 배터리 방전 위험이 있습니다. 보조동력장치(APU) 혹한기 예열 킷 가동 및 저온 작동유를 사용하십시오.")

    # (E) 해양/해협/초고염분
    if any(k in terrain_type for k in ['해양', '해협', '군도', '연안']):
        if weapon['id'] in ['FFX_KDDX_FRIGATE', 'NAVAL_SYSTEMS', 'CHEONGUNG_II', 'KSS_III_SUBMARINE', 'GHOST_COMMANDER_MUMT']:
            advisories.append("해풍에 동반된 초고염분 해무로 인한 센서 마스트 및 레이돔 부식 방지를 위해 '통합 담수 세척 스프링클러' 일일 세척 주기 엄수가 필수적입니다.")

    if not advisories:
        advisories.append(f"현지 전장 환경({terrain_type})에 본 무기체계의 군용 운용 규격이 안정적으로 부합하며, 통상적인 야전 예방 정비를 통해 최상의 가동률을 유지할 수 있습니다.")

    overall = 'Warning' if (temp_status == 'Warning' or hum_status == 'Warning') else ('Caution' if (temp_status == 'Caution' or hum_status == 'Caution') else 'Optimal')

    return {
        'overallStatus': overall,
        'tempStatus': temp_status,
        'tempDesc': temp_text,
        'humidityStatus': hum_status,
        'humidityDesc': hum_text,
        'terrainScore': terrain_score,
        'fieldAdvisories': advisories,
        'fieldConstraints': specs.get('fieldConstraints', ''),
        'countermeasurePackage': specs.get('countermeasurePackage', '')
    }

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

        # 분쟁지 전장 지형 및 기후 프로파일 매핑
        terrain_info = getattr(config, 'CONFLICT_TERRAIN_CLIMATE', {}).get(slug)
        if not terrain_info:
            terrain_info = {
                'country': title_ko,
                'countryEn': title_en,
                'terrainType': '복합 지형 및 구릉',
                'terrainDescription': f'{region_ko} 권역 내 전장 지형과 기상 조건이 상존하는 분쟁지.',
                'tempRange': {'min': -10, 'max': 40, 'desc': '-10°C ~ 40°C'},
                'humidity': {'avg': 60, 'max': 85, 'desc': '평균 60%'},
                'specialHazards': ['기동 제약', '통신 및 시계 장애'],
                'terrainPhoto': {
                    'url': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85',
                    'caption': f'{title_ko} 작전 권역 전장 지형',
                    'location': region_ko,
                    'tags': ['작전 지역', '복합 지형']
                }
            }

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

        # 2. 소요 무기 매칭 및 환경 적합성 평가
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
                env_assessment = evaluate_environmental_fit(terrain_info, weapon)
                matched_weapons.append({
                    'weaponId': weapon['id'],
                    'nameKo': weapon['nameKo'],
                    'company': weapon['company'],
                    'category': weapon['category'],
                    'matchScore': min(match_score, 98),
                    'reasons': list(dict.fromkeys(reasons)),
                    'description': weapon['description'],
                    'threatScenarios': weapon['threatScenarios'],
                    'operatingSpecs': weapon.get('operatingSpecs', {}),
                    'environmentalAssessment': env_assessment
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
            'terrainInfo': terrain_info,
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

    active_model = normalize_model_name(custom_config.get('model') or 'gpt-4o')
    api_key = (custom_config.get('apiKey') or os.environ.get('OPENAI_API_KEY') or '').strip()

    # OpenAI GPT 연동 시도 (API 키가 제공된 경우)
    if api_key:
        cfg = dict(custom_config)
        cfg['apiKey'] = api_key
        cfg['model'] = active_model
        try:
            return await call_external_llm(cfg, matching_data, top_high_risks)
        except Exception as e:
            external_error = str(e)
            print(f'[Analyzer] OpenAI GPT({active_model}) 연동 실패: {e}')

    report_date = datetime.now().strftime('%Y년 %m월 %d일')
    high_count = len([m for m in matching_data if m['intensity'] == 'High'])

    key_theaters_data = []
    for t in top_high_risks:
        top_w = t['matchedWeapons'][0] if t.get('matchedWeapons') else None
        specs = top_w.get('operatingSpecs', {}) if top_w else {}
        env = top_w.get('environmentalAssessment', {}) if top_w else {}
        t_info = t.get('terrainInfo') or {}
        w_name = top_w['nameKo'] if top_w else '한화 무기체계'

        loc_t = t_info.get('tempRange', {})
        loc_h = t_info.get('humidity', {})
        t_desc = loc_t.get('desc', '온화')
        h_desc = loc_h.get('desc', '보통')
        
        env_fit_str = (
            f"현지 기후 환경(기온: {t_desc} [{loc_t.get('min', -10)}°C~{loc_t.get('max', 40)}°C] / "
            f"습도: {h_desc} [평균 {loc_h.get('avg', 60)}%~최대 {loc_h.get('max', 85)}%]) 대비, "
            f"{w_name}의 군용 운용 규격({specs.get('standard', 'MIL-STD-810H')}, 보증기온 {specs.get('tempRange', '-40°C~+50°C')}, "
            f"한계습도 {specs.get('maxHumidity', 95)}%)은 {env.get('tempDesc', '규격 완전 적합')} 및 {env.get('humidityDesc', '습도 한계 충족')} 상태로 평가되었습니다."
        )

        terrain_type = t_info.get('terrainType', '전장 복합 지형')
        doctrine_str = (
            f"[{terrain_type}] 전장 환경에 맞춰 {w_name}은(는) "
            f"현지 개활지 및 엄폐 지형을 활용한 고기동 분산 전개와 급속 사격 후 신속 진지 이탈(Shoot-and-Scoot) 교리를 철저히 이행합니다. "
            f"또한 전장 네트워크(C4I) 및 초소형 SAR 위성·드론 정찰 자산과 연동하여 적의 비대칭 공격을 사전 무력화하는 정밀 타격 운용 방식을 채택합니다."
        )

        advisories = env.get('fieldAdvisories', [])
        adv_text = " ".join(advisories[:2]) if advisories else specs.get('fieldConstraints', '표준 야전 군용 정비 지침을 철저히 준수함.')
        pkg = env.get('countermeasurePackage', specs.get('countermeasurePackage', '기본 야전 정비 키트'))
        cautions_str = f"{adv_text} 야전 운용 가동률 유지를 위해 [환경 극복 패키지: {pkg}]를 필히 적용해야 합니다."

        key_theaters_data.append({
            'theater': t['titleKo'],
            'region': t['regionKo'],
            'griScore': t['griScore'],
            'intensity': t['intensity'],
            'threatProfile': t.get('mainTheaters', ''),
            'matchedHanwhaSolution': [w['nameKo'] for w in t['matchedWeapons'][:3]],
            'environmentalFitAnalysis': env_fit_str,
            'operationalDoctrine': doctrine_str,
            'operationalCautions': cautions_str,
            'strategicImplication': f"전장 환경 및 위협 특성에 따라 {w_name} 중심의 패키지 수출과 현지 창정비·합작생산(MRO/Co-production) 거점화 구축을 최우선 추진함."
        })

    is_key_missing = not bool(api_key)
    telemetry_status = 'api_key_required' if is_key_missing else ('error_fallback' if external_error else 'success')
    status_msg = (
        'OpenAI API 키 미입력 (설정에서 키를 입력하시면 실시간 GPT AI 심층 분석이 활성화됩니다)'
        if is_key_missing else
        f'API 연결 실패로 인한 기초 데이터 분석 ({external_error})'
    )

    return {
        'title': f'한화 방산 미래전략실 글로벌 안보 리스크 & 소요 무기 매칭 AI 전략 보고서 ({active_model})',
        'generatedAt': datetime.utcnow().isoformat() + 'Z',
        'displayDate': report_date,
        'modelUsed': active_model,
        'executiveSummary': [
            f"전 세계 29개 주요 분쟁 지역 중 고위험(High Intensity) 분쟁은 총 {high_count}개 권역으로 집계되었습니다.",
            "우크라이나-러시아 및 중동(이스라엘·이란·홍해) 전선의 장기화로 인해 NATO 및 중동 동맹국을 중심으로 'K9 자주포', '천무 MLRS', '천궁-II 방공망'의 즉시 조달 수요가 최고조를 유지하고 있습니다.",
            "인도-태평양 및 대만 해협/남중국해 긴장 고조에 따라 도서 방어용 CTM-290 전술유도탄, 소형 SAR 정찰위성 및 해양 무인체계(UGV/USV) 수요가 신규 전략 축으로 부상하고 있습니다.",
            "미국 방산 생태계의 생산 능력 한계(안두릴·타타 사례)로 인해 동맹국 기반 공동 생산(Co-production) 및 MRO 협력 모델이 한화 방산의 글로벌 시장 침투 핵심 레버리지로 작동할 전망입니다."
        ],
        'keyTheaters': key_theaters_data,
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
            'provider': 'OpenAI',
            'model': active_model,
            'isExternal': False,
            'isFallback': external_error is not None,
            'status': telemetry_status,
            'statusMessage': status_msg,
            'externalError': external_error,
            'promptTokens': 0,
            'outputTokens': 0,
            'totalTokens': 0
        }
    }

def normalize_model_name(model: str) -> str:
    if not model:
        return 'gpt-4o'
    m = model.strip()
    if m.startswith('gpt') and not m.startswith('gpt-'):
        m = 'gpt-' + m[3:]
    return m

def build_openai_payload(model: str, messages: list, is_json: bool = True, max_tokens: int = 3500):
    payload = {
        'model': model,
        'messages': messages,
    }
    if is_json:
        payload['response_format'] = {'type': 'json_object'}
    
    # reasoning 계열(o1, o3 등)을 제외하고 temperature 적용
    if not (model.startswith('o1') or model.startswith('o3')):
        payload['temperature'] = 0.7

    # gpt-5 및 o-series 모델은 max_completion_tokens 권장, 이전 모델은 max_tokens
    if model.startswith(('o1', 'o3', 'gpt-5')):
        payload['max_completion_tokens'] = max_tokens
    else:
        payload['max_tokens'] = max_tokens
    return payload

async def call_external_llm(custom_config: dict, matching_data: list[dict], top_risks: list[dict]) -> dict:
    import time
    start_time = time.time()

    # 상위 분쟁지별 상세 위협 맥락 및 뉴스 동향 구성
    theaters_context = []
    for r in top_risks[:6]:
        weapons_details = []
        for w in r.get('matchedWeapons', [])[:3]:
            specs = w.get('operatingSpecs', {})
            env = w.get('environmentalAssessment', {})
            adv_list = env.get('fieldAdvisories', [])
            adv_str = '; '.join(adv_list[:2]) if adv_list else specs.get('fieldConstraints', '표준 군용 수칙 준수')
            weapons_details.append(
                f"    * {w['nameKo']}({w.get('company', '한화')}): [보증기온: {specs.get('tempRange', '-40°C~+50°C')} / 한계습도: {specs.get('maxHumidity', 95)}% / 군용규격: {specs.get('standard', 'MIL-STD-810H')}] "
                f"[환경평가: 기온={env.get('tempDesc', '적합')}, 습도={env.get('humidityDesc', '적합')}, 지형적합={env.get('terrainScore', 85)}점] "
                f"[야전제약: {specs.get('fieldConstraints', '없음')}] [권장대응킷: {env.get('countermeasurePackage', '기본 킷')}] "
                f"[현장주의점: {adv_str}]"
            )
        weapons_block = "\n".join(weapons_details) if weapons_details else "    * 복합 화력/방호 체계"

        # 최신 관련 뉴스 헤드라인 결합 (최대 2건)
        news_headlines = [f"'{n.get('title')}'" for n in r.get('matchedNews', [])[:2] if n.get('title')]
        news_str = f" [관련 뉴스: {', '.join(news_headlines)}]" if news_headlines else ""

        t_info = r.get('terrainInfo') or {}
        terrain_str = f"{t_info.get('terrainType', '복합 지형')} (기온: {t_info.get('tempRange', {}).get('desc', '온난')}, 습도: {t_info.get('humidity', {}).get('desc', '보통')}, 환경위협: {', '.join(t_info.get('specialHazards', ['작전 제약']))})" if t_info else ""
        
        theaters_context.append(
            f"- [{r.get('regionKo', '글로벌')}] {r['titleKo']} (GRI 지수: {r['griScore']}/100, 위험도: {r['intensity']})\n"
            f"  * 전장 지형 및 기후 제원: {terrain_str}\n"
            f"  * 핵심 위협 요인: {r.get('mainTheaters', '복합 비대칭 위협 및 화력 소모전')}{news_str}\n"
            f"  * 매칭 무기체계 및 군용 운용/환경 제원:\n{weapons_block}"
        )
    theaters_text = "\n".join(theaters_context)

    prompt = f"""당신은 한화그룹 방산 부문(한화에어로스페이스, 한화시스템, 한화오션) 미래전략실의 수석 안보/방산 전략 컨설턴트입니다.
제공된 전 세계 분쟁 데이터, 전장 지형·기후(온도/습도/환경위협), 그리고 한화 무기체계의 군용 규격(MIL-STD-810H, 보증온도, 한계습도, 야전제약)을 종합 분석하여 최고경영진(C-Level) 및 계열사 사업본부장에게 보고할 최고 수준의 '심층 방산 전략 인텔리전스 보고서'를 JSON 포맷으로 작성하십시오.

[분석 대상 핵심 분쟁 및 무기 운용/환경 제원 현황]
{theaters_text}

[작성 및 서술 원칙 - 반드시 준수]
1. 분량을 절대 축약하지 말고, 전문적인 군사 전략, 무기 운용 교리 및 방위산업 비즈니스 용어를 활용하여 각 섹션을 길고 상세하게 작성하십시오.
2. 'executiveSummary': 총 4~5개 항목으로 구성하십시오. 각 항목은 [지정학적 위기 메커니즘 - 극한 환경 극복 및 방산 공급망 병목 - 한화 3사의 사업적 수주 기회 및 대응책]을 체계적으로 서술하여, '각 항목당 반드시 3~4문장 이상의 심층 단락(최소 150자 이상)'으로 작성하십시오.
3. 'keyTheaters': 제공된 상위 고위험 분쟁지들에 대해 각각 다음 항목을 '심층적이고 전문적인 군사·방산 용어로 상세히 작성'하십시오:
   - 'theater': 분쟁명
   - 'region': 권역명
   - 'griScore': 정수 (예: 95)
   - 'intensity': 'High' 또는 'Medium'
   - 'matchedHanwhaSolution': 추천 무기체계 2~3종 배열
   - 'environmentalFitAnalysis': 현지 기후(기온/습도/특수위협)와 무기체계 보증 규격(MIL-STD-810H, -40~50°C, 95% 습도 등)의 정밀 매칭 분석 및 한계치 검토를 2~3문장 이상으로 기술하십시오.
   - 'operationalDoctrine': 해당 전장의 지형(개활 스텝, 사막 모래, 험준 산악, 열대 정글, 해협 등)과 기상 특성에 최적화된 '무기체계 실전 운용 방식 및 전술 교리(기동 방식, 사격 진지 선정, 엄폐 및 센서 운용 등)'를 3~4문장 이상으로 상세 기술하십시오.
   - 'operationalCautions': 극한 전장 환경(혹한 결빙, 50도 혹서, 라스푸티차 진흙탕, 하부브 모래폭풍, 95% 극고습 염무 등)에서 무기체계의 가동률 저하 및 기능 고장을 방지하기 위한 '야전 운용상 필수 주의사항 및 정비 지침(APU 예열, 광학계 질소 충전/결로 방지, 흡기 필터 주기 세척, 궤도 패드 교체, 담수 세척 등)'을 3~4문장 이상으로 명확히 기술하십시오.
   - 'strategicImplication': 해당 전장의 위협 양상과 무기체계의 전술적 기대 효과, 현지 생산·MRO 거점화 전략을 3~4문장 이상의 완성된 심층 단락으로 기술하십시오.
4. 'strategicRecommendations': 한화 3사(에어로스페이스, 시스템, 오션)의 통합 시너지를 반영한 4대 핵심 전략을 수립하십시오:
   - 4개 분야: [화력·기동 체계 (한화에어로스페이스)], [다층 복합방공 및 우주 C4I (한화시스템)], [해양 안보 및 특수함정 (한화오션)], [글로벌 공급망(GVC) 및 G2G 패키지 금융]
   - 각 항목의 'action'은 단순한 구호가 아니라 G2G 정부간 협력, 현지 합작법인(JV), 나토 규격 호환, 부품 국산화 등 '구체적인 실행 로드맵을 3~4문장 이상'으로 상세 기술하십시오.

반드시 마크다운 백틱(```json) 없이 유효한 순수 JSON 포맷으로만 응답하십시오:
{{
  "title": "2026-2030 글로벌 안보 위기 심층 분석 및 한화 방산 3사 통합 수출·전략 대응 보고서",
  "executiveSummary": [
    "경영진 요약 심층 분석 문단 1 (3~4문장 이상으로 상세 서술)",
    "경영진 요약 심층 분석 문단 2 (3~4문장 이상으로 상세 서술)",
    "경영진 요약 심층 분석 문단 3 (3~4문장 이상으로 상세 서술)",
    "경영진 요약 심층 분석 문단 4 (3~4문장 이상으로 상세 서술)"
  ],
  "keyTheaters": [
    {{
      "theater": "분쟁명",
      "region": "지역",
      "griScore": 95,
      "intensity": "High",
      "matchedHanwhaSolution": ["K9A2 자주포", "천무 MLRS"],
      "environmentalFitAnalysis": "현지 기온 및 습도 대비 MIL-STD-810H 보증 스펙 매칭 분석...",
      "operationalDoctrine": "전장 지형 및 기상 특성을 고려한 최적의 무기 기동 및 사격 운용 교리 3~4문장...",
      "operationalCautions": "혹한/혹서/진흙탕 등 야전 운용 시 고장 방지를 위한 필수 주의사항 및 정비 수칙 3~4문장...",
      "strategicImplication": "전술 교리 및 한화 솔루션 매칭 심층 분석 3~4문장..."
    }}
  ],
  "strategicRecommendations": [
    {{
      "pillar": "화력·기동 체계 (한화에어로스페이스)",
      "action": "현지 생산 및 탄약 공급망 구축 로드맵 3~4문장..."
    }},
    {{
      "pillar": "다층 복합방공 및 우주 C4I (한화시스템)",
      "action": "다층 방공망 및 저궤도 위성 C4I 통합 제안 3~4문장..."
    }},
    {{
      "pillar": "해양 안보 및 특수함정 (한화오션)",
      "action": "잠수함/호위함 패키지 및 현지 MRO 클러스터 구축 3~4문장..."
    }},
    {{
      "pillar": "글로벌 공급망(GVC) 및 G2G 패키지 금융",
      "action": "정부 주도 수출금융 및 글로벌 파트너십 전략 3~4문장..."
    }}
  ]
}}"""

    api_key = (custom_config.get('apiKey') or '').strip()
    model_pref = normalize_model_name(custom_config.get('model'))

    if not api_key:
        raise ValueError('OpenAI API 키가 입력되지 않았습니다.')

    # 404 모델 에러 방지: 사용자 지정 모델 우선, 없거나 404면 대체 모델 순차 시도
    models_to_try = [model_pref] if model_pref else ['gpt-4o']
    for m in ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-3.5-turbo']:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = ''
    async with httpx.AsyncClient(timeout=30.0) as client:
        for model in models_to_try:
            try:
                payload = build_openai_payload(model, [{'role': 'user', 'content': prompt}], is_json=True, max_tokens=3500)
                resp = await client.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'Content-Type': 'application/json'
                    },
                    json=payload
                )
                if resp.status_code == 200:
                    data = resp.json()
                    usage = data.get('usage', {})
                    content_str = data['choices'][0]['message']['content']
                    cleaned = clean_llm_json(content_str)
                    report = json.loads(cleaned)
                    report['title'] = f"한화 방산 미래전략실 글로벌 안보 리스크 & 소요 무기 매칭 AI 전략 보고서 ({model})"
                    report['telemetry'] = {
                        'provider': 'OpenAI GPT',
                        'model': model,
                        'requestedModel': model_pref,
                        'isFallback': model != model_pref,
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
                    # 인증 오류(401, 403) 또는 사용량 초과(429) 시 다른 모델 시도 없이 즉시 중단
                    if resp.status_code in (401, 403, 429):
                        break
            except Exception as ex:
                last_error = str(ex)
                print(f"[OpenAI Call] 모델 {model} 예외: {ex}")

    raise ValueError(f"OpenAI GPT 호출 실패: {last_error}")

async def test_llm_connection(api_key: str, model_pref: str = None) -> dict:
    api_key = (api_key or '').strip()
    if not api_key:
        return {'success': False, 'message': 'API 키가 입력되지 않았습니다.'}

    model_pref = normalize_model_name(model_pref)
    models_to_try = [model_pref] if model_pref else ['gpt-4o']
    for m in ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-3.5-turbo']:
        if m not in models_to_try:
            models_to_try.append(m)

    last_error = ''
    async with httpx.AsyncClient(timeout=15.0) as client:
        for model in models_to_try:
            try:
                payload = build_openai_payload(model, [{'role': 'user', 'content': 'Say hello in Korean in 3 words'}], is_json=False, max_tokens=20)
                resp = await client.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'Content-Type': 'application/json'
                    },
                    json=payload
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
