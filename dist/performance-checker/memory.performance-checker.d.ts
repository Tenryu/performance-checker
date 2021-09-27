import { ISubModule } from './index';
export declare type MemoryData = {
    enabled: boolean;
    total: number;
    used: number;
    limit: number;
    percent: number;
};
/**
 * MemoryPerformanceChecker
 * メモリ関連の数値を返す (Chrome限定)
 * 単位は bytes
 */
export default class MemoryPerformanceChecker implements ISubModule<MemoryData> {
    static ZERO_DATA: MemoryData;
    getEnabled(): boolean;
    getData(): MemoryData;
}
