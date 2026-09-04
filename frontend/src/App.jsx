import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ViewNav from './components/ViewNav';
import RiskMap from './components/RiskMap';
import MatchingMatrix from './components/MatchingMatrix';
import NewsFeed from './components/NewsFeed';
import PortfolioSpectrum from './components/PortfolioSpectrum';
import ReportModal from './components/ReportModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [currentView, setCurrentView] = useState('map');
  const [status, setStatus] = useState({});
  const [matching, setMatching] = useState([]);
  const [news, setNews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Saved Settings
  const savedProvider = localStorage.getItem('ai_provider');
  const [settings, setSettings] = useState({
    provider: 'openai',
    apiKey: localStorage.getItem('ai_api_key') || '',
    model: localStorage.getItem('ai_model') || 'gpt-4o',
    syncInterval: Number(localStorage.getItem('ai_sync_interval') || '0')
  });

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
    loadData();
  }, []);

  // 자동 동기화 타이머
  useEffect(() => {
    if (settings.syncInterval > 0) {
      const interval = setInterval(() => {
        handleSync(false);
      }, settings.syncInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [settings.syncInterval]);

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

  // AI 전략 보고서 모달 열기
  const handleOpenReport = async (overrideModel) => {
    setIsReportOpen(true);
    setIsReportLoading(true);
    const targetModel = overrideModel || settings.model || 'gpt-4o';
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, model: targetModel })
      });
      const data = await res.json();
      if (data.success) {
        setReportData(data.report);
      }
    } catch (err) {
      console.error('보고서 생성 실패:', err);
    } finally {
      setIsReportLoading(false);
    }
  };

  // 보고서 모달 내부에서 모델 직접 변경 시
  const handleModelChangeFromReport = (newModel) => {
    const updated = { ...settings, model: newModel };
    setSettings(updated);
    localStorage.setItem('ai_model', newModel);
    handleOpenReport(newModel);
  };

  // 설정 저장
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ai_provider', newSettings.provider);
    localStorage.setItem('ai_api_key', newSettings.apiKey);
    localStorage.setItem('ai_model', newSettings.model || 'gpt-4o');
    localStorage.setItem('ai_sync_interval', String(newSettings.syncInterval));
    alert('⚙️ 설정이 저장되었습니다.');
  };

  // 매트릭스에서 선택 후 지도 탭으로 전환
  const handleSelectConflictAndNavigate = (conflict) => {
    setSelectedConflict(conflict);
    setCurrentView('map');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        status={status}
        isSyncing={isSyncing}
        onSync={() => handleSync(true)}
        onOpenReport={handleOpenReport}
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

      {/* AI Strategic Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={reportData}
        isLoading={isReportLoading}
        currentModel={settings.model || 'gpt-4o'}
        onSelectModel={handleModelChangeFromReport}
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
