

let canvasWidth = 1500;
let canvasHeight = 800;
let mapWidth = 150
let mapHeight = 80
let cellSize = 10
export const easystar = new EasyStar.js();



import {Game, WorldMap, minTemperatur, maxTemperatur} from "./classes.js"
import * as util from './util.js'
import * as helper from './helper.js'
import {cellTypes} from './types.js'

import {drawTileRaw, drawHouse, drawCityMenu} from './graphics.js'

let game = new Game(new WorldMap(mapWidth, mapHeight))

import {generateWorld} from "./generate_world.js"

generateWorld({world:game.world, seaLevel: 0.2, mapWidth:mapWidth, mapHeight:mapHeight, canvasWidth:canvasWidth, canvasHeight:canvasHeight, player: game.player})

if (localStorage['savegame1']) {
    console.time("loadGame")
    console.log("File Size: " + localStorage['savegame1'].length / 1000000 + " mb" )
    game = JSON.parse(localStorage['savegame1'])
    console.timeEnd("loadGame")
}else{
    console.time("generateWorld")
    generateWorld({world:game.world, seaLevel: 0.2, mapWidth:mapWidth, mapHeight:mapHeight, canvasWidth:canvasWidth, canvasHeight:canvasHeight, player: game.player})
    console.timeEnd("generateWorld")
    localStorage['savegame1'] = JSON.stringify(game)
}

let world = game.world;


window.onload = function(){
    loadImagesAndDraw();

};

// game = JSON.parse(localStorage['savegame1'])
// world = game.world


let sprites = {

}

function temperatureToColor(value){
    let val = Math.round(util.scale(value,minTemperatur, maxTemperatur, -255, 0)) * -1
    let hex = val.toString(16)
    return '0xFF'+hex+hex
}
function elevationToColor(value){
    let val = util.scale(value,-1, 1, -255, 0)
    let hex = Math.round(val*-1).toString(16)
    return '0x'+hex+hex+hex
}
function rainfallToColor(value){
    let val = Math.round(util.scale(value, -1 ,1 , -255, 0)) * -1
    let hex = val.toString(16)
    let color = '0x'+hex+hex+'FF'
    return color
}

function setupMovie (baseString){

    var frames = [];
    let textures = PIXI.loader.resources[baseString].textures
    if (!textures) alert(baseString +  " animation not found")
    for (var i = 0; i < Object.keys(textures).length; i++) {
        frames.push(textures[baseString+i+'.png']);
    }
    var movie = new PIXI.extras.MovieClip(frames);
    movie.interactive = true
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
    drawCityMenu(graphics, menu)

    let movie = setupMovie('beer')
    movie.click = (mouseData) => alert("CLICK Beer");
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

        world.cities.forEach(city => {
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
            helper.setXY(text.anchor, 0.5);
            text.x = city.cell.x * cellSize + 5
            if (text.x <= 40) text.anchor.x = .1
            if (text.x >= canvasWidth - 40) text.anchor.x = .9
            text.y = city.cell.y * cellSize - 5
            text.canvas.style.webkitFontSmoothing = "antialiased";
            stage.addChild(text);
        })


        world.ships.forEach(ship => {
            var ship1texture = PIXI.loader.resources.shipmap.texture;
            var ship1 = new PIXI.Sprite(ship1texture);
            ship1.interactive = true;
            ship1.click = function(mouseData){
                alert("CLICK Ship!");
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
function loadImagesAndDraw(){
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
