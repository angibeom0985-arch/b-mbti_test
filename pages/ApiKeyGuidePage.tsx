import React from 'react';
import AdBanner from '../components/AdBanner';

const ApiKeyGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            🔑 Google AI Studio API 키 발급 가이드
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mx-auto"></div>
        </div>

        {/* 광고 */}
        <div className="mb-8">
          <AdBanner slot="2689008677" className="rounded-2xl" />
        </div>

        {/* 가이드 내용 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🚀</span> 1단계: Google AI Studio 접속
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              1. <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Google AI Studio (https://aistudio.google.com/)</a>에 접속하세요.
            </p>
            <p className="text-gray-600">
              2. 구글 계정으로 로그인합니다.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-sm text-blue-700">
                💡 <strong>팁:</strong> 구글 계정이 없다면 먼저 계정을 만들어주세요.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔑</span> 2단계: API 키 생성
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              1. 왼쪽 메뉴에서 <strong>"Get API key"</strong>를 클릭합니다.
            </p>
            <p className="text-gray-600">
              2. <strong>"Create API key"</strong> 버튼을 클릭합니다.
            </p>
            <p className="text-gray-600">
              3. 새 프로젝트를 만들거나 기존 프로젝트를 선택합니다.
            </p>
            <p className="text-gray-600">
              4. 생성된 API 키를 복사합니다.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-sm text-yellow-700">
                ⚠️ <strong>중요:</strong> API 키는 다시 확인할 수 없으니 안전한 곳에 저장하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 광고 */}
        <div className="mb-6">
          <AdBanner slot="2689008677" className="rounded-2xl" />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚙️</span> 3단계: API 키 사용하기
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              1. 메인 페이지로 돌아가서 API 키 입력란에 붙여넣기합니다.
            </p>
            <p className="text-gray-600">
              2. <strong>"설정하기"</strong> 버튼을 클릭합니다.
            </p>
            <p className="text-gray-600">
              3. 이제 더 정확한 MBTI 분석을 받을 수 있습니다!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-700">
                🔒 <strong>보안:</strong> API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">❓</span> 자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-violet-300 pl-4">
              <h3 className="font-semibold text-gray-800">Q: API 키 사용에 비용이 발생하나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                A: Google AI Studio는 매월 무료 사용량을 제공합니다. 일반적인 사용에서는 비용이 발생하지 않습니다.
              </p>
            </div>
            <div className="border-l-4 border-pink-300 pl-4">
              <h3 className="font-semibold text-gray-800">Q: API 키를 잃어버렸어요</h3>
              <p className="text-gray-600 text-sm mt-1">
                A: Google AI Studio에서 새로운 API 키를 생성하고 기존 키를 삭제할 수 있습니다.
              </p>
            </div>
            <div className="border-l-4 border-orange-300 pl-4">
              <h3 className="font-semibold text-gray-800">Q: API 키 없이도 사용할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                A: 네, 기본 모드로도 테스트를 진행할 수 있지만 API 키를 사용하면 더 정확한 분석을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 뒤로 가기 버튼 */}
        <div className="text-center">
          <button
            onClick={() => {
              if (window.opener) {
                window.close();
              } else {
                window.location.href = '/';
              }
            }}
            className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            ✨ 테스트하러 가기
          </button>
        </div>

        {/* 광고 */}
        <div className="mt-8">
          <AdBanner slot="2689008677" className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGuidePage;