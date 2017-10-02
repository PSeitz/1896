
import {openCityMenu, openShipMenu, closeShipMenu, ressurect, bury} from './main.js'

import {startNavigation, endNavigation, showInfoForRoute, removeRouteInfo} from './navigation.js'

if(!window._menuState){
    window._menuState = {}
}
// const _menuState = {};

let keys = ["showShipMenu", "showShipNavigation", "showRouteInfo"]

const handler = {
    set(target, key, value) {
        console.log(`Setting value ${key} as ${value}`)
        target[key] = value;
        if (key == "showShipMenu") { openShipMenu(value) }
        if (key == "showShipNavigation") { startNavigation(value) }
        if (key == "showRouteInfo") { showInfoForRoute(value) }
        // localStorage['state'] = bury(window._menuState);
        // console.log(localStorage['state'])
        return true
    },
    deleteProperty(target, key) {
        console.log(`Deleting ${key}`)
        if (key == "showShipMenu") { closeShipMenu() }
        if (key == "showShipNavigation") { endNavigation() }
        if (key == "showRouteInfo") { removeRouteInfo() }
        delete target[key];
        return true
    }
};

export const menuState = new Proxy(window._menuState, handler);

export function reassign(){
    for(let key of keys){ reassignKey(key) }
}

function reassignKey(key){
    let tmp = menuState[key];
    if(tmp){
        delete menuState[key]
        menuState[key] = tmp
    }

}




// localStorage['state'] = new Resurrect().resurrect(localStorage['state']);
