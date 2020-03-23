import Phaser from 'phaser'
import GameScalePlugin from 'phaser-plugin-game-scale'

import objects from './objects/*.js'

export const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 240,
  height: 240,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 40 }
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

const loadMap = (app, name) => {
  const map = app.make.tilemap({ key: name })
  const tiles = map.tilesets.map(t => map.addTilesetImage(t.name))
  map.layers.forEach(layer => {
    // TODO: handle layer.properties.speed
    if (Array.isArray(layer.properties) && layer.properties.find(p => p.name === 'blocks' && p.value)) {
      map.createDynamicLayer(layer.name, tiles, 0, 0)
      map.setCollisionByExclusion([-1])
      app.physics.world.bounds.width = layer.width
      app.physics.world.bounds.height = layer.height
      app.floor = layer
    } else {
      map.createStaticLayer(layer.name, tiles, 0, 0)
    }
  })
  return map
}

function preload () {
  for (let w = 1; w < 5; w++) {
    this.load.tilemapTiledJSON(`bg-world${w}`, `/assets/maps/bg-world${w}.json`)
    this.load.image(`world${w}_outdoor`, `/assets/maps/world${w}_outdoor.png`)
    if (w === 1 || w === 4) {
      this.load.tilemapTiledJSON(`bg-castle${w}`, `/assets/maps/bg-castle${w}.json`)
      this.load.image(`world${w}_castle`, `/assets/maps/world${w}_castle.png`)
    }
    for (let s = 1; s < 4; s++) {
      this.load.tilemapTiledJSON(`${w}-${s}`, `/assets/maps/${w}-${s}.json`)
    }
  }
  Object.values(objects).forEach(object => {
    if (object.default.preload) {
      object.default.preload.bind(this)()
    } else {
      console.log(object.default, 'no preload')
    }
  })
  this.load.tilemapTiledJSON('bg-castle2', '/assets/maps/bg-castle2.json')
}

function create () {
  this.loadedObjects = []
  loadMap(this, 'bg-world1')
  const map = loadMap(this, '1-1')
  map.objects.forEach(o => {
    o.objects.forEach(object => {
      if (objects[object.type]) {
        const GameObject = objects[object.type].default
        this.loadedObjects.push(new GameObject(this, object.x, object.y, object))
      }
    })
  })
}

function update (time, delta) {
  this.loadedObjects.forEach(o => o.update(time, delta))
}
