const KEYS = 'LEFT,RIGHT,UP,DOWN,W,A,S,D,SPACE,R'
let pl, plats, keys, jump, over, timer, score, hscore
let bumped = false
const randint = limit=> Math.floor(Math.random() * limit)
const randsign = () => Math.random() > 0.5 ? -1 : 1
const rx = () => randint(game.config.width)
const ry = () => randint(game.config.height)
const rr = (min,max) => randint(max-min+1)+min
class Main extends Phaser.Scene {
    init() {
        score = 0
        hscore = localStorage.getItem("hscore")
        if (! hscore) hscore = 0 
    }
    preload() {
        this.load.image('back', './assets/img/background.png')
        this.load.image('player', './assets/img/player.png')
        this.load.image('platform', './assets/img/platform.png')
        this.load.image('coin', './assets/img/coin.png')
        this.load.image('baddy', './assets/img/baddy.png')
        this.load.image('end', './assets/img/end.png')
        this.load.image('powerup', './assets/img/powerup.png')
        this.load.audio('music', './assets/snd/backgoundmusic.mp3')
        this.load.audio('collect', './assets/snd/coinc.wav')
        this.load.audio('collide', './assets/snd/collide.wav')
        this.load.audio('gamesound', './assets/snd/gameovers.wav')
        this.load.audio('jump', './assets/snd/jumps.wav')
    }
    create() {
        pl = this.add.image(0, 0, 'back').setOrigin(0, 0)
        pl = this.physics.add.sprite(100, 150, 'player')
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
        
        let baddy = this.physics.add.group()
        const spawnEnemy = () => {
            let b = baddy.create(rx(), ry(), 'baddy')
            b.setCollideWorldBounds(true)
            b.setGravityY(200)
            b.setBounce(1)
            let velx = 300 * randsign() + randint(50)
            let vely = 300 * randsign() + randint(50) 
            b.setVelocity(200)
        }
        spawnEnemy()
        timer = setInterval(spawnEnemy, 2000)
        let coins = this.physics.add.group()
        const spawnCoin = (x,y) => {
            let c = coins.create(x||rx(),y||ry(),'coin')
            c.setScale(2, 2)
            
        }
        for (let i=0; i<10; i++) spawnCoin()
        //let em = this.add.particles('coin').createEmitter()
        //em.setPosition(100,200)
        //em.setSpeed(100);
        //em.setBlendMode(Phaser.BlendModes.ADD)
        //em.setGravityY(600)
        keys = this.input.keyboard.addKeys(KEYS) 
        plats = this.physics.add.staticGroup()
        plats.create(300, 525, 'platform').setScale(5, 5).refreshBody()
        plats.create(200, 650, 'platform').setScale(5, 5).refreshBody()
        plats.create(512, 495, 'platform').setScale(5, 5).refreshBody()
        plats.create(252, 358, 'platform').setScale(5, 5).refreshBody()
        plats.create(98, 471, 'platform').setScale(5, 5).refreshBody()
        plats.create(500, 268, 'platform').setScale(5, 5).refreshBody()
        plats.create(860, 639, 'platform').setScale(5, 5).refreshBody()
        plats.create(739, 412, 'platform').setScale(5, 5).refreshBody()
        plats.create(941, 301, 'platform').setScale(5, 5).refreshBody()
        plats.create(308, 170, 'platform').setScale(5, 5).refreshBody()
        plats.create(542, 696, 'platform').setScale(5, 5).refreshBody()
        plats.create(752, 109, 'platform').setScale(5, 5).refreshBody()
        plats.create(519, 88, 'platform').setScale(5, 5).refreshBody()
        
        const collideCoin = (p, c) => {
            c.destroy()
            spawnCoin()
            score += 1 //same as score = score + 1
            scoreText.setText(`Score: ${score}`)
            collect.play()
            if (score >= hscore) {
                hscore = score
                localStorage.setItem("hscore", hscore)
                hscoreText.setText(`High: ${hscore}`)
            }
        }
        
        let powerups = this.physics.add.group()
        const spawnPower = (x,y) => {
            let p = powerups.create(x||rx(), y||ry(), 'powerup')
            p.setScale(2, 2)
            setTimeout(spawnPower, rr(30000,35000) )
        }
        setTimeout(spawnPower, 3000)
        const collidePowerUp = (p, u) => {
            u.destroy()
            b.destroy()
        }
        const collidePlat = () => {
            if (!bumped) bump.play()
            bumped = true
        }
        const endgame = (p, b) => {
            b.destroy()
            clearInterval(timer)
            this.add.image(0, 0, 'end').setOrigin(0, 0)
            this.physics.pause()
            music.stop()
            over.play()
        }
        this.physics.add.collider(pl, plats, collidePlat)
        this.physics.add.collider(baddy, plats)
        this.physics.add.collider(pl, coins, collideCoin)
        this.physics.add.collider(pl, baddy, endgame)
        this.physics.add.collider(pl, powerups, collidePowerUp)
        let scoreText = this.add.text(16, 16, 'Score: 0', {
            fontFamily: "comic sans ms",
            color: "red",
            fontSize: "24px",
        })
        
        
        let hscoreText = this.add.text(800, 16, `High: ${hscore}`, {
            fontFamily: "comic sans ms",
            color: "red",
            fontSize: "24px",
        })
    }
    update() {
        if (bumped && pl.body.touching.none) {
            bumped = false
        }
        if (keys.SPACE.isDown) {
            this.scene.restart()
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
}
let game = new Phaser.Game({
    scene: [Main],
    physics: { default: 'arcade' }
})