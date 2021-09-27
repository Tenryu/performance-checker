import { EventEmitter } from 'eventemitter3';
import MemoryPerformanceChecker, { MemoryData } from './memory.performance-checker';
import { FpsData, FpsPerformanceChecker } from './fps.performance-checker';

export interface ISubModule<T> {
  getEnabled(): boolean;

  getData(): T;
}

/**
 * PerformanceCheckerData
 */
export type PerformanceCheckerData = {
  info: {
    option: PerformanceCheckerOption,
  },
  average: PerformanceData,
  max: PerformanceData,
  min: PerformanceData,
  list: PerformanceData[],
};

/**
 * PerformanceData
 */
type PerformanceData = {
  timestamp: number,
  fps: FpsData,
  memory: MemoryData,
};

/**
 * option
 */
type PerformanceCheckerOption = {
  samplingMS?: number,
};
const PerformanceCheckerDefaultOption: PerformanceCheckerOption = {
  samplingMS: 500,
};

/**
 * Events
 */
type PerformanceCheckerEvents = {
  'update': (data: PerformanceCheckerData) => void,
}

/**
 * PerformanceChecker
 */
export default class PerformanceCheckerModule extends EventEmitter<PerformanceCheckerEvents> {

  private subModules!: {
    fps: null | FpsPerformanceChecker,
    memory: null | MemoryPerformanceChecker,
  };

  private intervalId = -1;

  private data!: PerformanceCheckerData;

  private option: PerformanceCheckerOption;

  constructor(
    option?: PerformanceCheckerOption,
  ) {
    super();
    this.option = { ...PerformanceCheckerDefaultOption, ...option };
    this.initialize();
  }

  /**
   * 平均値産出 (2値から)
   * @param a
   * @param b
   * @private
   */
  private static calcAverage<T>(a: { [key: string]: any }, b: { [key: string]: any }): T {
    let obj: any = {};
    const keys = Object.keys(a);
    const valuesA = Object.values(a);
    const valuesB = Object.values(b);
    for (let i = 0; i < keys.length; i++) {
      if (typeof valuesA[i] === 'number') {
        obj = {
          ...obj,
          [keys[i]]: (valuesA[i] + valuesB[i]) / 2,
        };
      } else {
        obj = {
          ...obj,
          [keys[i]]: valuesA[i],
        };
      }
    }
    return obj;
  }

  /**
   * 最大値産出 (2値から)
   * @param a
   * @param b
   * @private
   */
  private static calcMax<T>(a: { [key: string]: any }, b: { [key: string]: any }): T {
    let obj: any = {};
    const keys = Object.keys(a);
    const valuesA = Object.values(a);
    const valuesB = Object.values(b);
    for (let i = 0; i < keys.length; i++) {
      if (typeof valuesA[i] === 'number') {
        obj = {
          ...obj,
          [keys[i]]: valuesA[i] > valuesB[i] ? valuesA[i] : valuesB[i],
        };
      } else {
        obj = {
          ...obj,
          [keys[i]]: valuesA[i],
        };
      }
    }
    return obj;
  }

  /**
   * 最小値産出 (2値から)
   * @param a
   * @param b
   * @private
   */
  private static calcMin<T>(a: { [key: string]: any }, b: { [key: string]: any }): T {
    let obj: any = {};
    const keys = Object.keys(a);
    const valuesA = Object.values(a);
    const valuesB = Object.values(b);
    for (let i = 0; i < keys.length; i++) {
      if (typeof valuesA[i] === 'number') {
        obj = {
          ...obj,
          [keys[i]]: valuesA[i] < valuesB[i] ? valuesA[i] : valuesB[i],
        };
      } else {
        obj = {
          ...obj,
          [keys[i]]: valuesA[i],
        };
      }
    }
    return obj;
  }

  /**
   * 初期化
   * イベントは消さない
   */
  initialize() {
    window.clearInterval(this.intervalId);
    this.subModules = {
      fps: new FpsPerformanceChecker(),
      memory: new MemoryPerformanceChecker(),
    };
    this.intervalId = -1;
    this.data = {
      info: {
        option: this.option,
      },
      average: {
        timestamp: 0,
        fps: FpsPerformanceChecker.ZERO_DATA,
        memory: MemoryPerformanceChecker.ZERO_DATA,
      },
      max: {
        timestamp: 0,
        fps: FpsPerformanceChecker.ZERO_DATA,
        memory: MemoryPerformanceChecker.ZERO_DATA,
      },
      min: {
        timestamp: 0,
        fps: FpsPerformanceChecker.ZERO_DATA,
        memory: MemoryPerformanceChecker.ZERO_DATA,
      },
      list: [],
    };
  }

  setOption(option: PerformanceCheckerOption) {
    this.option = { ...this.option, ...option };
  }

  getOption() {
    return this.option;
  }

  /**
   * 計測開始
   * データの取得は .on('update', (data) => void) で
   */
  start() {
    this.initialize();
    this.intervalId = window.setInterval(
      () => {
        const currentData = this.createPerformanceData();
        const list = [
          ...this.data.list,
          currentData,
        ];
        const average: PerformanceData = {
          timestamp: 0,
          fps: list.length === 1 ? currentData.fps : PerformanceCheckerModule.calcAverage(this.data.average.fps, currentData.fps),
          memory: list.length === 1 ? currentData.memory : PerformanceCheckerModule.calcAverage<MemoryData>(this.data.average.memory, currentData.memory),
        };
        const max: PerformanceData = {
          timestamp: 0,
          fps: list.length === 1 ? currentData.fps : PerformanceCheckerModule.calcMax(this.data.average.fps, currentData.fps),
          memory: list.length === 1 ? currentData.memory : PerformanceCheckerModule.calcMax<MemoryData>(this.data.average.memory, currentData.memory),
        };
        const min: PerformanceData = {
          timestamp: 0,
          fps: list.length === 1 ? currentData.fps : PerformanceCheckerModule.calcMin(this.data.average.fps, currentData.fps),
          memory: list.length === 1 ? currentData.memory : PerformanceCheckerModule.calcMin<MemoryData>(this.data.average.memory, currentData.memory),
        };
        this.data.list = list;
        this.data.average = average;
        this.data.max = max;
        this.data.min = min;
        this.emit('update', this.data);
      },
      this.option.samplingMS,
    );
  }

  /**
   * 計測終了
   */
  end() {
    window.clearInterval(this.intervalId);
  }

  private createPerformanceData(): PerformanceData {
    const timestamp = new Date().getTime();
    const fps = this.getFpsData();
    const memory = this.getMemoryData();
    return {
      timestamp,
      fps,
      memory,
    };
  }

  /**
   * FPS関連のデータ取得
   * @private
   */
  private getFpsData() {
    return this.subModules.fps?.getData() || FpsPerformanceChecker.ZERO_DATA;
  }

  /**
   * メモリー関連のデータ取得
   * @private
   */
  private getMemoryData(): MemoryData {
    return this.subModules.memory?.getData() || MemoryPerformanceChecker.ZERO_DATA;
  }

}

