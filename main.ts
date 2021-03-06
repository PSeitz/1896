

export const canvasWidth = 1500;
export const canvasHeight = 800;
let mapWidth = 150
let mapHeight = 80
export const cellSize = 10

// const PIXI: any = require('pixi.js');
import * as PIXI from 'pixi.js';
import {EasyStar} from 'easystarts';
import { Game, WorldMap, WorldCell,Position, Ship, City, SupplyAndDemand, InfluenceArea, Player, minTemperatur, maxTemperatur } from "./classes"

import * as sound from './sounds.js'

import * as g from './graphics.js'
import { drawCanvas, redrawCanvas } from './drawWorld'
import {state, bind} from './state'
import { generateWorld, setUpEasyStar } from "./generate_world"
// import  './navigation'

(<any>window).Game = Game;
(<any>window).WorldMap = WorldMap;
(<any>window).WorldCell = WorldCell;
(<any>window).Ship = Ship;
(<any>window).City = City;
(<any>window).SupplyAndDemand = SupplyAndDemand;
(<any>window).InfluenceArea = InfluenceArea;
(<any>window).Player = Player;

// declare let PIXI: any;
declare let Resurrect: any;
// declare let EasyStar: any;
declare let Vue: any;
// declare function Resurrect(): Resurrect;



if (module.hot) {
    module.hot.accept(['./graphics.js', './drawWorld.ts', './navigation.ts', './test.js', './classes.ts', './generate_world.ts', './helper.ts', './keyboard.js', './types.ts', './util.ts', './state.ts'], function() {
        console.log('OOOH BOY')
        redrawCanvas(renderer, world, stage)
        // g.showInfo([])
    })
    module.hot.accept();
    // module.hot.dispose(data => {
    //     console.log('Dispose the stuff')
    //     refreshCanvas()
    //     // Clean up and pass data to the updated module...
    // })

} else {
    alert("NO HOT")
}

{
    let game = new Game(new WorldMap(mapWidth, mapHeight, 0.2))
    generateWorld({world:game.world, seaLevel: 0.2, mapWidth:mapWidth, mapHeight:mapHeight, canvasWidth:canvasWidth, canvasHeight:canvasHeight, player: game.player})
}
export function ressurect(data:any) {
    return new Resurrect().resurrect(data);
}
export function bury(data:any) {
    return new Resurrect().stringify(data)
}

let game;
if (localStorage['savegame1']) {
    console.time("loadGame")
    console.log("File Size: " + localStorage['savegame1'].length / 1000000 + " mb")

    game = ressurect(localStorage['savegame1']);

    console.timeEnd("loadGame")
} else {
    game = new Game(new WorldMap(mapWidth, mapHeight, 0.2))
    console.time("generateWorld")
    generateWorld({ world: game.world, seaLevel: 0.2, mapWidth: mapWidth, mapHeight: mapHeight, canvasWidth: canvasWidth, canvasHeight: canvasHeight, player: game.player })
    console.timeEnd("generateWorld")

    localStorage['savegame1'] = bury(game);
}
(<any>window).game = game

export let world = game.world;

export const easystar = new EasyStar();
setUpEasyStar(easystar, world)


window.onload = function() {
    loadImagesAndDraw();

};

let layers = {}

function setupMovie(baseString:string) {

    var frames = [];
    let textures = PIXI.loader.resources[baseString].textures!
    if (!textures) alert(baseString + " animation not found")
    for (var i = 0; i < Object.keys(textures).length; i++) {
        frames.push(textures[baseString + i + '.png']);
    }
    var movie = new PIXI.AnimatedSprite(frames);
    movie.interactive = true
    movie.animationSpeed = 0.13
    movie.play();
    return movie;
}

// export const stage = new PIXI.Container(0x66FF99, true);
export const stage = new PIXI.Container();
export let renderer:PIXI.Renderer;

let menu: PIXI.Container | null = null

function closeCityMenu(city:any) {
    menu && stage.removeChild(menu)
}

export function openCityMenu(city: City) {
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
    g.drawCityMenu(renderer, graphics, menu)

    let movie:any = setupMovie('beer')
    movie.click = (mouseData:any) => alert("CLICK Beer");
    menu.addChild(movie);
    stage.addChild(menu)

}

bind("showShipMenu", (newVal:Ship)=> {
    openShipMenu(newVal)
})

let shipMenu: PIXI.Container | null = null
export function openShipMenu(ship:Ship) {
    sound.playRandom("pirate")
    sound.play("ship.pirate.bay")
    let xPos = ship.position.x * cellSize + 20
    let yPos = ship.position.y * cellSize - 5
    if (shipMenu) closeShipMenu()
    if (ship == null)
        return
        
    shipMenu = new PIXI.Container();
    shipMenu.x = xPos
    shipMenu.y = yPos

    let graphics = new PIXI.Graphics();
    g.drawCityMenu(renderer, graphics, shipMenu)

    let text:any = g.newText("Drive", 12)
    text.interactive = true;
    text.click = (mouseData:any) => {
        if (state.showShipNavigation == ship) delete state.showShipNavigation
        else state.showShipNavigation = ship
    };
    text.y = 5, text.x = 5
    shipMenu.addChild(text);
    stage.addChild(shipMenu)
}

export function closeShipMenu() {
    sound.get("ship.pirate.bay").fade(sound.get("ship.pirate.bay").volume(), 0, 2500);
    if (shipMenu) stage.removeChild(shipMenu)
    shipMenu = null
}

function start() {
    let canvas = <HTMLCanvasElement>document.getElementById("stage");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    renderer = PIXI.autoDetectRenderer({
        width:canvasWidth,
        height: canvasHeight,
        view: canvas, backgroundColor: 0x1099bb, antialias: true,
        resolution: window.devicePixelRatio || 1,
        // autoResize: true
    });

    drawCanvas(renderer, world, layers, stage, cellSize)
}

function andNowDraw(el: any) {
    (layers as any).container.removeChildren();
    (layers as any).container.addChild(el);
    renderer.render(stage)
}
function showTemperature() { andNowDraw((layers as any).temperatureView) }
function showMap() { andNowDraw((layers as any).worldView) }
function showElevation() { andNowDraw((layers as any).elevationView) }
function showRainFall() { andNowDraw((layers as any).rainFallView) }

function nextTurn() {
    for (let ship of world.ships) {
        ship.move()
    }
    redrawCanvas(renderer, world, stage)
}

export function getPixelPos(opt:Position) { // @FixMe not any
    return { x: opt.x * cellSize, y: opt.y * cellSize }
}
export function setPixelPos(opt:Position, target:Position) {
    let { x, y } = getPixelPos(opt)
    target.x = x
    target.y = y
}

(<any>window).showTemperature = showTemperature;
(<any>window).showMap = showMap;
(<any>window).showElevation = showElevation;
(<any>window).showRainFall = showRainFall;
(<any>window).nextTurn = nextTurn;

function loadImagesAndDraw() {
    let loader = PIXI.loader
    loader.add("ship1", "img/shipsmall_1.jpg")
        .add("ship2", "img/shipmedium_1.jpg")
        .add("ship3", "img/shiplarge_1.jpg")
        .add("shipmap", "img/ship_map.png")
        .add('beer', 'img/beer/beer.json')
        .load(() => start());

    new Vue({
        el: '#money',
        data: {
            money: 'Hello Vue.js!'
        }
    })
}

function create2DArray(width:number, height:number) {
    var x = new Array(height);
    for (var i = 0; i < height; i++) {
        x[i] = new Array(width);
    }
    return x
}
