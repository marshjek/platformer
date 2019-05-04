
let pl, keys, plats, gameover, jump
let bumped = false

function preload() {
  this.load.image('back', './assets/img/background.png')
  this.load.image('player', './assets/img/player.png')
  this.load.image('platform', './assets/img/platform.png')
  this.load.image('coin', './assets/img/coin.png')
  this.load.image('baddy', './assets/img/baddy.png')
  this.load.image('end', './assets/img/end.png')

  this.load.audio('music', './assets/snd/backgoundmusic.mp3')
  this.load.audio('collect', './assets/snd/coinc.wav')
  this.load.audio('collide', './assets/snd/collide.wav')
  this.load.audio('gamesound', './assets/snd/gameovers.wav')
  this.load.audio('jump', './assets/snd/jumps.wav')
}



function create() {
  pl = this.add.image(0, 0, 'back').setOrigin(0, 0)
  pl = this.physics.add.sprite(100, 100, 'player')
  pl.setCollideWorldBounds(true)
  pl.setGravityY(1200)

  jump = this.sound.add('jump')
  let music = this.sound.add('music')
  music.play()
  let collect = this.sound.add('collect')
  over = this.sound.add('gamesound')
  let bump = this.sound.add('collide')
  //let width = this.getBounds().width
  //let badx
  //if (pl.x < 400) {
  //  badx = Phaser.Math.Between(0,this.getBounds().width/2)
  //} else

  baddy = this.physics.add.sprite(200, 350, 'baddy').setScale(2.5,2.5)
  baddy.setCollideWorldBounds(true)
  baddy.setGravityY(200)
  baddy.setBounce(1)
  baddy.setVelocity(200)

  coins = this.physics.add.group()
  coins.create(600,600,'coin').setScale(3,3)
  coins.create(200,600,'coin').setScale(3,3)
  coins.create(300,400,'coin').setScale(3,3)
  coins.create(400,500,'coin').setScale(3,3)

  //let em = this.add.particles('coin').createEmitter()
  //em.setPosition(100,200)
  //em.setSpeed(100);
  //em.setBlendMode(Phaser.BlendModes.ADD)
  //em.setGravityY(600)


  keys = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,W,A,S,D,SPACE') //keys = this.input.keyboard.createCursorKeys()
  plats = this.physics.add.staticGroup()
  plats.create(300,525, 'platform').setScale(5,5).refreshBody()
  plats.create(200,650, 'platform').setScale(5,5).refreshBody()


  function collideCoin(p,c){
    c.destroy()
    score += 1 //same as score = score + 1
    scoreText.setText(`Score: ${score}`)
    collect.play()
  }

  function collidePlat(){
    if (! bumped) bump.play()
    bumped=true
}

  function endgame(p,b) {
  gameover = true
  this.add.image(0,0,'end').setOrigin(0,0)
  this.physics.pause()  
  b.destroy()
  music.stop()
  over.play()
  
  }

  this.physics.add.collider(pl,plats, collidePlat)
  this.physics.add.collider(baddy,plats)
  this.physics.add.collider(pl,coins,collideCoin)
  this.physics.add.collider(pl,baddy,endgame,null,this)
  

  let score = 0
  let scoreText = this.add.text(16,16,'Score: 0', {
    fontFamily: "comic sans ms",
    color: "red",
    fontSize: "24px",
  })
  
  
}

function update() {

  if (bumped && pl.body.touching.none) {
    bumped = false
  }

  if (gameover && keys.SPACE.isDown) {
    gameover = false
    this.create()
    this.physics.resume()
    return
  }  

  if (keys.LEFT.isDown || keys.A.isDown) {
    pl.setVelocityX(-250)
  } 

  else if (keys.RIGHT.isDown || keys.D.isDown) {
    pl.setVelocityX(250)
  }

  if (pl.body.onFloor()) {
    if (keys.UP.isDown || keys.W.isDown) {
      pl.setVelocityY(-570)
      jump.play()
      
    }
    pl.setDragX(1700)
    
  }
}

let config = {
  pixelArt: true,
  scene: { preload, create, update },
  physics: { default: 'arcade' },

  
}


new Phaser.Game(config)