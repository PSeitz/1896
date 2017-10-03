var sounds = {};

export function load(name, path , opt){
    let dat = opt || {}
    dat.src = [path]
    sounds[name] = new Howl(dat);
}

export function play(name){
    sounds[name].play();
}

export function stop(name){
    sounds[name].stop();
}

export function get(name){
    return sounds[name]
}

export function playRandom(name){
    let randSound = _.sample(Object.keys(sounds).filter(el => el.startsWith(name)))
    sounds[randSound].play();
}

load("pirate.arr", 'sounds/arr.wav')
load("pirate.ja.ayecaptain", 'sounds/aye captain.wav')
load("pirate.ja.aye", 'sounds/aye.wav')
load("pirate.ja.bauch", 'sounds/baeuche.wav')
load("pirate.frag.eh", 'sounds/eh.wav')
load("pirate.frag.huh", 'sounds/huhwav')
load("pirate.frag.japcap", 'sounds/ja captain.wav')
load("pirate.ja.segel2", "sounds/segel2.m4a")
load("pirate.ja.segel", "sounds/segel.m4a")
load("pirate.ja.rauben", "sounds/rauben.m4a")
load("pirate.ja.ayecap", "sounds/ayecap.m4a")
load("pirate.ja.baeuche", "sounds/baeuche.m4a")
load("pirate.frag.waslos", "sounds/waslos.m4a")

load("ship.pirate.bay", "sounds/pirate-ship-at-bay.wav", {loop: true, volume: 0.2})
