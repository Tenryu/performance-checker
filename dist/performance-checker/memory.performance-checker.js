"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * MemoryPerformanceChecker
 * メモリ関連の数値を返す (Chrome限定)
 * 単位は bytes
 */
class MemoryPerformanceChecker {
    getEnabled() {
        return Boolean(window.performance && window.performance.memory);
    }
    getData() {
        if (!this.getEnabled()) {
            return MemoryPerformanceChecker.ZERO_DATA;
        }
        const total = window.performance.memory.totalJSHeapSize;
        const used = window.performance.memory.usedJSHeapSize;
        const limit = window.performance.memory.jsHeapSizeLimit;
        return {
            enabled: true,
            total,
            used,
            limit,
            percent: used / limit * 100,
        };
    }
}
exports.default = MemoryPerformanceChecker;
MemoryPerformanceChecker.ZERO_DATA = {
    enabled: false,
    total: 0,
    used: 0,
    limit: 0,
    percent: 0,
};
