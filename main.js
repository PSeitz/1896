window.onload = addCanvasStuff;

let colors = [0xec407a,0xab47bc,0x26c6da,0xffca28,0x29b6f6,0xe84e40,0x5c6bc0,0xff7043,0x9ccc65];

let owners = [];

function getNextColor(){
    return getNext(colors, 'colors')
}

let cursors = {};
function getNext(collection, name){
    if (!cursors[name]) cursors[name] = 0;

    if (cursors[name] == collection.length) {
        cursors[name]=0;
    }
    let col = collection[cursors[name]];
    cursors[name]++;
    return col;
}


let filter = PIXI.filters || PIXI.Filter;

class Game {
    constructor(money) {
        this.money = money;
    }
}

let game = new Game(0)
let width = 800;
let height = 800;

function init() {

}

function showhide(id) {
    var e = document.getElementById(id);
    e.style.display = (e.style.display == 'inline-block') ? 'none' : 'inline-block';
 }

function switchToCanvas(){
    showhide('startit')
    showhide('moneyyeshrich')
    showhide('stage')
    addCanvasStuff()
}

function addCanvasStuff(){
    let canvas = document.getElementById("stage");

    let mouseDown = false


    canvas.width=width;
    canvas.height=height;

    let loader = PIXI.loader
    loader
		.add("cloud1", "img/cloud1_nice.png")
        .add("cloud3", "img/cloud4_nice.png")
        .load(abgehts);

    function abgehts(){

        let stage = new PIXI.Container(0x66FF99, true);
        let renderer = new PIXI.autoDetectRenderer(width, height, {
            view: canvas, backgroundColor : 0x1099bb, antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoResize:true});

            PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

            let map = new PIXI.Container();
            stage.addChild(map);
            let world = new WorldMap(null, 350, 350)
            noise.seed(Math.random());
            function drawCells(world){
        		//clear all graphic objects on the stage
        		// map.clear();
        		//set drawing style
        		// map.lineStyle(1, 0x999999);

                let cellSize = 2
                let paddingPerSide = 0
        		//iterate all cells in the world

                world.cells.forEach(cell => cell.data.elevation = noise.perlin2(x/50, y/50))
                world.cells.forEach(cell => cell.data.temperature = noise.perlin2(x/200, y/200))
                world.cells.forEach(cell => cell.data.rainfall = noise.perlin2(x/20, y/20))
                world.cells.forEach(cell => cell.data.drainage = noise.perlin2(x/20, y/20))

        		for (var i = 0; i < world.cells.length; i++) {

        			var cell = world.cells[i];
        			var x = cell.x;
        			var y = cell.y;

        			//calculate the position on the canvas where the cell should be drawn
        			// var drawPosX = paddingPerSide + x + ((x % numberOfCellsPerRow) * (cellSize-1));
        			// var drawPosY = paddingPerSide + y + ((y % numberOfCellsPerRow) * (cellSize-1));
                    var value = noise.perlin2(x/200, y/200);
                    let type = typeForNum(value)

                    cell.sprite = drawTile(type.color, cellSize - paddingPerSide);
                    // cell.sprite.anchor.x = 0
                    // cell.sprite.anchor.y = 0
                    cell.sprite.position.x = paddingPerSide + x * cellSize;
                    cell.sprite.position.y = paddingPerSide + y * cellSize;
                    map.addChild(cell.sprite);

        		}
        		// stage.addChild(map);
        	}
            drawCells(world)
            renderer.render(stage)

        }

}

    const typesWithRanges = {
        "DesertC":  {range: [-1, -0.55], color:0xAA8639},
        "City1":  {range: [-0.55, -0.5], color:0xCC0000},
        "Water": {range: [-0.5, 0], color:0x2A4F6E},
        "City":  {range: [0, .05], color:0xCC0000},
        "Wood":  {range: [.05, 0.5], color:0x297B48},
        "WoodDesert":  {range: [.5, 0.55], color:0x506630},
        "Desert":  {range: [.55, 0.9], color:0xAA8639},
        "Ice":  {range: [0.9, 1.0], color:0xDEDEDE}
    };

    const types = {
        "Water": { color:0x2A4F6E},
        "WarmDesert": { color:0xAA8639, temperature: [30,50]},
        "TropicalRainForest": { color:0x297B48, temperature: [20,30]},
        "Savanna": { color:0x297B48, temperature: [20,30]},
        "Desert": { color:0xAA8639, temperature: [10,20]},
        "Forest": { color:0x297B48, temperature: [5,20]},
        "Prairie": { color:0x506630, temperature: [0,10]},
        "BorealForest": { color:0xDEDEDE,temperature: [-10,0]},
        "Tundra": { color:0xDEDEDE, temperature:[-20,-10]},
        "Ice": { color:0xDEDEDE, temperature:[-30,-20]},
    };


    [30,50]
    [20,30]
    [20,30]
    [10,20]
    [5,20]
    [0,10]
    [-10,0]
    [-20,-10]
    [-30,-20]









    // -30 start
    let temperatureTypes = [
        {"WarmDesert":[30,50]},
        {"TropicalRainForest":[20,30]},
        {"Savanna":[20,30]},
        {"Desert":[10,20]},
        {"Forest":[5,20]},
        {"Prairie":[0,10]},
        {"BorealForest":[-10,0]},
        {"Tundra":[-20,-10]},
        {"Ice":[-30,-20]}
    ]

    const classification = {
        { elevation: [-1, 0],type: "Water"},
        { elevation: [-1, 0],type: "City",},
        { elevation: [-1, 0],type: "Wood",},
        { elevation: [-1, 0],type: "WoodDesert"},
        { elevation: [-1, 0],type: "Desert",},
        { elevation: [-1, 0],type: "Ice",}
    };

    function typeForNum(num){
        for (var key in typesWithRanges) {
            let type = typesWithRanges[key]
            if(num >=type.range[0]  && num <= type.range[1]) return type
        }
    }

    class WorldCell {
        constructor(isWater, x, y) {
            this.isWater = isWater;
            this.x = x;
            this.y = y;
            this.data = {}
        }
        draw(){
        }
        classify(){

        }
    }



    class Key {
        constructor(keycode) {
            let keyCallBack = keyboard(keycode);
            this.pressed = false
            keyCallBack.press = () => {this.pressed = true;}
            keyCallBack.release = () => {this.pressed = false;}
        }
    }
    class WorldMap {
        constructor(cities, width, length) {
            this.cities = cities;
            this.cells = []
            this.createCells(width, length)
        }
        createCells(width, length){
            for (let x = 0; x < width; x++) {
    			for (let y = 0; y < length; y++) {
    				let cell = new WorldCell(true, x,y);
    				this.cells.push(cell);
    			}
    		}
        }
        draw(){

        }
        getCellAtXY(x,y){
    		for (let i = 0; i < this.cells.length; i++) {
    			let cell = this.cells[i];
    			if(cell.x === x && cell.y === y){
    				return cell;
    			}
    		}
    	}
    }

    function getDistance( point1, point2 )
    {
        return Math.hypot(point2.x-point1.x, point2.y-point1.y)
    }

    class SupplyAndDemand {
        constructor(supply, demand) {
            this.supply = supply;
            this.position = demand;
        }

    }

    class City {
        constructor(name, initialPosition) {
            this.supplyAndDemand = new SupplyAndDemand()
            this.name = name;
            this.chemtrailTank = 300;
            this.speed = 1;
            this.maxSpeed = 2;
            this.angle = 180;
            this.position = initialPosition;
            this.rotationSpeed = 0.5;
            this.spotted = 0;
        }

        spray(delta, stage){
            if (this.chemtrailTank <= 0) {
                return;
            }
            let chemTrailAmount =  (1 * delta)
            this.chemtrailTank -= chemTrailAmount;
            this.chemtrailTank = Math.max(0, this.chemtrailTank)
            this.chemtrails.addTrail(this.position, chemTrailAmount, stage)
        }
    }


    class Ship {
        constructor(name, condition, capacity, position) {
            this.name = name;
            this.condition = condition;
            this.capacity = capacity;
            this.position = position
        }
        move(delta){
        }
    }
