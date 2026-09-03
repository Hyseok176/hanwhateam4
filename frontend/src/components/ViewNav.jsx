import React from 'react';
import { Globe, Layers, Rss, ShieldCheck } from 'lucide-react';

export default function ViewNav({ currentView, onViewChange, lastSyncedAt }) {
  const syncDate = lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString('ko-KR') : '확인 중...';

  return (
    <nav className="view-nav-bar">
      <div className="nav-tabs">
        <button
          className={`nav-tab ${currentView === 'map' ? 'active' : ''}`}
          onClick={() => onViewChange('map')}
        >
          <Globe size={16} /> 지정학적 리스크 맵
        </button>
        <button
          className={`nav-tab ${currentView === 'matching' ? 'active' : ''}`}
          onClick={() => onViewChange('matching')}
        >
          <Layers size={16} /> 소요 무기 매칭 매트릭스
        </button>
        <button
          className={`nav-tab ${currentView === 'news' ? 'active' : ''}`}
          onClick={() => onViewChange('news')}
        >
          <Rss size={16} /> 실시간 방산 뉴스 피드
        </button>
        <button
          className={`nav-tab ${currentView === 'portfolio' ? 'active' : ''}`}
          onClick={() => onViewChange('portfolio')}
        >
          <ShieldCheck size={16} /> 한화 무기체계 스펙트럼
        </button>
      </div>

      <div className="nav-extra-info">
        <span className="pulse-indicator"></span>
        <span>최근 동기화: {syncDate}</span>
      </div>
    </nav>
  );
}
