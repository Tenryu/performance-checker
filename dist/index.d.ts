declare type Option = {
    right?: number;
    top?: number;
    zIndex?: number;
};
export default class PerformanceChecker {
    private initialized;
    private performanceCheckerModule;
    private container;
    private containerFps;
    private containerMemory;
    private labelFps;
    private labelMemory;
    private graphFps;
    private graphMemory;
    constructor(opt?: Option);
    initialize(): void;
    start(): void;
    end(): void;
    show(): void;
    hide(): void;
    private removeDom;
    private onUpdate;
    private round;
    private createDom;
}
export {};
