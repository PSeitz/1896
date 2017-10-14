import * as PIXI from 'pixi.js';

import {cellSize, stage, renderer, easystar, world} from './main.ts'
import * as helper from './helper'
import * as g from './graphics.js'
import * as state from './state.js'

import * as sound from './sounds.js'

let navigationLayer = null
let shipRouteLayer = null
let infoMenu = null

export function endNavigation(){
    if(navigationLayer) stage.removeChild(navigationLayer)
    navigationLayer = null
    shipRouteLayer= null

    if(infoMenu)stage.removeChild(infoMenu)
    infoMenu= null
}

function drawDashedBorder(step){
    let cont = new PIXI.Container();
    cont.addChild(g.drawdash(0,0,step,0,3));
    cont.addChild(g.drawdash(0,0,0,step,3));
    cont.addChild(g.drawdash(step,0,step,step,3));
    cont.addChild(g.drawdash(0,step,step,step,3));
    return cont
}



export function startNavigation() {
    endNavigation();

    navigationLayer = new PIXI.Container();
    let step = cellSize*2.5
    let cont = drawDashedBorder(step)
    let texture = renderer.generateTexture(cont);

    world.cities.forEach(city => {
        let x = city.cell.x * cellSize
        let y = city.cell.y * cellSize

        if(state.menuState.showShipNavigation.position.x == city.cell.x && state.menuState.showShipNavigation.position.y == city.cell.y) return

        let sprite1 = new PIXI.Sprite(texture);
        sprite1.position.x = x
        sprite1.position.y = y
        helper.setXY(sprite1.anchor, 0.5);
        sprite1.interactive = true
        sprite1.click = (mouseData) => {
            if (state.menuState.showRouteInfo && state.menuState.showRouteInfo.city == city) delete state.menuState.showRouteInfo
            else state.menuState.showRouteInfo = {city:city, ship: state.menuState.showShipNavigation}
        }
        navigationLayer.addChild(sprite1)
    })

    stage.addChild(navigationLayer)
}

export function removeRoute(){
    navigationLayer.removeChild(shipRouteLayer)
}

export function showInfoForRoute(opt) {
    removeRoute()
    drawRoute(opt.ship, opt.city)

    if(infoMenu)stage.removeChild(infoMenu)
    infoMenu = g.showInfo([
        {text:"Und ab gehts", onclick: ()=>{
            // alert("ja")
            sound.playRandom("pirate.ja")
            opt.ship.drivingTo = opt.city
            delete state.menuState.showRouteInfo
            delete state.menuState.showShipNavigation
            delete state.menuState.showShipMenu
        }},
        {text:"Zeig mir bitte mehr!!", onclick: ()=>{
            alert("mäh")
        }}]
    )
    navigationLayer.addChild(infoMenu)
}

export function drawRoute(currentShip, city){
    let pathGraphics = new PIXI.Graphics();
    shipRouteLayer = new PIXI.Container();
    let path = easystar.findPath(currentShip.position.x, currentShip.position.y, city.cell.x, city.cell.y)
    for (let cell of path) {
        g.drawTileRaw(pathGraphics, 0xFF5896, cellSize / 2, cell.x * cellSize, cell.y * cellSize)
    }
    shipRouteLayer.addChild(pathGraphics)
    stage.addChild(shipRouteLayer)
}
