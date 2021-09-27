import { EventEmitter } from 'eventemitter3';
import { MemoryData } from './memory.performance-checker';
import { FpsData } from './fps.performance-checker';
export interface ISubModule<T> {
    getEnabled(): boolean;
    getData(): T;
}
/**
 * PerformanceCheckerData
 */
export declare type PerformanceCheckerData = {
    info: {
        option: PerformanceCheckerOption;
    };
    average: PerformanceData;
    max: PerformanceData;
    min: PerformanceData;
    list: PerformanceData[];
};
/**
 * PerformanceData
 */
declare type PerformanceData = {
    timestamp: number;
    fps: FpsData;
    memory: MemoryData;
};
/**
 * option
 */
declare type PerformanceCheckerOption = {
    samplingMS?: number;
};
/**
 * Events
 */
declare type PerformanceCheckerEvents = {
    'update': (data: PerformanceCheckerData) => void;
};
/**
 * PerformanceChecker
 */
export default class PerformanceCheckerModule extends EventEmitter<PerformanceCheckerEvents> {
    private subModules;
    private intervalId;
    private data;
    private option;
    constructor(option?: PerformanceCheckerOption);
    /**
     * 平均値産出 (2値から)
     * @param a
     * @param b
     * @private
     */
    private static calcAverage;
    /**
     * 最大値産出 (2値から)
     * @param a
     * @param b
     * @private
     */
    private static calcMax;
    /**
     * 最小値産出 (2値から)
     * @param a
     * @param b
     * @private
     */
    private static calcMin;
    /**
     * 初期化
     * イベントは消さない
     */
    initialize(): void;
    setOption(option: PerformanceCheckerOption): void;
    getOption(): PerformanceCheckerOption;
    /**
     * 計測開始
     * データの取得は .on('update', (data) => void) で
     */
    start(): void;
    /**
     * 計測終了
     */
    end(): void;
    private createPerformanceData;
    /**
     * FPS関連のデータ取得
     * @private
     */
    private getFpsData;
    /**
     * メモリー関連のデータ取得
     * @private
     */
    private getMemoryData;
}
export {};
