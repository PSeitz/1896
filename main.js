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
let width = 1000;
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

            let mapWidth = 1000
            let mapHeight = 800
            let cellSize = 1

            let world = new WorldMap(null, mapWidth, mapHeight)
            noise.seed(Math.random());
            function drawCells(world){
        		//clear all graphic objects on the stage
        		// map.clear();
        		//set drawing style
        		// map.lineStyle(1, 0x999999);


                let paddingPerSide = 0
        		//iterate all cells in the world

                world.cells.forEach(cell => cell.data.elevation   = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight))
                world.cells.forEach(cell => cell.data.temperature = noise.simplex2(cell.x/mapWidth, cell.y/mapHeight)) // very slow change
                world.cells.forEach(cell => cell.data.rainfall    = noise.simplex2(cell.x * 5/mapWidth, cell.y * 5/mapHeight))
                world.cells.forEach(cell => cell.data.drainage    = noise.simplex2(cell.x/20, cell.y/20))

                // world.cells.forEach(cell => cell.scale())
                // world.cells.forEach(cell => cell.classify())

                var graphics = new PIXI.Graphics();
                let simplex =  new SimplexNoise()
        		for (var i = 0; i < world.cells.length; i++) {
        			var cell = world.cells[i];
        			var x = cell.x;
        			var y = cell.y;
                    var mod = noise.simplex2(x * 10/mapWidth, y * 10/mapHeight);
                    var value = noise.simplex3(x* 2/mapWidth, y* 2/mapHeight, mod * y/mapHeight);
                    // var value = simplex.noise(x/150, y/150);
                    let type = typeForNum(value)
                    drawTileRaw(graphics, type.color, cellSize, paddingPerSide + x * cellSize, paddingPerSide + y * cellSize)

        		}
                stage.addChild(graphics);

        		// stage.addChild(map);
        	}
            drawCells(world)
            renderer.render(stage)

        }

}



    const types = {
        "Water": { color:0x2A4F6E},
        "Desert": { color:0xAA8639,
            temperature: [0,30],
            rainfall: [-1,-0.8]},
        "TropicalRainForest": { color:0x297B48,
            temperature: [20,30],
            rainfall: [0.5,1]},
        "SubTropicalRainForest": { color:0x297B48,
            temperature: [20,30],
            rainfall: [0.0,0.5]},
        "Savanna": { color:0x297B48,
            temperature: [20,30],
            drainage: [-1,1],
            rainfall: [-0.8,0]},
        "Forest": { color:0x297B48,
            temperature: [5,20],
            drainage: [-1,0.75]},
        "Wasteland": { color:0x297B48,
            temperature: [5,20],
            drainage: [0.75,1],
            rainfall: [-1,0]},
        "Swamp": { color:0x506630,
            temperature: [0,20],
            rainfall: [0.5,1],
            drainage: [-1,-0.9]},
        "Prairie": { color:0x506630,
            temperature: [0,10],
            drainage: [0.5,1]},
        "BorealForest": { color:0xDEDEDE,
            temperature: [-5,5]},
        "Tundra": { color:0xDEDEDE,
            temperature:[-15,-5]}
    };

    let typesWithoutWater = Object.assign({}, types);
    delete typesWithoutWater.Water

    const typesWithRanges = {
        "Water": {range: [-1, 0], color:0x2A4F6E},
        "City":  {range: [0, .05], color:0xCC0000},
        "Wood":  {range: [.05, 0.5], color:0x297B48},
        "WoodDesert":  {range: [.5, 0.55], color:0x506630},
        "Desert":  {range: [.55, 0.9], color:0xAA8639},
        "Ice":  {range: [0.9, 1.0], color:0xDEDEDE}
    };

    function typeForNum(num){
        for (var key in typesWithRanges) {
            let type = typesWithRanges[key]
            if(inRange(num, type.range)) return type
        }
    }

    function inRange(num, range) {
        return num >= range[0] && num <= range[1]
    }

    function typesToArr(){
        let arr = []
        for (var key in types) {
            let obj = Object.assign({}, types[key]);
            obj.name = key
            arr.push(obj)
        }
        return arr
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
        scale(){
            // NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
            console.log(this.data.temperature)
            let oldRange = 2
            let newRange = 30 + 15
            this.data.temperature = (((this.data.temperature + 1) * newRange) / oldRange) - 15

            // this.data.temperature = (((this.data.temperature - (-1))) * (30 - (-15)))) / (1 - (-1)))) + (-15)
            console.log(this.data.temperature)
        }
        classify(){
            let data = this.data
            if (data.elevation < 0) {
                this.type = "Water"
            }else{
                let candidates = {}
                // Check temperature
                _.each(typesWithoutWater, function(type, key){
                    if(inRange(data.temperature, type.temperature)) candidates[key] = true
                })

                _.each(candidates, function(nothing, key){
                    let type = typesWithoutWater[key]
                    if (type.rainfall) {
                        if(!inRange(data.rainfall, type.rainfall)) delete candidates[key]
                    }
                })

                _.each(candidates, function(nothing, key){
                    let type = typesWithoutWater[key]
                    if (type.drainage) {
                        if(!inRange(data.drainage, type.drainage)) delete candidates[key]
                    }
                })
                console.log(Object.keys(candidates))
                // Check drainage

                // Check rainfall


                // let candidates = Object.assign({}, types);
                // delete candidates.Water
                // let typesArr = typesToArr()
                // _.remove(typesArr, type => )

            }
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
