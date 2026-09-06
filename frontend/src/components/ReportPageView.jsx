import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Copy, Printer, RefreshCw,
  Crosshair, ShieldCheck, ExternalLink, AlertTriangle
} from 'lucide-react';
import ReportDocument from './ReportDocument';

/**
 * AI 전략 보고서 전용 전체화면 독립 페이지 뷰
 * 브라우저 새 탭(/report)에서 열람되며, 탭 분할 없이 전문(Full text)이 연속 출력됩니다.
 */
export default function ReportPageView({ onBack }) {
  const contentRef = useRef(null);
  const [report, setReport] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_strategic_report');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // 저장된 설정 로드
  const apiKey = localStorage.getItem('ai_api_key') || '';
  const provider = localStorage.getItem('ai_provider') || 'openai';
  const model = localStorage.getItem('ai_model') || 'gpt-5.4';

  // 보고서 가져오기 또는 새로 분석
  const fetchReport = async (forceRefresh = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider,
          apiKey: apiKey,
          model: model,
          syncInterval: 0,
          forceRefresh: forceRefresh
        })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
        try {
          localStorage.setItem('cached_strategic_report', JSON.stringify(data.report));
        } catch (e) {
          console.warn('로컬 캐싱 실패:', e);
        }
      } else {
        setErrorMessage(data.detail || '보고서를 생성하거나 불러오는 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setErrorMessage(`서버 통신 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 마운트 시 캐시가 없으면 1회 로드 (캐시가 있으면 즉시 렌더링되어 토큰 소모 없음)
  useEffect(() => {
    if (!report) {
      fetchReport(false);
    }
  }, []);

  // 전문 클립보드 복사
  const handleCopy = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText);
      alert('📋 한화 방산 미래전략실 공식 전략 보고서 전문이 클립보드에 복사되었습니다.');
    }
  };

  // A4 인쇄 / PDF 저장
  const handlePrint = () => {
    window.print();
  };

  // 대시보드로 복귀 또는 창 닫기
  const handleNavigateBack = () => {
    if (window.opener && !window.opener.closed) {
      // 새 탭으로 열렸던 경우 창 닫기 시도
      window.close();
    } else if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="report-page-layout">
      {/* 1. 상단 플로팅 네비게이션 툴바 (인쇄 시 숨김) */}
      <header className="report-page-topbar no-print">
        <div className="report-page-topbar-left">
          <button
            className="btn btn-sm btn-ghost report-back-btn"
            onClick={handleNavigateBack}
            title="메인 대시보드로 돌아가기"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <ArrowLeft size={16} /> <span>대시보드로 이동</span>
          </button>
          
          <div className="topbar-divider" />

          <div className="report-page-brand">
            <div className="report-page-logo-icon">
              <Crosshair size={18} />
            </div>
            <div className="report-page-brand-text">
              <div className="brand-sub">HANWHA DEFENSE FUTURE STRATEGY OFFICE</div>
              <div className="brand-main">글로벌 지정학 리스크 & 소요 무기 매칭 전략 보고서 (전문)</div>
            </div>
          </div>
        </div>

        <div className="report-page-topbar-right">

          <button
            className="btn btn-sm btn-primary"
            onClick={() => fetchReport(true)}
            disabled={isLoading}
            title="최신 방산 뉴스 및 분쟁 데이터를 바탕으로 보고서를 새로 분석합니다"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isLoading ? 'fa-spin' : ''} />
            <span>{isLoading ? '분석 중...' : '최신 데이터로 새로 분석'}</span>
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={handleCopy}
            disabled={!report || isLoading}
            title="보고서 전문을 클립보드에 복사합니다"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Copy size={14} /> <span>전문 복사</span>
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={handlePrint}
            disabled={!report || isLoading}
            title="A4 규격으로 인쇄하거나 PDF로 저장합니다"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> <span>인쇄 / PDF</span>
          </button>
        </div>
      </header>

      {/* 2. 메인 보고서 문서 영역 */}
      <main className="report-page-main">
        <div className="report-page-container">
          {isLoading ? (
            <div className="report-page-loading-card">
              <div className="fa-spin" style={{ display: 'inline-block', marginBottom: '1.25rem', color: 'var(--brand-orange)' }}>
                <Crosshair size={46} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
                전략 인텔리전스 시스템으로 보고서 전문을 분석·편철하고 있습니다...
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
                글로벌 29개 분쟁 전구와 실시간 데일리방산 뉴스 타임라인, 한화 3사(에어로스페이스·시스템·오션) 무기체계 스펙을 종합 매칭 중입니다.
              </p>
            </div>
          ) : errorMessage ? (
            <div className="report-page-error-card">
              <p style={{ fontSize: '1rem', color: 'var(--alert-red)', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <AlertTriangle size={18} /> 보고서 데이터를 불러오지 못했습니다.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {errorMessage}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => fetchReport(true)}
                style={{ padding: '0.6rem 1.4rem', fontWeight: 700 }}
              >
                🔄 다시 시도하기
              </button>
            </div>
          ) : report ? (
            <ReportDocument report={report} contentRef={contentRef} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
