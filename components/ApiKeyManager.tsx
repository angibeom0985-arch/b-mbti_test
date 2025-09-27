import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeySet, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showInput, setShowInput] = useState(!currentApiKey);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 API 키 확인
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey && !currentApiKey) {
      setApiKey(storedApiKey);
      onApiKeySet(storedApiKey);
      setShowInput(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsValidating(true);
    // 간단한 API 키 형식 검증
    if (apiKey.startsWith('AIza') && apiKey.length > 30) {
      localStorage.setItem('gemini_api_key', apiKey);
      onApiKeySet(apiKey);
      setShowInput(false);
    } else {
      alert('올바른 Google AI Studio API 키 형식이 아닙니다.');
    }
    setIsValidating(false);
  };

  const handleReset = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setShowInput(true);
    onApiKeySet('');
  };

  if (!showInput && currentApiKey) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-sm text-green-700 font-medium">API 키가 설정되었습니다</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-green-600 hover:text-green-800 underline"
          >
            변경하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-yellow-800 mb-1">🔑 Google AI Studio API 키 필요</h3>
        <p className="text-xs text-yellow-700">
          더 정확한 분석을 위해 Google AI Studio API 키가 필요합니다.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Google AI Studio API 키를 입력하세요"
            className="w-full px-3 py-2 text-sm border border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            disabled={isValidating}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={!apiKey.trim() || isValidating}
            className="flex-1 bg-yellow-500 text-white text-sm font-medium py-2 px-4 rounded-xl hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? '확인 중...' : '설정하기'}
          </button>
          <button
            type="button"
            onClick={() => window.open('/guide/api-key', '_blank')}
            className="px-3 py-2 text-xs text-yellow-600 hover:text-yellow-800 underline"
          >
            발급 방법
          </button>
        </div>
      </form>
      
      <div className="mt-2 text-xs text-yellow-600">
        💡 API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다.
      </div>
    </div>
  );
};

export default ApiKeyManager;