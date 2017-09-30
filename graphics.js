
import * as PIXI from 'pixi.js';
import * as helper from './helper.js'


export function addPlaneUI(thePlane){
    let planerDrawer = new PIXI.Graphics();
    planerDrawer.beginFill(thePlane.color);
    planerDrawer.drawRect(0,0, 35, 15);
    planerDrawer.endFill();

    let texture = planerDrawer.generateTexture();
    thePlane.sprite = new PIXI.Sprite(texture)
    helper.setXY(thePlane.sprite.anchor, 0.5);
    thePlane.sprite.anchor.x=0.3
    helper.setXYFrom(thePlane.sprite, thePlane.position)
}


export function drawTileRaw(graphics, color, size, x, y){
    graphics.beginFill(color);
    graphics.drawRect(x,y, size, size);
    graphics.endFill();
}

export function newText(val, fontSize) { // For prototyping ?
    fontSize = fontSize || '14px'
    var textOptions = { fontFamily: 'Arial', fontSize: fontSize, fill: 'white', align: 'center', stroke: '#34495e', strokeThickness: 3, lineJoin: 'round' }
    let text = new PIXI.Text(val ,textOptions);
    // helper.setXY(text.anchor, 0.5);
    text.canvas.style.webkitFontSmoothing = "antialiased";
    return text
}

export function showInfo(data) {
    let padding = 2
    console.log("padding " + padding)
    let graphics = new PIXI.Graphics();
    let infoMenu = new PIXI.Container();
    let textHeight = 38

    graphics.beginFill(0x1d111a, 0.99);
    graphics.drawRoundedRect(0, 0, 256 + padding * 2, data.length*textHeight + padding * 2, 3)
    graphics.endFill();

    graphics.beginFill(0x3d321a, 0.99);
    graphics.drawRoundedRect(padding, padding, 256, data.length*textHeight, 3)
    graphics.endFill();
    infoMenu.addChild(graphics)
    for (var i = 0; i < data.length; i++) {
        let text = newText(data[i].text, '24px')
        text.y = i * textHeight + padding;
        text.x = padding + 4
        if(data[i].onclick){
            text.interactive = true
            text.click = data[i].onclick
        }
        infoMenu.addChild(text)
    }
    return infoMenu
}


export function drawCityMenu(graphics, menu) {
    graphics.beginFill(0x3d321a, 0.99);
    graphics.drawRoundedRect(0, 0, 128, 32, 3)
    graphics.endFill();
    menu.addChild(new PIXI.Sprite(graphics.generateCanvasTexture()));
}

// export function drawHouse(color, size){
//     let graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.drawRoundedRect(x, y, width, height, radius)
//     graphics.endFill();
//     return new PIXI.Sprite(graphics.generateCanvasTexture());
// }

export function drawHouse(color, size){
    let graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    let size3 = Math.round(size/3)
    graphics.drawPolygon([0, size3, size/2, 0, size, size3]);
    graphics.drawRect(0, size3, size, size);
    graphics.endFill();
    graphics.beginFill(0x333333);
    graphics.drawRect(size3, Math.round(size*2/3), size3, Math.round(size*0.75));

    graphics.endFill();

    return new PIXI.Sprite(graphics.generateCanvasTexture());
}
export function drawTile(color, size){
    let graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawRect(0,0, size, size);
    graphics.endFill();
    return new PIXI.Sprite(graphics.generateCanvasTexture());
}

export function drawPerson(graphics, color, position){
    graphics.beginFill(color);
    graphics.drawRect(0,0, 7, 30);
    graphics.endFill();
}


export function drawdash(x0,y0,x1,y1,linewidth){
    let dashed = new PIXI.Graphics()
    dashed.lineStyle(1, 0x59e3e8, 1); // linewidth,color,alpha
    dashed.moveTo(0, 0);
    dashed.lineTo(linewidth,0);
    dashed.moveTo(linewidth*1.5,0);
    dashed.lineTo(linewidth*2.5,0);
    var dashedtexture = dashed.generateCanvasTexture(1,1);
    var linelength=Math.pow(Math.pow(x1-x0,2) + Math.pow(y1-y0,2) , 0.5);
    var tilingSprite = new PIXI.extras.TilingSprite(dashedtexture, linelength, linewidth);
    tilingSprite.x=x0;
    tilingSprite.y=y0;
    tilingSprite.rotation = angle(x0,y0,x1,y1)*Math.PI/180;
    tilingSprite.pivot.set(linewidth/2, linewidth/2);
    return tilingSprite;
    function angle(x0,y0,x1,y1){
        var diff_x = Math.abs(x1 - x0),
            diff_y = Math.abs(y1 - y0);
        var cita;
        if(x1>x0){
            if(y1>y0){
                cita= 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
            }else
            {
                if(y1<y0){
                    cita=-360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                }else{
                    cita=0;
                }
            }
        }else
        {
            if(x1<x0){
                if(y1>y0){
                    cita=180-360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                }else
                {
                    if(y1<y0){
                        cita=180+360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                    }else{
                        cita=180;
                    }
                }
            }else{
                if(y1>y0){
                    cita=90;
                }else
                {
                    if(y1<y0){
                        cita=-90;
                    }else{
                        cita=0;
                    }
                }
            }
        }
        return cita;
    }
}
