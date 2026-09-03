import React, { useState } from 'react';
import { Crosshair, FilterX } from 'lucide-react';

export default function MatchingMatrix({ matching, onSelectConflictAndNavigate }) {
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [weaponFilter, setWeaponFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  let filtered = matching;

  if (regionFilter !== 'ALL') {
    filtered = filtered.filter(m => m.regionKo.includes(regionFilter));
  }

  if (weaponFilter !== 'ALL') {
    filtered = filtered.filter(m => m.matchedWeapons.some(w => w.nameKo.includes(weaponFilter)));
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(m =>
      m.titleKo.toLowerCase().includes(q) ||
      m.titleEn.toLowerCase().includes(q) ||
      m.mainTheaters.toLowerCase().includes(q) ||
      m.matchedWeapons.some(w => w.nameKo.toLowerCase().includes(q))
    );
  }

  return (
    <div className="view-panel">
      <div className="section-header-bar">
        <div>
          <h2 className="section-heading">
            <Crosshair className="text-orange" size={22} /> 글로벌 분쟁별 한화 방산 소요 무기 매칭 매트릭스
          </h2>
          <p className="section-desc">
            전 세계 29개 분쟁지의 전장 환경·위협 요인과 한화 방산 핵심 포트폴리오를 AI 상관관계 매칭한 결과입니다.
          </p>
        </div>

        <div className="matrix-filter-bar">
          <select
            className="form-select"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="ALL">모든 권역 전체</option>
            <option value="동유럽">동유럽</option>
            <option value="중동">중동/홍해</option>
            <option value="동아시아">동아시아</option>
            <option value="동남아시아">동남아시아</option>
            <option value="서남아시아">남아시아/서남아</option>
            <option value="아프리카">아프리카</option>
            <option value="남미">중남미</option>
          </select>

          <select
            className="form-select"
            value={weaponFilter}
            onChange={(e) => setWeaponFilter(e.target.value)}
          >
            <option value="ALL">모든 무기 체계</option>
            <option value="K9">K9 자주포 / K10</option>
            <option value="천무">천무 다련장로켓</option>
            <option value="천궁">천궁-II / L-SAM 방공</option>
            <option value="레드백">레드백 / 장갑차</option>
            <option value="레이저">레이저 대공무기 / 안티드론</option>
            <option value="해양">함정 / 잠수함 / 해양전투</option>
            <option value="위성">SAR 위성 / 통신 / C4I</option>
          </select>

          <input
            type="text"
            className="form-input"
            placeholder="분쟁지명, 위협, 무기 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="matching-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FilterX size={40} style={{ marginBottom: '1rem' }} />
            <p>조건에 부합하는 분쟁 및 무기 매칭 데이터가 없습니다.</p>
          </div>
        ) : (
          filtered.map(item => {
            const isHigh = item.intensity === 'High';
            const isMed = item.intensity === 'Medium';
            const cardClass = isHigh ? 'card-high' : isMed ? 'card-med' : 'card-low';
            const griColor = isHigh ? 'var(--alert-red)' : isMed ? 'var(--alert-amber)' : 'var(--radar-cyan)';

            return (
              <div className={`matrix-card ${cardClass}`} key={item.conflictId}>
                <div className="mc-header">
                  <div>
                    <div className="mc-region">{item.regionKo} • {item.intensity}</div>
                    <h3 className="mc-title">{item.titleKo}</h3>
                  </div>
                  <div className="mc-gri-badge">
                    <div className="mc-gri-val" style={{ color: griColor }}>{item.griScore}</div>
                    <div className="mc-gri-lbl">GRI SCORE</div>
                  </div>
                </div>

                <p className="mc-summary">{item.strategicSummary}</p>

                <div className="mc-weapons-section">
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                    추천 소요 무기 ({item.matchedWeapons.length}종)
                  </div>
                  {item.matchedWeapons.slice(0, 3).map(w => (
                    <div className="mc-weapon-item" key={w.weaponId}>
                      <div>
                        <div className="mc-w-name">{w.nameKo.split(' ')[0]}</div>
                        <div className="mc-w-cat">{w.category}</div>
                      </div>
                      <div className="mc-w-match">{w.matchScore}% 적합</div>
                    </div>
                  ))}
                </div>

                <div className="mc-footer">
                  <span>연관 기사 {item.matchedNewsCount}건 • 전선 거점 {item.locations?.length || 0}개소</span>
                  <button
                    className="btn-card-action"
                    onClick={() => onSelectConflictAndNavigate(item)}
                  >
                    <Crosshair size={13} /> 지도에서 분석
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
