"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
const c3 = __importStar(require("c3"));
require("./c3.css");
class Graph {
    constructor(id) {
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
    setData(data) {
        const key = Object.keys(data)[0];
        const value = Object.values(data)[0];
        this.chart.load({
            columns: [
                [key, ...value],
            ],
        });
    }
}
exports.Graph = Graph;
