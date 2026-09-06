import React, { useRef } from 'react';
import {
  Copy, Printer, X, Crosshair, ShieldCheck, RefreshCw, AlertTriangle
} from 'lucide-react';
import ReportDocument from './ReportDocument';

export default function ReportModal({ isOpen, onClose, report, isLoading, currentModel, onSelectModel, onRegenerate }) {
  const contentRef = useRef(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText);
      alert('미래전략실 공식 전략 보고서 전문이 클립보드에 복사되었습니다.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeModelName = 'gpt-5.4';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="report-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={13} className="text-orange" />
              <span>HANWHA DEFENSE STRATEGIC INTELLIGENCE</span>
            </div>
            <h2 className="modal-title">글로벌 안보 리스크 & 소요 무기 매칭 전략 보고서 (전문)</h2>
          </div>

          <div className="modal-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {report?.telemetry && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)'
              }}>
                <span>입력: <strong style={{ color: 'var(--text-primary)' }}>{(report.telemetry.promptTokens || 0).toLocaleString()}</strong></span>
                <span style={{ color: 'var(--border-subtle)' }}>/</span>
                <span>출력: <strong style={{ color: 'var(--brand-orange)' }}>{(report.telemetry.outputTokens || 0).toLocaleString()}</strong></span>
              </div>
            )}
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onRegenerate && onRegenerate(activeModelName)}
              disabled={isLoading}
              title="최신 기사 및 분쟁 데이터를 바탕으로 보고서를 새로 분석합니다"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <RefreshCw size={13} className={isLoading ? 'fa-spin' : ''} />
              <span>{isLoading ? '분석 중...' : '새로 분석'}</span>
            </button>
            <button className="btn btn-sm btn-outline" onClick={handleCopy} title="보고서 전문 클립보드 복사">
              <Copy size={13} /> 복사
            </button>
            <button className="btn btn-sm btn-outline" onClick={handlePrint} title="A4 규격 인쇄 및 PDF 저장">
              <Printer size={13} /> 인쇄/PDF
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', maxHeight: '82vh', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div className="fa-spin" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--brand-orange)' }}>
                <Crosshair size={36} />
              </div>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                전략 인텔리전스 시스템으로 실시간 안보 데이터 및 방산 전략 보고서를 편철하고 있습니다...
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                데일리방산 뉴스 타임라인과 한화 3사 주요 무기체계 스펙을 종합 분석 중입니다.
              </p>
            </div>
          ) : !report ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <p style={{ fontSize: '0.92rem', color: 'var(--alert-red)', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <AlertTriangle size={16} /> 보고서 데이터를 불러오지 못했습니다.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                일시적인 네트워크 지연이거나 서버 준비 중일 수 있습니다. 아래 버튼을 눌러 다시 시도해 주세요.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onSelectModel && onSelectModel(activeModelName)}
                style={{ padding: '0.5rem 1.2rem', fontWeight: 700 }}
              >
                다시 생성하기
              </button>
            </div>
          ) : (
            <>
              {report?.telemetry && (report.telemetry.promptTokens < 13000 || report.telemetry.outputTokens < 3500) && (
                <div style={{
                  background: 'rgba(237, 109, 0, 0.08)',
                  border: '1px solid rgba(237, 109, 0, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1.1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--brand-orange)', flexShrink: 0 }} />
                    <span>
                      <strong>안내:</strong> 브라우저에 캐시된 이전 보고서(입력 {(report.telemetry.promptTokens || 0).toLocaleString()} / 출력 {(report.telemetry.outputTokens || 0).toLocaleString()} 토큰)입니다.
                      신규 <strong>1.8만 토큰급 심층 그라운딩 엔진</strong>으로 생성하려면 새로 분석을 실행하세요.
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onRegenerate && onRegenerate(activeModelName)}
                    disabled={isLoading}
                    style={{ whiteSpace: 'nowrap', fontWeight: 700, padding: '0.35rem 0.85rem' }}
                  >
                    최신 심층 분석
                  </button>
                </div>
              )}
              <ReportDocument report={report} contentRef={contentRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
