import * as PIXI from 'pixi.js';
import {cellSize, stage, renderer, easystar, world} from './main'
import * as helper from './helper'
import * as g from './graphics.js'
import {state, bind} from './state'
import * as sound from './sounds.js'
import {City, Ship} from './classes'

let navigationLayer: PIXI.Container = null
let shipRouteLayer: PIXI.Container = null
let infoMenu: PIXI.Container = null

export function endNavigation(){
    if(navigationLayer) stage.removeChild(navigationLayer)
    navigationLayer = null
    shipRouteLayer= null

    if(infoMenu)stage.removeChild(infoMenu)
    infoMenu= null
}

function drawDashedBorder(renderer: PIXI.Renderer, step:number){
    let cont = new PIXI.Container();
    cont.addChild(g.drawdash(renderer,0,0,step,0,3));
    cont.addChild(g.drawdash(renderer,0,0,0,step,3));
    cont.addChild(g.drawdash(renderer,step,0,step,step,3));
    cont.addChild(g.drawdash(renderer,0,step,step,step,3));
    return cont
}

bind("showShipNavigation", (newVal:Ship)=> {
    // navigationForShip(newVal) //TODO RENDERER IRGNEDWOHER
})

bind("showRouteInfo", (newVal:({city:City, ship: Ship}))=> {
    showInfoForRoute(newVal)
})


export function navigationForShip(renderer: PIXI.Renderer, ship:Ship) {
    endNavigation();
    if (ship ==null) return

    navigationLayer = new PIXI.Container();
    let step = cellSize*2.5
    let cont = drawDashedBorder(renderer, step)
    let texture = renderer.generateTexture(cont, PIXI.SCALE_MODES.LINEAR, 1);

    world.cities.forEach((city:City) => {
        let x = city.cell.x * cellSize
        let y = city.cell.y * cellSize

        if(state.showShipNavigation.position.x == city.cell.x && state.showShipNavigation.position.y == city.cell.y) return

        let sprite1:any = new PIXI.Sprite(texture);
        sprite1.position.x = x
        sprite1.position.y = y
        helper.setXY(sprite1.anchor, 0.5);
        sprite1.interactive = true
        sprite1.click = (mouseData:any) => {
            if (state.showRouteInfo && state.showRouteInfo.city == city) delete state.showRouteInfo
            else state.showRouteInfo = {city:city, ship: state.showShipNavigation}
        }
        navigationLayer.addChild(sprite1)
    })

    stage.addChild(navigationLayer)
}

export function removeRoute(){
    navigationLayer.removeChild(shipRouteLayer)
}

export function showInfoForRoute(opt:({city:City, ship: Ship})) {
    removeRoute()
    if (opt==null) return;
    drawRoute(opt.ship, opt.city)

    if(infoMenu)navigationLayer.removeChild(infoMenu)
    infoMenu = g.showInfo([
        {text:"Und ab gehts", onclick: ()=>{
            // alert("ja")
            sound.playRandom("pirate.ja")
            opt.ship.drivingTo = opt.city
            delete state.showRouteInfo
            delete state.showShipNavigation
            delete state.showShipMenu
        }},
        {text:"Zeig mir bitte mehr!!", onclick: ()=>{
            alert("mäh")
        }}]
    )
    navigationLayer.addChild(infoMenu)
}

export function drawRoute(currentShip:Ship, city:City){
    let pathGraphics = new PIXI.Graphics();
    shipRouteLayer = new PIXI.Container();
    let path = easystar.findPathSync(currentShip.position.x, currentShip.position.y, city.cell.x, city.cell.y)
    for (let cell of path) {
        g.drawTileRaw(pathGraphics, 0xFF5896, cellSize / 2, cell.x * cellSize, cell.y * cellSize)
    }
    shipRouteLayer.addChild(pathGraphics)
    navigationLayer.addChild(shipRouteLayer)
}
