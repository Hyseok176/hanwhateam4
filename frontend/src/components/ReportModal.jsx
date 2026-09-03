import React, { useRef } from 'react';
import { Copy, Printer, X, Brain, ListChecks, Globe, Shield, Sparkles, Activity } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, report, isLoading }) {
  const contentRef = useRef(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText);
      alert('📋 전략 보고서 전문이 클립보드에 복사되었습니다.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="report-badge">
              <Brain size={13} style={{ display: 'inline', marginRight: '4px' }} /> EXECUTIVE STRATEGIC BRIEFING
            </div>
            <h2 className="modal-title">한화 방산 미래전략실 전략 인텔리전스 보고서</h2>
          </div>

          <div className="modal-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-sm btn-outline" onClick={handleCopy}>
              <Copy size={13} /> 복사
            </button>
            <button className="btn btn-sm btn-outline" onClick={handlePrint}>
              <Printer size={13} /> 인쇄/PDF
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body report-paper" ref={contentRef}>
          {isLoading || !report ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div className="fa-spin" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--brand-orange)' }}>
                <Brain size={42} />
              </div>
              <p>지정학적 리스크 지수 및 최신 방산 뉴스를 결합하여 AI 전략 분석을 생성하고 있습니다...</p>
            </div>
          ) : (
            <>
              <div className="report-header-meta">
                <div>
                  <div className="report-badge">CONFIDENTIAL / STRATEGY INTELLIGENCE</div>
                  <h1 className="report-doc-title">{report.title}</h1>
                </div>
                <div className="report-doc-date">{report.displayDate || new Date().toLocaleDateString('ko-KR')}</div>
              </div>

              {/* AI Engine & Token Telemetry Bar */}
              {report.telemetry && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                  background: 'rgba(255, 102, 0, 0.05)',
                  border: '1px solid rgba(255, 102, 0, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.78rem',
                  marginBottom: '1.25rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} className="text-orange" />
                    <span>분석 엔진: <strong style={{ color: 'var(--text-primary)' }}>{report.telemetry.provider}</strong></span>
                    <span className="score-badge badge-low" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                      {report.telemetry.model}
                    </span>
                    {report.telemetry.isFallback && (
                      <span style={{ color: '#ffb300', marginLeft: '4px', fontSize: '0.7rem' }}>
                        (API 연결 지연으로 내장 엔진 분석 적용됨)
                      </span>
                    )}
                  </div>

                  {report.telemetry.totalTokens > 0 ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      <span>입력: <strong style={{ color: 'var(--text-primary)' }}>{report.telemetry.promptTokens?.toLocaleString()}</strong> 토큰</span>
                      <span style={{ color: 'var(--border-subtle)' }}>|</span>
                      <span>출력: <strong style={{ color: 'var(--text-primary)' }}>{report.telemetry.outputTokens?.toLocaleString()}</strong> 토큰</span>
                      <span style={{ color: 'var(--border-subtle)' }}>|</span>
                      <span style={{ color: 'var(--radar-cyan)', fontWeight: 700 }}>총 {report.telemetry.totalTokens?.toLocaleString()} 토큰</span>
                      {report.telemetry.latencyMs && (
                        <span style={{ color: 'var(--text-muted)' }}>({report.telemetry.latencyMs}ms)</span>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      내장 지정학적 리스크 지수(GRI) 및 매칭 휴리스틱 추론 완료
                    </div>
                  )}
                </div>
              )}

              {/* 1. Executive Summary */}
              <h2 className="report-sec-heading">
                <ListChecks size={18} /> 1. 미래전략실 경영진 핵심 요약 (Executive Summary)
              </h2>
              <ul className="report-exec-list">
                {report.executiveSummary?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              {/* 2. Key Theaters */}
              <h2 className="report-sec-heading">
                <Globe size={18} /> 2. 중점 감시 고위험 분쟁지 & 소요 무기 매칭 현황
              </h2>
              <table className="report-theaters-table">
                <thead>
                  <tr>
                    <th>분쟁 권역</th>
                    <th>GRI 위험도</th>
                    <th>한화 추천 솔루션</th>
                    <th>전략적 시사점</th>
                  </tr>
                </thead>
                <tbody>
                  {report.keyTheaters?.map((t, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.theater}</strong>
                        <br />
                        <span style={{ color: 'var(--brand-orange)', fontSize: '0.72rem', fontWeight: 600 }}>{t.region}</span>
                      </td>
                      <td className="col-gri">
                        <div className="report-gri-tag-wrap">
                          <span className={`report-gri-tag ${t.intensity === 'High' ? 'tag-high' : t.intensity === 'Medium' ? 'tag-med' : 'tag-low'}`}>
                            <span className="gri-val">{t.griScore}</span>
                            <span className="gri-sep">•</span>
                            <span className="gri-txt">{t.intensity}</span>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--radar-cyan)', fontWeight: 600 }}>
                          {Array.isArray(t.matchedHanwhaSolution) ? t.matchedHanwhaSolution.join(', ') : t.matchedHanwhaSolution}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{t.strategicImplication}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 3. Strategic Pillars */}
              <h2 className="report-sec-heading">
                <Shield size={18} /> 3. 한화 방산 부문 4대 전략적 실행 제언
              </h2>
              <div className="report-pillars-grid">
                {report.strategicRecommendations?.map((r, idx) => (
                  <div className="pillar-card" key={idx}>
                    <div className="pillar-title">🎯 {r.pillar}</div>
                    <div className="pillar-action">{r.action}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
