"use strict";

/*class UI{
    static keyHandler(e){
        let text = e.code + '\n';
        if (e.code === "Space"){
        //puff!
        }
        switch (e.code){
          case "ArrowUp":
          case "ArrowLeft":
          case "ArrowDown":
          case "ArrowRight":
            field.callTankMove(user_tank, Direction[e.code.substring(5)]);
            break;
          case "Space":
            field.callTankShoot(user_tank);
            break;
        }
    }
}*/
//addEventListener("keydown", throttle(UI.keyHandler, 50));


function throttle(func, limit){
    return func; //TODO
}

let app = new PIXI.Application({ width: 800, height: 800 });
let user_tank;
let field = new Field();

let main_interval, audio_interval, te_audio;

let gameStarted = false;


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const cellsInUse = new Map();

const randomCoords = () => {
    const coordX = getRndInteger(field.width / 2, field.width - 2);
    const coordY = getRndInteger(field.height / 2, field.height - 2);
    const coord_key = `${coordX}x${coordY}`;

    if (cellsInUse.has(coord_key)) {
        return randomCoords();
    }

    cellsInUse.set(coord_key);

    return [coordX, coordY];
}

window.onload = () => loadTextures().then(() => {
    user_tank  = new Tank(2, 2, 0, 0, 2);

    const keysMap = {
        ArrowUp: 'move',
        ArrowLeft: 'move',
        ArrowDown: 'move',
        ArrowRight: 'move',
        Space: 'shoot',
    };

    const keysPressed = {
        move: false,
        shoot: false
    }

    let movementInterval;

    addEventListener("keydown", function(e) {

        if (!keysMap[e.code] && e.code != "Enter") {
            return;
        }

        if (gameStarted && keysMap[e.code] === 'move' && !keysPressed.move) {
            clearInterval(movementInterval);
            const dir = Direction[e.code.substring(5)];

            keysPressed.move = true;
            field.callTankMove(user_tank, dir);
            movementInterval = setInterval(() => {
                field.callTankMove(user_tank, dir);
            }, 50);
        }

        if (e.code == "Enter" && !gameStarted){
            document.querySelector('.lauPopup').classList.add('lauHide');
            gameStarted = true;

            main_interval = setInterval(() => field.draw(), 1000/field.fps);;

            te_audio = new Audio("tank_engine.mp3");
            te_audio.volume = 0.1;
            te_audio.play();
            audio_interval = setInterval(() => { te_audio.play(); }, 30500);
        }
    });

    addEventListener("keyup", function(e) {
        if (keysMap[e.code] === 'move') {
            clearInterval(movementInterval);
            keysPressed.move = false;
        }


        if (keysMap[e.code] === 'shoot') {
            field.callTankShoot(user_tank);
        }
    });



    document.querySelector('.lauCanWrap').appendChild(app.view);

    let renderer = new PIXI_Renderer(field);

    field.renderer = renderer;

    field.loadMap(maps[Math.floor(Math.random() * maps.length)]);
    field.setSprites();
    field.tankDeathAudio = new Audio("tank_death.mp3");
    field.tankDeathAudio.volume = 0.1;
    field.userTankDeathAudio = new Audio("user_tank_death.mp3");
    field.userTankDeathAudio.volume = 0.1;
    field.userTankMoveAudio = new Audio("tank_move.mp3");
    field.userTankMoveAudio.volume = 0.1;
    field.consAudio = new Audio("cons.mp3");
    field.consAudio.volume = 0.1;
    field.bulletWallAudio = new Audio("bullet_wall.mp3");
    field.bulletWallAudio.volume = 0.1;

    field.user_tank = user_tank; //TODO: rewrite user_tank
    field.addTank(user_tank);
    app.stage.addChild(terrainContainer);
    app.stage.addChild(consContainer);
    app.stage.addChild(tankContainer);
    app.stage.addChild(bulletContainer);
    app.stage.addChild(effectContainer);


    for(let a = 1, tanksCount = 3; a <= tanksCount; a++) {
        addTank(0);
    }
    for(let a = 1, tanksCount = 3; a <= tanksCount; a++) {
        addTank(1);
    }
    for(let a = 1, tanksCount = 1; a <= tanksCount; a++) {
        addTank(2);
    }

    for(let a = 1, tanksCount = 3; a <= tanksCount; a++) {
        addPoolTank(0);
    }
    for(let a = 1, tanksCount = 3; a <= tanksCount; a++) {
        addPoolTank(1);
    }
    for(let a = 1, tanksCount = 3; a <= tanksCount; a++) {
        addPoolTank(2);
    }

    field.max_tanks = 7 + 1;

    field.draw();
    //let end_status = document.getElementById("end_status");
    //let pool_status = document.getElementById("pool_status");
    //end_status.textContent = "OK";

//const reader = new FileReader();
//let map_text = reader.readAsText(new File("", "maps/map1.mp"));



});

function addTank(type = Math.floor(Math.random() * 3)){
    switch (type) {
        case 0:
        {
            const [x, y] = randomCoords();

            let enemy_tank = new Tank(x, y, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) + 8, 1, 1);

            field.addTank(enemy_tank);

            let ai = new Private(field, enemy_tank);
            field.addAI(ai);
            break;
        }
        case 1:
        {
            const [x, y] = randomCoords();

            let enemy_tank = new Tank(x, y, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) + 16, 2, 1);

            field.addTank(enemy_tank);

            let ai = new Officer(field, enemy_tank);
            field.addAI(ai);
            break;
        }
        case 2:
        {
            const [x, y] = randomCoords();

            let enemy_tank = new Tank(x, y, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) + 24, 3, 1);

            field.addTank(enemy_tank);

            let ai = new OfficerII(field, enemy_tank);
            field.addAI(ai);
            break;
        }
    }
}

function addPoolTank(type = Math.floor(Math.random() * 3)){
    const grid = document.getElementsByClassName("enemyGrid")[0];
    const tank_icon = document.createElement('div');
    tank_icon.classList.add("enemyItem");
    grid.appendChild(tank_icon);
    switch (type) {
        case 0: {
            const [x, y] = randomCoords();

            let enemy_tank = new Tank(x, y, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) + 8, 1, 1);

            field.tanks_pool.push(enemy_tank);

            let ai = new Private(field, enemy_tank);
            field.ai_pool.push(ai);
            break;
        }
        case 1: {
            const [x, y] = randomCoords();

            let enemy_tank = new Tank(x, y, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) + 16, 1, 1);

            field.tanks_pool.push(enemy_tank);

            let ai = new Officer(field, enemy_tank);
            field.ai_pool.push(ai);
            break;
        }
        case 2:
        {
            const [x, y] = randomCoords();

            let enemy_tank = new Tank(x, y, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) + 24, 1, 1);

            field.tanks_pool.push(enemy_tank);

            let ai = new OfficerII(field, enemy_tank);
            field.ai_pool.push(ai);
            break;
        }
    }
}

function endOfGame(win){
    clearInterval(main_interval);
    clearInterval(audio_interval);
    te_audio.pause();
    const big_popup = document.getElementsByClassName("lauPopup")[0];
    const small_popup = document.getElementsByClassName("popupWrap")[0];
    const string = win ? "YOU WIN! PRESS F5 TO START!" : "YOU LOSE! PRESS F5 TO START!";
    console.log(document, document.getElementsByClassName("lauPopup"), small_popup, big_popup);
    small_popup.textContent = string;
    big_popup.classList.remove("lauHide");
    //field.draw();
    app.stop();
    field.userTankMoveAudio.volume = 0;
}