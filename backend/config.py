# backend/config.py
# 한화 방산 미래전략실 - 설정 및 무기체계/분쟁 매핑 사전 (FastAPI)

DAILY_DEFENSE_RSS_URL = 'https://www.dailydefense.co.kr/rss/allArticle.xml'
DAILY_DEFENSE_TOP_RSS_URL = 'https://www.dailydefense.co.kr/rss/clickTop.xml'

# Armed Conflicts 29개 활성 분쟁지 정의
CONFLICT_SLUGS = [
    'russia-ukraine-war',
    'israel-gaza-war',
    'iran-israel-war',
    'lebanon-israel-conflict',
    'yemen-war',
    'syria-civil-war',
    'iraq-conflict',
    'turkey-kurdish-conflict',
    'sudan-civil-war',
    'south-sudan-conflict',
    'somalia-al-shabaab',
    'ethiopia-conflict',
    'dr-congo-m23-conflict',
    'central-african-republic',
    'nigeria-boko-haram',
    'sahel-insurgency',
    'mozambique-cabo-delgado',
    'libya-conflict',
    'afghanistan-conflict',
    'pakistan-conflict',
    'india-pakistan-kashmir',
    'myanmar-civil-war',
    'taiwan-strait-tensions',
    'south-china-sea-disputes',
    'armenia-azerbaijan-conflict',
    'mexico-drug-war',
    'colombia-conflict',
    'haiti-gang-violence',
    'ecuador-conflict'
]

# 분쟁 한국어 메타데이터 매핑
CONFLICT_META_KO = {
    'russia-ukraine-war': {'nameKo': '러시아-우크라이나 전쟁', 'regionKo': '동유럽', 'mainTheaters': '도네츠크, 자포리자, 쿠르스크, 하르키우'},
    'israel-gaza-war': {'nameKo': '이스라엘-하마스(가자) 전쟁', 'regionKo': '중동', 'mainTheaters': '가자지구, 라파, 서안지구'},
    'iran-israel-war': {'nameKo': '이란-이스라엘 분쟁', 'regionKo': '중동', 'mainTheaters': '테헤란, 텔아비브, 시리아 국경'},
    'lebanon-israel-conflict': {'nameKo': '레바논-이스라엘(헤즈볼라) 충돌', 'regionKo': '중동', 'mainTheaters': '남부 레바논, 베이루트'},
    'yemen-war': {'nameKo': '예멘 내전 & 홍해 후티 위기', 'regionKo': '중동/홍해', 'mainTheaters': '홍해 항로, 사나, 아덴만'},
    'syria-civil-war': {'nameKo': '시리아 내전', 'regionKo': '중동', 'mainTheaters': '알레포, 이들립, 다마스쿠스'},
    'iraq-conflict': {'nameKo': '이라크 안보 위기', 'regionKo': '중동', 'mainTheaters': '바그다드, 에르빌'},
    'turkey-kurdish-conflict': {'nameKo': '튀르키예-쿠르드(PKK) 분쟁', 'regionKo': '중동/아나톨리아', 'mainTheaters': '이라크 북부 국경, 시리아 북부'},
    'sudan-civil-war': {'nameKo': '수단 내전 (정규군 vs RSF)', 'regionKo': '아프리카', 'mainTheaters': '하르툼, 다르푸르'},
    'south-sudan-conflict': {'nameKo': '남수단 분쟁', 'regionKo': '아프리카', 'mainTheaters': '주바, 유니티주'},
    'somalia-al-shabaab': {'nameKo': '소말리아-알샤바브 분쟁', 'regionKo': '동아프리카', 'mainTheaters': '모가디슈, 소말릴란드 국경'},
    'ethiopia-conflict': {'nameKo': '에티오피아 암하라/오로모 분쟁', 'regionKo': '동아프리카', 'mainTheaters': '암하라주, 티그라이'},
    'dr-congo-m23-conflict': {'nameKo': '민주콩고(DRC)-M23 반군 분쟁', 'regionKo': '중앙아프리카', 'mainTheaters': '북키부주, 고마'},
    'central-african-republic': {'nameKo': '중앙아프리카공화국 분쟁', 'regionKo': '중앙아프리카', 'mainTheaters': '방기, 국경지대'},
    'nigeria-boko-haram': {'nameKo': '나이지리아 보코하람/ISWAP 반란', 'regionKo': '서아프리카', 'mainTheaters': '보르노주, 차드호'},
    'sahel-insurgency': {'nameKo': '사헬 지대 이슬람 반군 (말리/니제르/부르키나파소)', 'regionKo': '서아프리카', 'mainTheaters': '3국 접경지대'},
    'mozambique-cabo-delgado': {'nameKo': '모잠비크 카보델가도 반군', 'regionKo': '남아프리카', 'mainTheaters': '카보델가도주 가스전 지대'},
    'libya-conflict': {'nameKo': '리비아 동서 정권 대립', 'regionKo': '북아프리카', 'mainTheaters': '트리폴리, 벵가지, 시르테'},
    'afghanistan-conflict': {'nameKo': '아프가니스탄 탈레반-ISKP 분쟁', 'regionKo': '서남아시아', 'mainTheaters': '카불, 낭가르하르'},
    'pakistan-conflict': {'nameKo': '파키스탄 TTP & 발루치 분쟁', 'regionKo': '서남아시아', 'mainTheaters': '카이베르파크툰크와, 발루치스탄'},
    'india-pakistan-kashmir': {'nameKo': '인도-파키스탄 카슈미르 분쟁', 'regionKo': '남아시아', 'mainTheaters': '통제선(LoC), 라다크 국경'},
    'myanmar-civil-war': {'nameKo': '미얀마 내전 (군부 vs NUG/반군)', 'regionKo': '동남아시아', 'mainTheaters': '만달레이, 샨주, 라카인주'},
    'taiwan-strait-tensions': {'nameKo': '대만 해협 긴장 & 양안 위기', 'regionKo': '동아시아', 'mainTheaters': '대만 해협 중간선, 펑후제도, 방공식별구역'},
    'south-china-sea-disputes': {'nameKo': '남중국해 영유권 분쟁 (필리핀/베트남 vs 중국)', 'regionKo': '동남아시아/해양', 'mainTheaters': '스카버러 암초, 세컨드 토마스 암초, 스프래틀리 군도'},
    'armenia-azerbaijan-conflict': {'nameKo': '아르메니아-아제르바이잔 국경 분쟁', 'regionKo': '코카서스', 'mainTheaters': '잔게주르 회랑, 국경 접경지'},
    'mexico-drug-war': {'nameKo': '멕시코 마약 카르텔 전쟁', 'regionKo': '중남미', 'mainTheaters': '시날로아, 할리스코, 국경도시'},
    'colombia-conflict': {'nameKo': '콜롬비아 ELN 및 FARC 반군', 'regionKo': '남미', 'mainTheaters': '안데스 정글, 베네수엘라 국경'},
    'haiti-gang-violence': {'nameKo': '아이티 갱단 폭력 위기', 'regionKo': '카리브해', 'mainTheaters': '포르토프랭스'},
    'ecuador-conflict': {'nameKo': '에콰도르 치안 비상사태', 'regionKo': '남미', 'mainTheaters': '과야킬, 태평양 연안 마약루트'}
}

# 한화 방산 18대 핵심 무기체계 포트폴리오 (한화에어로스페이스 · 한화시스템 · 한화오션)
HANWHA_DEFENSE_PORTFOLIO = [
    {
        'id': 'K9_THUNDER',
        'nameKo': 'K9 자주포 & K10 탄약운반장갑차',
        'company': '한화에어로스페이스',
        'category': '화력/기동',
        'caliber': '155mm / 52구경장',
        'description': '글로벌 점유율 50% 이상의 대표 K-방산 자주포. NATO 표준 호환, 분당 6~8발 급속사격, 자동화 사격통제.',
        'threatScenarios': ['포격전', '장거리 화력지원', '진지 파괴', '대포병 사격', '전면 지상전'],
        'targetRegions': ['동유럽', '북유럽', '중동', '서남아시아', '동남아시아'],
        'keywords': ['자주포', '155mm', '포격', '화력', 'k9', 'k-9', '포탄', '대포병', '사거리', '탄약운반차']
    },
    {
        'id': 'CHEONMU_MLRS',
        'nameKo': '천무 다련장로켓 (K-MLRS / Chunmoo)',
        'company': '한화에어로스페이스',
        'category': '정밀유도/화력',
        'range': '80km ~ 290km 유도미사일',
        'description': '130mm 무유도로켓부터 239mm 유도로켓, 290mm 전술지대지유도탄(CTM-290)까지 운용 가능한 다연장 화력체계.',
        'threatScenarios': ['원거리 정밀 타격', '종심 타격', '적 지휘부/방공망 무력화', '해안 방어'],
        'targetRegions': ['동유럽', '중동', '동아시아', '동남아시아'],
        'keywords': ['다련장', '천무', '로켓', '유도탄', 'mlrs', 'himars', '정밀타격', 'ctm-290', '원거리']
    },
    {
        'id': 'REDBACK_IFV',
        'nameKo': '레드백(Redback) 미래형 궤도장갑차 / K21',
        'company': '한화에어로스페이스',
        'category': '기동/방호',
        'description': '호주 육군 LAND 400 선정 차세대 보병전투장갑차(IFV). 능동방호체계(APS), 30mm 기관포, 대전차미사일 탑재.',
        'threatScenarios': ['도시 기동전', '대전차 미사일 방호', '기계화보병 수송', '복합 지상전'],
        'targetRegions': ['오세아니아', '동유럽', '서유럽', '중동'],
        'keywords': ['장갑차', '레드백', '보병전투', 'ifv', '방호', '기동', 'k21', 'aps', '기관포']
    },
    {
        'id': 'CHEONGUNG_II',
        'nameKo': '천궁-II (M-SAM) 중거리 지대공 유도무기',
        'company': '한화시스템 / 한화에어로스페이스',
        'category': '방공/대공미사일',
        'description': '탄도탄 및 항공기 요격용 한국형 패트리어트. MFR 다기능 레이더와 히트투킬(Hit-to-Kill) 정밀 요격 미사일.',
        'threatScenarios': ['탄도미사일 위협', '순항미사일 요격', '적기 침투', '복합 공중위협'],
        'targetRegions': ['중동', '동유럽', '동아시아'],
        'keywords': ['천궁', 'm-sam', '방공', '요격', '지대공', '패트리어트', '탄도탄', '미사일 방어', 'mfr', '레이더']
    },
    {
        'id': 'L_SAM',
        'nameKo': 'L-SAM 장거리 지대공 유도무기 & 초고고도 방어',
        'company': '한화에어로스페이스 / 한화시스템',
        'category': '방공/탄도탄방어',
        'description': '고도 40~60km 상공에서 적 탄도미사일을 요격하는 한국형 사드(THAAD)급 상층 방어체계.',
        'threatScenarios': ['중장거리 탄도탄', '극초음속 무기', '상층 공중위협'],
        'targetRegions': ['동아시아', '중동'],
        'keywords': ['l-sam', '엘샘', '장거리 지대공', '사드', 'thaad', '상층방어', '고고도 요격']
    },
    {
        'id': 'LASER_AIR_DEFENSE',
        'nameKo': '레이저 대공무기 (Block-I) / 안티드론 솔루션',
        'company': '한화에어로스페이스 / 한화시스템',
        'category': '미래/드론대응',
        'description': '광섬유 레이저 빔으로 적 소형 드론 및 무인기를 1회 발사비용 약 2천원으로 격추하는 미래 전장의 게임체인저.',
        'threatScenarios': ['소형 드론 공격', '자폭 무인기 군집 침투', '정찰 드론', '비대칭 공중 침투'],
        'targetRegions': ['중동', '동유럽', '동아시아', '남아시아'],
        'keywords': ['레이저', '드론', '무인기', '안티드론', '카운터드론', '요격', '샤헤드', '자폭드론', 'uav']
    },
    {
        'id': 'BIHO_HYBRID',
        'nameKo': '비호복합 대공포 & 단거리 복합방공',
        'company': '한화에어로스페이스',
        'category': '방공/근접방어',
        'description': '30mm 쌍열 자주대공포와 신궁 지대공유도탄을 결합하여 저고도로 침투하는 적기 및 무인기를 격멸.',
        'threatScenarios': ['저고도 침투', '헬기 공격', '순항미사일 근접 방어', '드론 방어'],
        'targetRegions': ['중동', '동남아시아', '동유럽'],
        'keywords': ['비호', '대공포', '복합', '저고도', '30mm', '신궁', '근접방공']
    },
    {
        'id': 'CHEONHO_AAGW',
        'nameKo': '30mm 차륜형대공포 천호(AAGW)',
        'company': '한화에어로스페이스 / 한화시스템',
        'category': '방공/근접방어',
        'caliber': '30mm 쌍열 (분당 1,200발)',
        'description': '기존 발칸포를 대체하여 K808 차륜형 차체에 고성능 전자광학추적장치(EOTS)와 30mm 쌍열포를 결합한 고기동 근접방공체계.',
        'threatScenarios': ['저고도 적기 침투', '자폭 드론 격추', '아군 기동대열 방호', '순항미사일 대응'],
        'targetRegions': ['중동', '동남아시아', '동유럽'],
        'keywords': ['천호', '대공포', 'aagw', '30mm', '차륜형대공포', 'eots', '저고도방공', '안티드론']
    },
    {
        'id': 'KSS_III_SUBMARINE',
        'nameKo': '장보고-III (KSS-III Batch-II) 3,600톤급 잠수함',
        'company': '한화오션',
        'category': '해양/잠수함',
        'specs': '3,600톤급 / AIP + 리튬전지 / SLBM VLS',
        'description': '세계 최고 수준의 잠항지속능력을 갖춘 디젤 잠수함. 공기불요추진(AIP)과 리튬전지, SLBM 수직발사관을 탑재한 글로벌 전략 타격 플랫폼.',
        'threatScenarios': ['해양 영유권 분쟁', '해상 봉쇄 돌파', '전략 억제/SLBM 타격', '수중 정찰/대잠전'],
        'targetRegions': ['동아시아', '동남아시아', '유럽', '북미'],
        'keywords': ['잠수함', '장보고', 'kss-iii', 'batch-ii', '오르카', 'aip', '리튬전지', 'slbm', '수중', '해양']
    },
    {
        'id': 'FFX_KDDX_FRIGATE',
        'nameKo': 'FFX Batch-III(울산급) / KDDX 차기구축함',
        'company': '한화오션 / 한화시스템',
        'category': '해양/수상함',
        'specs': '복합센서마스트(I-MAST) / 4면 AESA 레이더',
        'description': '한화오션의 첨단 함정 설계와 한화시스템의 복합센서마스트(I-MAST) 및 통합전투체계(CMS)가 결합된 대한민국 해군 핵심 수상 전투함.',
        'threatScenarios': ['대함 미사일 방어', '해상 교통로 보호', '연안/원해 초계', '잠수함 탐지'],
        'targetRegions': ['동남아시아', '동아시아', '남미', '중동'],
        'keywords': ['호위함', '구축함', '울산급', 'ffx', 'kddx', '함정', '해군', '수상함', 'i-mast', '전투함']
    },
    {
        'id': 'GHOST_COMMANDER_MUMT',
        'nameKo': '무인전력지휘통제함(Ghost Commander) & 전투용 XLUUV',
        'company': '한화오션',
        'category': '해양/무인전투',
        'specs': '해양 유무인 복합전투(MUM-T) 기함',
        'description': '무인수상정(USV), 무인잠수정(UUV), 무인항공기(UAV)를 모함에서 자율 전개·지휘하는 미래 스마트 네이비 유무인 복합전투 사령탑.',
        'threatScenarios': ['무인 정찰/감시', '기뢰 탐색/소해', '위험해역 선견작전', '해상 군집 공격 대응'],
        'targetRegions': ['북미', '동아시아', '중동'],
        'keywords': ['고스트커맨더', '무인함', 'xluuv', 'uuv', 'usv', '유무인복합', 'mum-t', '해양드론']
    },
    {
        'id': 'NAVAL_SYSTEMS',
        'nameKo': '함정용 통합전투체계 & 해양 복합센서',
        'company': '한화시스템',
        'category': '해양/센서',
        'description': 'KDDX 차기구축함 및 호위함 통합 전투체계(CMS), 다기능 위상배열레이더(MFR) 및 정밀 소나체계.',
        'threatScenarios': ['해상 봉쇄', '잠수함 위협', '해양 영유권 분쟁', '대함 미사일 방어', '연안 방어'],
        'targetRegions': ['동아시아', '동남아시아', '중동', '남미'],
        'keywords': ['함정', '구축함', '호위함', '해군', '해상', '전투체계', 'aesa', '소나', '리튬전지', '해양']
    },
    {
        'id': 'KF21_AESA_RADAR',
        'nameKo': 'KF-21 한국형 전투기용 AESA 레이더 & 항전체계',
        'company': '한화시스템',
        'category': '항공/센서',
        'specs': '1,000+ GaN TR모듈 / 다중표적 동시추적',
        'description': '미국 기술이전 없이 독자 개발에 성공한 한국형 전투기(KF-21)의 핵심 두뇌. 공대공·공대지·공대함 다중 표적을 원거리에서 정밀 동시 탐색 및 추적.',
        'threatScenarios': ['원거리 공중전', '적 스텔스기 탐색', '정밀 공대지 타격 유도', '전자전 방해 극복'],
        'targetRegions': ['동유럽', '동아시아', '중동', '동남아시아'],
        'keywords': ['aesa', '레이더', 'kf-21', '보라매', '항전', '전투기', '공중전', '공대공', '표적추적']
    },
    {
        'id': 'AERO_TURBOFAN_ENGINE',
        'nameKo': '첨단 항공 가스터빈 엔진 (KF-21 F414 & 차세대 터보팬)',
        'company': '한화에어로스페이스',
        'category': '항공/추진',
        'specs': '21,500lbf급 후기연소기 추력 / FADEC',
        'description': '대한민국 유일의 가스터빈 항공엔진 제작사(누적 10,000대 생산 돌파). KF-21 탑재 F414 엔진 양산 및 15,000lbf급 차세대 독자 군용 터보팬 엔진 R&D.',
        'threatScenarios': ['항공 추진체계 자립', '초음속 비행', '장거리 항공 초계', '전술 무인기 엔진'],
        'targetRegions': ['동유럽', '동남아시아', '북미'],
        'keywords': ['항공엔진', '가스터빈', '엔진', 'f414', '터보팬', 'kf-21', '추진체계', '제트엔진']
    },
    {
        'id': 'TAIPERS_MISSILE',
        'nameKo': '천검(TAipers) 헬기/장갑차용 정밀유도 대전차미사일',
        'company': '한화에어로스페이스',
        'category': '정밀유도/기갑',
        'specs': '사거리 8km+ / 광섬유+무선 / AI 영상인식',
        'description': '이스라엘 스파이크(Spike)급 비가시선(NLOS) 장거리 정밀 타격 유도미사일. 유선 광섬유 및 무선 데이터링크, AI 딥러닝 기반 표적 자동인식(Fire & Forget).',
        'threatScenarios': ['적 전차/기갑부대 파괴', '엄폐 진지 정밀타격', '헬기 공대지 공격', '도시 기동전'],
        'targetRegions': ['동유럽', '중동', '동남아시아'],
        'keywords': ['천검', '대전차', '대전차미사일', '유도탄', '스파이크', 'lah', '공대지', '장거리타격']
    },
    {
        'id': 'TIGON_WHEELED_IFV',
        'nameKo': '타이곤(TIGON) 6x6 차륜형 장갑차 & K105A1',
        'company': '한화에어로스페이스',
        'category': '기동/차륜형',
        'specs': '525마력 / 최고시속 100km / 수륙양용',
        'description': '궤도형이 부담스러운 국가를 위한 고기동·가성비 차륜형 장갑차. STANAG 레벨3 방호와 수륙양용 능력, 105mm 기동화력 지원 능력 완비.',
        'threatScenarios': ['신속 기동전', '사막/평원 수색', '국경 경비', '게릴라/비정규군 소탕'],
        'targetRegions': ['동남아시아', '아프리카', '중동', '중남미'],
        'keywords': ['타이곤', 'tigon', '차륜형', '장갑차', 'k105a1', '차륜형자주포', '기동', '수륙양용']
    },
    {
        'id': 'SPACE_SAT_DEFENSE',
        'nameKo': '소형 SAR 정찰위성 & 저궤도 군위성통신망',
        'company': '한화시스템',
        'category': '우주/정찰/통신',
        'description': '주야간 악천후 관계없이 지상을 0.5m급 해상도로 감시하는 초소형 SAR 위성 및 미래 군용 저궤도 위성 통신.',
        'threatScenarios': ['지휘통제 단절', '통신 방해(EW)', '우주 기반 실시간 전장 감시', '장거리 표적 획득'],
        'targetRegions': ['동아시아', '동유럽', '중동'],
        'keywords': ['위성', 'sar', '우주', '정찰', '통신', 'c4i', '감시', '우주국방', '전자전']
    },
    {
        'id': 'UGV_UNMANNED',
        'nameKo': '다목적 무인차량(Arion-SMET) & 자율로봇 체계',
        'company': '한화에어로스페이스',
        'category': '무인/자율체계',
        'description': '미 국방부 FCT(해외비교시험) 통과. 원격/자율주행 기반 물자수송, 부상자 후송, 원격사격통제(RCWS) 수색.',
        'threatScenarios': ['위험지역 수색', '군수물자 자율수송', '도시 시가전', '사상자 감축'],
        'targetRegions': ['북미', '유럽', '중동', '동아시아'],
        'keywords': ['무인차량', 'ugv', '아리온스멧', '로봇', '자율주행', 'rcws', '무인수색']
    }
]
