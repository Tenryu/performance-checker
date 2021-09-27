"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = require("eventemitter3");
const memory_performance_checker_1 = __importDefault(require("./memory.performance-checker"));
const fps_performance_checker_1 = require("./fps.performance-checker");
const PerformanceCheckerDefaultOption = {
    samplingMS: 500,
};
/**
 * PerformanceChecker
 */
class PerformanceChecker extends eventemitter3_1.EventEmitter {
    constructor(option) {
        super();
        this.intervalId = -1;
        this.option = { ...PerformanceCheckerDefaultOption, ...option };
        this.initialize();
    }
    /**
     * 平均値産出 (2値から)
     * @param a
     * @param b
     * @private
     */
    static calcAverage(a, b) {
        let obj = {};
        const keys = Object.keys(a);
        const valuesA = Object.values(a);
        const valuesB = Object.values(b);
        for (let i = 0; i < keys.length; i++) {
            if (typeof valuesA[i] === 'number') {
                obj = {
                    ...obj,
                    [keys[i]]: (valuesA[i] + valuesB[i]) / 2,
                };
            }
            else {
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
    static calcMax(a, b) {
        let obj = {};
        const keys = Object.keys(a);
        const valuesA = Object.values(a);
        const valuesB = Object.values(b);
        for (let i = 0; i < keys.length; i++) {
            if (typeof valuesA[i] === 'number') {
                obj = {
                    ...obj,
                    [keys[i]]: valuesA[i] > valuesB[i] ? valuesA[i] : valuesB[i],
                };
            }
            else {
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
    static calcMin(a, b) {
        let obj = {};
        const keys = Object.keys(a);
        const valuesA = Object.values(a);
        const valuesB = Object.values(b);
        for (let i = 0; i < keys.length; i++) {
            if (typeof valuesA[i] === 'number') {
                obj = {
                    ...obj,
                    [keys[i]]: valuesA[i] < valuesB[i] ? valuesA[i] : valuesB[i],
                };
            }
            else {
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
            fps: new fps_performance_checker_1.FpsPerformanceChecker(),
            memory: new memory_performance_checker_1.default(),
        };
        this.intervalId = -1;
        this.data = {
            info: {
                option: this.option,
            },
            average: {
                timestamp: 0,
                fps: fps_performance_checker_1.FpsPerformanceChecker.ZERO_DATA,
                memory: memory_performance_checker_1.default.ZERO_DATA,
            },
            max: {
                timestamp: 0,
                fps: fps_performance_checker_1.FpsPerformanceChecker.ZERO_DATA,
                memory: memory_performance_checker_1.default.ZERO_DATA,
            },
            min: {
                timestamp: 0,
                fps: fps_performance_checker_1.FpsPerformanceChecker.ZERO_DATA,
                memory: memory_performance_checker_1.default.ZERO_DATA,
            },
            list: [],
        };
    }
    setOption(option) {
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
        this.intervalId = window.setInterval(() => {
            const currentData = this.createPerformanceData();
            const list = [
                ...this.data.list,
                currentData,
            ];
            const average = {
                timestamp: 0,
                fps: list.length === 1 ? currentData.fps : PerformanceChecker.calcAverage(this.data.average.fps, currentData.fps),
                memory: list.length === 1 ? currentData.memory : PerformanceChecker.calcAverage(this.data.average.memory, currentData.memory),
            };
            const max = {
                timestamp: 0,
                fps: list.length === 1 ? currentData.fps : PerformanceChecker.calcMax(this.data.average.fps, currentData.fps),
                memory: list.length === 1 ? currentData.memory : PerformanceChecker.calcMax(this.data.average.memory, currentData.memory),
            };
            const min = {
                timestamp: 0,
                fps: list.length === 1 ? currentData.fps : PerformanceChecker.calcMin(this.data.average.fps, currentData.fps),
                memory: list.length === 1 ? currentData.memory : PerformanceChecker.calcMin(this.data.average.memory, currentData.memory),
            };
            this.data.list = list;
            this.data.average = average;
            this.data.max = max;
            this.data.min = min;
            this.emit('update', this.data);
        }, this.option.samplingMS);
    }
    /**
     * 計測終了
     */
    end() {
        window.clearInterval(this.intervalId);
    }
    createPerformanceData() {
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
    getFpsData() {
        return this.subModules.fps?.getData() || fps_performance_checker_1.FpsPerformanceChecker.ZERO_DATA;
    }
    /**
     * メモリー関連のデータ取得
     * @private
     */
    getMemoryData() {
        return this.subModules.memory?.getData() || memory_performance_checker_1.default.ZERO_DATA;
    }
}
exports.default = PerformanceChecker;
