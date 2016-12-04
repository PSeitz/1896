var sounds = {};

function load(name, path){
    sounds[name] = new Howl({
      src: [path]
    });
}

function play(name){
    sounds[name].play();
}

// load("attack", 'sounds/attack.wav')
