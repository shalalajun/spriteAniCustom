import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import FlipBookAni from './FlipBookAni.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'




/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const light = new THREE.DirectionalLight(0xffffff, 1.5)
light.position.set(3,2,0)
scene.add(light)


/**
 * texture
 */
const spriteTexture = new THREE.TextureLoader().load( 'textures/sprite/sprite.png' );

const sMaterial = new THREE.MeshToonMaterial({ map: spriteTexture })

const gltfLoader = new GLTFLoader()
gltfLoader.load('models/headTest.glb', (gltf)=>{
    const head = gltf.scene
    head.scale.set(30,30,30)
    
    head.traverse((child)=>{

        if(child.isMesh )
        {
            child.material = sMaterial
        }

    })
    scene.add(head)
})


// const spriteAni = new TextureAnimator2(spriteTexture, 8, 5)
// spriteAni.loop([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 0.5)

const flipBookAni = new FlipBookAni(spriteTexture, 8, 5)
flipBookAni.loop([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 0.5)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const deltaTime = clock.getDelta()
    // Update controls
    controls.update()
   // spriteAni.update(deltaTime)
 
    flipBookAni.update(deltaTime)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    setTimeout(() =>{
        window.requestAnimationFrame(tick)
    }, 1000 / 30)
   
}

tick()


function TextureAnimator2(spriteTexture, tileHorize, tileVertical) 
{	
	// note: texture passed by reference, will be updated by the update function.
    this.texture = spriteTexture;
    //this.texture.flipY = false
    this.texture.magFilter = THREE.NearestFilter;
    spriteTexture.wrapS = spriteTexture.wrapT = THREE.RepeatWrapping; 
    this.texture.repeat.set(1/tileHorize, 1/tileVertical);

    this.currentTile = 0
    this.tileHorize = 0
    this.tileVertical = 0

   
    this.tileHorize = tileHorize;
	this.tileVertical = tileVertical;


    this.playSpriteIndices = []
    this.runningTileArrayIndex = 0
    this.maxDisplayTime = 0
    this.elapsedTime = 0
    
    this.loop = function(playSpriteIndices, totalduration)
    {
        this.playSpriteIndices = playSpriteIndices
        this.runningTileArrayIndex = 0
        this.currentTile = playSpriteIndices[this.runningTileArrayIndex]
        this.maxDisplayTime = totalduration / this.playSpriteIndices.length
        
    }
	
	this.update = function(delta)
    {
        this.elapsedTime += delta
        
        if(this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime)
        {
            this.elapsedTime = 0
            this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length
            this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex]
     
            const offsetX = (this.currentTile % this.tileHorize) / this.tileHorize
            const offsetY = (this.tileVertical - Math.floor(this.currentTile / this.tileHorize)-1) / this.tileVertical
            this.texture.offset.x = offsetX
            this.texture.offset.y = offsetY
        }

    }
    

}