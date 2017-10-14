
import {Position} from './classes'

export function inRange(num:number, range:[number, number]) {
    return num >= range[0] && num <= range[1]
}

export function getDistance( point1:Position, point2:Position )
{
    return Math.hypot(point2.x-point1.x, point2.y-point1.y)
}

export function scale(val:number,oldMin:number, oldMax:number, newMin:number, newMax:number){
    return (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
}
