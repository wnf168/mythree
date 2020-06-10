<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../../static/lib/stats"
import TWEEN from '@tweenjs/tween.js'
export default {
  name: "Index",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      state:null,
      widths:document.body.clientWidth,
      heights:document.body.clientHeight
    };
  },
  methods: {
    init(){
        let app = document.querySelector("#container");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45,this.widths/this.heights,0.1,1000);
        // this.camera.position.x = 0;
        // this.camera.position.y = 0;
        // this.camera.position.z = 600;
        // this.camera.up.x = 0;
        // this.camera.up.y = 1;
        this.camera.position.z = 1;
        // this.camera.lookAt({
        //   x:0,
        //   y:0,
        //   z:0
        // })
        this.renderer = new THREE.WebGLRenderer({
            antialias:false
        });
        this.renderer.setSize(this.widths,this.heights);
        this.renderer.setClearColor('#87ceeb')
        app.appendChild(this.renderer.domElement);

        var geometry = new THREE.BoxGeometry(0.2,0.2,0.2);
        var material = new THREE.MeshBasicMaterial({color:'#ff0000'});
        this.mesh = new THREE.Mesh(geometry,material);
        // this.mesh.position = new THREE.Vector3(0,0,0);
        this.scene.add(this.mesh);
        this.state = new Stats();
        this.state.domElement.style.position = "absolute";
        this.state.domElement.style.left = "0px";
        this.state.domElement.style.top = "0px";
        app.appendChild(this.state.domElement)

        
        this.animate();
        this.tween();
    },
    tween(){
       new TWEEN.Tween(this.camera.position).to({x:1.8},1000).repeat(Infinity).start();
    },
    animate(){
        this.state.begin();
        requestAnimationFrame(this.animate);
        //this.mesh.rotation.y += 0.01;
        //console.log(this.mesh.position.x)
        this.renderer.render(this.scene,this.camera);
        TWEEN.update();
        this.state.end();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style  scoped>
#container {
  height: 100%;
}
</style>