var sounds = {};

export function load(name, path){
    sounds[name] = new Howl({
        src: [path]
    });
}

export function play(name){
    sounds[name].play();
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
