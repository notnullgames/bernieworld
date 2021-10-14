import kaboom from 'kaboom'
import tiledKaboom from 'tiled-kaboom'
import map from './assets/maps/1-1.json' assert { type: "json" }

const k = kaboom({
    plugins: [ tiledKaboom ]
})

const { sprites, levels, key, mapObj } = await k.loadTiledMap(map, './assets/maps/')
console.log({ sprites, levels, key, mapObj })

// initial load
for (let level of levels) {
  k.addLevel(level, { width: 16, height: 16, ...key })
}
