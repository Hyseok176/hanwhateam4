import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0B0F17',
          color: '#E2E8F0',
          fontFamily: 'Pretendard, -apple-system, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#131C2E',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#F1F5F9' }}>
              화면을 표시하는 중 일시적인 오류가 발생했습니다
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '24px' }}>
              지정학적 리스크 데이터 및 지도를 불러오는 과정에서 경합이 발생했을 수 있습니다. 아래 버튼을 눌러 다시 시도해 주세요.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0284C7, #2563EB)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              대시보드 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
