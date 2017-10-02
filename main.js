

export const canvasWidth = 1500;
export const canvasHeight = 800;
let mapWidth = 150
let mapHeight = 80
export const cellSize = 10

import * as PIXI from 'pixi.js';
import {Game, WorldMap, WorldCell, Ship, City,SupplyAndDemand, InfluenceArea, Player, minTemperatur, maxTemperatur} from "./classes.js"

import * as g from './graphics.js'

import {drawCanvas, redrawCanvas} from './drawWorld.js'
import {showNavigation, endNavigation} from './navigation.js'

import * as state from './state.js'

window.Game = Game
window.WorldMap = WorldMap
window.WorldCell = WorldCell
window.Ship = Ship
window.City = City
window.SupplyAndDemand = SupplyAndDemand
window.InfluenceArea = InfluenceArea
window.Player = Player



let game = new Game(new WorldMap(mapWidth, mapHeight))

import {generateWorld, setUpEasyStar} from "./generate_world.js"

function refresh() {
    // drawCanvas();
    console.log("redrawing")
    redrawCanvas(world, stage)
}

if (module.hot) {

    module.hot.accept(['./graphics.js', './drawWorld.js', './navigation.js','./test.js', './classes.js', './generate_world.js', './helper.js', './keyboard.js', './types.js', './util.js' ], function() {
        console.log('OOOH BOY')
        refresh()
        // g.showInfo([])
    })

    // module.hot.accept('./graphics.js', function() {refresh()} )
    // module.hot.accept('./navigation.js', () => console.log('RELOADED navigation.JS!') )
    // module.hot.accept('./test.js', () => {
    //     console.log('RELOADED test.JS!')
    //     test.testo()
    // })
    module.hot.accept();

    module.hot.dispose(data => {
        console.log('Dispose the stuff')
        refresh()
        // Clean up and pass data to the updated module...
    })

}else{
    alert("NO HOT")
}

// generateWorld({world:game.world, seaLevel: 0.2, mapWidth:mapWidth, mapHeight:mapHeight, canvasWidth:canvasWidth, canvasHeight:canvasHeight, player: game.player})

if (localStorage['savegame1']) {
    console.time("loadGame")
    console.log("File Size: " + localStorage['savegame1'].length / 1000000 + " mb" )

    game = new Resurrect().resurrect(localStorage['savegame1']);

    console.timeEnd("loadGame")
}else{
    console.time("generateWorld")
    generateWorld({world:game.world, seaLevel: 0.2, mapWidth:mapWidth, mapHeight:mapHeight, canvasWidth:canvasWidth, canvasHeight:canvasHeight, player: game.player})
    console.timeEnd("generateWorld")

    localStorage['savegame1'] = new Resurrect().stringify(game);

    // localStorage['savegame1'] = JSON.stringify(game)
}

export let world = game.world;

export const easystar = new EasyStar.js();
setUpEasyStar(easystar, world)


window.onload = function(){
    loadImagesAndDraw();

};

let layers = {}

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

export const stage = new PIXI.Container(0x66FF99, true);
export let renderer;

let menu = null

function closeCityMenu(city){
    stage.removeChild(menu)
}

export function openCityMenu(city){
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
    g.drawCityMenu(graphics, menu)

    let movie = setupMovie('beer')
    movie.click = (mouseData) => alert("CLICK Beer");
    menu.addChild(movie);
    stage.addChild(menu)

}


let shipMenu = null
export function openShipMenu(ship){
    let xPos = ship.position.x * cellSize + 20
    let yPos = ship.position.y * cellSize - 5
    if (shipMenu) closeShipMenu()
    shipMenu = new PIXI.Container();
    shipMenu.x = xPos
    shipMenu.y = yPos

    let graphics = new PIXI.Graphics();
    g.drawCityMenu(graphics, shipMenu)

    let text = g.newText("Drive")
    text.interactive = true;
    text.click = (mouseData) =>{
        if (state.menuState.showShipNavigation == ship) delete state.menuState.showShipNavigation
        else state.menuState.showShipNavigation = ship
    };
    text.y = 5, text.x = 5
    shipMenu.addChild(text);
    stage.addChild(shipMenu)
}

export function closeShipMenu(){
    if (shipMenu) stage.removeChild(shipMenu)
    shipMenu = null
}


function start(){
    let canvas = document.getElementById("stage");
    canvas.width=canvasWidth;
    canvas.height=canvasHeight;

    renderer = new PIXI.autoDetectRenderer(canvasWidth, canvasHeight, {
        view: canvas, backgroundColor : 0x1099bb, antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoResize:true});

    drawCanvas(renderer, world, layers, stage, cellSize, canvasWidth)
}


function andNowDraw(el) {
    layers.container.removeChildren();
    layers.container.addChild(el);
    renderer.render(stage)
}
function showTemperature() { andNowDraw(layers.temperatureView)}
function showMap() {andNowDraw(layers.worldView)}
function showElevation() { andNowDraw(layers.elevationView) }
function showRainFall() { andNowDraw(layers.rainFallView) }

window.showTemperature = showTemperature
window.showMap = showMap
window.showElevation = showElevation
window.showRainFall = showRainFall

function loadImagesAndDraw(){
    let loader = PIXI.loader
    loader.add("ship1", "img/shipsmall_1.jpg")
        .add("ship2", "img/shipmedium_1.jpg")
        .add("ship3", "img/shiplarge_1.jpg")
        .add("shipmap", "img/ship_map.png")
        .add('beer','img/beer/beer.json')
        .load(() => start());

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
