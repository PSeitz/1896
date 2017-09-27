import * as PIXI from 'pixi.js';

import {cellSize, stage, renderer, easystar} from './main.js'
import * as helper from './helper.js'
import * as g from './graphics.js'


let navigationLayer = null
let shipRouteLayer = null
let currentShip = null

export function endNavigation(){
    if(navigationLayer) stage.removeChild(navigationLayer)
    currentShip = null
    navigationLayer = null
    shipRouteLayer= null
}

function drawDashedBorder(step){
    let cont = new PIXI.Container();
    cont.addChild(g.drawdash(0,0,step,0,3));
    cont.addChild(g.drawdash(0,0,0,step,3));
    cont.addChild(g.drawdash(step,0,step,step,3));
    cont.addChild(g.drawdash(0,step,step,step,3));
    return cont
}

export function toggleNavigation(world, ship){
    if (ship == currentShip) endNavigation();
    else if (navigationLayer) endNavigation();
    else showNavigation(world, ship)
}

export function showNavigation(world, ship) {
    endNavigation();

    currentShip = ship
    navigationLayer = new PIXI.Container();
    let step = cellSize*2.5
    let cont = drawDashedBorder(step)
    let texture = renderer.generateTexture(cont);

    function removeRoute(){
        navigationLayer.removeChild(shipRouteLayer)
    }
    function showRoute(ship, city){
        let pathGraphics = new PIXI.Graphics();
        shipRouteLayer = new PIXI.Container();
        let path = easystar.findPath(ship.position.x, ship.position.y, city.cell.x, city.cell.y)
        for (let cell of path) {
            g.drawTileRaw(pathGraphics, 0xFF5896, cellSize, cell.x * cellSize, cell.y * cellSize)
        }
        shipRouteLayer.addChild(pathGraphics)
        navigationLayer.addChild(shipRouteLayer)
    }

    world.cities.forEach(city => {
        let x = city.cell.x * cellSize
        let y = city.cell.y * cellSize

        let sprite1 = new PIXI.Sprite(texture);
        sprite1.position.x = x
        sprite1.position.y = y
        helper.setXY(sprite1.anchor, 0.5);
        sprite1.interactive = true
        sprite1.click = (mouseData) => {
            // alert("TARGET")
            removeRoute()
            showRoute(ship, city)
        }
        navigationLayer.addChild(sprite1)


    })

    stage.addChild(navigationLayer)
    // let line = g.drawdash(50,50,650,50,1);
    // stage.addChild(line);
}
