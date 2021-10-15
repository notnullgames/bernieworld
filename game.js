/* global fetch */
import kaboom from 'kaboom'
import tiledKaboom from 'tiled-kaboom'

let k

// return a nice object for an array of Tiled properties
function getProperties (object) {
  return object?.properties?.reduce((a, v) => ({ ...a, [v.name]: v.value }), {}) || {}
}

// fully load a bernie map
async function loadMap (name) {
  const { levels, key, mapObj } = await k.loadTiledMap(`./assets/maps/${name}.json`, './assets/maps/')
  const world = name.split('-')[0]
  const bgMap = await k.loadTiledMap(`./assets/maps/bg-world${world}.json`, './assets/maps/')

  // load an alternate set of keys that has area/solid added (for blocks)
  const staticKey = {}
  Object.keys(key).forEach(k => {
    staticKey[k] = () => [...key[k](), area(), solid()]
  })

  // categorize layers
  const layersAll = {}
  const layersObject = []
  const layersTiled = []
  mapObj.layers.forEach(layer => {
    layersAll[layer.name] = layer
    if (layer.type === 'tilelayer') {
      layersTiled.push(layer.name)
    } else if (layer.type === 'objectgroup') {
      layersObject.push(layer.name)
    }
  })

  // create a scene and add the layers
  k.scene(name, () => {
    k.play('overworld', {
      volume: 1,
      loop: true
    })

    k.layers(['bg', ...Object.keys(layersAll)], layersObject[0] || layersTiled[layersTiled.length - 1])

    // load bg
    // TODO: this is a pretty rudimentary way to repeat bg. I should figure out animating 1 bg for screen
    const mapWidth = mapObj.width * mapObj.tilewidth
    const bgWidth = bgMap.mapObj.width * bgMap.mapObj.tilewidth
    let bgPos = 0
    while (bgPos < mapWidth) {
      for (const level of bgMap.levels) {
        k.add([
          k.addLevel(level, { pos: k.vec2(bgPos, 0), width: bgMap.mapObj.tilewidth, height: bgMap.mapObj.tileheight, ...bgMap.key }),
          k.layer('bg')
        ])
      }
      bgPos += bgWidth
    }

    for (const l in layersTiled) {
      const props = getProperties(layersAll[layersTiled[l]])
      if (props.blocks) {
        k.add([
          k.addLevel(levels[l], { width: mapObj.tilewidth, height: mapObj.tileheight, ...staticKey }),
          k.layer(layersTiled[l])
        ])
      } else {
        k.addLevel(levels[l], { width: mapObj.tilewidth, height: mapObj.tileheight, ...key })
      }
    }

    let player

    for (const o of layersObject) {
      const { objects } = layersAll[o]
      for (const object of objects) {
        if (object.type === 'player') {
          player = k.add([
            k.sprite('bernie'),
            k.origin('botleft'),
            k.pos(object.x, object.y),
            k.body(),
            k.area(),
            'player'
          ])
          k.camPos(k.vec2(player.pos.x, 0))
        }
      }
    }

    const speed = 200

    // TODO: this movement is jerkey, jump sucks, and this camera logic is rudimentary

    if (player) {
      k.action('player', player => {
        k.camPos(player.pos)
        console.log(player.pos.y)
        if (player.pos.y > 200) {
          // music.pause()
          // k.play('death')
        }
      })

      k.keyPressRep('left', () => {
        player.move(k.vec2(-speed, 0))
      })
      k.keyPressRep('right', () => {
        player.move(k.vec2(speed, 0))
      })
      k.keyPressRep('up', () => {
        k.play('jump')
        player.jump()
      })
      k.keyPressRep('down', () => {
        player.move(k.vec2(0, speed))
      })
    } else {
      console.error('No player in map.')
    }
  })
}

async function setup () {
  window.removeEventListener('click', setup)
  document.getElementById('welcome').remove()

  k = kaboom({
    plugins: [tiledKaboom],
    scale: 4,
    clearColor: [0, 0, 0, 1],
    debug: true,
    fullscreen: true
  })

  // load sounds
  await Promise.all([
    'bounce',
    'castle-fast',
    'castle',
    'chat',
    'coin',
    'death',
    'fire',
    'flag',
    'invincibility',
    'jump',
    'overworld-fast',
    'overworld',
    'powdown',
    'powup',
    'reveal',
    'shoot',
    'stomp',
    'victory'
  ].map(name => k.loadSound(name, `assets/sounds/${name}.ogg`)))

  // load object sprites
  // TODO: these are just for map-making. load the actual spritesheet here.
  await Promise.all([
    'bernie',
    'cheese-left',
    'cheese-right',
    'cheeto',
    'fire',
    'fist',
    'gopoboo',
    'ice',
    'lever',
    'magamba-left',
    'magamba-right',
    'mitch-green-left',
    'mitch-green-right',
    'mitch-red-left',
    'mitch-red-right',
    'paramitch-green-left',
    'paramitch-green-right',
    'paramitch-red-left',
    'paramitch-red-right',
    'republican',
    'tikitorcher-left',
    'tikitorcher-right',
    'trashman'
  ].map(name => k.loadSprite(name, `assets/maps/objects/${name}.png`)))

  // load levels
  await Promise.all([
    loadMap('1-1')
  ])

  // start on 1-1
  k.go('1-1')
}

window.addEventListener('click', setup)
