




// export type CellTypes = 
//     {kind:CellKind.Mountain, color:0x101002} |
//     {kind:CellKind.ShallowWater, color:0x165896} |
//     {kind:CellKind.DeepWater, color:0x002f5b} |
//     {kind:CellKind.Desert, color:0xAA8639 , temperature: [0,30], rainfall: [-1,-0.8]} |
//     {kind:CellKind.TropicalRainForest, color:0x26ad2b , temperature: [20,30], rainfall: [0.5,1]} |
//     {kind:CellKind.SubTropicalRainForest, color:0x7ead80 , temperature: [20,30], rainfall: [0.0,0.5]} |
//     {kind:CellKind.Savanna, color:0xabad2d , temperature: [20,30], drainage: [-1,1], rainfall: [-0.8,0]}|
//     {kind:CellKind.Forest, color:0x005b03 , temperature: [5,20], drainage: [-1,0.75]}|
//     {kind:CellKind.Wasteland, color:0xada97e , temperature: [5,20], drainage: [0.75,1], rainfall: [-1,0]}|
//     {kind:CellKind.Swamp, color:0x394928 , temperature: [0,20], rainfall: [0.5,1], drainage: [-1,-0.9]}|
//     {kind:CellKind.Prairie, color:0xafaf7b , temperature: [0,10], drainage: [0.5,1]}|
//     {kind:CellKind.BorealForest, color:0x0d300e , temperature: [-5,5]}|
//     {kind:CellKind.Tundra, color:0xDEDEDE , temperature:[-10,-5]}
// ;



// export type CellTypes = [
//     {kind:CellKind.Mountain, color:0x101002} ,
//     {kind:CellKind.ShallowWater, color:0x165896} ,
//     {kind:CellKind.DeepWater, color:0x002f5b} ,
//     {kind:CellKind.Desert, color:0xAA8639 , temperature: [0,30], rainfall: [-1,-0.8]} ,
//     {kind:CellKind.TropicalRainForest, color:0x26ad2b , temperature: [20,30], rainfall: [0.5,1]} ,
//     {kind:CellKind.SubTropicalRainForest, color:0x7ead80 , temperature: [20,30], rainfall: [0.0,0.5]} ,
//     {kind:CellKind.Savanna, color:0xabad2d , temperature: [20,30], drainage: [-1,1], rainfall: [-0.8,0]},
//     {kind:CellKind.Forest, color:0x005b03 , temperature: [5,20], drainage: [-1,0.75]},
//     {kind:CellKind.Wasteland, color:0xada97e , temperature: [5,20], drainage: [0.75,1], rainfall: [-1,0]},
//     {kind:CellKind.Swamp, color:0x394928 , temperature: [0,20], rainfall: [0.5,1], drainage: [-1,-0.9]},
//     {kind:CellKind.Prairie, color:0xafaf7b , temperature: [0,10], drainage: [0.5,1]},
//     {kind:CellKind.BorealForest, color:0x0d300e , temperature: [-5,5]},
//     {kind:CellKind.Tundra, color:0xDEDEDE , temperature:[-10,-5]}
// ]
let wtf = {
    "asd": "asa"
}


type TodoKeys = keyof wtf;

export type CellKind = "Mountain" | "ShallowWater" | "DeepWater" | "Desert" | "TropicalRainForest" 
                     | "SubTropicalRainForest" | "Savanna" | "Forest" | "Wasteland" | "Swamp" | "Prairie" | "BorealForest" | "Tundra"

export let allCellKinds:[CellKind] = ["Mountain" , "ShallowWater" , "DeepWater" , "Desert" , "TropicalRainForest" 
                     , "SubTropicalRainForest" , "Savanna" , "Forest" , "Wasteland" , "Swamp" , "Prairie" , "BorealForest" , "Tundra"]


export let allCellKindsNoWater:[CellKind] = [ "Desert" , "TropicalRainForest" 
                     , "SubTropicalRainForest" , "Savanna" , "Forest" , "Wasteland" , "Swamp" , "Prairie" , "BorealForest" , "Tundra"]


export function getCellTypeData(kind:CellKind) {
    switch (kind) {
        case "Mountain":
            return {kind:kind, color:0x101002} 
        case "ShallowWater":
            return {kind:kind, color:0x165896} 
        case "DeepWater":
            return {kind:kind, color:0x002f5b} 
        case "Desert":
            return {kind:kind, color:0xAA8639 , temperature: [0,30], rainfall: [-1,-0.8]} 
        case "TropicalRainForest":
            return {kind:kind, color:0x26ad2b , temperature: [20,30], rainfall: [0.5,1]} 
        case "SubTropicalRainForest":
            return {kind:kind, color:0x7ead80 , temperature: [20,30], rainfall: [0.0,0.5]} 
        case "Savanna":
            return {kind:kind, color:0xabad2d , temperature: [20,30], drainage: [-1,1], rainfall: [-0.8,0]}
        case "Forest":
            return {kind:kind, color:0x005b03 , temperature: [5,20], drainage: [-1,0.75]}
        case "Wasteland":
            return {kind:kind, color:0xada97e , temperature: [5,20], drainage: [0.75,1], rainfall: [-1,0]}
        case "Swamp":
            return {kind:kind, color:0x394928 , temperature: [0,20], rainfall: [0.5,1], drainage: [-1,-0.9]}
        case "Prairie":
            return {kind:kind, color:0xafaf7b , temperature: [0,10], drainage: [0.5,1]}
        case "BorealForest":
            return {kind:kind, color:0x0d300e , temperature: [-5,5]}
        case "Tundra":
            return {kind:kind, color:0xDEDEDE , temperature:[-10,-5]}
        default:
            break;
    }
}

// const wat:CellTypes = {kind:"Mountain", color:0x101002}
// export type CellType = { 
//     color: number
//     temperature?: [number, number]
//     drainage?: [number, number]
//     rainfall?: [number, number]
//     [key: string]: any;
// }

// interface CellTypeMap {
//     [key: string]: CellType;

// }

// export enum CellKind {
//     Mountain,
//     ShallowWater,
//     DeepWater,
//     Desert,
//     TropicalRainForest,
//     SubTropicalRainForest,
//     Savanna,
//     Forest,
//     Wasteland,
//     Swamp,
//     Prairie,
//     BorealForest,
//     Tundra,
// }

// export const cellTypes: CellTypeMap = {
//     "Mountain": { color:0x101002, temperature:null},
//     // "Water": { color:0x2A4F6E},
//     "ShallowWater": { color:0x165896, temperature:null},
//     "DeepWater": { color:0x002f5b, temperature:null},
//     "Desert": { color:0xAA8639,
//         temperature: [0,30],
//         rainfall: [-1,-0.8]},
//     "TropicalRainForest": { color:0x26ad2b,
//         temperature: [20,30],
//         rainfall: [0.5,1]},
//     "SubTropicalRainForest": { color:0x7ead80,
//         temperature: [20,30],
//         rainfall: [0.0,0.5]},
//     "Savanna": { color:0xabad2d,
//         temperature: [20,30],
//         drainage: [-1,1],
//         rainfall: [-0.8,0]},
//     "Forest": { color:0x005b03,
//         temperature: [5,20],
//         drainage: [-1,0.75]},
//     "Wasteland": { color:0xada97e,
//         temperature: [5,20],
//         drainage: [0.75,1],
//         rainfall: [-1,0]},
//     "Swamp": { color:0x394928,
//         temperature: [0,20],
//         rainfall: [0.5,1],
//         drainage: [-1,-0.9]},
//     "Prairie": { color:0xafaf7b,
//         temperature: [0,10],
//         drainage: [0.5,1]},
//     "BorealForest": { color:0x0d300e,
//         temperature: [-5,5]},
//     "Tundra": { color:0xDEDEDE,
//         temperature:[-10,-5]}
// };



// class CellType {
//     color: number
//     temperature?: [number, number]
//     rainfall?: [number, number]
//     constructor(color:number, temperature?: [number, number], rainfall?: [number, number]) {
//         this.color = color
//         this.temperature = temperature
//         this.rainfall = rainfall
//     }
// }

// export const cellTypes = {
//     "Mountain": new CellType(0x101002),
//      "ShallowWater": new CellType(0x165896),
//     "DeepWater": new CellType(0x002f5b),
//     "Desert": new CellType(0xAA8639, [0,30], rainfall: [-1,-0.8]),
//     "TropicalRainForest": new CellType(0x26ad2b, [20,30], rainfall: [0.5,1]),
//     "SubTropicalRainForest": new CellType(0x7ead80, [20,30], rainfall: [0.0,0.5]),
//     "Savanna": new CellType(0xabad2d, [20,30], drainage: [-1,1], rainfall: [-0.8,0]),
//     "Forest": new CellType(0x005b03, [5,20], drainage: [-1,0.75]),
//     "Wasteland": new CellType(0xada97e, [5,20], drainage: [0.75,1], rainfall: [-1,0]),
//     "Swamp": new CellType(0x394928, [0,20], rainfall: [0.5,1], drainage: [-1,-0.9]),
//     "Prairie": new CellType(0xafaf7b, [0,10], drainage: [0.5,1]),
//     "BorealForest": new CellType(0x0d300e, [-5,5]),
//     "Tundra": new CellType(0xDEDEDE,[-10,-5]),
// };


let Goods= {
    "Wood":{decayPerDay: 1/1000},
    "Weapons":{},
    "Food":{decayPerDay: 5/1000},
    "Baumwolle":{decayPerDay: 1/1000},
    "Wein":{},
    "Coffee":{decayPerDay: 5/1000},
    "Banana":{},
    "Gold":{},
    "Exotic Animals":{},
}
