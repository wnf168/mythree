import * as Three from "three";
let scene = new Three.Scene()
let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)
let material = new Three.MeshNormalMaterial()
let mesh = new Three.Mesh(geometry, material)
let renderer = new Three.WebGLRenderer({ antialias: false })
let getHeight = document.body.clientHeight;
let getWidth = document.body.clientWidth;

let camera = new Three.PerspectiveCamera(70, getWidth / getHeight, 0.01, 10)
export function init() {
    
    let container = document.getElementById('container')


    camera.position.z = 0.6
    scene.add(mesh)


    renderer.setSize(getWidth,getHeight)
    // console.log(container)
    
    container.appendChild(renderer.domElement)
    animate();

}
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02
    renderer.render(scene, camera)
}