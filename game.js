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
  const blevels = bgMap.levels
  const bkey = bgMap.key
  const bmapObj = bgMap.mapObj

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

  const blayersTiled = bmapObj.layers.map(layer => layer.name)

  // create a scene and add the layers
  k.scene(name, () => {
    // setup layers
    const layerNames = [...blayersTiled, ...Object.keys(layersAll)]
    const defaultLayer = layersObject[0] || layersTiled[layersTiled.length - 1]
    k.layers(layerNames, defaultLayer)

    const bLayers = {}

    // add background
    for (const l in blayersTiled) {
      const level = blevels[l]
      const layerName = blayersTiled[l]
      bLayers[layerName] = k.add([
        k.addLevel(level, { width: bmapObj.tilewidth, height: bmapObj.tileheight, ...bkey }),
        k.layer(layerName)
      ])
    }

    // add foreground
    for (const l in layersTiled) {
      const props = getProperties(layersAll[layersTiled[l]])
      if (props.blocks) {
        k.add([
          k.addLevel(levels[l], { width: mapObj.tilewidth, height: mapObj.tileheight, ...staticKey }),
          k.layer(layersTiled[l])
        ])
      } else {
        k.add([
          k.addLevel(levels[l], { width: mapObj.tilewidth, height: mapObj.tileheight, ...key }),
          k.layer(layersTiled[l])
        ])
      }
    }

    let player
    k.play('overworld', { loop: true })

    for (const o of layersObject) {
      const { objects } = layersAll[o]
      for (const object of objects) {
        if (object.type === 'player') {
          player = k.add([
            k.sprite('bernie'),
            k.origin('botleft'),
            k.pos(object.x, object.y),
            k.body(),
            k.area({ width: 16, height: 16 }),
            k.origin('bot'),
            'player'
          ])
          k.camPos(k.vec2(player.pos.x, 0))
        }
      }
    }

    const speed = 200
    let jumping = false

    // TODO: this movement is jerky, jump sucks, and this camera logic is rudimentary

    function doJump () {
      if (player.grounded()) {
        k.play('jump')
        player.jump(speed * 2)
        jumping = true
      }
    }

    if (player) {
      k.action('player', player => {
        k.camPos(k.vec2(player.pos.x + 100, 124))

        if (player.grounded()) {
          jumping = false
        }

        if (jumping) {
          player.play('jump')
        } else {
          player.play('idle')
        }

        console.log(player.frame)

        if (player.pos.y > 208) {
          // music.pause()
          // k.play('death')
        }
      })
      k.keyDown('left', () => {
        player.move(-speed, 0)
        player.flipX(true)
      })
      k.keyDown('right', () => {
        player.move(speed, 0)
        player.flipX(false)
      })
      k.keyDown('up', doJump)
      k.keyDown('space', doJump)
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
    width: 208,
    height: 208,
    stretch: true,
    letterbox: true
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

  await k.loadSpriteAtlas('assets/sprites/spritesheet.png', {
    bernie: {
      x: 0,
      y: 0,
      width: 512,
      height: 32,
      sliceX: 32,
      anims: {
        walk: { from: 2, to: 4, loop: true, speed: 1 },
        idle: { from: 2, to: 0, loop: true, speed: 0.5 },
        jump: { from: 7, to: 8, speed: 3 }
      },
      anim: 'idle'
    }
  })

  // load levels
  await Promise.all([
    loadMap('1-1')
  ])

  // start on 1-1
  k.go('1-1')
}

window.addEventListener('click', setup)
