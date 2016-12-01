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


let mapWidth = 100
let mapHeight = 80
let cellSize = 10

let world = new WorldMap(null, mapWidth, mapHeight)

function addCanvasStuff(){


    let loader = PIXI.loader
    loader
		.add("cloud1", "img/cloud1_nice.png")
        .add("cloud3", "img/cloud4_nice.png")
        .load(abgehts);

}

function abgehts(){
    let canvas = document.getElementById("stage");
    canvas.width=width;
    canvas.height=height;
    var easystar = new EasyStar.js();
    let stage = new PIXI.Container(0x66FF99, true);
    let renderer = new PIXI.autoDetectRenderer(width, height, {
        view: canvas, backgroundColor : 0x1099bb, antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoResize:true});

    PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

    let map = new PIXI.Container();
    stage.addChild(map);




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
            for (var i = 0; i < 2; i++) {
                let cell = _.sample(shoreCells)
                cell.isCity=true
                // shoreCells = shoreCells.filter(cell5 => getDistance(cell5, cell)>5)
            }
            shoreCells.forEach( cell => cell.isCity=true)


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

function create2DArray(width, height){
    var x = new Array(height);
    for (var i = 0; i < height; i++) {
      x[i] = new Array(width);
    }
    return x
}


function inRange(num, range) {
    return num >= range[0] && num <= range[1]
}
