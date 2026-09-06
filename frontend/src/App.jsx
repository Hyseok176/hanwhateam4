import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ViewNav from './components/ViewNav';
import RiskMap from './components/RiskMap';
import MatchingMatrix from './components/MatchingMatrix';
import NewsFeed from './components/NewsFeed';
import PortfolioSpectrum from './components/PortfolioSpectrum';
import ReportModal from './components/ReportModal';
import ReportPageView from './components/ReportPageView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  // 라우트 상태 감지 (/report 또는 ?view=report)
  const [isReportRoute, setIsReportRoute] = useState(() => {
    return window.location.pathname === '/report' || window.location.search.includes('view=report');
  });

  const [currentView, setCurrentView] = useState('map');
  const [status, setStatus] = useState({});
  const [matching, setMatching] = useState([]);
  const [news, setNews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [focusConflict, setFocusConflict] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_strategic_report');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Saved Settings
  const savedProvider = localStorage.getItem('ai_provider');
  const [settings, setSettings] = useState({
    provider: 'openai',
    apiKey: localStorage.getItem('ai_api_key') || '',
    model: localStorage.getItem('ai_model') || 'gpt-5.4',
    syncInterval: Number(localStorage.getItem('ai_sync_interval') || '0')
  });

  // 브라우저 뒤로가기 / 앞으로가기 라우팅 처리
  useEffect(() => {
    const handlePopState = () => {
      const isRep = window.location.pathname === '/report' || window.location.search.includes('view=report');
      setIsReportRoute(isRep);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 데이터 로드
  const loadData = async () => {
    try {
      const [statusRes, matchingRes, newsRes, portfolioRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/matching'),
        fetch('/api/news'),
        fetch('/api/portfolio')
      ]);

      const statusJson = await statusRes.json();
      const matchingJson = await matchingRes.json();
      const newsJson = await newsRes.json();
      const portfolioJson = await portfolioRes.json();

      setStatus(statusJson);
      setMatching(matchingJson);
      setNews(newsJson);
      setPortfolio(portfolioJson);

      // 기본 선택 분쟁 (첫 번째 고위험 분쟁)
      if (!selectedConflict && matchingJson.length > 0) {
        const topHigh = matchingJson.find(m => m.intensity === 'High') || matchingJson[0];
        setSelectedConflict(topHigh);
      }
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    }
  };

  useEffect(() => {
    if (!isReportRoute) {
      loadData();
    }
  }, [isReportRoute]);

  // 자동 동기화 타이머
  useEffect(() => {
    if (!isReportRoute && settings.syncInterval > 0) {
      const interval = setInterval(() => {
        handleSync(false);
      }, settings.syncInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isReportRoute, settings.syncInterval]);

  // 실시간 동기화
  const handleSync = async (manual = true) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadData();
        if (manual) {
          alert('✅ 최신 방산 뉴스(데일리방산) 및 글로벌 29개 분쟁 데이터가 성공적으로 동기화되었습니다.');
        }
      }
    } catch (err) {
      console.error('동기화 실패:', err);
      if (manual) alert('동기화 중 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
    }
  };

  // AI 전략 보고서 새 창으로 열기 (사용자 요청: 새 페이지를 열게 하면서 뜨도록)
  const handleOpenReportInNewTab = () => {
    const newWindow = window.open('/report', '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // 팝업이 차단된 환경의 경우 동일 창 라우트로 안전하게 전환
      window.history.pushState({}, '', '/report');
      setIsReportRoute(true);
    }
  };

  // AI 전략 보고서 생성 (실제 API 호출 및 캐싱)
  const generateReport = async (overrideModel, forceRefresh = true) => {
    setIsReportLoading(true);
    const targetModel = (typeof overrideModel === 'string' && overrideModel.trim())
      ? overrideModel.trim()
      : (settings.model || 'gpt-5.4');
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.provider || 'openai',
          apiKey: settings.apiKey || '',
          model: targetModel,
          syncInterval: Number(settings.syncInterval || 0),
          forceRefresh: forceRefresh
        })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReportData(data.report);
        try {
          localStorage.setItem('cached_strategic_report', JSON.stringify(data.report));
        } catch (e) {
          console.warn('보고서 로컬 캐싱 실패:', e);
        }
      } else {
        console.error('보고서 생성 실패:', data);
        alert(`보고서 생성 중 문제가 발생했습니다: ${data.detail || '잠시 후 다시 시도해 주세요.'}`);
      }
    } catch (err) {
      console.error('보고서 통신 실패:', err);
      alert(`서버 연결 실패: ${err.message}`);
    } finally {
      setIsReportLoading(false);
    }
  };

  // 보고서 새로 분석 (모달용)
  const handleRegenerateReport = (modelToUse) => {
    generateReport(modelToUse || settings.model || 'gpt-5.4', true);
  };

  // 보고서 모달 내부에서 모델 직접 변경 시
  const handleModelChangeFromReport = (newModel) => {
    const updated = { ...settings, model: newModel };
    setSettings(updated);
    localStorage.setItem('ai_model', newModel);
    generateReport(newModel, true);
  };

  // 설정 저장
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ai_provider', newSettings.provider);
    localStorage.setItem('ai_api_key', newSettings.apiKey);
    localStorage.setItem('ai_model', newSettings.model || 'gpt-5.4');
    localStorage.setItem('ai_sync_interval', String(newSettings.syncInterval));
    alert('시스템 설정이 정상적으로 저장되었습니다.');
  };

  // 매트릭스에서 선택 후 지도 탭으로 전환 (해당 분쟁 지역으로 포커스 줌인)
  const handleSelectConflictAndNavigate = (conflict) => {
    setSelectedConflict(conflict);
    setFocusConflict(conflict);
    setCurrentView('map');
  };

  // 대시보드로 복귀 핸들러
  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/');
    setIsReportRoute(false);
  };

  // 1. /report 경로일 경우 전용 전체화면 보고서 페이지 렌더링
  if (isReportRoute) {
    return <ReportPageView onBack={handleBackToDashboard} />;
  }

  // 2. 메인 대시보드 렌더링
  return (
    <div className="app-container">
      {/* Header */}
      <Header
        status={status}
        isSyncing={isSyncing}
        onSync={() => handleSync(true)}
        onOpenReport={handleOpenReportInNewTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Navigation Tabs */}
      <ViewNav
        currentView={currentView}
        onViewChange={setCurrentView}
        lastSyncedAt={status.lastSyncedAt}
      />

      {/* Main Content */}
      <main className="main-container">
        {currentView === 'map' && (
          <RiskMap
            conflicts={matching}
            selectedConflict={selectedConflict}
            onSelectConflict={setSelectedConflict}
            focusConflict={focusConflict}
            onFocusConsumed={() => setFocusConflict(null)}
          />
        )}

        {currentView === 'matching' && (
          <MatchingMatrix
            matching={matching}
            onSelectConflictAndNavigate={handleSelectConflictAndNavigate}
          />
        )}

        {currentView === 'news' && (
          <NewsFeed news={news} />
        )}

        {currentView === 'portfolio' && (
          <PortfolioSpectrum portfolio={portfolio} />
        )}
      </main>

      {/* AI Strategic Report Modal (기존 모달 호환) */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={reportData}
        isLoading={isReportLoading}
        currentModel={settings.model || 'gpt-5.4'}
        onSelectModel={handleModelChangeFromReport}
        onRegenerate={handleRegenerateReport}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
