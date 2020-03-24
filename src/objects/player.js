export default class Player {
  static preload () {
  }

  constructor (app, x = 0, y = 0, obj) {
    this.app = app
    this.player = app.physics.add.sprite(x, 400 - y, 'sprites')
    this.player.setBounce(0.2)
    // this.player.setCollideWorldBounds(true)
    app.physics.add.collider(app.floor.tilemapLayer, this.player)
    app.cameras.main.startFollow(this.player)
    this.cursors = app.input.keyboard.createCursorKeys()

    let frames = app.anims.generateFrameNames('sprites', { start: 0, end: 2, prefix: 'bernie-', suffix: '.png' })
    app.anims.create({ key: 'small-stand', frames, frameRate: 0.5, repeat: -1 })
    this.player.anims.play('small-stand')
    this.player.setSize(16, 32, 0, 16)
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
