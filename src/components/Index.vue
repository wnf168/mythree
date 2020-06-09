<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../../static/lib/stats"
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
        this.camera = new THREE.PerspectiveCamera(45,this.widths/this.heights,0.05,1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias:false
        });
        this.renderer.setSize(this.widths,this.heights);
        this.renderer.setClearColor('#87ceeb')
        app.appendChild(this.renderer.domElement);

        var geometry = new THREE.BoxGeometry(0.2,0.2,0.2);
        var material = new THREE.MeshBasicMaterial({color:'#ff0000'});
        this.mesh = new THREE.Mesh(geometry,material);
        this.scene.add(this.mesh);
        this.state = new Stats();
        this.state.domElement.style.position = "absolute";
        this.state.domElement.style.left = "0px";
        this.state.domElement.style.top = "0px";
        app.appendChild(this.state.domElement)

        this.camera.position.z = 1;
        this.animate();
    },
    animate(){
        this.state.begin();
        requestAnimationFrame(this.animate);
        this.mesh.rotation.y += 0.01;
        this.renderer.render(this.scene,this.camera);
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