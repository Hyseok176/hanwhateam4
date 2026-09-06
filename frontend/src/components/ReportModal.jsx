import React, { useRef, useState } from 'react';
import {
  Copy, Printer, X, Brain, ListChecks, Globe, Shield, Sparkles, Activity,
  Crosshair, Compass, AlertTriangle, Thermometer, Cpu, Clock, ExternalLink,
  FileText, Landmark, Building2, CheckCircle2, ChevronRight, Layers, ShieldCheck
} from 'lucide-react';

export default function ReportModal({ isOpen, onClose, report, isLoading, currentModel, onSelectModel }) {
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState('1pager'); // '1pager' | 'theaters' | 'all'

  if (!isOpen) return null;

  const handleCopy = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText);
      alert('📋 미래전략실 공식 전략 보고서 전문이 클립보드에 복사되었습니다.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const PRESET_MODELS = ['gpt-5.4', 'gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1-mini', 'gpt-3.5-turbo'];
  const activeModelName = report?.telemetry?.model || currentModel || 'gpt-5.4';
  const isCustomModel = activeModelName && !PRESET_MODELS.includes(activeModelName);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="report-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={13} className="text-orange" />
              <span>HANWHA DEFENSE STRATEGIC INTELLIGENCE</span>
            </div>
            <h2 className="modal-title">글로벌 안보 리스크 & 소요 무기 매칭 전략 보고서</h2>
          </div>

          <div className="modal-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        <div className="modal-body report-paper" ref={contentRef}>
          {isLoading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div className="fa-spin" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--brand-orange)' }}>
                <Brain size={42} />
              </div>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                전략 인텔리전스 엔진으로 실시간 안보 데이터 및 방산 전략 보고서를 생성하고 있습니다...
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                데일리방산 뉴스 타임라인과 한화 3사 주요 무기체계 스펙을 종합 분석 중입니다.
              </p>
            </div>
          ) : !report ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <p style={{ fontSize: '0.92rem', color: 'var(--alert-red)', fontWeight: 700, marginBottom: '0.6rem' }}>
                ⚠️ 보고서 데이터를 불러오지 못했습니다.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                일시적인 네트워크 지연이거나 서버 준비 중일 수 있습니다. 아래 버튼을 눌러 다시 시도해 주세요.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onSelectModel && onSelectModel(activeModelName)}
                style={{ padding: '0.5rem 1.2rem', fontWeight: 700 }}
              >
                🔄 다시 생성하기
              </button>
            </div>
          ) : (
            <>
              {/* Strategic Report Document Header */}
              <div className="report-doc-official-header" style={{
                borderBottom: '2px solid var(--brand-orange)',
                paddingBottom: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h1 className="report-doc-title" style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
                      {report.title || '한화 방산 글로벌 안보 리스크 & 소요 무기 매칭 전략 보고서'}
                    </h1>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>분석 대상: 글로벌 29개 분쟁 전구 및 실시간 방산 데이터</span>
                      <span style={{ color: 'var(--border-subtle)' }}>•</span>
                      <span>연계 체계: 한화 3사(에어로스페이스·시스템·오션) 포트폴리오</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      발행일: {report.displayDate || new Date().toLocaleDateString('ko-KR')}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      분석 모델: <strong style={{ color: 'var(--brand-orange)' }}>{report.telemetry?.model || activeModelName || 'GPT-5.4'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Engine & Telemetry Bar */}
              {report.telemetry && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                  background: report.telemetry.totalTokens > 0 ? 'rgba(4, 192, 158, 0.05)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${report.telemetry.totalTokens > 0 ? 'rgba(4, 192, 158, 0.22)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <Sparkles size={14} className="text-orange" />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem' }}>
                        분석 엔진:
                      </span>
                      
                      {/* Model Selector Pill */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#FFFFFF', padding: '2px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
                        <Cpu size={12} className="text-cyan" />
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>모델:</span>
                        <select
                          value={report.telemetry.model || activeModelName}
                          onChange={(e) => onSelectModel && onSelectModel(e.target.value)}
                          disabled={isLoading}
                          style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: 'var(--brand-orange)',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)'
                          }}
                        >
                          <option value="gpt-5.4">gpt-5.4</option>
                          <option value="gpt-4o">gpt-4o</option>
                          <option value="gpt-4o-mini">gpt-4o-mini</option>
                          <option value="o3-mini">o3-mini</option>
                          {isCustomModel && (
                            <option value={activeModelName}>{activeModelName}</option>
                          )}
                        </select>
                      </div>

                      {report.telemetry.totalTokens > 0 ? (
                        <span style={{ color: 'var(--alert-green)', fontWeight: 600, fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          ● 실시간 AI 분석 완료
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.74rem' }}>
                          ● 정규 분석 데이터
                        </span>
                      )}
                    </div>

                    {report.telemetry.totalTokens > 0 && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem' }}>
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
                </div>
              )}

              {/* 2-Track View Tab Switcher (Screen only) */}
              <div className="report-track-nav no-print" style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '1.5rem',
                padding: '4px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === '1pager' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('1pager')}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700,
                    padding: '0.55rem 0.8rem'
                  }}
                >
                  <FileText size={14} /> 1. 경영진 1-Page 브리핑 (Executive Cockpit)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'theaters' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('theaters')}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700,
                    padding: '0.55rem 0.8rem'
                  }}
                >
                  <Clock size={14} /> 2. 전구별 심층 인텔리전스 & 전황 타임라인
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('all')}
                  style={{
                    flex: '0 0 auto',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    padding: '0.55rem 1rem'
                  }}
                >
                  <Layers size={14} /> 전체 전문
                </button>
              </div>

              {/* ========================================================= */}
              {/* TRACK 1: 경영진 1-Page Executive Cockpit                 */}
              {/* ========================================================= */}
              {(activeTab === '1pager' || activeTab === 'all') && (
                <div className="track-1pager-container" style={{ marginBottom: '2.5rem' }}>
                  
                  {/* 1-1. Macro Key Takeaways */}
                  <div style={{
                    background: 'rgba(243, 115, 33, 0.04)',
                    border: '1px solid rgba(243, 115, 33, 0.2)',
                    borderLeft: '4px solid var(--brand-orange)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.1rem 1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    <h3 style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: 'var(--brand-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      margin: '0 0 0.5rem 0'
                    }}>
                      <Globe size={16} /> 미래전략실 거시 총평 (Executive Strategic Takeaway)
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
                      {report.executive1Pager?.macroTakeaway || report.executiveSummary?.[0]}
                    </p>
                  </div>

                  {/* 1-2. Top 3 Urgent Theaters & Flash Triggers */}
                  {report.executive1Pager?.urgentTheaters && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '0.75rem'
                      }}>
                        <AlertTriangle size={16} className="text-red" /> 3대 긴급 감시 전구 및 속보 전황 (Top 3 Flash Triggers)
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                        {report.executive1Pager.urgentTheaters.map((ut, idx) => (
                          <div key={idx} style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            borderTop: '3px solid var(--alert-red)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.9rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{ut.theater}</strong>
                              <span className="score-badge badge-high" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                GRI {ut.griScore} • {ut.urgency}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                              <strong style={{ color: 'var(--text-primary)' }}>⚡ 전황 급변 요인:</strong> {ut.flashTrigger}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--radar-cyan)', fontWeight: 600 }}>
                              🎯 추천: {ut.hanwhaSolution}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--brand-orange)', background: 'rgba(243, 115, 33, 0.06)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-xs)' }}>
                              <strong>즉시 과제:</strong> {ut.immediateAction}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-3. Affiliate Action Matrix (Hanwha 3-Company Synergy) */}
                  {report.executive1Pager?.affiliateActionMatrix && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '0.75rem'
                      }}>
                        <Building2 size={16} className="text-orange" /> 한화 방산 3사 즉시 추진 과제 & 수주 파이프라인 임팩트
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
                        {report.executive1Pager.affiliateActionMatrix.map((aff, idx) => (
                          <div key={idx} style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.55rem',
                            boxShadow: 'var(--shadow-sm)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                              <strong style={{ fontSize: '0.94rem', color: 'var(--brand-orange)' }}>{aff.affiliate}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{aff.focusPillar}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                              <strong style={{ color: 'var(--text-primary)' }}>주요 추진 과제:</strong> {aff.keyInitiative}
                            </div>
                            <div style={{
                              marginTop: 'auto',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'var(--radar-cyan)',
                              background: 'rgba(0, 240, 255, 0.05)',
                              border: '1px solid rgba(0, 240, 255, 0.18)',
                              padding: '0.45rem 0.65rem',
                              borderRadius: 'var(--radius-xs)'
                            }}>
                              💰 파이프라인 목표: {aff.pipelineEstimate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-4. Export Financing (ECA) Strategy Card */}
                  {report.executive1Pager?.exportFinancingECA && (
                    <div style={{
                      background: 'rgba(0, 240, 255, 0.04)',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem',
                      marginBottom: '1.25rem'
                    }}>
                      <h4 style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: 'var(--radar-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        margin: '0 0 0.45rem 0'
                      }}>
                        <Landmark size={15} /> 🏛️ 한국수출입은행(KEXIM)·무역보험공사(K-SURE) 수출금융(ECA) 및 G2G 협력 전략
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
                        {report.executive1Pager.exportFinancingECA}
                      </p>
                    </div>
                  )}

                  {/* 1-5. Executive Summary Bullet Points */}
                  {report.executiveSummary && (
                    <div style={{ marginTop: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ListChecks size={15} /> 경영진 핵심 브리핑 전문
                      </h4>
                      <ul className="report-exec-list" style={{ margin: 0 }}>
                        {report.executiveSummary.map((item, idx) => (
                          <li key={idx} style={{ fontSize: '0.83rem', lineHeight: 1.65 }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Page break marker for Print/PDF */}
              {activeTab === 'all' && <div className="page-break" style={{ height: '1px', margin: '2rem 0', borderBottom: '2px dashed var(--border-subtle)' }} />}

              {/* ========================================================= */}
              {/* TRACK 2: 전구별 심층 인텔리전스 & 전황 타임라인              */}
              {/* ========================================================= */}
              {(activeTab === 'theaters' || activeTab === 'all') && (
                <div className="track-theaters-container" style={{ marginBottom: '2.5rem' }}>
                  
                  {/* Summary Theaters Table */}
                  <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Globe size={18} /> 중점 감시 전구 종합 현황 & 소요 솔루션
                  </h2>

                  <table className="report-theaters-table" style={{ marginBottom: '2rem' }}>
                    <thead>
                      <tr>
                        <th>분쟁 전구</th>
                        <th>GRI 위험도</th>
                        <th>전황 모멘텀</th>
                        <th>한화 추천 솔루션</th>
                        <th>전략적 시사점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.keyTheaters?.map((t, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>{t.theater}</strong>
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
                          <td style={{ fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {t.riskMomentum || (t.intensity === 'High' ? '전황 격화' : '지속 대치')}
                          </td>
                          <td>
                            <span style={{ color: 'var(--radar-cyan)', fontWeight: 600, fontSize: '0.82rem' }}>
                              {Array.isArray(t.matchedHanwhaSolution) ? t.matchedHanwhaSolution.join(', ') : t.matchedHanwhaSolution}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{t.strategicImplication}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Detailed Per-Theater Cards with Real News Timeline & Doctrines */}
                  <h3 style={{
                    fontSize: '0.98rem',
                    color: 'var(--brand-orange)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    marginBottom: '1rem'
                  }}>
                    <Crosshair size={18} /> 전구별 심층 전술 교리 · 실시간 전황 타임라인 및 야전 환경 극복 가이드
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {report.keyTheaters?.map((t, idx) => (
                      <div
                        key={idx}
                        className="theater-doctrine-card"
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderLeft: `4px solid ${t.intensity === 'High' ? 'var(--alert-red)' : t.intensity === 'Medium' ? 'var(--alert-amber)' : 'var(--radar-cyan)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '1.15rem 1.35rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {/* Header bar of Theater Card */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.6rem',
                          marginBottom: '0.85rem',
                          paddingBottom: '0.65rem',
                          borderBottom: '1px solid var(--border-subtle)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {t.theater}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--brand-orange)', fontWeight: 600 }}>
                              ({t.region})
                            </span>
                            <span className={`score-badge ${t.intensity === 'High' ? 'badge-high' : t.intensity === 'Medium' ? 'badge-med' : 'badge-low'}`} style={{ fontSize: '0.7rem' }}>
                              GRI {t.griScore} • {t.intensity}
                            </span>
                            {t.riskMomentum && (
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-pill)',
                                background: 'rgba(255, 68, 68, 0.08)',
                                border: '1px solid rgba(255, 68, 68, 0.25)',
                                color: 'var(--alert-red)',
                                fontWeight: 700
                              }}>
                                📈 {t.riskMomentum}
                              </span>
                            )}
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

                        {/* Verified MIL-SPEC Tag */}
                        {t.verifiedSpecs && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(4, 192, 158, 0.08)',
                            border: '1px solid rgba(4, 192, 158, 0.25)',
                            padding: '3px 9px',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.74rem',
                            color: 'var(--alert-green)',
                            fontWeight: 600,
                            marginBottom: '0.85rem'
                          }}>
                            <CheckCircle2 size={13} /> 공식 검증 군용 규격: {t.verifiedSpecs}
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          
                          {/* 1. Real News Chronological Timeline Feed (Zero Hallucination with Links) */}
                          {t.recentTimeline && t.recentTimeline.length > 0 && (
                            <div style={{
                              background: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.85rem 1rem'
                            }}>
                              <div style={{
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                marginBottom: '0.65rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <Clock size={14} className="text-orange" /> ⚡ 실제 수집된 최근 전황 변동 타임라인 (Ground Truth Links)
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {t.recentTimeline.map((item, tlIdx) => (
                                  <div key={tlIdx} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    fontSize: '0.78rem',
                                    borderLeft: '2px solid var(--brand-orange)',
                                    paddingLeft: '8px'
                                  }}>
                                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', flexShrink: 0, marginTop: '2px' }}>
                                      {item.date}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        <span style={{
                                          background: 'var(--bg-surface-elevated)',
                                          border: '1px solid var(--border-medium)',
                                          color: 'var(--brand-orange)',
                                          padding: '1px 5px',
                                          borderRadius: 'var(--radius-xs)',
                                          fontSize: '0.68rem',
                                          fontWeight: 700
                                        }}>
                                          {item.sourceId}
                                        </span>
                                        {item.link ? (
                                          <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                              color: 'var(--text-primary)',
                                              fontWeight: 700,
                                              textDecoration: 'none',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '3px'
                                            }}
                                            className="timeline-article-link"
                                            title="데일리방산 실제 원문 기사 열기"
                                          >
                                            {item.headline} <ExternalLink size={11} className="text-orange" />
                                          </a>
                                        ) : (
                                          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                                            {item.headline}
                                          </span>
                                        )}
                                      </div>
                                      {item.tacticalImpact && (
                                        <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.75rem' }}>
                                          ↳ <strong style={{ color: 'var(--radar-cyan)' }}>전술적 함의:</strong> {item.tacticalImpact}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 2. Operational Doctrine */}
                          {t.operationalDoctrine && (
                            <div style={{
                              background: 'rgba(255, 102, 0, 0.04)',
                              border: '1px solid rgba(255, 102, 0, 0.18)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.75rem 0.95rem'
                            }}>
                              <div style={{
                                fontSize: '0.78rem',
                                fontWeight: 800,
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

                          {/* 3. Field Advisories & Cautions */}
                          {t.operationalCautions && (
                            <div style={{
                              background: 'rgba(255, 179, 0, 0.04)',
                              border: '1px solid rgba(255, 179, 0, 0.2)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.75rem 0.95rem'
                            }}>
                              <div style={{
                                fontSize: '0.78rem',
                                fontWeight: 800,
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

                          {/* 4. Environmental Fit Analysis */}
                          {t.environmentalFitAnalysis && (
                            <div style={{
                              background: 'rgba(0, 240, 255, 0.04)',
                              border: '1px solid rgba(0, 240, 255, 0.18)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.75rem 0.95rem'
                            }}>
                              <div style={{
                                fontSize: '0.78rem',
                                fontWeight: 800,
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
              )}

              {/* ========================================================= */}
              {/* Overarching 4 Strategic Pillars                           */}
              {/* ========================================================= */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Shield size={18} /> 3. 한화 방산 부문 4대 전략적 실행 제언
                </h2>
                <div className="report-pillars-grid">
                  {report.strategicRecommendations?.map((r, idx) => (
                    <div className="pillar-card" key={idx} style={{ padding: '1.1rem' }}>
                      <div className="pillar-title" style={{ fontSize: '0.88rem', fontWeight: 800 }}>🎯 {r.pillar}</div>
                      <div className="pillar-action" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{r.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
