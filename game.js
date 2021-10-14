/* global fetch */
import kaboom from 'kaboom'
import tiledKaboom from 'tiled-kaboom'

async function loadMap (name) {
  const map = await fetch(`./assets/maps/${name}.json`).then(r => r.json())
  const { levels, key, mapObj } = await k.loadTiledMap(map, './assets/maps/')

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
    k.layers(Object.keys(layersAll), layersObject[0] || layersTiled[layersTiled.length - 1])
    for (const l in layersTiled) {
      k.addLevel(levels[l], { width: mapObj.tileheight, height: mapObj.tilewidth, ...key })
    }
  })
}

let k
async function setup () {
  document.getElementById('welcome').remove()
  k = kaboom({
    plugins: [tiledKaboom]
  })

  await loadMap('1-1')
  k.go('1-1')

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
}

window.addEventListener('click', setup)
