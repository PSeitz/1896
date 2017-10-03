
import * as PIXI from 'pixi.js';
import {Game, WorldMap, WorldCell, Ship, City,SupplyAndDemand, InfluenceArea, Player, minTemperatur, maxTemperatur} from "./classes.js"

import * as util from './util.js'
import * as helper from './helper.js'
import {cellTypes} from './types.js'

import * as g from './graphics.js'

import * as sound from './sounds.js'

import * as state from './state.js'

import {openCityMenu, cellSize, canvasWidth} from './main.js'

let shipLayer = null;
let cityLayer = null;

function drawShips(world, stage){
    if(shipLayer) stage.removeChild(shipLayer)
    shipLayer = new PIXI.Container();
    world.ships.forEach(ship => {
        var ship1texture = PIXI.loader.resources.shipmap.texture;
        var ship1 = new PIXI.Sprite(ship1texture);
        ship1.interactive = true;
        helper.setXY(ship1.anchor, 0.5, 0.2);
        ship1.click = (mouseData) =>  {
            // openShipMenu(ship)

            if (state.menuState.showShipMenu == ship) delete state.menuState.showShipMenu
            else state.menuState.showShipMenu = ship

        };
        ship1.x = ship.position.x * cellSize
        ship1.y = ship.position.y * cellSize
        shipLayer.addChild(ship1);
    })
    stage.addChild(shipLayer);

}

function drawCities(world, stage){
    if(cityLayer) stage.removeChild(cityLayer)
    cityLayer = new PIXI.Container();
    world.cities.forEach(city => {
        let house = g.drawHouse('0xBB3333', Math.round(cellSize*1.5))
        house.x = city.cell.x * cellSize
        house.y = city.cell.y * cellSize
        helper.setXY(house.anchor, 0.5);
        house.interactive = true
        house.click = (mouseData) => openCityMenu(city)
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
        text.canvas.style.webkitFontSmoothing = "antialiased";
        cityLayer.addChild(text);
    })
    stage.addChild(cityLayer);

}

export function drawCanvas(renderer, world, layers, stage, cellSize){
    // PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;
    function drawWorldCells(world){
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
            let type = cellTypes[cell.type]
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
    drawCities(world, stage)
    drawShips(world, stage)
    animate()

    renderer.render(stage)

    function animate() {
        // render the stage container
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

}

export function redrawCanvas(world, stage){
    drawShips(world, stage)
    drawCities(world, stage)
    state.reassign()
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
