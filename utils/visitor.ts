// 방문자수 관리 유틸리티
export class VisitorCounter {
  private static readonly STORAGE_KEY = 'mbti_test_visitor_count';
  private static readonly VERSION_STATS_KEY = 'mbti_test_version_stats';
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

  // 테스트 버전별 사용 통계 관리
  static incrementVersionUsage(version: number): void {
    const stats = this.getVersionStats();
    stats[version] = (stats[version] || 0) + 1;
    localStorage.setItem(this.VERSION_STATS_KEY, JSON.stringify(stats));
  }

  // 테스트 버전별 사용 통계 조회
  static getVersionStats(): Record<number, number> {
    const stored = localStorage.getItem(this.VERSION_STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // 초기값 설정 (임의의 데이터로 시작)
    const initialStats = {
      1: 245, // 사람들 속의 나
      2: 389, // 하나님의 일 속의 나 (가장 인기)
      3: 178  // 위기 속의 나
    };
    localStorage.setItem(this.VERSION_STATS_KEY, JSON.stringify(initialStats));
    return initialStats;
  }

  // 가장 인기 있는 테스트 버전 반환
  static getMostPopularVersion(): number {
    const stats = this.getVersionStats();
    let maxCount = 0;
    let mostPopular = 1;
    
    for (const [version, count] of Object.entries(stats)) {
      if (count > maxCount) {
        maxCount = count;
        mostPopular = parseInt(version);
      }
    }
    
    return mostPopular;
  }
}