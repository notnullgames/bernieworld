export default class Player {
  static preload () {
    this.load.atlas('player', '/assets/objects/player.png', '/assets/objects/player.json')
  }

  constructor (app, x = 0, y = 0, obj) {
    console.log('player', x, y, app.floor)
    this.app = app
    this.player = app.physics.add.sprite(x, 240 - y, 'player')
    // this.player.setBounce(0.2)
    // this.player.setCollideWorldBounds(true)
    app.physics.add.collider(app.floor.tilemapLayer, this.player)
    app.cameras.main.startFollow(this.player)
    this.cursors = app.input.keyboard.createCursorKeys()
    console.log(Object.keys(this.cursors))
  }

  update (time, delta) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
      // this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)
      // this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)
      // this.player.anims.play('turn')
    }
    if (this.cursors.space.isDown) {
      this.player.setVelocityY(-100)
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }
  }
}
