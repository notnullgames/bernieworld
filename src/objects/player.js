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
  }

  update (time, delta) {
  }
}
