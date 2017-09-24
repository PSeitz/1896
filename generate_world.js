


function generateWorld(opt){
    let world = opt.world
    let seaLevel = opt.seaLevel
    // noise.seed(16);
    // noise.seed(Math.random());
    console.time("cells")
    world.cells.forEach(cell => {
        // cell.data.elevation   = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight)
        var mod = noise.simplex2(cell.x * 10/mapWidth, cell.y * 10/mapHeight);
        var value = noise.simplex3(cell.x* 2/mapWidth, cell.y* 2/mapHeight, mod * cell.y/(mapHeight*5));
        cell.data.elevation = value
    })

    world.cells.forEach(cell => cell.data.temperature = noise.simplex2(cell.x/mapWidth, cell.y/mapHeight)) // very slow change
    world.cells.forEach(cell => cell.data.rainfall    = noise.simplex2(cell.x * 2/mapWidth, cell.y * 2/mapHeight))
    world.cells.forEach(cell => cell.data.drainage    = noise.simplex2(cell.x/20, cell.y/20))

    world.cells.forEach(cell => cell.scale())
    world.cells.forEach(cell => cell.classify(seaLevel))
    console.timeEnd("cells")

    function placeHouse(){
        let shoreCells = world.cells.filter(cell => {
            let neighbors = world.getNeighborsWithCell(cell)
            return inRange(cell.data.elevation, [seaLevel - 0.05, seaLevel])
                && neighbors.some(cell => isWater(cell.type))
                && neighbors.some(cell => !isWater(cell.type));
            // return neighbors.some(cell => (cell.type != "Water"))
            //     && cell.type == "Water";
        } )

        console.log(shoreCells.length)
        for (var i = 0; i < 250; i++) {
            let cell = _.sample(shoreCells)
            cell.isCity=true
            // shoreCells = shoreCells.filter(cell5 => getDistance(cell5, cell)>5)
            let minDistance = canvasWidth * canvasHeight  /100000
            shoreCells.filter(cell5 => (getDistance(cell5, cell)<minDistance && cell5 !=cell)).forEach(cell => (cell.isCity = false))
        }

        // shoreCells.forEach(cell => cell.isCity=true)
        // shoreCells.forEach(city => {
        //     if(world.getNeighborsWithCell(city).some(cell => cell.isCity)){
        //         let group = world.getNeighborsWithCell(city)
        //         city.isCity = false
        //         group.forEach(cell => (cell.isCity=false))
        //         _.sample(group).isCity = true
        //     }
        // })
    }
    placeHouse()


    function groupCities(){
        let cities = world.cells.filter(cell => cell.isCity)

        let groups = []
        let groupNum = 1

        while (cities.length >0) {
            let start = cities.pop()
            let group = []
            groups.push(group)
            group.push(start)
            var addGroup = _.remove(cities, city => easystar.findPath(start.x, start.y, city.x, city.y));
            Array.prototype.push.apply(group, addGroup)
        }
        let newCities = _.maxBy(groups, 'length');
        groups.forEach(group => {
            if (group!=newCities) {
                group.forEach(city => (city.isCity = false))
            }
        })
    }
    let maxCities = canvasWidth * canvasHeight / 50000
    function limitNumCities(){
        while (world.cells.filter(cell => cell.isCity).length > maxCities) {
            _.sample(world.cells.filter(cell => cell.isCity)).isCity = false
        }
    }

    console.time("groupCities")

    function setPathFindGrid() {
        var grid = new Array(mapHeight);
        for (let y = 0; y < mapHeight; y++) {
            grid[y] = new Array(mapWidth);
            for (let x = 0; x < mapWidth; x++) {
                let isReachable = isWater(world.getCellAtXY(x,y).type) || world.getCellAtXY(x,y).isCity
                grid[y][x] = isReachable ? 0 : 1
            }
        }
        easystar.setGrid(grid);
        easystar.setAcceptableTiles([0]);
        easystar.enableSync();
    }

    setPathFindGrid()
    groupCities()
    limitNumCities()


    let cityCells = world.cells.filter(cell => cell.isCity)
    cityCells.forEach(cell => {
        game.cities.push(new City(faker.address.city(), cell, 10, world))
    })

    console.timeEnd("groupCities")


    // Add Ship
    let startCell = _.sample(cityCells)
    let playerShip = new Ship(faker.commerce.productName(), 100, 35, startCell, game.player)
    game.ships.push(playerShip)

}
