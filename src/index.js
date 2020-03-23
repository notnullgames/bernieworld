import Phaser from 'phaser'
import GameScalePlugin from 'phaser-plugin-game-scale'

export const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 240,
  height: 240,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  pixelArt: true,
  zoom: 4,
  scaleMode: 0,
  scene: {
    preload,
    create,
    update
  },
  plugins: {
    global: [{
      key: 'GameScalePlugin',
      plugin: GameScalePlugin,
      mapping: 'gameScale'
    }]
  }
})

function preload () {
  this.load.tilemapTiledJSON('1-1', '/assets/maps/1-1.json')
  this.load.tilemapTiledJSON('1-2', '/assets/maps/1-2.json')
  this.load.tilemapTiledJSON('1-3', '/assets/maps/1-3.json')
  this.load.tilemapTiledJSON('2-1', '/assets/maps/2-1.json')
  this.load.tilemapTiledJSON('2-2', '/assets/maps/2-2.json')
  this.load.tilemapTiledJSON('2-3', '/assets/maps/2-3.json')
  this.load.tilemapTiledJSON('3-1', '/assets/maps/3-1.json')
  this.load.tilemapTiledJSON('3-2', '/assets/maps/3-2.json')
  this.load.tilemapTiledJSON('3-3', '/assets/maps/3-3.json')
  this.load.tilemapTiledJSON('4-1', '/assets/maps/4-1.json')
  this.load.tilemapTiledJSON('4-2', '/assets/maps/4-2.json')
  this.load.tilemapTiledJSON('4-3', '/assets/maps/4-3.json')
  this.load.tilemapTiledJSON('bg-castle1', '/assets/maps/bg-castle1.json')
  this.load.tilemapTiledJSON('bg-castle2', '/assets/maps/bg-castle2.json')
  this.load.tilemapTiledJSON('bg-castle4', '/assets/maps/bg-castle4.json')
  this.load.tilemapTiledJSON('bg-world1', '/assets/maps/bg-world1.json')
  this.load.tilemapTiledJSON('bg-world2', '/assets/maps/bg-world2.json')
  this.load.tilemapTiledJSON('bg-world3', '/assets/maps/bg-world3.json')
  this.load.tilemapTiledJSON('bg-world4', '/assets/maps/bg-world4.json')
  this.load.image('world1_castle', '/assets/maps/world1_castle.png')
  this.load.image('world1_outdoor', '/assets/maps/world1_outdoor.png')
  this.load.image('world2_outdoor', '/assets/maps/world2_outdoor.png')
  this.load.image('world3_outdoor', '/assets/maps/world3_outdoor.png')
  this.load.image('world4_castle', '/assets/maps/world4_castle.png')
  this.load.image('world4_outdoor', '/assets/maps/world4_outdoor.png')
}

function create () {
  const loadMap = name => {
    const map = this.make.tilemap({ key: name })
    const tiles = map.tilesets.map(t => map.addTilesetImage(t.name))
    map.layers.forEach(layer => {
      if (Array.isArray(layer.properties) && layer.properties.find(p => p.name === 'blocks' && p.value)) {
        map.createDynamicLayer(layer.name, tiles, 0, 0)
        map.setCollisionByExclusion([-1])
        this.physics.world.bounds.width = layer.width
        this.physics.world.bounds.height = layer.height
      } else {
        map.createStaticLayer(layer.name, tiles, 0, 0)
      }
    })
    return map
  }

  loadMap('bg-world1')
  loadMap('1-1')
}

function update (time, delta) {
}
