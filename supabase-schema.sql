-- Supabase에서 실행할 SQL 스키마
-- 테스트 결과 저장 테이블 생성

CREATE TABLE IF NOT EXISTS test_results (
    id BIGSERIAL PRIMARY KEY,
    mbti_type VARCHAR(4) NOT NULL CHECK (mbti_type ~ '^[EI][SN][TF][JP]$'),
    character VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    session_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_test_results_mbti_type ON test_results(mbti_type);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_test_results_session_id ON test_results(session_id);

-- Row Level Security (RLS) 활성화
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (모든 사용자가 통계를 볼 수 있음)
CREATE POLICY "Enable read access for all users" ON test_results
    FOR SELECT USING (true);

-- 공개 삽입 정책 (모든 사용자가 결과를 저장할 수 있음)
CREATE POLICY "Enable insert access for all users" ON test_results
    FOR INSERT WITH CHECK (true);

-- 선택적: 통계를 위한 뷰 생성
CREATE OR REPLACE VIEW mbti_statistics AS
SELECT 
    mbti_type,
    character,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM test_results 
GROUP BY mbti_type, character
ORDER BY count DESC;