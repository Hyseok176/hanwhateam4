# backend/collector.py
# 데일리방산 RSS 피드 및 Armed Conflicts 29개 분쟁 데이터 수집 모듈 (FastAPI)

import os
import json
import re
import html
import asyncio
from datetime import datetime
import httpx
import xmltodict
from . import config

CACHE_DIR = os.path.join(os.path.dirname(__file__), '..', 'data_cache')
os.makedirs(CACHE_DIR, exist_ok=True)

NEWS_CACHE_FILE = os.path.join(CACHE_DIR, 'news.json')
CONFLICTS_CACHE_FILE = os.path.join(CACHE_DIR, 'conflicts.json')

def clean_text(raw: str) -> str:
    if not raw:
        return ''
    decoded = html.unescape(raw)
    decoded = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', decoded, flags=re.DOTALL)
    decoded = re.sub(r'<[^>]+>', ' ', decoded)
    return re.sub(r'\s+', ' ', decoded).strip()

def tag_news_content(title: str, desc: str) -> list[str]:
    combined = (title + ' ' + desc).lower()
    tags = []
    if re.search(r'k9|자주포|포탄|화력|155mm', combined):
        tags.append('자주포/화력')
    if re.search(r'천무|다련장|mlrs|미사일|로켓|정밀타격', combined):
        tags.append('유도무기/미사일')
    if re.search(r'장갑차|레드백|k21|보병전투|기동', combined):
        tags.append('기동/장갑차')
    if re.search(r'천궁|방공|요격|패트리어트|대공|l-sam', combined):
        tags.append('방공/요격')
    if re.search(r'드론|무인기|uav|레이저|안티드론', combined):
        tags.append('드론/대드론')
    if re.search(r'함정|잠수함|해군|호위함|구축함|해양', combined):
        tags.append('해양/함정')
    if re.search(r'위성|우주|sar|레이더|통신', combined):
        tags.append('우주/통신/레이더')
    if re.search(r'수출|계약|수주|mou|공동생산|방사청', combined):
        tags.append('방산수출/비즈니스')
    if re.search(r'미국|록히드|레이시온|안두릴|나토|유럽|폴란드|중동', combined):
        tags.append('글로벌안보')
    
    return tags if tags else ['일반방산']

async def scrape_single_defense_article(client: httpx.AsyncClient, idx: int) -> dict | None:
    url = f'https://www.dailydefense.co.kr/news/articleView.html?idxno={idx}'
    try:
        res = await client.get(url, timeout=10.0)
        if res.status_code != 200:
            return None
        
        og_title = re.search(r'<meta property="og:title" content="([^"]+)"', res.text)
        if not og_title:
            return None
        title = clean_text(og_title.group(1).replace(' - 데일리방산', '').strip())
        if not title:
            return None

        og_desc = re.search(r'<meta property="og:description" content="([^"]+)"', res.text)
        desc = clean_text(og_desc.group(1)) if og_desc else title

        date_m = re.search(r'<li[^>]*>\s*<i[^>]*><\/i>\s*([12]\d{3}[-.\/][01]\d[-.\/][0-3]\d\s+[0-2]\d:[0-5]\d)', res.text)
        if not date_m:
            date_m = re.search(r'([12]\d{3}[-.\/][01]\d[-.\/][0-3]\d\s+[0-2]\d:[0-5]\d)', res.text)
        pub_date = date_m.group(1) if date_m else ''

        author_m = re.search(r'([가-힣]{2,4}\s*기자)', res.text)
        author = author_m.group(1) if author_m else '데일리방산'

        tags = tag_news_content(title, desc)

        return {
            'id': f'DD-{idx}',
            'title': title,
            'link': url,
            'pubDate': pub_date,
            'author': author,
            'description': desc,
            'tags': tags,
            'source': '데일리방산'
        }
    except Exception:
        return None

async def fetch_defense_news(target_count: int = 100) -> list[dict]:
    print(f'[Collector] 데일리방산 뉴스 수집 중 (목표: {target_count}건)...')
    articles_dict = {}

    # 1. 기존 로컬 캐시 로드하여 보존
    if os.path.exists(NEWS_CACHE_FILE):
        try:
            with open(NEWS_CACHE_FILE, 'r', encoding='utf-8') as f:
                cached = json.load(f)
                for item in cached:
                    articles_dict[item['id']] = item
        except Exception:
            pass

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    }

    try:
        async with httpx.AsyncClient(headers=headers, timeout=15.0) as client:
            # 2. 최신 RSS 50건 수집 및 신규 기사 우선 반영
            try:
                resp = await client.get(config.DAILY_DEFENSE_RSS_URL)
                if resp.status_code == 200:
                    parsed = xmltodict.parse(resp.text)
                    items = parsed.get('rss', {}).get('channel', {}).get('item', [])
                    if isinstance(items, dict):
                        items = [items]

                    for item in items:
                        title = clean_text(item.get('title', ''))
                        link = item.get('link', '')
                        pub_date = item.get('pubDate', '')
                        author = clean_text(item.get('author', ''))
                        desc = clean_text(item.get('description', ''))
                        if not title:
                            continue

                        idx_match = re.search(r'idxno=(\d+)', link)
                        news_id = f"DD-{idx_match.group(1)}" if idx_match else f"DD-{hash(title)}"
                        tags = tag_news_content(title, desc)

                        articles_dict[news_id] = {
                            'id': news_id,
                            'title': title,
                            'link': link,
                            'pubDate': pub_date,
                            'author': author,
                            'description': desc,
                            'tags': tags,
                            'source': '데일리방산'
                        }
            except Exception as e:
                print(f'[Collector] RSS 피드 파싱 경고: {e}')

            # 3. 100건 미만인 경우에만 이전 기사 순차 완충 수집 (차단 방지)
            if len(articles_dict) < target_count:
                numeric_ids = []
                for k in articles_dict:
                    m = re.search(r'\d+', k)
                    if m:
                        numeric_ids.append(int(m.group()))

                min_idx = min(numeric_ids) if numeric_ids else 1900
                curr_idx = min_idx - 1

                while len(articles_dict) < target_count and curr_idx > 1000:
                    res = await scrape_single_defense_article(client, curr_idx)
                    if res and res['id'] not in articles_dict:
                        articles_dict[res['id']] = res
                    curr_idx -= 1
                    await asyncio.sleep(0.3)  # Rate-limit 완충 딜레이

        # 4. 고유 ID(발행 번호) 기준 내림차순 정렬 후 100건 저장
        def get_sort_key(item):
            m = re.search(r'\d+', item['id'])
            return int(m.group()) if m else 0

        news_list = sorted(articles_dict.values(), key=get_sort_key, reverse=True)[:target_count]

        with open(NEWS_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(news_list, f, ensure_ascii=False, indent=2)
        print(f'[Collector] 데일리방산 뉴스 {len(news_list)}건 수집 및 캐시 완료.')

        return news_list

    except Exception as e:
        print(f'[Collector] 뉴스 수집 오류: {e}')
        if os.path.exists(NEWS_CACHE_FILE):
            with open(NEWS_CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)

    return list(articles_dict.values())[:target_count]

async def fetch_single_conflict(client: httpx.AsyncClient, slug: str) -> dict | None:
    url = f"https://armedconflicts.org/data/{slug}.json"
    meta = config.CONFLICT_META_KO.get(slug, {'nameKo': slug, 'regionKo': '기타', 'mainTheaters': ''})
    try:
        resp = await client.get(url)
        if resp.status_code == 200:
            data = resp.json()
            locations = []
            for loc in data.get('locations', []):
                try:
                    locations.append({
                        'name': loc.get('name', ''),
                        'type': loc.get('type', 'theater'),
                        'lat': float(loc.get('lat', 0)),
                        'lon': float(loc.get('lon', 0)),
                        'description': loc.get('description', ''),
                        'control': loc.get('control', ''),
                        'asOf': loc.get('as_of', '')
                    })
                except (ValueError, TypeError):
                    continue

            raw_intensity = data.get('intensity', 'Medium')
            normalized_intensity = 'Low' if raw_intensity in ['Low', 'Elevated'] else raw_intensity

            return {
                'id': data.get('id', f'ACM-{slug}'),
                'slug': data.get('slug', slug),
                'titleEn': data.get('title', slug),
                'titleKo': meta.get('nameKo', slug),
                'status': data.get('status', 'Active'),
                'intensity': normalized_intensity,
                'rawIntensity': raw_intensity,
                'regionEn': data.get('region', 'Global'),
                'regionKo': meta.get('regionKo', '글로벌'),
                'mainTheaters': meta.get('mainTheaters', ''),
                'type': data.get('type', 'Armed Conflict'),
                'trackedSince': data.get('tracked_since', ''),
                'revision': data.get('revision', datetime.utcnow().strftime('%Y-%m-%d')),
                'sources': data.get('sources', ['ACLED', 'UCDP', 'CFR']),
                'locations': locations,
                'url': data.get('url', f'https://armedconflicts.org/{slug}.html')
            }
    except Exception as e:
        print(f'[Collector] 분쟁 [{slug}] 수집 실패: {e}')
    return None

async def fetch_conflicts_data() -> list[dict]:
    print('[Collector] Armed Conflicts 29개 분쟁 수집 중...')
    conflicts = []
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) HanwhaIntelBot/2.0'}

    async with httpx.AsyncClient(headers=headers, timeout=20.0) as client:
        tasks = [fetch_single_conflict(client, slug) for slug in config.CONFLICT_SLUGS]
        results = await asyncio.gather(*tasks)
        conflicts = [r for r in results if r is not None]

    if conflicts:
        with open(CONFLICTS_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(conflicts, f, ensure_ascii=False, indent=2)
        print(f'[Collector] 총 {len(conflicts)}개 분쟁 데이터 정규화 완료.')
    elif os.path.exists(CONFLICTS_CACHE_FILE):
        with open(CONFLICTS_CACHE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)

    return conflicts

def get_cached_news() -> list[dict]:
    if os.path.exists(NEWS_CACHE_FILE):
        with open(NEWS_CACHE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def get_cached_conflicts() -> list[dict]:
    if os.path.exists(CONFLICTS_CACHE_FILE):
        with open(CONFLICTS_CACHE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

async def refresh_all():
    news, conflicts = await asyncio.gather(
        fetch_defense_news(),
        fetch_conflicts_data()
    )
    return {
        'news': news,
        'conflicts': conflicts,
        'updatedAt': datetime.utcnow().isoformat() + 'Z'
    }
