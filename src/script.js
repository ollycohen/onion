import './style.css'
import 'bootstrap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const onionColor = 0xBFA169;

// Loading
const textureLoader = new THREE.TextureLoader()

const onionTexture = textureLoader.load('/textures/onionRecord.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereGeometry( .7, 16, 32, 100);

// Materials

// const material = new THREE.MeshStandardMaterial()
const material = new THREE.PointsMaterial()
material.color = new THREE.Color(onionColor)
// material.metalness = .7
// material.roughness = .2
// material.wireframe = true
material.normalMap = onionTexture
material.size = 4

// Mesh
const sphere = new THREE.Points(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(onionColor, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(onionColor, 0.2)
pointLight2.position.set(0,0,0)
pointLight2.intensity = 2
scene.add(pointLight2)

gui.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
gui.add(pointLight2.position, 'x').min(-3).max(3).step(0.01)
gui.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)


// gui.add(pointLight2.intensity, 'intensity').min(0).max(10).step(0.01)

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, .64)
// scene.add(pointLightHelper)

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

const onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

document.addEventListener('mousemove', onDocumentMouseMove)

const updateSphere = (event) => {
    sphere.position.y = window.scrollY  * .001
}

window.addEventListener('scroll', updateSphere)


const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .5 * (targetY - sphere.rotation.x)
    sphere.position.z = .5 * (targetX - sphere.rotation.y)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()