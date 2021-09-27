import PerformanceCheckerModule, { PerformanceCheckerData } from './performance-checker';
import { Graph } from './graph';
import { draggable } from './draggable';

export default class PerformanceChecker {

  // - flag -
  private initialized: boolean;

  // - main module -
  private performanceCheckerModule: PerformanceCheckerModule;

  // - dom -
  private container: HTMLDivElement;
  private containerFps: HTMLDivElement;
  private containerMemory: HTMLDivElement;
  private labelFps: HTMLSpanElement;
  private labelMemory: HTMLSpanElement;

  // - graph -
  private graphFps: Graph;
  private graphMemory: Graph;

  constructor() {
    this.initialized = false;
    this.performanceCheckerModule = new PerformanceCheckerModule();
    // - create dom -
    const dom = this.createDom();
    document.body.appendChild(dom.container);
    draggable(dom.container);
    this.container = dom.container;
    this.containerFps = dom.containerFps;
    this.containerMemory = dom.containerMemory;
    this.labelFps = dom.labelFps;
    this.labelMemory = dom.labelMemory;
    // - graph -
    this.graphFps = new Graph(this.containerFps.id);
    this.graphMemory = new Graph(this.containerMemory.id);
  }

  initialize() {
    this.initialized = true;
    this.removeDom();
    this.performanceCheckerModule.removeAllListeners();
    this.performanceCheckerModule.initialize();
    this.performanceCheckerModule.on('update', (e) => this.onUpdate(e));
    document.body.appendChild(this.container);
  }

  start() {
    if (!this.initialized) {
      throw new Error('Be sure to `initialize()` before running `start()` !!');
    }
    this.performanceCheckerModule.start();
  }

  end() {
    this.performanceCheckerModule.end();
  }

  private removeDom() {
    if (document.body.contains(this.container)) {
      document.body.removeChild(this.container);
    }
  }

  private onUpdate(e: PerformanceCheckerData) {
    this.labelFps.innerText =  `FPS : ${this.round(e.list[e.list.length - 1].fps.frames)}`;
    this.labelMemory.innerText = `Memory : ${this.round(e.list[e.list.length - 1].memory.percent)} %`;
    const DATA_LENGTH = 20;
    const convertPerformanceDataToGraphData = (
      data: PerformanceCheckerData,
      key: string,
      length: number,
    ) => {
      const key1 = key.split('.')[0];
      const key2 = key.split('.')[1] || '';
      return ({
        [key1.split('.')[0]]: data.list
          .filter((_, i, arr) => i >= arr.length - length)
          .map((v) => (v as any)[key1][key2]),
      });
    };
    this.graphFps.setData(convertPerformanceDataToGraphData(e, 'fps.frames', DATA_LENGTH));
    this.graphMemory.setData(convertPerformanceDataToGraphData(e, 'memory.percent', DATA_LENGTH));
  }

  private round(num: number) {
    return Math.round(num * 100) / 100;
  }

  private createDom(): { container: HTMLDivElement; containerMemory: HTMLDivElement; labelFps: HTMLSpanElement; labelMemory: HTMLSpanElement; containerFps: HTMLDivElement } {
    // - container -
    const container = document.createElement('div');
    container.id = 'graph-container';
    container.setAttribute('style', 'position: absolute; top: 10px; right: 10px; user-select: none');
    // - container:fps -
    const containerFps = document.createElement('div');
    containerFps.setAttribute('style', 'width: 200px; height: 200px');
    containerFps.id = 'graph-container-fps';
    const labelFps = document.createElement('span');
    // - container:memory -
    const containerMemory = document.createElement('div');
    containerMemory.setAttribute('style', 'width: 200px; height: 200px');
    containerMemory.id = 'graph-container-memory';
    const labelMemory = document.createElement('span');
    // append
    container.appendChild(labelFps);
    container.appendChild(containerFps);
    container.appendChild(labelMemory);
    container.appendChild(containerMemory);
    return ({
      container,
      containerFps,
      labelFps,
      containerMemory,
      labelMemory,
    });
  }

}
