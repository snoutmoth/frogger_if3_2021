let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    },
    autoCenter: true
};


let game = new Phaser.Game(config);

let frog, mumFrog, deadFrog;
let down, up, left, right;
let tweenHeart;
let car = [];
let welcomeImage, playButtonImage;
let onWelcomeScreen = true;
let counter;
let timerText, countdownTimer, scoreText;
let savedFrog;
let jumpSound, smashedSound, traficSound;

function init() {
   
}

function preload() {
    this.load.image('background', './assets/images/FroggerBackground.png');
    this.load.image('frog', './assets/images/Frog.png');
    this.load.image('mumfrog', './assets/images/MumFrog.png');
    this.load.image('heart', './assets/images/heart.png');
    this.load.image('car0', './assets/images/car.png');
    this.load.image('car1', './assets/images/F1-1.png');
    this.load.image('car2', './assets/images/snowCar.png');
    this.load.image('deadfrog', './assets/images/deadFrog.png');
    this.load.image('welcome', './assets/images/TitleScreen.png');
    this.load.image('playbutton', './assets/images/playButton.webp');

    this.load.audio('jump', './assets/audio/coaac.wav');
    this.load.audio('smashed', './assets/audio/smashed.wav');
    this.load.audio('trafic', './assets/audio/trafic.wav');
}

function create() {
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    backgroundImage = this.add.image(0, 0, 'background'); 
    backgroundImage.setOrigin(0, 0);
    frog = this.add.image(241, 296, 'frog');
    deadFrog = this.add.image(-100, -100, 'deadfrog');
    let numCaseMumFrog = Phaser.Math.Between(0, 25);
    mumFrog = this.add.image(numCaseMumFrog*16, 0, 'mumfrog');
    mumFrog.setOrigin(0, 0);

    for(let j=0; j<3; j++){
        for(let i=0; i<10 ; i++){
            let index = i+j*10;   // index va de 0 à 29
            let randomSpace = Phaser.Math.Between(-15, 15);
            let randomCar = Phaser.Math.Between(0,2);
            car[index] = this.physics.add.image(-50+i*55 + randomSpace, 192+j*32, 'car'+randomCar);
            car[index].setOrigin(0, 0);
            car[index].setVelocity(100, 0);
        }
    }

    for(let j=0; j<3; j++){
        for(let i=0; i<10 ; i++){
            let index = 30+i+j*10;  // index va de 30 à 59
            let randomSpace = Phaser.Math.Between(-15, 15);
            let randomCar = Phaser.Math.Between(0,2);
            car[index] = this.physics.add.image(480+i*55 + randomSpace, 64+j*32, 'car'+randomCar);
            car[index].setOrigin(0, 0);
            car[index].setAngle(180);
            car[index].setVelocity(-100, 0);
        }
    }


    let heart = this.add.image(240, 160, 'heart');
    heart.setScale(0.0);
    tweenHeart = this.tweens.add({
        targets: heart,
        scale: 4.0, 
        duration: 6000, 
        ease: 'Linear', 
        yoyo: false,
        loop: 0,
        paused: true
        });

    timerText = this.add.text(455, 0, "", { fontFamily: 'carterone', fontSize: 18, color: '#000000' });
    countdownTimer = this.time.addEvent({
        delay: 1000,
        callback: countdown, 
        callbackScope: this,
        repeat: -1,
        paused: true
        });

    welcomeImage = this.add.image(0, 0, 'welcome');
    welcomeImage.setOrigin(0, 0);
    welcomeImage.setScale(0.7);
    playButtonImage = this.add.image(240, 280, 'playbutton').setInteractive();
    playButtonImage.on('pointerdown', startGame);
    playButtonImage.setScale(0.05);

    scoreText = this.add.text(100, 200, "", { fontFamily: 'carterone', fontSize: 18, color: '#000000' });

    jumpSound = this.sound.add('jump'); 
    smashedSound = this.sound.add('smashed'); 
    traficSound = this.sound.add('trafic'); 
}

function update() {
    if(!onWelcomeScreen){
        if (Phaser.Input.Keyboard.JustDown(down)&&frog.y<304) {
            frog.y += 16;
            frog.setAngle(180);
            jumpSound.play();
        }
        if (Phaser.Input.Keyboard.JustDown(up)&&frog.y>16) {
            frog.y -= 16;
            frog.setAngle(0);
            jumpSound.play();
        }
        if (Phaser.Input.Keyboard.JustDown(left)&&frog.x>16) {
            frog.x -= 16;
            frog.setAngle(-90);
            jumpSound.play();
        }
        if (Phaser.Input.Keyboard.JustDown(right)&&frog.x<464) {
            frog.x += 16;
            frog.setAngle(90);
            jumpSound.play();
        }
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(), mumFrog.getBounds())) {
        frog.x = -100;
        tweenHeart.play();
        setTimeout(newFrog, 1000);
        savedFrog++;
    }

    for(let i=0; i<60; i++){
        if(i<30&&car[i].x>500) car[i].x=-50;
        if(i>=30&&car[i].x<-50) car[i].x = 500;
        if(Phaser.Geom.Intersects.RectangleToRectangle(frog.getBounds(), car[i].getBounds())) {
            deadFrog.setPosition(frog.x, frog.y);
            frog.x = -100;
            setTimeout(newFrog, 3000);
            smashedSound.play();
        }
    }
}

function startGame(){
    welcomeImage.setVisible(false);
    playButtonImage.setVisible(false);
    onWelcomeScreen = false;
    countdownTimer.paused = false;
    savedFrog = 0;
    counter = 60;
    traficSound.play({loop: true});
}

function countdown(){
    counter--;
    timerText.text = counter;
    if (counter==0) gameOver();
}

function newFrog(){
    frog.setPosition(241, 296);
    deadFrog.setPosition(-100, -100);
}

function gameOver(){
    countdownTimer.paused = true;
    welcomeImage.setVisible(true);
    playButtonImage.setVisible(true);
    scoreText.text="Vous avez sauvé " + savedFrog + " grenouille(s)"
}

/*

index = i + j * 10 

i = 0 j = 0 -> index = 0
i = 1 j = 0 -> index = 1
...
i = 9 j = 0 -> index = 9
i = 0 j = 1 -> index = 10
i = 1 j = 1 -> index = 11
...
i = 9 j = 1 -> index = 19
i = 0 j = 2 -> index = 20
i = 1 j = 2 -> index = 21
...
i = 9 j = 2 -> index = 29

*/