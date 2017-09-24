function addPersonUI(person, stage) {

    let container = new PIXI.DisplayObjectContainer();
    person.container = container;
    stage.addChild(container);

    let graphics = new PIXI.Graphics();
    drawPerson(graphics, person.color, person.position);

    let texture = graphics.generateTexture();
    person.sprite = new PIXI.Sprite(texture);
    person.sprite.interactive = false;

    setXY(person.sprite.anchor, 0.5);
    container.addChild(person.sprite);

    setXYFrom(person.container, person.position)

    person.text = new PIXI.cocoontext.CocoonText(person.name ,{font : '10px Arial', align : 'center', fill:"white"});
    setXY(person.text.anchor, 0.5);
    person.text.canvas.style.webkitFontSmoothing = "antialiased";
    container.addChild(person.text);
    person.text.y = - 20 - _.random(0, 80);
}

function addPlaneUI(thePlane){
    let planerDrawer = new PIXI.Graphics();
    planerDrawer.beginFill(thePlane.color);
    planerDrawer.drawRect(0,0, 35, 15);
    planerDrawer.endFill();

    let texture = planerDrawer.generateTexture();
    thePlane.sprite = new PIXI.Sprite(texture)
    setXY(thePlane.sprite.anchor, 0.5);
    thePlane.sprite.anchor.x=0.3
    setXYFrom(thePlane.sprite, thePlane.position)
}


function drawTileRaw(graphics, color, size, x, y){
    graphics.beginFill(color);
    graphics.drawRect(x,y, size, size);
    graphics.endFill();
}

function drawCityMenu(graphics, menu) {
    graphics.beginFill(0x3d321a, 0.99);
    graphics.drawRoundedRect(0, 0, 128, 32, 3)
    graphics.endFill();
    menu.addChild(new PIXI.Sprite(graphics.generateCanvasTexture()));
}

// function drawHouse(color, size){
//     let graphics = new PIXI.Graphics();
//     graphics.beginFill(color);
//     graphics.drawRoundedRect(x, y, width, height, radius)
//     graphics.endFill();
//     return new PIXI.Sprite(graphics.generateCanvasTexture());
// }

function drawHouse(color, size){
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
function drawTile(color, size){
    let graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawRect(0,0, size, size);
    graphics.endFill();
    return new PIXI.Sprite(graphics.generateCanvasTexture());
}

function drawPerson(graphics, color, position){
    graphics.beginFill(color);
    graphics.drawRect(0,0, 7, 30);
    graphics.endFill();
}
