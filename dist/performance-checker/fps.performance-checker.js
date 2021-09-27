"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FpsPerformanceChecker = void 0;
class FpsPerformanceChecker {
    constructor() {
        this.beginTime = performance.now();
        this.prevTime = this.beginTime;
        this.framesCounter = 0;
        this.frames = 0;
        this.loop();
    }
    loop() {
        this.update();
        requestAnimationFrame(() => this.loop());
    }
    update() {
        this.framesCounter += 1;
        let prevTime = this.prevTime;
        const time = performance.now();
        if (time > prevTime + 1000) {
            this.frames = (this.framesCounter * 1000) / (time - prevTime);
            this.prevTime = time;
            this.framesCounter = 0;
        }
    }
    getEnabled() {
        return true;
    }
    getData() {
        return {
            frames: this.frames,
        };
    }
}
exports.FpsPerformanceChecker = FpsPerformanceChecker;
FpsPerformanceChecker.ZERO_DATA = {
    frames: 0,
};
