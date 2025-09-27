import React, { useState, useRef, useEffect } from 'react';
import AdBanner from '../components/AdBanner';

interface AdminPageProps {}

type EditorMode = 'basic' | 'html';
type EditablePage = 'index' | 'test1' | 'test2' | 'test3' | 'result';

const ADMIN_CREDENTIALS = {
  username: 'akb0811',
  password: 'rlqja0985!'
};

const AdminPage: React.FC<AdminPageProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // 에디터 상태
  const [selectedPage, setSelectedPage] = useState<EditablePage>('index');
  const [editorMode, setEditorMode] = useState<EditorMode>('basic');
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState<Record<EditablePage, string>>({
    index: '<h1>성경인물 MBTI 테스트</h1><p>나와 닮은 성경 속 인물을 찾아보세요!</p>',
    test1: '<h1>신앙생활 깊이보기 테스트</h1><p>예배, 기도, 교제를 통해 나만의 신앙 스타일을 발견해보세요.</p>',
    test2: '<h1>하나님의 일 속의 나</h1><p>섬김과 사역에서의 성향을 알아보는 테스트입니다.</p>',
    test3: '<h1>위기 속의 나</h1><p>어려운 상황에서의 반응을 통해 성격을 파악해보세요.</p>',
    result: '<h1>테스트 결과</h1><p>당신과 닮은 성경인물을 확인하세요.</p>'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 내용 불러오기
    const stored = localStorage.getItem('admin_content');
    if (stored) {
      try {
        setSavedContent(JSON.parse(stored));
      } catch (e) {
        console.error('저장된 내용을 불러오는데 실패했습니다.', e);
      }
    }
  }, []);

  useEffect(() => {
    // 페이지 변경시 해당 페이지의 내용 불러오기
    setContent(savedContent[selectedPage] || '');
  }, [selectedPage, savedContent]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSaveContent = () => {
    const newSavedContent = { ...savedContent, [selectedPage]: content };
    setSavedContent(newSavedContent);
    localStorage.setItem('admin_content', JSON.stringify(newSavedContent));
    alert('내용이 저장되었습니다!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제 프로덕션에서는 서버에 업로드하지만, 데모용으로 FileReader 사용
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const imageTag = editorMode === 'html' 
          ? `<img src="${imageUrl}" alt="업로드된 이미지" style="max-width: 100%; height: auto;" />`
          : `![업로드된 이미지](${imageUrl})`;
        
        const textarea = editorRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent = content.substring(0, start) + imageTag + content.substring(end);
          setContent(newContent);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      const previewContent = editorMode === 'html' 
        ? content
        : content.replace(/\n/g, '<br>');
      
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>미리보기 - ${selectedPage}</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Noto Sans KR', sans-serif; 
              padding: 20px; 
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
            }
            img { max-width: 100%; height: auto; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>${selectedPage} 페이지 미리보기</h1>
          <hr>
          <div>${previewContent}</div>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">🔐 관리자 로그인</h1>
            <p className="text-gray-600">관리자 계정으로 로그인하세요.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              🚀 로그인
            </button>
          </form>

          <div className="mt-8">
            <AdBanner slot="2689008677" className="rounded-xl" />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">⚙️ 관리자 페이지</h1>
              <p className="text-gray-600">웹사이트 내용을 편집하고 관리하세요.</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                🏠 메인으로
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                🚪 로그아웃
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 사이드바 - 페이지 선택 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📄 페이지 선택</h2>
              <div className="space-y-2">
                {[
                  { key: 'index', label: '🏠 메인 페이지', desc: '첫 화면 내용 (index.html)' },
                  { key: 'test1', label: '� 테스트 1', desc: '신앙생활 테스트 (test1.html)' },
                  { key: 'test2', label: '⚡ 테스트 2', desc: '하나님의 일 테스트 (test2.html)' },
                  { key: 'test3', label: '🔥 테스트 3', desc: '위기상황 테스트 (test3.html)' },
                  { key: 'result', label: '📊 결과 페이지', desc: '테스트 결과 내용 (result.html)' }
                ].map((page) => (
                  <button
                    key={page.key}
                    onClick={() => setSelectedPage(page.key as EditablePage)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedPage === page.key
                        ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{page.label}</div>
                    <div className={`text-sm ${selectedPage === page.key ? 'text-white/80' : 'text-gray-500'}`}>
                      {page.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 광고 */}
            <div className="mb-6">
              <AdBanner slot="2689008677" className="rounded-xl" />
            </div>
          </div>

          {/* 오른쪽 에디터 영역 */}
          <div className="lg:col-span-2">
            {/* 에디터 컨트롤 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  ✏️ {selectedPage} 페이지 편집
                </h2>
                
                {/* 모드 전환 */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setEditorMode('basic')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      editorMode === 'basic'
                        ? 'bg-white text-violet-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    📝 기본모드
                  </button>
                  <button
                    onClick={() => setEditorMode('html')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      editorMode === 'html'
                        ? 'bg-white text-violet-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    💻 HTML모드
                  </button>
                </div>
              </div>

              {/* 툴바 */}
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  🖼️ 이미지 첨부
                </button>
                
                <button
                  onClick={handlePreview}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                >
                  👀 미리보기
                </button>
                
                <button
                  onClick={handleSaveContent}
                  className="px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition-colors"
                >
                  💾 저장
                </button>
              </div>

              {/* 에디터 */}
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  editorMode === 'html'
                    ? 'HTML 코드를 입력하세요...'
                    : '내용을 입력하세요...'
                }
                className={`w-full h-96 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none ${
                  editorMode === 'html' ? 'font-mono text-sm' : ''
                }`}
                style={
                  editorMode === 'html'
                    ? {
                        background: '#f8f9fa',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                      }
                    : {}
                }
              />

              {editorMode === 'html' && (
                <div className="mt-2 text-xs text-gray-500">
                  💡 HTML 태그를 사용할 수 있습니다. 이미지는 &lt;img&gt; 태그로 삽입됩니다.
                </div>
              )}
            </div>

            {/* 광고 */}
            <AdBanner slot="2689008677" className="rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;