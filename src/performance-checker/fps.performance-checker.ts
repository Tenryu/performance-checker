import { ISubModule } from './index';

export type FpsData = {
  frames: number,
};

export class FpsPerformanceChecker implements ISubModule<FpsData> {

  static ZERO_DATA: FpsData = {
    frames: 0,
  };

  private beginTime: number;
  private prevTime: number;
  private framesCounter: number;
  private frames: number;

  constructor() {
    this.beginTime = performance.now();
    this.prevTime = this.beginTime;
    this.framesCounter = 0;
    this.frames = 0;
    this.loop();
  }

  private loop() {
    this.update();
    requestAnimationFrame(() => this.loop());
  }

  private update() {
    this.framesCounter += 1;
    let prevTime = this.prevTime;
    const time = performance.now();
    if (time > prevTime + 1000) {
      this.frames = (this.framesCounter * 1000) / (time - prevTime);
      this.prevTime = time;
      this.framesCounter = 0;
    }
  }

  getEnabled(): boolean {
    return true;
  }

  getData(): FpsData {
    return {
      frames: this.frames,
    };
  }

}
