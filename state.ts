
import {openCityMenu, openShipMenu, closeShipMenu, ressurect, bury} from './main'

// import {startNavigation, endNavigation, showInfoForRoute, removeRoute} from './navigation'

if(!(<any>window)._globalState){
    (<any>window)._globalState = {}
}
// const _globalState = {};


type keys = "showShipMenu" | "showShipNavigation" | "showRouteInfo"

let handlers:any = {

}

const handler = {
    set(target:any, key:keys, value:any) {
        console.log(`Setting value ${key} as ${value}`)
        target[key] = value;

        if (handlers[key]) {
            handlers[key](value);
        }

        // if (key == "showShipMenu") { openShipMenu(value) }
        // if (key == "showShipNavigation") { startNavigation() }
        // if (key == "showRouteInfo") { showInfoForRoute(value) }
        // localStorage['state'] = bury(window._globalState);
        // console.log(localStorage['state'])
        return true
    },
    deleteProperty(target:any, key:keys) {
        console.log(`Deleting ${key}`)
        // if (key == "showShipMenu") { closeShipMenu() }
        // if (key == "showShipNavigation") { endNavigation() }
        // if (key == "showRouteInfo") { removeRoute() }
        delete target[key];
        if (handlers[key]) {
            handlers[key](null);
        }
        return true
    }
};

export const state = new Proxy((<any>window)._globalState, handler);

export function reassign(){
    // for(let key of (<any>window)._globalState){ reassignKey(key) }
    reassignKey("showShipNavigation")
    reassignKey("showShipMenu")
    reassignKey("showRouteInfo")
}

function reassignKey(key:keys){
    let tmp = state[key];
    if(tmp){
        delete state[key]
        state[key] = tmp
    }

}

export function bind(name:keys, handler:(newValue:{} | null) => any) {
    handlers[name] = handler;
}



// localStorage['state'] = new Resurrect().resurrect(localStorage['state']);
