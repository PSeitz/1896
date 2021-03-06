
export enum SeaLevelCellKind {
    Mountain = "Mountain",
    ShallowWater = "ShallowWater",
    DeepWater = "DeepWater"
}

export enum OtherCellKind {
    Mountain = "Mountain",
    ShallowWater = "ShallowWater",
    DeepWater = "DeepWater",
    Desert = "Desert",
    TropicalRainForest = "TropicalRainForest",
    SubTropicalRainForest = "SubTropicalRainForest",
    Savanna = "Savanna",
    Forest = "Forest",
    Wasteland = "Wasteland",
    Swamp = "Swamp",
    Prairie =  "Prairie",
    BorealForest = "BorealForest",
    Tundra = "Tundra"
}

export type CellKind = SeaLevelCellKind | OtherCellKind

export type CellType = { 
    color: number
    temperature?: [number, number]
    drainage?: [number, number]
    rainfall?: [number, number]
    [key: string]: any;
}

export type CellTypeMap = {
    [P in CellKind]: CellType;
}
export type CellTypeMapNoWater = {
    [P in OtherCellKind]: CellType;
}

export const CellTypes: CellTypeMap = {
    Mountain: { color:0x101002, temperature:null},
    // "Water": { color:0x2A4F6E},
    ShallowWater: { color:0x165896, temperature:null},
    DeepWater: { color:0x002f5b, temperature:null},
    Desert: { color:0xAA8639,
        temperature: [0,30],
        rainfall: [-1,-0.8]},
    "TropicalRainForest": { color:0x26ad2b,
        temperature: [20,30],
        rainfall: [0.5,1]},
    "SubTropicalRainForest": { color:0x7ead80,
        temperature: [20,30],
        rainfall: [0.0,0.5]},
    "Savanna": { color:0xabad2d,
        temperature: [20,30],
        drainage: [-1,1],
        rainfall: [-0.8,0]},
    "Forest": { color:0x005b03,
        temperature: [5,20],
        drainage: [-1,0.75]},
    "Wasteland": { color:0xada97e,
        temperature: [5,20],
        drainage: [0.75,1],
        rainfall: [-1,0]},
    "Swamp": { color:0x394928,
        temperature: [0,20],
        rainfall: [0.5,1],
        drainage: [-1,-0.9]},
    "Prairie": { color:0xafaf7b,
        temperature: [0,10],
        drainage: [0.5,1]},
    "BorealForest": { color:0x0d300e,
        temperature: [-5,5]},
    "Tundra": { color:0xDEDEDE,
        temperature:[-10,-5]}
};


export const cellTypesWithoutWater: CellTypeMapNoWater = Object.assign({}, CellTypes);
delete cellTypesWithoutWater.ShallowWater
delete cellTypesWithoutWater.DeepWater
delete cellTypesWithoutWater.Mountain

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
