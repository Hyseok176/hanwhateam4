import React, { useRef } from 'react';
import { Copy, Printer, X, Brain, ListChecks, Globe, Shield, Sparkles, Activity, Crosshair, Compass, AlertTriangle, Thermometer, Cpu } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, report, isLoading, currentModel, onSelectModel }) {
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

  const PRESET_MODELS = ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1-mini', 'gpt-3.5-turbo'];
  const activeModelName = report?.telemetry?.model || currentModel || 'gpt-4o';
  const isCustomModel = activeModelName && !PRESET_MODELS.includes(activeModelName);

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
              <p>선택된 AI 모델({activeModelName})로 지정학적 리스크 지수 및 최신 방산 뉴스를 결합하여 전략 분석을 생성하고 있습니다...</p>
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

              {/* AI Engine & Token Telemetry Bar with Model Switcher */}
              {report.telemetry && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  background: report.telemetry.totalTokens > 0 ? 'rgba(4, 192, 158, 0.06)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${report.telemetry.totalTokens > 0 ? 'rgba(4, 192, 158, 0.25)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.85rem 1.15rem',
                  marginBottom: '1.5rem',
                  color: 'var(--text-secondary)'
                }}>
                  {/* Top row: Model selector & Live badge */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <Sparkles size={15} className="text-orange" />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>AI 엔진: {report.telemetry.provider || 'OpenAI'}</span>
                      
                      {/* Model Selector Pill */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '3px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
                        <Cpu size={13} className="text-cyan" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>적용 모델:</span>
                        <select
                          value={report.telemetry.model || activeModelName}
                          onChange={(e) => onSelectModel && onSelectModel(e.target.value)}
                          disabled={isLoading}
                          style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: 'var(--brand-orange)',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)'
                          }}
                          title="다른 모델을 선택하시면 해당 모델로 보고서를 즉시 전환 생성합니다"
                        >
                          <option value="gpt-4o">gpt-4o (플래그십 심층 안보 분석)</option>
                          <option value="gpt-4o-mini">gpt-4o-mini (경량 고속 분석)</option>
                          <option value="o3-mini">o3-mini (차세대 고급 추론 분석)</option>
                          <option value="o1-mini">o1-mini (심층 논리 추론 분석)</option>
                          <option value="gpt-3.5-turbo">gpt-3.5-turbo (기본 호환 모드)</option>
                          {isCustomModel && (
                            <option value={activeModelName}>{activeModelName} (사용자 설정 모델)</option>
                          )}
                        </select>
                      </div>

                      {report.telemetry.totalTokens > 0 ? (
                        <span style={{ color: 'var(--alert-green)', fontWeight: 700, fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          ● 실시간 AI 심층 추론 완료
                        </span>
                      ) : (
                        <span style={{ color: 'var(--brand-orange)', fontWeight: 600, fontSize: '0.74rem' }}>
                          ● OpenAI API 키 대기 중 (기초 데이터 요약)
                        </span>
                      )}
                    </div>

                    {report.telemetry.totalTokens > 0 && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                        <span>입력: <strong style={{ color: 'var(--text-primary)' }}>{report.telemetry.promptTokens?.toLocaleString()}</strong> 토큰</span>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <span>출력: <strong style={{ color: 'var(--text-primary)' }}>{report.telemetry.outputTokens?.toLocaleString()}</strong> 토큰</span>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <span style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>총 {report.telemetry.totalTokens?.toLocaleString()} 토큰</span>
                        {report.telemetry.latencyMs && (
                          <span style={{ color: 'var(--text-muted)' }}>({report.telemetry.latencyMs}ms)</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom hint if no tokens */}
                  {report.telemetry.totalTokens === 0 && (
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                      <span>상단 [⚙️ AI 설정]에서 OpenAI API Key를 등록하시면 선택하신 <strong style={{ color: 'var(--brand-orange)' }}>{report.telemetry.model || activeModelName}</strong> 모델의 실시간 심층 추론이 실행됩니다.</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>💡 셀렉트 박스에서 다른 모델을 선택하여 즉시 전환할 수 있습니다.</span>
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

              {/* 2-1. Key Theaters Tactical Doctrine & Field Operational Guidelines */}
              <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  color: 'var(--brand-orange)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '0.85rem'
                }}>
                  <Crosshair size={16} /> 전구별 심층 전술 교리 · 운용 방식 및 야전 환경 극복 지침
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {report.keyTheaters?.map((t, idx) => (
                    <div
                      key={idx}
                      className="theater-doctrine-card"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderLeft: `4px solid ${t.intensity === 'High' ? 'var(--alert-red)' : t.intensity === 'Medium' ? 'var(--alert-amber)' : 'var(--radar-cyan)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '1.1rem 1.25rem',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.6rem',
                        marginBottom: '0.85rem',
                        paddingBottom: '0.65rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {t.theater}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--brand-orange)', fontWeight: 600 }}>
                            ({t.region})
                          </span>
                          <span className={`score-badge ${t.intensity === 'High' ? 'badge-high' : t.intensity === 'Medium' ? 'badge-med' : 'badge-low'}`} style={{ fontSize: '0.7rem' }}>
                            GRI {t.griScore} • {t.intensity}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {(Array.isArray(t.matchedHanwhaSolution) ? t.matchedHanwhaSolution : [t.matchedHanwhaSolution]).map((sol, sIdx) => (
                            <span key={sIdx} style={{
                              background: 'rgba(0, 240, 255, 0.08)',
                              border: '1px solid rgba(0, 240, 255, 0.25)',
                              color: 'var(--radar-cyan)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}>
                              {sol}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* 1. Operational Doctrine */}
                        {t.operationalDoctrine && (
                          <div style={{
                            background: 'rgba(255, 102, 0, 0.04)',
                            border: '1px solid rgba(255, 102, 0, 0.18)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem 0.9rem'
                          }}>
                            <div style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'var(--brand-orange)',
                              marginBottom: '0.35rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <Compass size={14} /> 🎯 실전 운용 방식 및 전술 교리 (Operational Doctrine)
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
                              {t.operationalDoctrine}
                            </p>
                          </div>
                        )}

                        {/* 2. Field Advisories & Cautions */}
                        {t.operationalCautions && (
                          <div style={{
                            background: 'rgba(255, 179, 0, 0.04)',
                            border: '1px solid rgba(255, 179, 0, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem 0.9rem'
                          }}>
                            <div style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#ffb300',
                              marginBottom: '0.35rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <AlertTriangle size={14} /> ⚠️ 야전 운용상 주의사항 및 환경 극복 가이드 (Field Advisories & Maintenance)
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                              {t.operationalCautions}
                            </p>
                          </div>
                        )}

                        {/* 3. Environmental Fit Analysis */}
                        {t.environmentalFitAnalysis && (
                          <div style={{
                            background: 'rgba(0, 240, 255, 0.04)',
                            border: '1px solid rgba(0, 240, 255, 0.18)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem 0.9rem'
                          }}>
                            <div style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'var(--radar-cyan)',
                              marginBottom: '0.35rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <Thermometer size={14} /> 🌡️ 군용 규격(보증 기온 -40~+50°C / 허용 습도 95% RH) 대비 전장 적합도 분석
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                              {t.environmentalFitAnalysis}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
