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


let seaLevel = 0.2

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
        var easystar = new EasyStar.js();
        let stage = new PIXI.Container(0x66FF99, true);
        let renderer = new PIXI.autoDetectRenderer(width, height, {
            view: canvas, backgroundColor : 0x1099bb, antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoResize:true});

            PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

            let map = new PIXI.Container();
            stage.addChild(map);

            let mapWidth = 100
            let mapHeight = 80
            let cellSize = 10



            let world = new WorldMap(null, mapWidth, mapHeight)
            noise.seed(5);
            // noise.seed(Math.random());
            function drawCells(world){
                let paddingPerSide = 0

                world.cells.forEach(cell => {
                    // cell.data.elevation   = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight)
                    var mod = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight);
                    var value = noise.simplex3(cell.x* 2/mapWidth, cell.y* 2/mapHeight, mod * cell.y/(mapHeight*2));
                    cell.data.elevation = value
                })

                world.cells.forEach(cell => cell.data.temperature = noise.simplex2(cell.x/mapWidth, cell.y/mapHeight)) // very slow change
                world.cells.forEach(cell => cell.data.rainfall    = noise.simplex2(cell.x * 5/mapWidth, cell.y * 5/mapHeight))
                world.cells.forEach(cell => cell.data.drainage    = noise.simplex2(cell.x/20, cell.y/20))


                world.cells.forEach(cell => cell.scale())
                console.time("classify");
                world.cells.forEach(cell => cell.classify())

                function placeHouse(){
                    let shoreCells = world.cells.filter(cell => {
                        let neighbors = world.getNeighborsWithCell(cell)
                        return inRange(cell.data.elevation, [seaLevel - 0.05, seaLevel])
                            && neighbors.some(cell => (cell.type == "Water"))
                            && neighbors.some(cell => (cell.type != "Water"));
                        // return neighbors.some(cell => (cell.type != "Water"))
                        //     && cell.type == "Water";
                    } )

                    console.log(shoreCells.length)
                    // shoreCells.forEach(cell => cell.type="Mountain")
                    for (var i = 0; i < 2; i++) {
                        let cell = _.sample(shoreCells)
                        cell.isCity=true
                        // shoreCells = shoreCells.filter(cell5 => getDistance(cell5, cell)>5)
                    }
                    // shoreCells.forEach( cell => cell.isCity=true)


                }
                placeHouse()


                console.timeEnd("classify");
                var graphics = new PIXI.Graphics();
                let simplex =  new SimplexNoise()
        		for (var i = 0; i < world.cells.length; i++) {
        			var cell = world.cells[i];
                    var mod = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight);
                    var value = noise.simplex3(cell.x* 2/mapWidth, cell.y* 2/mapHeight, mod * cell.y/(mapHeight*2));
                    // var value = simplex.noise(cell.x/150, cell.y/150);
                    // let type = typeForNum(value)
                    let type = types[cell.type]
                    drawTileRaw(graphics, type.color, cellSize, paddingPerSide + cell.x * cellSize, paddingPerSide + cell.y * cellSize)

        		}
                stage.addChild(graphics);

                world.cells.filter(cell => cell.isCity).forEach(cell => {
                    let house = drawHouse(0xBB3333, cellSize*1.5)
                    house.x = cell.x * cellSize
                    house.y = cell.y * cellSize
                    stage.addChild(house);
                })

                var grid = new Array(mapHeight);
                for (let y = 0; y < mapHeight; y++) {
                    grid[y] = new Array(mapWidth);
                    for (let x = 0; x < mapWidth; x++) {
                        if (world.getCellAtXY(x,y).type == "Water" || world.getCellAtXY(x,y).isCity) {
                            grid[y][x] = 0
                        }else{
                            grid[y][x] = 1
                        }
                    }
                }
                easystar.setGrid(grid);
                easystar.setAcceptableTiles([0]);
                let start = world.cells.filter(cell => cell.isCity)[0]
                let end = world.cells.filter(cell => cell.isCity)[1]
                easystar.enableSync();
                easystar.findPath(start.x, start.y, end.x, end.y, function( path ) {
                    if (path === null) {
                        console.log("Path was not found.");
                    } else {
                        console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);

                        path.forEach(cell => {
                            let house = drawHouse(0xBB3333, cellSize*1.5)
                            house.x = cell.x * cellSize
                            house.y = cell.y * cellSize
                            stage.addChild(house);
                        })
                    }
                });

                easystar.calculate()
                console.log(world.getNeighbors(mapWidth-1,0))
        		// stage.addChild(map);
        	}
            drawCells(world)
            renderer.render(stage)

        }

}

function create2DArray(width, height){
    var x = new Array(height);
    for (var i = 0; i < height; i++) {
      x[i] = new Array(width);
    }
    return x
}


    const types = {
        "Mountain": { color:0x000000},
        "Water": { color:0x2A4F6E},
        "Desert": { color:0xAA8639,
            temperature: [0,30],
            rainfall: [-1,-0.8]},
        "TropicalRainForest": { color:0x297B48,
            temperature: [20,30],
            rainfall: [0.5,1]},
        "SubTropicalRainForest": { color:0x7ead80,
            temperature: [20,30],
            rainfall: [0.0,0.5]},
        "Savanna": { color:0xabad2d,
            temperature: [20,30],
            drainage: [-1,1],
            rainfall: [-0.8,0]},
        "Forest": { color:0x6dad2d,
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
        "BorealForest": { color:0xD234713,
            temperature: [-5,5]},
        "Tundra": { color:0xDEDEDE,
            temperature:[-15,-5]}
    };

    let typesWithoutWater = Object.assign({}, types);
    delete typesWithoutWater.Water
    delete typesWithoutWater.Mountain

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
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.data = {}
        }
        draw(){
        }
        scale(){
            // NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
            let oldRange = 2
            let newRange = 30 + 15
            this.data.temperature = (((this.data.temperature + 1) * newRange) / oldRange) - 15
            // console.log(this.data.temperature)
        }
        classify(){
            let data = this.data
            if (data.elevation < seaLevel) {
                this.type = "Water"
            }else if (data.elevation > 0.85) {
                this.type = "Mountain"
            }else{
                let candidates = {}
                let self = this
                function checkSet(){
                    if(Object.keys(candidates).length === 1) self.type = Object.keys(candidates)[0]
                }

                // Check temperature
                _.each(typesWithoutWater, function(type, key){
                    if(inRange(data.temperature, type.temperature)) candidates[key] = true
                })

                _.each(candidates, function(nothing, key){
                    checkSet()
                    if (typesWithoutWater[key].rainfall && !inRange(data.rainfall, typesWithoutWater[key].rainfall))
                        delete candidates[key]
                })

                _.each(candidates, function(nothing, key){
                    checkSet()
                    if (typesWithoutWater[key].drainage && !inRange(data.drainage, typesWithoutWater[key].drainage)) delete candidates[key]
                })

                checkSet()
                if(Object.keys(candidates).length > 1) self.type = Object.keys(candidates)[0]

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
        constructor(cities, width, height) {
            this.cities = cities;
            this.width = width
            this.height = height
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
        getNeighborsWithCell(cell){return this.getNeighbors(cell.x, cell.y)}
        getNeighbors(x,y){
            let neighbors = []
            for (let rowNum=Math.max(x-1, 0); rowNum<=Math.min(x+1, this.width-1); rowNum++) {
                for (let colNum=Math.max(y-1, 0); colNum<=Math.min(y+1, this.height-1); colNum++) {
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

    let Goods= [
        "Wood",
        "Weapons",
        "Food",
        "Baumwolle",
        "Wein",
        "Weapons",
        "Weapons",
        "Weapons",
        "Weapons",
    ]
