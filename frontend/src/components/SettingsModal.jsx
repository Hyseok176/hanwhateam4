import React, { useState } from 'react';
import { Settings, X, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const initialProvider = settings.provider === 'gemini' ? 'openai' : (settings.provider || 'builtin');
  const [provider, setProvider] = useState(initialProvider);
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || 'gpt-4o-mini');
  const [syncInterval, setSyncInterval] = useState(settings.syncInterval || 0);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'OpenAI API 키를 먼저 입력해 주세요.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim(), model })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, message: `통신 오류: ${err.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      provider,
      apiKey: apiKey.trim(),
      model,
      syncInterval: Number(syncInterval)
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings className="text-orange" size={20} /> AI & 분석 엔진 설정
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">AI 분석 엔진 모드</label>
            <select
              className="form-select"
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setTestResult(null);
              }}
              style={{ width: '100%' }}
            >
              <option value="builtin">내장 로컬 전략 분석 엔진 (Built-in Heuristic AI, 별도 키 불필요)</option>
              <option value="openai">OpenAI GPT API (GPT-4o mini / GPT-4o)</option>
            </select>
            <small className="form-hint">
              기본 내장 엔진은 인터넷/API키 없이도 29개 분쟁과 방산 뉴스를 결합하여 즉시 분석 보고서를 생성합니다.
            </small>
          </div>

          {provider === 'openai' && (
            <>
              <div className="form-group">
                <label className="form-label">OpenAI GPT 모델 선택</label>
                <select
                  className="form-select"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setTestResult(null);
                  }}
                  style={{ width: '100%' }}
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (추천 - 빠르고 경제적, 고품질)</option>
                  <option value="gpt-4o">gpt-4o (최고급 심층 안보 전략 분석)</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo (기본 호환 모드)</option>
                </select>
                <small className="form-hint">
                  만약 API 키가 특정 모델에 404를 반환하면 시스템이 다른 모델로 자동 대체 시도합니다.
                </small>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">OpenAI API Key</label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={handleTestConnection}
                    disabled={isTesting || !apiKey.trim()}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    {isTesting ? <Loader2 size={12} className="fa-spin" /> : <Sparkles size={12} className="text-orange" />}
                    {isTesting ? '테스트 중...' : 'API 연결 & 토큰 테스트'}
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
                      {testResult.success && testResult.totalTokens > 0 && (
                        <div style={{ color: 'var(--radar-cyan)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                          입력: {testResult.promptTokens}토큰 | 출력: {testResult.outputTokens}토큰 (총 {testResult.totalTokens}토큰 정상 감지)
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

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
