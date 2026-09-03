import React, { useState } from 'react';
import { Newspaper, Search, PieChart, Target, User, Clock, ExternalLink } from 'lucide-react';

const TAG_LIST = [
  'ALL',
  '자주포/화력',
  '유도무기/미사일',
  '기동/장갑차',
  '방공/요격',
  '드론/대드론',
  '해양/함정',
  '우주/통신/레이더',
  '방산수출/비즈니스',
  '글로벌안보'
];

export default function NewsFeed({ news }) {
  const [activeTag, setActiveTag] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  let filtered = news;
  if (activeTag !== 'ALL') {
    filtered = filtered.filter(n => n.tags.includes(activeTag));
  }
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      (n.author || '').toLowerCase().includes(q)
    );
  }

  // 통계 계산
  const tagCounts = {};
  news.forEach(n => {
    n.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const total = news.length || 1;

  return (
    <div className="view-panel">
      <div className="section-header-bar">
        <div>
          <h2 className="section-heading">
            <Newspaper className="text-cyan" size={22} /> 데일리방산 실시간 뉴스 인텔리전스
          </h2>
          <p className="section-desc">
            데일리방산 공식 RSS 피드(최신 50건)를 실시간 수집하고, 주요 무기체계 및 글로벌 분쟁 태그를 자동 분석합니다.
          </p>
        </div>

        <div className="news-filter-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', width: '280px' }}
              placeholder="기사 제목, 내용, 키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tag Buttons */}
      <div className="news-tag-bar">
        {TAG_LIST.map(tag => (
          <button
            key={tag}
            className={`tag-filter-btn ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag === 'ALL' ? '전체 뉴스' : tag}
          </button>
        ))}
      </div>

      <div className="news-list-layout">
        <div className="news-cards-stream">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <Newspaper size={40} style={{ marginBottom: '1rem' }} />
              <p>검색 조건에 일치하는 방산 뉴스가 없습니다.</p>
            </div>
          ) : (
            filtered.map(item => (
              <article 
                className="news-card-row" 
                key={item.id}
                onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <div className="nc-head">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="nc-title"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.title}
                  </a>
                  <div className="nc-tags">
                    {item.tags.map(t => (
                      <span className="news-tag-badge" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <p className="nc-desc">{item.description}</p>
                <div className="nc-meta" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} /> {item.author || '데일리방산'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {item.pubDate}
                    </span>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    onClick={(e) => e.stopPropagation()}
                    title="원문 기사 새 탭으로 열기"
                    style={{ 
                      color: 'var(--brand-orange)', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.78rem', 
                      fontWeight: 600, 
                      textDecoration: 'none',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 102, 0, 0.08)'
                    }}
                  >
                    <ExternalLink size={13} /> 원문 기사 보기
                  </a>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Sidebar Analytics */}
        <aside className="news-side-analytics">
          <div className="side-card">
            <h3 className="side-card-title">
              <PieChart size={16} className="text-orange" /> 방산 뉴스 토픽 점유율
            </h3>
            <div>
              {sortedTags.map(([tag, count]) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <div className="topic-bar-row" key={tag}>
                    <div className="tb-meta">
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tag}</span>
                      <span style={{ color: 'var(--radar-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {count}건 ({pct}%)
                      </span>
                    </div>
                    <div className="tb-track">
                      <div className="tb-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="side-card">
            <h3 className="side-card-title">
              <Target size={16} className="text-cyan" /> 한화 전략실 핵심 모니터링 키워드
            </h3>
            <div className="keyword-cloud">
              <span className="kw-tag">#공동생산(MOU)</span>
              <span className="kw-tag">#K9자주포_현지화</span>
              <span className="kw-tag">#천궁II_중동수주</span>
              <span className="kw-tag">#안티드론_레이저</span>
              <span className="kw-tag">#CTM290_폴란드</span>
              <span className="kw-tag">#미국_방산공급망</span>
              <span className="kw-tag">#호주_레드백</span>
              <span className="kw-tag">#소형SAR위성</span>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
