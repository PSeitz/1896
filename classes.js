
let typesWithoutWater = Object.assign({}, cellTypes);
delete typesWithoutWater.ShallowWater
delete typesWithoutWater.DeepWater
// delete typesWithoutWater.Water
delete typesWithoutWater.Mountain


let maxTemperatur = _.maxBy(_.values(cellTypes), el => (el.temperature ? el.temperature[1] : 0)).temperature[1];
let minTemperatur = _.minBy(_.values(cellTypes), el => (el.temperature ? el.temperature[0] : 0)).temperature[0];

class Game {
    constructor(world) {
        this.world = world;
        this.cities = [];
        this.day = 0;

        this.player = new Player(3500000)
        this.ships = []
    }
    turn(){

    }
}

class Player {
    constructor(money) {
        this.money = money;
    }
}

function scale(val,oldMin, oldMax, newMin, newMax){
    return (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
}
class WorldCell {
    constructor(x, y) {
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
    classify(seaLevel){
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

            let candidates = []
            let self = this
            function checkSet(){
                if(candidates.length === 1) self.type = candidates[0]
            }
            // Check temperature
            _.each(typesWithoutWater, function(type, key){
                if(inRange(data.temperature, type.temperature)) candidates.push(key)//[key] = true
            })
            function filter(prop){
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

class WorldMap {
    constructor(cities, width, height, seaLevel) {
        this.cities = cities;
        this.width = width
        this.height = height
        this.seaLevel = seaLevel
        this.cells = []
        this.createCells(width, height)
    }
    createCells(width, height){
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let cell = new WorldCell(x,y);
                this.cells.push(cell);
            }
        }
    }
    draw(){

    }
    getNeighborsWithCell(cell, radius){return this.getNeighbors(cell.x, cell.y, radius)}
    getNeighbors(x,y, radius){
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
    getCellAtXY(x,y){
        for (let i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i];
            if(cell.x === x && cell.y === y){
                return cell;
            }
        }
        throw new Error("cell at " + x + ' ' +y + ' not found')
    }
}

function getDistance( point1, point2 )
{
    return Math.hypot(point2.x-point1.x, point2.y-point1.y)
}


class SupplyAndDemand {
    constructor(producingGoods, neededGoods, population) {
        // this.supply = supply;
        // this.demand = demand;
    }
}

class InfluenceArea{
    constructor(cell, world) {
        this.nearNeighbors = world.getNeighborsWithCell(cell, 3)
    }
    getNeighborsWithTypes(types){
        return this.nearNeighbors.filter(cell => types.indexOf(cell.type))
    }
    getWoodCells(){
        return this.getNeighborsWithTypes(["BorealForest", "TropicalRainForest", "Forest"]).length
    }
}

class City {
    constructor(name, cell, population, world) {
        this.InfluenceArea = new InfluenceArea(cell, world)
        this.supplyAndDemand = new SupplyAndDemand()
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


class Ship {
    constructor(name, condition, capacity, position, owner) {
        this.name = name;
        this.condition = condition;
        this.capacity = capacity;
        this.position = position
        this.owner = owner
    }
    move(delta){
    }
}
