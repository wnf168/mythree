<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
export default {
  name: "Index",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      widths:document.body.clientWidth,
      heights:document.body.clientHeight
    };
  },
  methods: {
    init(){
        let app = document.querySelector("#container");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45,this.widths/this.heights,0.05,1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.widths,this.heights);
        this.renderer.setClearColor('#87ceeb')
        app.appendChild(this.renderer.domElement);

        var geometry = new THREE.BoxGeometry(0.2,0.2,0.2);
        var material = new THREE.MeshBasicMaterial({color:'#ff0000'});
        this.mesh = new THREE.Mesh(geometry,material);
        this.scene.add(this.mesh);

        this.camera.position.z = 1;
        this.animate();
    },
    animate(){
        requestAnimationFrame(this.animate);
        this.mesh.rotation.x += 0.1;
        this.renderer.render(this.scene,this.camera);
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