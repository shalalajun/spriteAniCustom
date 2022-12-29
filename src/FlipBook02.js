import *as THREE from 'three'

export default class FilpBook
{


    constructor(scene, spriteTexture, tileHorize, tileVertical)
    {
        this.currentTile = 0
        this.tileHorize = 0
        this.tileVertical = 0
        this.playSpriteIndices = []
        this.runningTileArrayIndex = 0
        this.maxDisplayTime = 0
        this.elapsedTime = 0

        this.map = new THREE.TextureLoader().load(spriteTexture)
        this.map.magFilter = THREE.NearestFilter
        this.tileHorize = tileHorize
        this.tileVertical = tileVertical
        this.map.repeat.set(1/this.tileHorize, 1/this.tileVertical)

        this.material = new THREE.MeshBasicMaterial({map: this.map})
        this.sprite = new THREE.Sprite(this.material)
        this.sprite.position.y = 0.5

        scene.add(this.sprite)

        this.update(0)

    }


    loop(playSpriteIndices, totalduration)
    {
        this.playSpriteIndices = playSpriteIndices
        this.runningTileArrayIndex = 0
        this.currentTile = playSpriteIndices[this.runningTileArrayIndex]
        this.maxDisplayTime = totalduration / this.playSpriteIndices.length
    }

    update(delta)
    {
        this.elapsedTime += delta

        if(this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime)
        {
            this.elapsedTime = 0
            this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length
            this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex]

            const offsetX = (this.currentTile % this.tileHorize) / this.tileHorize
            const offsetY = (this.tileVertical - Math.floor(this.currentTile / this.tileHorize)-1) / this.tileVertical
            this.map.offset.x = offsetX
            this.map.offset.y = offsetY
        }
    }

}