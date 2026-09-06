import React, { useState, useEffect } from 'react';
import { Settings, X, Check, AlertCircle, Loader2, Shield } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [syncInterval, setSyncInterval] = useState(settings.syncInterval || 0);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey || '');
      setProvider('openai');
      setSyncInterval(settings.syncInterval || 0);
      setTestResult(null);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'API 인증 키를 먼저 입력해 주세요.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey: apiKey.trim() })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, message: `연결 테스트 실패: ${err.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      provider: 'openai',
      apiKey: apiKey.trim(),
      model: 'gpt-5.4',
      syncInterval: Number(syncInterval)
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings className="text-orange" size={20} /> 분석 엔진 및 시스템 설정
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Dedicated Engine Info Card (No Dropdown) */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} className="text-orange" />
                <span>전략 분석 엔진 모델</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                전용 전략 분석 모델을 통해 심층 인텔리전스 보고서를 도출합니다.
              </div>
            </div>
            <span style={{
              background: 'rgba(243, 115, 33, 0.12)',
              border: '1px solid rgba(243, 115, 33, 0.35)',
              color: 'var(--brand-orange)',
              fontSize: '0.76rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 'var(--radius-sm)',
              whiteSpace: 'nowrap'
            }}>
              OpenAI GPT-5.4
            </span>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">엔진 인증 키 (API Key)</label>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                {isTesting ? <Loader2 size={12} className="fa-spin" /> : <Check size={12} className="text-orange" />}
                {isTesting ? '테스트 중...' : '연결 테스트'}
              </button>
            </div>
                <input
                  type="password"
                  className="form-input"
                  style={{ width: '100%', marginTop: '0.3rem' }}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setTestResult(null);
                  }}
                />
                <small className="form-hint">API 키는 브라우저 로컬 스토리지에 안전하게 보관됩니다.</small>

                {/* Test Result Message */}
                {testResult && (
                  <div style={{
                    marginTop: '0.65rem',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    lineHeight: 1.45,
                    background: testResult.success ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 68, 68, 0.08)',
                    border: `1px solid ${testResult.success ? 'var(--radar-cyan)' : 'var(--risk-high)'}`,
                    color: testResult.success ? 'var(--text-primary)' : '#ff6b6b',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    {testResult.success ? (
                      <Check size={14} className="text-cyan" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{testResult.message}</div>
                      {testResult.success && (
                        <div style={{ color: 'var(--radar-cyan)', marginTop: '0.2rem', fontSize: '0.72rem' }}>
                          인텔리전스 전략 분석 엔진과의 정상 통신이 확인되었습니다.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

          <div className="form-group">
            <label className="form-label">자동 동기화 주기</label>
            <select
              className="form-select"
              value={syncInterval}
              onChange={(e) => setSyncInterval(Number(e.target.value))}
              style={{ width: '100%' }}
            >
              <option value={0}>수동 동기화만 사용</option>
              <option value={30}>30분마다 자동 갱신</option>
              <option value={60}>1시간마다 자동 갱신</option>
            </select>
          </div>

          <div className="modal-footer-btns">
            <button className="btn btn-primary" onClick={handleSave}>
              설정 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
