import { ISubModule } from './index';

export type MemoryData = {
  enabled: boolean,
  total: number,
  used: number,
  limit: number,
  percent: number,
};

/**
 * MemoryPerformanceChecker
 * メモリ関連の数値を返す (Chrome限定)
 * 単位は bytes
 */
export default class MemoryPerformanceChecker implements ISubModule<MemoryData> {

  static ZERO_DATA: MemoryData = {
    enabled: false,
    total: 0,
    used: 0,
    limit: 0,
    percent: 0,
  };

  getEnabled(): boolean {
    return Boolean(window.performance && (window.performance as any).memory);
  }

  getData(): MemoryData {
    if (!this.getEnabled()) {
      return MemoryPerformanceChecker.ZERO_DATA;
    }
    const total = (window.performance as any).memory.totalJSHeapSize;
    const used = (window.performance as any).memory.usedJSHeapSize;
    const limit = (window.performance as any).memory.jsHeapSizeLimit;
    return {
      enabled: true,
      total,
      used,
      limit,
      percent: used / limit * 100,
    }
  }

}
