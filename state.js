
import {openCityMenu, openShipMenu, closeShipMenu} from './main.js'

import {startNavigation, endNavigation} from './navigation.js'

const _menuState = {};

const handler = {
    set(target, key, value) {
        console.log(`Setting value ${key} as ${value}`)
        target[key] = value;
        if (key == "showShipMenu") { openShipMenu(value) }
        if (key == "showShipNavigation") { startNavigation(value) }
        return true
    },
    deleteProperty(target, key) {
        console.log(`Deleting ${key}`)
        if (key == "showShipMenu") { closeShipMenu() }
        if (key == "showShipNavigation") { endNavigation() }
        delete target[key];
        return true
    }
};

export const menuState = new Proxy(_menuState, handler);

export function reassign(){
    reassignKey("showShipMenu")
    reassignKey("showShipNavigation")
    // for(let el in _menuState){
    //     let tmp = _menuState[el];
    //     delete menuState[el]
    //     menuState[el] = tmp
    // }
}

function reassignKey(key){
    let tmp = _menuState[key];
    delete menuState[key]
    menuState[key] = tmp
}