window.onload = addCanvasStuff;


let seaLevel = 0.2

let canvasWidth = 1500;
let canvasHeight = 800;
let mapWidth = 150
let mapHeight = 80
let cellSize = 10
var easystar = new EasyStar.js();

let world = new WorldMap(null, mapWidth, mapHeight)
let game = new Game(world)
console.time("generateWorld")
generateWorld(world)
console.timeEnd("generateWorld")
localStorage['savegame1'] = JSON.stringify(game)


// game = JSON.parse(localStorage['savegame1'])
// world = game.world

function setPathFindGrid() {
    var grid = new Array(mapHeight);
    for (let y = 0; y < mapHeight; y++) {
        grid[y] = new Array(mapWidth);
        for (let x = 0; x < mapWidth; x++) {
            let isReachable = isWater(world.getCellAtXY(x,y).type) || world.getCellAtXY(x,y).isCity
            grid[y][x] = isReachable ? 0 : 1
        }
    }
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    easystar.enableSync();
}

function isWater(type){
    return type == "ShallowWater" || type == "DeepWater" || type == "Water"
}
function generateWorld(world){

    // noise.seed(16);
    // noise.seed(Math.random());
    console.time("cells")
    world.cells.forEach(cell => {
        // cell.data.elevation   = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight)
        var mod = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight);
        var value = noise.simplex3(cell.x* 2/mapWidth, cell.y* 2/mapHeight, mod * cell.y/(mapHeight*5));
        cell.data.elevation = value
    })

    world.cells.forEach(cell => cell.data.temperature = noise.simplex2(cell.x/mapWidth, cell.y/mapHeight)) // very slow change
    world.cells.forEach(cell => cell.data.rainfall    = noise.simplex2(cell.x * 2/mapWidth, cell.y * 2/mapHeight))
    world.cells.forEach(cell => cell.data.drainage    = noise.simplex2(cell.x/20, cell.y/20))

    world.cells.forEach(cell => cell.scale())
    world.cells.forEach(cell => cell.classify())
    console.timeEnd("cells")

    function placeHouse(){
        let shoreCells = world.cells.filter(cell => {
            let neighbors = world.getNeighborsWithCell(cell)
            return inRange(cell.data.elevation, [seaLevel - 0.05, seaLevel])
                && neighbors.some(cell => isWater(cell.type))
                && neighbors.some(cell => !isWater(cell.type));
            // return neighbors.some(cell => (cell.type != "Water"))
            //     && cell.type == "Water";
        } )

        console.log(shoreCells.length)
        for (var i = 0; i < 250; i++) {
            let cell = _.sample(shoreCells)
            cell.isCity=true
            // shoreCells = shoreCells.filter(cell5 => getDistance(cell5, cell)>5)
            let minDistance = canvasWidth * canvasHeight  /100000
            shoreCells.filter(cell5 => (getDistance(cell5, cell)<minDistance && cell5 !=cell)).forEach(cell => (cell.isCity = false))
        }

        // shoreCells.forEach(cell => cell.isCity=true)
        // shoreCells.forEach(city => {
        //     if(world.getNeighborsWithCell(city).some(cell => cell.isCity)){
        //         let group = world.getNeighborsWithCell(city)
        //         city.isCity = false
        //         group.forEach(cell => (cell.isCity=false))
        //         _.sample(group).isCity = true
        //     }
        // })
    }
    placeHouse()


    function groupCities(){
        let cities = world.cells.filter(cell => cell.isCity)

        let groups = []
        let groupNum = 1

        while (cities.length >0) {
            let start = cities.pop()
            let group = []
            groups.push(group)
            group.push(start)
            var addGroup = _.remove(cities, city => easystar.findPath(start.x, start.y, city.x, city.y));
            Array.prototype.push.apply(group, addGroup)
        }
        let newCities = _.maxBy(groups, 'length');
        groups.forEach(group => {
            if (group!=newCities) {
                group.forEach(city => (city.isCity = false))
            }
        })
    }
    let maxCities = canvasWidth * canvasHeight / 50000
    function limitNumCities(){
        while (world.cells.filter(cell => cell.isCity).length > maxCities) {
            _.sample(world.cells.filter(cell => cell.isCity)).isCity = false
        }
    }

    console.time("groupCities")
    setPathFindGrid()
    groupCities()
    limitNumCities()


    let cityCells = world.cells.filter(cell => cell.isCity)
    cityCells.forEach(cell => {
        game.cities.push(new City(faker.address.city(), cell, 10, world))
    })

    console.timeEnd("groupCities")


    // Add Ship
    let startCell = _.sample(cityCells)
    let playerShip = new Ship(faker.commerce.productName(), 100, 35, startCell, game.player)
    game.ships.push(playerShip)

}

let sprites = {

}

function temperatureToColor(value){
    let val = Math.round(scale(value,minTemperatur, maxTemperatur, -255, 0)) * -1
    let hex = val.toString(16)
    return '0xFF'+hex+hex
}
function elevationToColor(value){
    let val = scale(value,-1, 1, -255, 0)
    let hex = Math.round(val*-1).toString(16)
    return '0x'+hex+hex+hex
}
function rainfallToColor(value){
    let val = Math.round(scale(value, -1 ,1 , -255, 0)) * -1
    let hex = val.toString(16)
    let color = '0x'+hex+hex+'FF'
    return color
}

function setupMovie (baseString){

    var frames = [];
    let textures = PIXI.loader.resources[baseString].textures
    for (var i = 0; i < Object.keys(textures).length; i++) {
        frames.push(textures[baseString+i+'.png']);
    }
    var movie = new PIXI.extras.MovieClip(frames);
    movie.animationSpeed = 0.13
    movie.play();
    return movie;
}

let stage = new PIXI.Container(0x66FF99, true);
let renderer;


let menu = null

function closeCityMenu(city){
    stage.removeChild(menu)
}

function openCityMenu(city){
    let xPos = city.cell.x * cellSize + 20
    let yPos = city.cell.y * cellSize - 5
    if (menu) {
        stage.removeChild(menu)
        if (menu.x == xPos && menu.y == yPos) { // same menu
            menu = null
            return
        }
    }
    menu = new PIXI.Container();
    menu.x = xPos
    menu.y = yPos

    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x111111, 0.8);
    graphics.drawRect(0, 0, 128, 32)
    graphics.endFill();
    menu.addChild(new PIXI.Sprite(graphics.generateCanvasTexture()));

    let movie = setupMovie('beer')
    menu.addChild(movie);
    stage.addChild(menu)

}

function drawCanvas(){
    let canvas = document.getElementById("stage");
    canvas.width=canvasWidth;
    canvas.height=canvasHeight;

    renderer = new PIXI.autoDetectRenderer(canvasWidth, canvasHeight, {
        view: canvas, backgroundColor : 0x1099bb, antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoResize:true});

    PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

    function drawCells(world){
        let paddingPerSide = 0
        sprites.container = new PIXI.Container();
        sprites.temperatureView = new PIXI.Graphics();
        sprites.worldView = new PIXI.Graphics();
        sprites.elevationView = new PIXI.Graphics();
        sprites.rainFallView = new PIXI.Graphics();
        for (var i = 0; i < world.cells.length; i++) {
            var cell = world.cells[i];
            let x = paddingPerSide + cell.x * cellSize
            let y = paddingPerSide + cell.y * cellSize
            let type = cellTypes[cell.type]
            drawTileRaw(sprites.worldView, type.color, cellSize, x, y)
            drawTileRaw(sprites.temperatureView, temperatureToColor(cell.data.temperature), cellSize, x, y)
            drawTileRaw(sprites.elevationView, elevationToColor(cell.data.elevation), cellSize, x, y)
            drawTileRaw(sprites.rainFallView, rainfallToColor(cell.data.rainfall), cellSize, x, y)

        }
        sprites.container.addChild(sprites.worldView);
        stage.addChild(sprites.container);

        game.cities.forEach(city => {
            let house = drawHouse('0xBB3333', Math.round(cellSize*1.5))
            house.x = city.cell.x * cellSize
            house.y = city.cell.y * cellSize
            house.interactive = true
            house.click = (mouseData) => openCityMenu(city)
            stage.addChild(house);

            var textOptions = {
                fontFamily: 'Arial', // Set style, size and font
                fontSize: '14px',
                fill: 'white', // Set fill color to blue
                align: 'center', // Center align the text, since it's multiline
                stroke: '#34495e', // Set stroke color to a dark blue-gray color
                strokeThickness: 3, // Set stroke thickness to 20
                lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
            }
            let text = new PIXI.Text(city.name ,textOptions);
            setXY(text.anchor, 0.5);
            text.x = city.cell.x * cellSize + 5
            if (text.x <= 40) text.anchor.x = .1
            if (text.x >= canvasWidth - 40) text.anchor.x = .9
            text.y = city.cell.y * cellSize - 5
            text.canvas.style.webkitFontSmoothing = "antialiased";
            stage.addChild(text);
        })


        game.ships.forEach(ship => {
            var ship1texture = PIXI.loader.resources.shipmap.texture;
            var ship1 = new PIXI.Sprite(ship1texture);
            ship1.interactive = true;
            ship1.click = function(mouseData){
               alert("CLICK!");
            }
            ship1.x = ship.position.x * cellSize
            ship1.y = ship.position.y * cellSize
            stage.addChild(ship1);
        })

        // world.cells.filter(cell => cell.isCity).forEach(cell => {
            // let house = drawHouse('0xBB3333', cellSize*1.5)
            // house.x = cell.x * cellSize
            // house.y = cell.y * cellSize
            // stage.addChild(house);

            // var ship1texture = PIXI.loader.resources.shipmap.texture;
            // var ship1 = new PIXI.Sprite(ship1texture);
            // ship1.interactive = true;
            // ship1.click = function(mouseData){
            //    alert("CLICK!");
            // }
            // ship1.x = cell.x * cellSize
            // ship1.y = cell.y * cellSize
            // stage.addChild(ship1);
        // })
        //
        animate()

    }
    drawCells(world)
    renderer.render(stage)

    function animate() {
        // render the stage container
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

}

function andNowDraw(el) {
    sprites.container.removeChildren();
    sprites.container.addChild(el);
    renderer.render(stage)
}
function showTemperature() { andNowDraw(sprites.temperatureView)}
function showMap() {andNowDraw(sprites.worldView)}
function showElevation() { andNowDraw(sprites.elevationView) }
function showRainFall() { andNowDraw(sprites.rainFallView) }
function addCanvasStuff(){
    let loader = PIXI.loader
    loader.add("ship1", "img/shipsmall_1.jpg")
        .add("ship2", "img/shipmedium_1.jpg")
        .add("ship3", "img/shiplarge_1.jpg")
        .add("shipmap", "img/ship_map.png")
        .add('beer','img/beer/beer.json')
        .load(drawCanvas);

    new Vue({
        el: '#money',
        data: {
            money: 'Hello Vue.js!'
        }
    })

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
