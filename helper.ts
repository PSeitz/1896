import {Position} from './classes'
import * as _ from 'lodash';

export function setXY(target:Position, value:number, y?:number) {
    target.x = value
    if (y) {
        target.y = y
    }else {
        target.y = value
    }
}
export function setXYFrom(target:Position, from:Position) {
    target.x = from.x
    target.y = from.y
}

export function setWidthHeight(target:any, value:number, height:number) {
    target.width = value
    if (height) {
        target.height = height
    }else {
        target.height = value
    }
}

export function getXYRatio(startPos:Position, endPos:Position){
    let deltaX = (endPos.x - startPos.x)
    let deltaY = (endPos.y - startPos.y)

    let xRatio = Math.abs(deltaX) / (Math.abs(deltaX) + Math.abs(deltaY)) * Math.sign(deltaX)
    let yRatio = Math.abs(deltaY) / (Math.abs(deltaX) + Math.abs(deltaY)) * Math.sign(deltaY)
    return {
        xRatio:xRatio,
        yRatio:yRatio
    }
}

export function moveTowards(startPos:Position, endPos:Position, movementAmount:number){
    // let deltaX = (endPos.x - startPos.x)
    // let deltaY = (endPos.y - startPos.y)
    //
    // let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    // let distanceRatio = movementAmount / distance;
    // startPos.x += deltaX * distanceRatio;
    // startPos.y += deltaY * distanceRatio;

    let radians = getDegree(startPos, endPos);
    // startPos.x = startPos.x - movementAmount * Math.cos(radians);
    // startPos.y = startPos.y - movementAmount * Math.sin(radians);
    return {
        x : startPos.x - movementAmount * Math.cos(radians),
        y : startPos.y - movementAmount * Math.sin(radians)
    }

}

export function moveTowardsAngle(startPos:Position, radians:number, movementAmount:number){
    return {
        x : startPos.x - movementAmount * Math.cos(radians),
        y : startPos.y - movementAmount * Math.sin(radians)
    }
}

export function getDegree(startPos:Position, endPos:Position){
    let x = startPos.x - endPos.x;
    let y = startPos.y - endPos.y;
    let radians = Math.atan2(y,x);
    return radians
}

export function normalizeDegree(degree:number){
    if (degree < 0)return degree + 360
    return degree
}
export function turnTowards(degree:number, targetDegree:number, stepSize:number){
    degree = normalizeDegree(degree)
    targetDegree = normalizeDegree(targetDegree)
    if (targetDegree-degree > 0) {
        return turnRight(degree, stepSize)
    }else{
        return turnLeft(degree, stepSize)
    }

}

// 0 180   -180 -0
export function turnRight(degree:number, amount:number){
    degree += amount;
    if (degree > 180) {
        degree = -180 + degree % 180;
    }
    return degree;
}

// 0 180   -180 -0
export function turnLeft(degree:number, amount:number){
    degree -= amount;
    if (degree < -180) {
        degree = 180 + degree % 180;
    }
    return degree;
}

export function radiansToDegrees(radians:number){
    return radians * (180/Math.PI)
}

export function degreesToRadians(degrees:number){
    return degrees / 180 * Math.PI
    // return degrees * Math.PI/180
}

export function randomXPointWithMinDistance(minDistance:number, otherXs:any, minX:number, maxX:number){
    let x, nearestNeighbour;
    for (let i = 0; i < 1000; i++) {
        x =  _.random(minX, maxX)
        if (otherXs.length === 0) {
            return x;
        }

        for (let otherX of otherXs) {
            let distance = Math.abs(otherX - x)
            if (nearestNeighbour == undefined || distance < nearestNeighbour) {
                nearestNeighbour = distance
            }
        }
        if (nearestNeighbour > minDistance) {
            break;
        }
    }

    return x
}

export function pluck(array:any, property:string){
    let newArr = []
    let props = property.split('.')
    for (let el of array) {
        let pluckedObj = el;
        for (let prop of props) {
            pluckedObj = pluckedObj[prop]
        }
        newArr.push(pluckedObj)
    }
    return newArr
}
