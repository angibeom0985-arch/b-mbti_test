// 방문자수 관리 유틸리티
export class VisitorCounter {
  private static readonly STORAGE_KEY = 'mbti_test_visitor_count';
  private static readonly INITIAL_COUNT = 789;

  // 방문자수 증가 및 반환
  static incrementAndGet(): number {
    const currentCount = this.getCurrentCount();
    const newCount = currentCount + 1;
    localStorage.setItem(this.STORAGE_KEY, newCount.toString());
    return newCount;
  }

  // 현재 방문자수 조회
  static getCurrentCount(): number {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return parseInt(stored, 10);
    }
    
    // 처음 방문 시 초기값 설정
    localStorage.setItem(this.STORAGE_KEY, this.INITIAL_COUNT.toString());
    return this.INITIAL_COUNT;
  }

  // 방문자수 포맷팅 (천 단위 콤마)
  static formatCount(count: number): string {
    return count.toLocaleString('ko-KR');
  }
}