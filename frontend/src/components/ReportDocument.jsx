import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

/**
 * 전략 보고서 전문(Full Document) 렌더링 컴포넌트
 * - 정통 국방 안보 / 한화 미래전략실 공식 전략 브리핑 양식
 * - AI 툴 느낌(네온 컬러, 반투명 상자, 특수문자 기호, 아이콘 남발)을 전면 배제한 고품격 공식 문서 서식
 */
export default function ReportDocument({ report, contentRef }) {
  if (!report) return null;

  return (
    <div className="report-paper report-doc-full" ref={contentRef}>
      {/* 1. Official Strategic Report Document Header */}
      <div className="report-doc-official-header" style={{
        borderBottom: '2.5px solid var(--brand-orange)',
        paddingBottom: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--brand-orange)',
              letterSpacing: '0.04em',
              marginBottom: '0.35rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} />
              <span>HANWHA DEFENSE STRATEGIC INTELLIGENCE REPORT</span>
            </div>
            <h1 className="report-doc-title" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.35 }}>
              {report.title || '글로벌 안보 리스크 & 소요 무기 매칭 전략 보고서 (전문)'}
            </h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>분석 대상: 글로벌 29개 분쟁 전구 및 실시간 방산 데이터</span>
              <span style={{ color: 'var(--border-subtle)' }}>|</span>
              <span>연계 체계: 한화 3사(에어로스페이스·시스템·오션) 18대 방산 포트폴리오</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: '150px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              기준일: {report.displayDate || new Date().toLocaleDateString('ko-KR')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              보안 등급: 사내 대외비 (CONFIDENTIAL)
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 제 1 장: 경영진 거시 총평 및 총괄 요약                     */}
      {/* ========================================================= */}
      <section className="report-doc-section" style={{ marginBottom: '2.5rem' }}>
        <h2 className="report-sec-heading">
          제 1 장. 경영진 거시 총평 및 총괄 브리핑 (Executive Summary)
        </h2>

        {/* Macro Key Takeaway Box */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xs)',
          padding: '1.25rem 1.45rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            color: 'var(--brand-orange)',
            marginBottom: '0.6rem',
            letterSpacing: '-0.01em'
          }}>
            [ 미래전략실 거시 총평: 글로벌 안보 지형 및 한화 방산 사업 영향도 ]
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.75, margin: 0, letterSpacing: '-0.01em' }}>
            {report.executive1Pager?.macroTakeaway || report.executiveSummary?.[0]}
          </p>
        </div>

        {/* Executive Summary Bullet Points */}
        {report.executiveSummary && (
          <div style={{ marginTop: '1.2rem' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
              핵심 브리핑 요약
            </div>
            <ul className="report-exec-list" style={{ margin: 0 }}>
              {report.executiveSummary.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.86rem', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--brand-orange)', marginRight: '8px' }}>{idx + 1}.</strong>
                  {item}
                </li>
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
          <h2 className="report-sec-heading">
            제 2 장. 3대 긴급 감시 전구 및 속보 전황 (Top 3 Flashpoints)
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.1rem' }}>
            실시간 데일리방산 속보 및 분쟁 지수(GRI)를 바탕으로 급격한 전황 악화가 관측된 최우선 감시 구역입니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            {report.executive1Pager.urgentTheaters.map((ut, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.15rem 1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.55rem' }}>
                  <span style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {idx + 1}. {ut.theater}
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(240, 68, 82, 0.1)',
                    color: 'var(--alert-red)',
                    border: '1px solid rgba(240, 68, 82, 0.3)'
                  }}>
                    GRI {ut.griScore} • {ut.urgency}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)', marginRight: '6px' }}>전황 급변 요인:</span>
                  {ut.flashTrigger}
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-orange)', marginRight: '6px' }}>대응 솔루션:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{ut.hanwhaSolution}</strong>
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  padding: '0.65rem 0.95rem',
                  borderRadius: 'var(--radius-xs)',
                  lineHeight: 1.55,
                  marginTop: '0.2rem'
                }}>
                  <strong style={{ color: 'var(--brand-orange)', marginRight: '6px' }}>즉시 실행 과제:</strong>
                  {ut.immediateAction}
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
          <h2 className="report-sec-heading">
            제 3 장. 한화 방산 3사 즉시 추진 과제 & 수주 파이프라인 임팩트
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.1rem' }}>
            지정학 리스크를 실제 수출 기회로 전환하기 위한 계열사별(에어로스페이스·시스템·오션) 전사 실무 과제입니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            {report.executive1Pager.affiliateActionMatrix.map((aff, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.15rem 1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.55rem', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {idx + 1}. <span style={{ color: 'var(--brand-orange)' }}>{aff.affiliate}</span>
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    중점 체계: {aff.focusPillar}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)', marginRight: '6px' }}>주요 추진 과제:</span>
                  {aff.keyInitiative}
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  padding: '0.65rem 0.95rem',
                  borderRadius: 'var(--radius-xs)',
                  lineHeight: 1.55,
                  marginTop: '0.2rem'
                }}>
                  <strong style={{ color: 'var(--brand-orange)', marginRight: '6px' }}>수주 파이프라인 목표:</strong>
                  <strong>{aff.pipelineEstimate}</strong>
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
        <h2 className="report-sec-heading">
          제 4 장. 글로벌 중점 감시 전구 종합 분석 매트릭스 (Matching Matrix)
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.1rem' }}>
          글로벌 29개 분쟁 데이터와 GRI 지수, 실시간 방산 뉴스를 교차 분석한 종합 매트릭스입니다.
        </p>

        <div className="report-theaters-table-wrapper">
          <table className="report-theaters-table">
            <thead>
              <tr>
                <th className="col-theater">분쟁 전구 (지역)</th>
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
                    <span className="theater-region" style={{ color: 'var(--brand-orange)', fontSize: '0.74rem', fontWeight: 600 }}>({t.region})</span>
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
                  <td className="col-implication" style={{ color: 'var(--text-primary)' }}>
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
        <h2 className="report-sec-heading">
          제 5 장. 전구별 심층 안보 인텔리전스, 전황 타임라인 & 무기체계 스펙 가이드
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          각 전구의 실제 뉴스 타임라인, 작전 교리, 환경 규격 및 야전 운용 가이드를 종합 수록하였습니다.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {report.keyTheaters?.map((t, idx) => (
            <div
              key={idx}
              className="theater-doctrine-card"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.35rem 1.55rem',
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}
            >
              {/* Header bar of Theater Card */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.6rem',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {idx + 1}. {t.theater} <span style={{ fontSize: '0.85rem', color: 'var(--brand-orange)', fontWeight: 600 }}>({t.region})</span>
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    background: t.intensity === 'High' ? 'rgba(240, 68, 82, 0.1)' : 'var(--bg-surface-elevated)',
                    color: t.intensity === 'High' ? 'var(--alert-red)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-medium)'
                  }}>
                    GRI {t.griScore} • {t.intensity}
                  </span>
                  {t.riskMomentum && (
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-secondary)',
                      fontWeight: 700
                    }}>
                      {t.riskMomentum}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(Array.isArray(t.matchedHanwhaSolution) ? t.matchedHanwhaSolution : [t.matchedHanwhaSolution]).map((sol, sIdx) => (
                    <span key={sIdx} style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {sol}
                    </span>
                  ))}
                </div>
              </div>

              {/* Environment Spec Tag */}
              {t.verifiedSpecs && (
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-xs)'
                }}>
                  <strong style={{ color: 'var(--brand-orange)', marginRight: '6px' }}>환경 보증 규격:</strong>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{t.verifiedSpecs}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* 1. Real News Chronological Timeline Feed */}
                {t.recentTimeline && t.recentTimeline.length > 0 && (
                  <div style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '1rem 1.25rem'
                  }}>
                    <div style={{
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '0.8rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '0.4rem'
                    }}>
                      최근 전황 타임라인 (관련 방산 뉴스 원문)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {t.recentTimeline.map((item, tlIdx) => (
                        <div key={tlIdx} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.82rem',
                          padding: '3px 0'
                        }}>
                          <span style={{ color: 'var(--brand-orange)', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>
                            •
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', flexShrink: 0, marginTop: '2px', minWidth: '76px' }}>
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
                                  title="원문 기사 열기"
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
                              <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.78rem', lineHeight: 1.5 }}>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: '4px' }}>전술적 함의:</span>
                                {item.tacticalImpact}
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
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.9rem 1.15rem'
                  }}>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: 'var(--brand-orange)',
                      marginBottom: '0.45rem'
                    }}>
                      실전 운용 방식 및 전술 교리
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
                      {t.operationalDoctrine}
                    </p>
                  </div>
                )}

                {/* 3. Field Advisories & Cautions */}
                {t.operationalCautions && (
                  <div style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.9rem 1.15rem'
                  }}>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '0.45rem'
                    }}>
                      야전 운용상 주의사항 및 환경 극복 가이드
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                      {t.operationalCautions}
                    </p>
                  </div>
                )}

                {/* 4. Environmental Fit Analysis */}
                {t.environmentalFitAnalysis && (
                  <div style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.9rem 1.15rem'
                  }}>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '0.45rem'
                    }}>
                      지형 및 기후 적합도 분석 (운용 규격 대비)
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
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
        <h2 className="report-sec-heading">
          제 6 장. 한화 방산 3사 전략적 실행 제언
        </h2>
        <div className="report-pillars-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
          {(report.strategicRecommendations || [])
            .filter(r => {
              const p = r.pillar || '';
              return !p.includes('공급망') && !p.includes('GVC') && !p.includes('금융') && !p.includes('ECA');
            })
            .map((r, idx) => (
              <div className="pillar-card" key={idx} style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-medium)', background: 'var(--bg-surface-elevated)' }}>
                <div className="pillar-title" style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--brand-orange)', marginRight: '8px' }}>{idx + 1}.</span>
                  <span>{r.pillar}</span>
                </div>
                <div className="pillar-action" style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                  {r.action}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Official Sign-off and Security Classification Footer */}
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
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, color: 'var(--brand-orange)' }}>
            HANWHA DEFENSE INTELLIGENCE • ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
}
