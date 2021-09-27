import { ISubModule } from './index';
export declare type FpsData = {
    frames: number;
};
export declare class FpsPerformanceChecker implements ISubModule<FpsData> {
    static ZERO_DATA: FpsData;
    private beginTime;
    private prevTime;
    private framesCounter;
    private frames;
    constructor();
    private loop;
    private update;
    getEnabled(): boolean;
    getData(): FpsData;
}
