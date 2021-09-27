import '../node_modules/c3/c3.css';
export declare type GraphData = {
    [key: string]: number[];
};
export declare class Graph {
    private chart;
    constructor(id: string);
    setData(data: GraphData): void;
}
