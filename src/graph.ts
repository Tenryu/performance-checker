import * as c3 from 'c3';
import './c3.css';

export type GraphData = { [key: string]: number[] };

export class Graph {

  private chart: c3.ChartAPI;

  constructor(id: string) {
    this.chart = c3.generate({
      bindto: `#${id}`,
      interaction: {
        enabled: false,
      },
      transition: {
        duration: 100,
      },
      data: {
        columns: [],
        type: 'area-step',
      },
      axis: {
        x: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
    });
  }

  setData(data: GraphData) {
    const key = Object.keys(data)[0];
    const value = Object.values(data)[0];
    this.chart.load({
      columns: [
        [key, ...value],
      ],
    });
  }
}
