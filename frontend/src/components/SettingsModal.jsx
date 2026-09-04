import React, { useState, useEffect } from 'react';
import { Settings, X, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const PRESET_MODELS = ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1-mini', 'gpt-3.5-turbo'];

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const initialProvider = settings.provider === 'gemini' ? 'openai' : (settings.provider || 'openai');
  const [provider, setProvider] = useState(initialProvider);
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  
  const currentModel = settings.model || 'gpt-4o';
  const isCustom = !PRESET_MODELS.includes(currentModel);
  const [selectedPreset, setSelectedPreset] = useState(isCustom ? 'custom' : currentModel);
  const [customModelName, setCustomModelName] = useState(isCustom ? currentModel : '');
  const [model, setModel] = useState(currentModel);
  const [syncInterval, setSyncInterval] = useState(settings.syncInterval || 0);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const cur = settings.model || 'gpt-4o';
      setApiKey(settings.apiKey || '');
      setProvider(settings.provider === 'gemini' ? 'openai' : (settings.provider || 'openai'));
      setModel(cur);
      const custom = !PRESET_MODELS.includes(cur);
      setSelectedPreset(custom ? 'custom' : cur);
      setCustomModelName(custom ? cur : '');
      setSyncInterval(settings.syncInterval || 0);
      setTestResult(null);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handlePresetChange = (val) => {
    setSelectedPreset(val);
    setTestResult(null);
    if (val === 'custom') {
      setModel(customModelName.trim() || 'gpt-4o');
    } else {
      setModel(val);
    }
  };

  const handleCustomModelChange = (val) => {
    setCustomModelName(val);
    setModel(val.trim() || 'gpt-4o');
    setTestResult(null);
  };

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
          {/* AI Engine Info Card */}
          <div style={{
            background: 'var(--brand-orange-light)',
            border: '1px solid rgba(243, 115, 33, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-orange)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={14} /> AI 전략 분석 엔진: OpenAI GPT
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                글로벌 29개 분쟁과 무기 제원을 실제 OpenAI LLM으로 심층 분석합니다.
              </div>
            </div>
            <span className="score-badge badge-low" style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {model}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">OpenAI GPT 모델 선택</label>
            <select
              className="form-select"
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="gpt-4o">gpt-4o (플래그십 심층 안보 전략 분석 - 추천)</option>
              <option value="gpt-4o-mini">gpt-4o-mini (경량 고속 안보 분석)</option>
              <option value="o3-mini">o3-mini (차세대 고급 추론 분석)</option>
              <option value="o1-mini">o1-mini (심층 논리 추론 분석)</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo (기본 호환 모드)</option>
              <option value="custom">직접 모델명 입력 (Custom Model)...</option>
            </select>

            {selectedPreset === 'custom' && (
              <div style={{ marginTop: '0.4rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%' }}
                  placeholder="OpenAI 모델 ID 입력 (예: gpt-4o, gpt-4o-mini, o3-mini 등)"
                  value={customModelName}
                  onChange={(e) => handleCustomModelChange(e.target.value)}
                />
                <small className="form-hint">
                  사용 가능한 OpenAI 모델 식별자(ID)를 직접 입력할 수 있습니다.
                </small>
              </div>
            )}

            <small className="form-hint" style={{ marginTop: '0.35rem', display: 'block' }}>
              현재 설정된 활성 모델: <strong style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>{model}</strong>
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
