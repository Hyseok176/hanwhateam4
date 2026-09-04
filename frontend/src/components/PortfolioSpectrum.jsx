import React, { useState } from 'react';
import { ShieldCheck, Search, Crosshair, Globe, Building2 } from 'lucide-react';

const CATEGORY_TABS = [
  'ALL',
  '화력/기동',
  '정밀유도',
  '방공/요격',
  '해양/함정',
  '항공/센서',
  '우주/무인'
];

export default function PortfolioSpectrum({ portfolio }) {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  let filtered = portfolio;
  if (selectedCat !== 'ALL') {
    if (selectedCat === '화력/기동') {
      filtered = filtered.filter(p => p.category.includes('화력') || p.category.includes('기동'));
    } else if (selectedCat === '정밀유도') {
      filtered = filtered.filter(p => p.category.includes('정밀유도'));
    } else if (selectedCat === '방공/요격') {
      filtered = filtered.filter(p => p.category.includes('방공') || p.category.includes('드론'));
    } else if (selectedCat === '해양/함정') {
      filtered = filtered.filter(p => p.category.includes('해양'));
    } else if (selectedCat === '항공/센서') {
      filtered = filtered.filter(p => p.category.includes('항공'));
    } else if (selectedCat === '우주/무인') {
      filtered = filtered.filter(p => p.category.includes('우주') || p.category.includes('무인'));
    }
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(p =>
      p.nameKo.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.keywords?.some(k => k.toLowerCase().includes(q))
    );
  }

  return (
    <div className="view-panel">
      {/* Header & Search Bar */}
      <div className="portfolio-header-wrap">
        <div>
          <h2 className="section-heading">
            <ShieldCheck className="text-orange" size={22} /> 한화 방산 육·해·공·우주 18대 핵심 무기체계 스펙트럼
          </h2>
          <p className="section-desc">
            한화에어로스페이스 · 한화시스템 · 한화오션 3사의 글로벌 수출 주력 체계 및 전장 소요 매칭 포트폴리오
          </p>
        </div>

        <div className="portfolio-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="portfolio-search-input"
            placeholder="무기체계명, 제조사, 키워드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="portfolio-tag-bar">
        {CATEGORY_TABS.map(tab => {
          let count = portfolio.length;
          if (tab === '화력/기동') count = portfolio.filter(p => p.category.includes('화력') || p.category.includes('기동')).length;
          else if (tab === '정밀유도') count = portfolio.filter(p => p.category.includes('정밀유도')).length;
          else if (tab === '방공/요격') count = portfolio.filter(p => p.category.includes('방공') || p.category.includes('드론')).length;
          else if (tab === '해양/함정') count = portfolio.filter(p => p.category.includes('해양')).length;
          else if (tab === '항공/센서') count = portfolio.filter(p => p.category.includes('항공')).length;
          else if (tab === '우주/무인') count = portfolio.filter(p => p.category.includes('우주') || p.category.includes('무인')).length;

          return (
            <button
              key={tab}
              className={`portfolio-tag-btn ${selectedCat === tab ? 'active' : ''}`}
              onClick={() => setSelectedCat(tab)}
            >
              <span>{tab === 'ALL' ? '전체' : tab}</span>
              <span style={{ 
                background: selectedCat === tab ? 'var(--brand-orange)' : 'rgba(255,255,255,0.08)',
                color: selectedCat === tab ? '#fff' : 'var(--text-muted)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3.5rem 1.5rem',
          background: 'var(--bg-surface)',
          border: '1px dashed var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>검색 결과가 없습니다.</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>'{searchTerm}'에 일치하는 무기체계 또는 키워드가 없습니다. 다른 검색어를 입력해 보세요.</p>
        </div>
      ) : (
        <div className="portfolio-grid">
          {filtered.map(p => {
            const companyColor = p.company.includes('한화오션') 
              ? 'var(--radar-cyan)' 
              : p.company.includes('한화시스템') 
                ? '#38BDF8' 
                : 'var(--brand-orange)';

            return (
              <div className="portfolio-card" key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div className="pc-category">{p.category}</div>
                  <span style={{ fontSize: '0.72rem', color: companyColor, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Building2 size={11} /> {p.company}
                  </span>
                </div>

                <h3 className="pc-title">{p.nameKo}</h3>

                {(p.caliber || p.range || p.specs) && (
                  <div style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.72rem', 
                    color: 'var(--radar-cyan)', 
                    fontWeight: 600,
                    background: 'rgba(0, 240, 255, 0.05)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                    marginBottom: '0.6rem'
                  }}>
                    {p.caliber || p.range || p.specs}
                  </div>
                )}

                <p className="pc-desc">{p.description}</p>

                {/* Military Environmental Operational Specs */}
                {p.operatingSpecs && (
                  <div className="pc-operating-specs" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem 0.75rem',
                    marginBottom: '0.75rem',
                    fontSize: '0.73rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                      <span>🌡️ <strong>운용온도:</strong> {p.operatingSpecs.tempRange}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{p.operatingSpecs.standard?.split('/')[0]}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: 1.4 }}>
                      🛡️ <strong>방호/밀폐:</strong> {p.operatingSpecs.protection}
                    </div>
                    {p.operatingSpecs.countermeasurePackage && (
                      <div style={{ color: 'var(--brand-orange)', fontSize: '0.7rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>🛠️ <strong>대응 킷:</strong> {p.operatingSpecs.countermeasurePackage}</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Crosshair size={11} className="text-cyan" /> 소요 대응 전장 시나리오
                </div>
                <div className="pc-scenarios">
                  {p.threatScenarios.map(s => (
                    <span className="scenario-pill" key={s}>{s}</span>
                  ))}
                </div>

                {p.targetRegions && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <Globe size={12} className="text-orange" />
                    <span>주요 타깃 권역:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.targetRegions.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
