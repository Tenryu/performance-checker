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
    constructor();
    initialize(): void;
    start(): void;
    end(): void;
    private removeDom;
    private onUpdate;
    private round;
    private createDom;
}
