
import * as PIXI from 'pixi.js';
import {Game, WorldMap, WorldCell, Ship, City,SupplyAndDemand, InfluenceArea, Player, minTemperatur, maxTemperatur} from "./classes"

import * as util from './util'
import * as helper from './helper'
import {CellTypes} from './types'

import * as g from './graphics.js'

import * as sound from './sounds.js'

import * as state from './state.js'

import {openCityMenu, cellSize, canvasWidth, getPixelPos, setPixelPos} from './main'

let shipLayer: PIXI.Container = null;
let cityLayer: PIXI.Container = null;

function drawShips(world: WorldMap, stage: PIXI.Container){
    if(shipLayer) stage.removeChild(shipLayer)
    shipLayer = new PIXI.Container();
    world.ships.forEach(ship => {
        var ship1texture = PIXI.loader.resources.shipmap.texture;
        var ship1:any = new PIXI.Sprite(ship1texture); // @FixMe wrong definition click
        ship1.interactive = true;
        helper.setXY(ship1.anchor, 0.5, 0.2);
        ship1.click = (mouseData:any) =>  {
            // openShipMenu(ship)

            //TODO whatever
            // if (state.menuState.showShipMenu == ship) 
            //     delete state.menuState.showShipMenu
            // else 
            //     state.menuState.showShipMenu = ship

        };
        setPixelPos(ship.position, ship1)
        // ship1.x = ship.position.x * cellSize
        // ship1.y = ship.position.y * cellSize
        shipLayer.addChild(ship1);
    })
    stage.addChild(shipLayer);

}

function drawCities(renderer: PIXI.Renderer, world:WorldMap, stage:PIXI.Container){
    if(cityLayer) stage.removeChild(cityLayer)
    cityLayer = new PIXI.Container();
    world.cities.forEach(city => {
        let house:any = g.drawHouse(renderer, parseInt('0xBB3333', 16), Math.round(cellSize*1.5))
        house.x = city.cell.x * cellSize
        house.y = city.cell.y * cellSize
        helper.setXY(house.anchor, 0.5);
        house.interactive = true
        house.click = (mouseData:any) => openCityMenu(city)
        cityLayer.addChild(house);

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
        text.y = city.cell.y * cellSize - 15
        // text.canvas.style.webkitFontSmoothing = "antialiased";
        cityLayer.addChild(text);
    })
    stage.addChild(cityLayer);

}

export function drawCanvas(renderer:PIXI.Renderer, world:WorldMap, layers:any, stage:PIXI.Container, cellSize:number){
    // PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;
    function drawWorldCells(world:WorldMap){
        let paddingPerSide = 0
        layers.container = new PIXI.Container();
        layers.temperatureView = new PIXI.Graphics();
        layers.worldView = new PIXI.Graphics();
        layers.elevationView = new PIXI.Graphics();
        layers.rainFallView = new PIXI.Graphics();
        for (var i = 0; i < world.cells.length; i++) {
            var cell = world.cells[i];
            let x = paddingPerSide + cell.x * cellSize
            let y = paddingPerSide + cell.y * cellSize
            let type = CellTypes[cell.type]
            g.drawTileRaw(layers.worldView, type.color, cellSize, x, y)
            g.drawTileRaw(layers.temperatureView, temperatureToColor(cell.data.temperature), cellSize, x, y)
            g.drawTileRaw(layers.elevationView, elevationToColor(cell.data.elevation), cellSize, x, y)
            g.drawTileRaw(layers.rainFallView, rainfallToColor(cell.data.rainfall), cellSize, x, y)
        }
        layers.container.addChild(layers.worldView);
        stage.addChild(layers.container);

        // world.cells.filter(cell => cell.isCity).forEach(cell => {
        // let house = g.drawHouse('0xBB3333', cellSize*1.5)
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

    }

    drawWorldCells(world)
    drawCities(renderer, world, stage)
    drawShips(world, stage)
    animate()

    renderer.render(stage)

    function animate() {
        // render the stage container
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

}

export function redrawCanvas(renderer: PIXI.Renderer, world:WorldMap, stage:any){
    drawShips(world, stage)
    drawCities(renderer, world, stage)
    state.reassign()
}

// function temperatureToColor(value:number):string{
//     let val = Math.round(util.scale(value,minTemperatur, maxTemperatur, -255, 0)) * -1
//     let hex = val.toString(16)
//     return '0xFF'+hex+hex
// }
// function elevationToColor(value:number):string{
//     let val = util.scale(value,-1, 1, -255, 0)
//     let hex = Math.round(val*-1).toString(16)
//     return '0x'+hex+hex+hex
// }
// function rainfallToColor(value:number):string{
//     let val = Math.round(util.scale(value, -1 ,1 , -255, 0)) * -1
//     let hex = val.toString(16)
//     let color = '0x'+hex+hex+'FF'
//     return color
// }

function temperatureToColor(value:number):number{
    let val = Math.round(util.scale(value,minTemperatur, maxTemperatur, -255, 0)) * -1
    let hex = val.toString(16)
    return parseInt('FF'+hex+hex, 16)
    // return '0xFF'+hex+hex
}
function elevationToColor(value:number):number{
    let val = util.scale(value,-1, 1, -255, 0)
    let hex = Math.round(val*-1).toString(16)
    // return '0x'+hex+hex+hex
    return parseInt('FF'+hex+hex+hex, 16)
}
function rainfallToColor(value:number):number{
    let val = Math.round(util.scale(value, -1 ,1 , -255, 0)) * -1
    let hex = val.toString(16)
    let color = '0x'+hex+hex+'FF'
    // return color
    return parseInt(hex+hex+'FF', 16)
}