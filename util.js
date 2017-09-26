export function inRange(num, range) {
    return num >= range[0] && num <= range[1]
}

export function getDistance( point1, point2 )
{
    return Math.hypot(point2.x-point1.x, point2.y-point1.y)
}

export function scale(val,oldMin, oldMax, newMin, newMax){
    return (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
}
