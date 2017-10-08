
import {cellTypes, CellType} from './types'
import {inRange,scale} from './util.js'

import {cellSize, stage, renderer, easystar, world} from './main'
import * as _ from 'lodash';

let typesWithoutWater = Object.assign({}, cellTypes);
delete typesWithoutWater.ShallowWater
delete typesWithoutWater.DeepWater
// delete typesWithoutWater.Water
delete typesWithoutWater.Mountain


export let maxTemperatur = _.maxBy(_.values(cellTypes), (el: CellType) => (el.temperature ? el.temperature[1] : 0)).temperature[1];
export let minTemperatur = _.minBy(_.values(cellTypes), (el: CellType) => (el.temperature ? el.temperature[0] : 0)).temperature[0];

export class Game {
    world: WorldMap
    day: number
    player: Player
    constructor(world: WorldMap) {
        this.world = world;
        // this.cities = [];
        this.day = 0;

        this.player = new Player(3500000, "theplayer")
        // this.players = [
        //     new Player(3500000, "theplayer"),
        //     new Player(3500000, "theplayer")
        // ]

        // this.ships = []
    }
    turn(){

    }
}


export interface Position {
    x: number;
    y: number;
}

export class Player {
    money: number
    name: string 
    constructor(money:number, name:string) {
        this.money = money;
        this.name = name;
    }
}

export class WorldCell {
    x: number
    y: number
    data: any
    type: string  // @FixMe enum
    isCity: boolean
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.data = {}
    }
    draw(){
    }
    scale(){
        // NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
        // let oldRange = 2
        // let newRange = maxTemperatur - minTemperatur

        let isNegative = this.data.temperature < 0

        // x^(1/sin(0.8)) http://fooplot.com/
        this.data.temperature = Math.pow(Math.abs(this.data.temperature), 1/Math.sin(0.6))
        if (isNegative) this.data.temperature *= -1

        // this.data.temperature = (((this.data.temperature + 1) * newRange) / oldRange) + minTemperatur
        this.data.temperature = scale(this.data.temperature,-1, 1, minTemperatur, maxTemperatur)

        // this.data.temperature = Math.minTemperatur(maxTemperatur, this.data.temperature)
        // this.data.temperature = Math.maxTemperatur(minTemperatur, this.data.temperature)
    }
    classify(seaLevel:number){
        let data = this.data
        if (data.elevation < seaLevel) {
            if (data.elevation + 0.2 < seaLevel) {
                this.type = "DeepWater"
            }else{
                this.type = "ShallowWater"
            }

        }else if (data.elevation > 0.85) {
            this.type = "Mountain"
        }else{

            let candidates: string[] = []
            let self = this
            // function checkSet(){
            //     if(candidates.length === 1) self.type = candidates[0]
            // }
            // Check temperature
            _.each(typesWithoutWater, function(type, key){
                if(inRange(data.temperature, type.temperature)) candidates.push(key)//[key] = true
            })
            let filter = (prop: string) => {
                let cando = candidates.filter(cand => (typesWithoutWater[cand][prop] && !inRange(data[prop], typesWithoutWater[cand][prop])))
                if (cando.length === 0 && candidates.length > 0) self.type = candidates[0]
                candidates = cando
                if(candidates.length === 1) self.type = candidates[0]
            }
            filter('rainfall')
            filter('drainage')
            if(candidates.length >= 1) self.type = candidates[0]

        }
    }
}

export class WorldMap {
    cities: City[] 
    ships: Ship[] 
    width: number
    height: number
    seaLevel: number
    cells: WorldCell[] 
    constructor(width:number, height:number, seaLevel:number) {
        this.cities = [];
        this.ships = [];
        this.width = width
        this.height = height
        this.seaLevel = seaLevel
        this.cells = []
        this.createCells(width, height)
    }
    createCells(width:number, height:number){
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let cell = new WorldCell(x,y);
                this.cells.push(cell);
            }
        }
    }
    draw(){

    }
    getNeighborsWithCell(cell: WorldCell, radius?:number){return this.getNeighbors(cell.x, cell.y, radius)}
    getNeighbors(x:number,y:number, radius?:number){
        radius = radius || 1
        let neighbors = []
        for (let rowNum=Math.max(x-radius, 0); rowNum<=Math.min(x+radius, this.width-1); rowNum++) {
            for (let colNum=Math.max(y-radius, 0); colNum<=Math.min(y+radius, this.height-1); colNum++) {
                if (rowNum == x && colNum == y) continue;
                neighbors.push(this.getCellAtXY(rowNum,colNum))
                // All the neighbors will be grid[rowNum][colNum]
            }
        }
        return neighbors
    }
    getCellAtXY(x:number,y:number){
        for (let i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i];
            if(cell.x === x && cell.y === y){
                return cell;
            }
        }
        throw new Error("cell at " + x + ' ' +y + ' not found')
    }
}



export class SupplyAndDemand {
    constructor(producingGoods:any, neededGoods:any, population:number) {
        // this.supply = supply;
        // this.demand = demand;
    }
}

export class InfluenceArea{
    nearNeighbors: WorldCell[]
    constructor(cell:WorldCell, world: WorldMap) {
        this.nearNeighbors = world.getNeighborsWithCell(cell, 3)
    }
    getNeighborsWithTypes(types: string[]){
        return this.nearNeighbors.filter(cell => types.indexOf(cell.type))
    }
    getWoodCells(){
        return this.getNeighborsWithTypes(["BorealForest", "TropicalRainForest", "Forest"]).length
    }
}

export class City {
    influenceArea: InfluenceArea
    supplyAndDemand: SupplyAndDemand
    name: string
    cell: WorldCell
    population: number
    constructor(name:string, cell: WorldCell, population:number, world:WorldMap) {
        this.influenceArea = new InfluenceArea(cell, world)
        this.supplyAndDemand = new SupplyAndDemand(1, 2, 3)
        this.name = name;
        this.cell = cell;
        this.population = population;
    }
    turn(){
        this.produce()
        this.consume()
    }
    produce(){

    }
    consume(){

    }
}


export class Ship {
    name: string
    condition: number
    capacity: number
    position: Position
    owner: string
    drivingTo: City
    currentPath: Position[]
    constructor(name: string, condition:number, capacity:number, position: WorldCell, owner: string) {
        this.name = name;
        this.condition = condition;
        this.capacity = capacity;
        this.position = position
        this.owner = owner
    }
    move(){
        if(!this.drivingTo) return
        if(!this.currentPath)
            this.currentPath = easystar.findPath(this.position.x, this.position.y, this.drivingTo.cell.x, this.drivingTo.cell.y)
        // if(this.currentPath == null) delete this.drivingTo

        this.currentPath.shift()
        this.position = this.currentPath[1];

    }
}
