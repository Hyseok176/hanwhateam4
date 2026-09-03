import React from 'react';
import { Crosshair, Satellite, AlertTriangle, Newspaper, Shield, Settings, RefreshCw, FileText } from 'lucide-react';

export default function Header({ status, isSyncing, onSync, onOpenReport, onOpenSettings }) {
  return (
    <header className="cmd-header">
      <div className="header-left">
        <div className="brand-badge">
          <div className="brand-logo-symbol">
            <Crosshair size={24} />
          </div>
          <div className="brand-title-wrap">
            <div className="brand-sub">HANWHA DEFENSE FUTURE STRATEGY OFFICE</div>
            <h1 className="brand-title">글로벌 지정학 리스크 & 소요 무기 매칭 인텔리전스</h1>
          </div>
        </div>
      </div>

      {/* Telemetry KPIs */}
      <div className="header-kpis">
        <div className="kpi-item">
          <span className="kpi-label"><Satellite size={12} /> 감시 분쟁지</span>
          <span className="kpi-val">{status.conflictsCount || 29}개국</span>
        </div>
        <div className="kpi-item alert-kpi">
          <span className="kpi-label"><AlertTriangle size={12} /> 고위험(High)</span>
          <span className="kpi-val text-red">{status.highRiskCount || '--'}개 권역</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label"><Newspaper size={12} /> 방산 뉴스 피드</span>
          <span className="kpi-val text-cyan">{status.newsCount || '--'}건</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label"><Shield size={12} /> 한화 포트폴리오</span>
          <span className="kpi-val text-orange">10개 체계</span>
        </div>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <button className="btn btn-outline" onClick={onOpenSettings} title="AI / LLM 설정">
          <Settings size={15} /> <span>AI 설정</span>
        </button>
        <button className="btn btn-outline" onClick={onSync} disabled={isSyncing} title="최신 뉴스 및 분쟁 데이터 수집">
          <RefreshCw size={15} className={isSyncing ? 'fa-spin' : ''} />
          <span>{isSyncing ? '동기화 중...' : '실시간 동기화'}</span>
        </button>
        <button className="btn btn-primary" onClick={onOpenReport} title="경영진 보고용 AI 브리핑 리포트">
          <FileText size={15} /> <span>AI 전략 보고서</span>
        </button>
      </div>
    </header>
  );
}
