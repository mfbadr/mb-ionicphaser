var game = new Phaser.Game(711, 400, Phaser.CANVAS, '', {preload:preload, create:create, update:update}),
  map, background, clouds, ground, dude, money, coinSound, score, scoreTxt;

function preload(){
  game.load.tilemap('map', 'assets/mb-ionicphaser.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('mario', 'assets/super_mario.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('coin', 'assets/coin.png', 32, 32);

  game.load.audio('coinSound', 'assets/sonic_ring.wav');

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  game.scale.refresh();
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  map = game.add.tilemap('map');
  map.addTilesetImage('mario', 'mario');
  background = map.createLayer('Background');
  clouds = map.createLayer('Clouds');
  ground = map.createLayer('Ground');
  background.resizeWorld();

  map.setCollision(34, true, 'Ground')

  dude = game.add.sprite(20, 20, 'dude');
  dude.animations.add('left', [0, 1, 2, 3], 10, true);
  dude.animations.add('right', [5, 6, 7, 8], 10, true);
  game.physics.arcade.enable(dude);
  game.camera.follow(dude);
  dude.body.gravity.y = 150;
  dude.body.collideWorldBounds = true;

  money = game.add.group();
  money.enableBody = true;
  money.physicsBodyType = Phaser.Physics.ARCADE;
  map.createFromObjects('Coins', 45, 'coin', 0, true, false, money);
  money.callAll('animations.add', 'animations', 'spin', [0 , 1, 2, 3, 4, 5], 10, true);
  money.callAll('animations.play', 'animations', 'spin');

  coinSound = game.add.audio('coinSound', 1);

  score = 0;
  scoreTxt = game.add.text(20, 10, 'Score: 0');
  scoreTxt.fixedToCamera = true;
}

function collect(dude, coin){
  coinSound.play();
  coin.kill();
  score += 10;
  scoreTxt.text = 'Score: ' + score;
}
function update(){

  game.physics.arcade.collide(dude, ground);
  game.physics.arcade.collide(money, ground);
  game.physics.arcade.collide(money, money);

  game.physics.arcade.overlap(dude, money, collect)

  if(game.input.activePointer.isDown){
    if(game.input.activePointer.x < 350){
      dude.body.velocity.x = -150;
      dude.animations.play('left');
    }else{
      dude.body.velocity.x = 150;
      dude.animations.play('right');
    }

    if(game.input.activePointer.y < 200){
      dude.body.velocity.y = -300;
    }
  }else{
    dude.body.velocity.x = 0;
    dude.frame = 4;
  }
}
