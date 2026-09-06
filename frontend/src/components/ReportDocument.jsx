import React from 'react';
import {
  ListChecks, Globe, Shield,
  Crosshair, Compass, AlertTriangle, Thermometer, Clock, ExternalLink,
  FileText, Building2, ShieldCheck
} from 'lucide-react';

/**
 * 전략 보고서 전문(Full Document) 렌더링 컴포넌트
 * - 정통 국방 안보 전략 인텔리전스 양식
 * - 제 1 장부터 제 6 장까지 정연한 6단계 전략 위계로 구성
 */
export default function ReportDocument({ report, contentRef }) {
  if (!report) return null;

  return (
    <div className="report-paper report-doc-full" ref={contentRef}>
      {/* 1. Official Strategic Report Document Header */}
      <div className="report-doc-official-header" style={{
        borderBottom: '2px solid var(--brand-orange)',
        paddingBottom: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="report-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '0.4rem' }}>
              <ShieldCheck size={13} className="text-orange" />
              <span>HANWHA DEFENSE STRATEGIC INTELLIGENCE REPORT</span>
            </div>
            <h1 className="report-doc-title" style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {report.title || '글로벌 안보 리스크 & 소요 무기 매칭 전략 보고서 (전문)'}
            </h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>분석 대상: 글로벌 29개 분쟁 전구 및 실시간 방산 데이터</span>
              <span style={{ color: 'var(--border-subtle)' }}>•</span>
              <span>연계 체계: 한화 3사(에어로스페이스·시스템·오션) 포트폴리오</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: '150px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              기준일: {report.displayDate || new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      </div>

      {/* 전략 분석 엔진 검증 제원 및 토큰 모니터링 바 */}
      {report.telemetry && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 1.15rem',
          marginBottom: '1.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Shield size={14} className="text-orange" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>전략 분석 엔진 검증 제원:</span>
            <span style={{
              background: 'rgba(237, 109, 0, 0.1)',
              color: 'var(--brand-orange)',
              border: '1px solid rgba(237, 109, 0, 0.25)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 700,
              fontSize: '0.72rem',
              whiteSpace: 'nowrap'
            }}>
              {report.telemetry.model ? `한화 미래전략 엔진 (${report.telemetry.model})` : '한화 미래전략 전용 엔진'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-mono)', flexWrap: 'nowrap', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <span style={{ whiteSpace: 'nowrap' }}>입력 토큰: <strong style={{ color: 'var(--text-primary)' }}>{(report.telemetry.promptTokens || 0).toLocaleString()}</strong></span>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <span style={{ whiteSpace: 'nowrap' }}>출력 토큰: <strong style={{ color: 'var(--brand-orange)' }}>{(report.telemetry.outputTokens || 0).toLocaleString()}</strong></span>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <span style={{ whiteSpace: 'nowrap' }}>총 토큰: <strong style={{ color: 'var(--radar-cyan)' }}>{(report.telemetry.totalTokens || ((report.telemetry.promptTokens || 0) + (report.telemetry.outputTokens || 0))).toLocaleString()}</strong></span>
            {report.telemetry.latencyMs > 0 && (
              <>
                <span style={{ color: 'var(--border-subtle)' }}>|</span>
                <span style={{ whiteSpace: 'nowrap' }}>처리 지연: <strong style={{ color: 'var(--text-secondary)' }}>{report.telemetry.latencyMs.toLocaleString()}ms</strong></span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 제 1 장: 경영진 거시 총평 및 총괄 요약                     */}
      {/* ========================================================= */}
      <section className="report-doc-section" style={{ marginBottom: '2.5rem' }}>
        <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} className="text-orange" /> 제 1 장: 경영진 거시 총평 및 총괄 브리핑 (Executive Summary)
        </h2>

        {/* Macro Key Takeaway Box */}
        <div style={{
          background: 'rgba(243, 115, 33, 0.04)',
          border: '1px solid rgba(243, 115, 33, 0.22)',
          borderLeft: '4px solid var(--brand-orange)',
          borderRadius: 'var(--radius-md)',
          padding: '1.15rem 1.35rem',
          marginBottom: '1.25rem'
        }}>
          <h3 style={{
            fontSize: '0.94rem',
            fontWeight: 800,
            color: 'var(--brand-orange)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '0 0 0.5rem 0'
          }}>
            <ShieldCheck size={16} /> 미래전략실 거시 총평 (Executive Strategic Takeaway)
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.75, margin: 0 }}>
            {report.executive1Pager?.macroTakeaway || report.executiveSummary?.[0]}
          </p>
        </div>

        {/* Executive Summary Bullet Points */}
        {report.executiveSummary && (
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ListChecks size={15} /> 핵심 브리핑 요약
            </h4>
            <ul className="report-exec-list" style={{ margin: 0 }}>
              {report.executiveSummary.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.84rem', lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 제 2 장: 3대 긴급 감시 전구 및 속보 전황                  */}
      {/* ========================================================= */}
      {report.executive1Pager?.urgentTheaters && (
        <section className="report-doc-section" style={{ marginBottom: '2.5rem' }}>
          <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} className="text-red" /> 제 2 장: 3대 긴급 감시 전구 및 속보 전황 (Top 3 Flashpoints)
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            실시간 데일리방산 속보 및 분쟁 지수(GRI)를 바탕으로 급격한 전황 악화가 관측된 최우선 감시 구역입니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {report.executive1Pager.urgentTheaters.map((ut, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderTop: '3px solid var(--alert-red)',
                borderRadius: 'var(--radius-md)',
                padding: '1.1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{ut.theater}</strong>
                  <span className="score-badge badge-high" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    GRI {ut.griScore} • {ut.urgency}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>■ 전황 급변 요인:</strong> {ut.flashTrigger}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--radar-cyan)', fontWeight: 600 }}>
                  ■ 대응 솔루션: {ut.hanwhaSolution}
                </div>
                <div style={{
                  fontSize: '0.76rem',
                  color: 'var(--brand-orange)',
                  background: 'rgba(243, 115, 33, 0.06)',
                  border: '1px solid rgba(243, 115, 33, 0.18)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  marginTop: 'auto'
                }}>
                  <strong>즉시 실행 과제:</strong> {ut.immediateAction}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 제 3 장: 한화 방산 3사 전사 실무 과제 & 수주 파이프라인    */}
      {/* ========================================================= */}
      {report.executive1Pager?.affiliateActionMatrix && (
        <section className="report-doc-section" style={{ marginBottom: '2.5rem' }}>
          <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} className="text-orange" /> 제 3 장: 한화 방산 3사 즉시 추진 과제 & 수주 파이프라인 임팩트
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            지정학 리스크를 실제 수출 기회로 전환하기 위한 계열사별(에어로스페이스·시스템·오션) 전사 과제입니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {report.executive1Pager.affiliateActionMatrix.map((aff, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--brand-orange)' }}>{aff.affiliate}</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{aff.focusPillar}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>주요 추진 과제:</strong> {aff.keyInitiative}
                </div>
                <div style={{
                  marginTop: 'auto',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--radar-cyan)',
                  background: 'rgba(0, 240, 255, 0.05)',
                  border: '1px solid rgba(0, 240, 255, 0.18)',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-xs)'
                }}>
                  ■ 파이프라인 목표: {aff.pipelineEstimate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Page break marker for Print */}
      <div className="page-break" style={{ height: '1px', margin: '2rem 0', borderBottom: '2px dashed var(--border-subtle)' }} />

      {/* ========================================================= */}
      {/* 제 4 장: 글로벌 중점 감시 전구 종합 분석 매트릭스 (5열 테이블) */}
      {/* ========================================================= */}
      <section className="report-doc-section" style={{ marginBottom: '2.5rem' }}>
        <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} /> 제 4 장: 글로벌 중점 감시 전구 종합 분석 매트릭스 (Matching Matrix)
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          글로벌 29개 분쟁 데이터와 GRI 지수, 실시간 방산 뉴스를 교차 분석한 종합 매트릭스입니다.
        </p>

        {/* 가로 스크롤 및 열 너비 겹침 방지 최적화 래퍼 */}
        <div className="report-theaters-table-wrapper">
          <table className="report-theaters-table">
            <thead>
              <tr>
                <th className="col-theater">분쟁 전구</th>
                <th className="col-gri">GRI 위험도</th>
                <th className="col-momentum">전황 모멘텀</th>
                <th className="col-solution">한화 추천 솔루션</th>
                <th className="col-implication">전략적 시사점</th>
              </tr>
            </thead>
            <tbody>
              {report.keyTheaters?.map((t, idx) => (
                <tr key={idx}>
                  <td className="col-theater">
                    <strong className="theater-name" style={{ color: 'var(--text-primary)', fontSize: '0.86rem', display: 'block' }}>{t.theater}</strong>
                    <span className="theater-region" style={{ color: 'var(--brand-orange)', fontSize: '0.74rem', fontWeight: 600 }}>{t.region}</span>
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
                  <td className="col-momentum">
                    <span className={`report-momentum-badge ${t.intensity === 'High' ? 'momentum-high' : 'momentum-normal'}`}>
                      {t.riskMomentum || (t.intensity === 'High' ? '전황 격화' : '지속 대치')}
                    </span>
                  </td>
                  <td className="col-solution">
                    <div className="report-solution-tags-wrap">
                      {(Array.isArray(t.matchedHanwhaSolution) ? t.matchedHanwhaSolution : [t.matchedHanwhaSolution]).map((sol, sIdx) => (
                        <span key={sIdx} className="report-solution-tag">
                          {sol}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="col-implication">
                    {t.strategicImplication}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 제 5 장: 전구별 심층 안보 인텔리전스, 전황 타임라인 & 가이드 */}
      {/* ========================================================= */}
      <section className="report-doc-section" style={{ marginBottom: '2.5rem' }}>
        <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crosshair size={18} className="text-orange" /> 제 5 장: 전구별 심층 안보 인텔리전스, 전황 타임라인 & 무기체계 스펙 가이드
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          각 전구의 실제 뉴스 타임라인, 작전 교리, 환경 규격 및 야전 운용 가이드를 종합 수록하였습니다.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {report.keyTheaters?.map((t, idx) => (
            <div
              key={idx}
              className="theater-doctrine-card"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderLeft: `4px solid ${t.intensity === 'High' ? 'var(--alert-red)' : t.intensity === 'Medium' ? 'var(--alert-amber)' : 'var(--radar-cyan)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.45rem',
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
                marginBottom: '0.95rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {t.theater}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--brand-orange)', fontWeight: 600 }}>
                    ({t.region})
                  </span>
                  <span className={`score-badge ${t.intensity === 'High' ? 'badge-high' : t.intensity === 'Medium' ? 'badge-med' : 'badge-low'}`} style={{ fontSize: '0.72rem' }}>
                    GRI {t.griScore} • {t.intensity}
                  </span>
                  {t.riskMomentum && (
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'rgba(255, 68, 68, 0.08)',
                      border: '1px solid rgba(255, 68, 68, 0.25)',
                      color: 'var(--alert-red)',
                      fontWeight: 700
                    }}>
                      {t.riskMomentum}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(Array.isArray(t.matchedHanwhaSolution) ? t.matchedHanwhaSolution : [t.matchedHanwhaSolution]).map((sol, sIdx) => (
                    <span key={sIdx} style={{
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      color: 'var(--radar-cyan)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.74rem',
                      fontWeight: 600
                    }}>
                      {sol}
                    </span>
                  ))}
                </div>
              </div>

              {/* Environment Spec Tag */}
              {t.verifiedSpecs && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}>
                  <Shield size={12} className="text-orange" />
                  <span>환경 보증 스펙:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{t.verifiedSpecs}</strong>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>

                {/* 1. Real News Chronological Timeline Feed */}
                {t.recentTimeline && t.recentTimeline.length > 0 && (
                  <div style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.95rem 1.15rem'
                  }}>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Clock size={14} className="text-orange" />
                      <span>최근 전황 타임라인 (관련 방산 뉴스)</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {t.recentTimeline.map((item, tlIdx) => (
                        <div key={tlIdx} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '0.8rem',
                          borderLeft: '2px solid var(--brand-orange)',
                          paddingLeft: '10px'
                        }}>
                          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', flexShrink: 0, marginTop: '2px', minWidth: '72px' }}>
                            {item.date}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-medium)',
                                color: 'var(--brand-orange)',
                                padding: '1px 5px',
                                borderRadius: 'var(--radius-xs)',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                flexShrink: 0
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
                                    wordBreak: 'break-word',
                                    lineHeight: 1.5
                                  }}
                                  className="timeline-article-link"
                                  title="데일리방산 실제 원문 기사 열기"
                                >
                                  {item.headline} <ExternalLink size={11} className="text-orange" style={{ verticalAlign: 'middle', display: 'inline' }} />
                                </a>
                              ) : (
                                <span style={{ color: 'var(--text-primary)', fontWeight: 700, wordBreak: 'break-word' }}>
                                  {item.headline}
                                </span>
                              )}
                            </div>
                            {item.tacticalImpact && (
                              <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.76rem', lineHeight: 1.5 }}>
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
                    background: 'rgba(255, 102, 0, 0.03)',
                    border: '1px solid rgba(255, 102, 0, 0.16)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 1.05rem'
                  }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: 'var(--brand-orange)',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Compass size={14} /> 실전 운용 방식 및 전술 교리
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
                      {t.operationalDoctrine}
                    </p>
                  </div>
                )}

                {/* 3. Field Advisories & Cautions */}
                {t.operationalCautions && (
                  <div style={{
                    background: 'rgba(255, 179, 0, 0.03)',
                    border: '1px solid rgba(255, 179, 0, 0.18)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 1.05rem'
                  }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: 'var(--alert-amber)',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <AlertTriangle size={14} /> 야전 운용상 주의사항 및 환경 극복 가이드
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                      {t.operationalCautions}
                    </p>
                  </div>
                )}

                {/* 4. Environmental Fit Analysis */}
                {t.environmentalFitAnalysis && (
                  <div style={{
                    background: 'rgba(0, 240, 255, 0.03)',
                    border: '1px solid rgba(0, 240, 255, 0.16)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 1.05rem'
                  }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: 'var(--radar-cyan)',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Thermometer size={14} /> 지형 및 기후 적합도 분석 (운용 규격 대비)
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                      {t.environmentalFitAnalysis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 제 6 장: 한화 방산 3사 전략적 실행 제언                   */}
      {/* ========================================================= */}
      <section className="report-doc-section" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem', marginBottom: '2.5rem' }}>
        <h2 className="report-sec-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} className="text-orange" /> 제 6 장: 한화 방산 3사 전략적 실행 제언
        </h2>
        <div className="report-pillars-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
          {(report.strategicRecommendations || [])
            .filter(r => {
              const p = r.pillar || '';
              return !p.includes('공급망') && !p.includes('GVC') && !p.includes('금융') && !p.includes('ECA');
            })
            .map((r, idx) => (
              <div className="pillar-card" key={idx} style={{ padding: '1.35rem 1.6rem' }}>
                <div className="pillar-title" style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} className="text-orange" />
                  <span>{r.pillar}</span>
                </div>
                <div className="pillar-action" style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                  {r.action}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 8. Official Sign-off and Security Classification Footer */}
      <footer className="report-doc-official-footer" style={{
        marginTop: '3rem',
        borderTop: '2px solid var(--border-medium)',
        paddingTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '3px' }}>
            한화 방산 미래전략실 전략 인텔리전스 (Hanwha Defense Future Strategy Office)
          </div>
          <div>본 보고서는 실시간 글로벌 분쟁 데이터와 한화 방산 포트폴리오를 기반으로 작성되었습니다.</div>
        </div>
      </footer>
    </div>
  );
}
