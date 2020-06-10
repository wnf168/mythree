<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../../static/lib/stats";
import TWEEN from "@tweenjs/tween.js";
import DAT from "../../static/lib/dat.gui";
export default {
  name: "Index",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      state: null,
      app: null,
      light:null,
      param:null,
      loader:null,//图片加载器
      widths: document.body.clientWidth,
      heights: document.body.clientHeight
    };
  },
  methods: {
    //场景
    _scene() {
      this.app = document.querySelector("#container");
      this.scene = new THREE.Scene();
    },
    //相机
    _camera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.widths / this.heights,
        0.1,
        1000
      );
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
    },
    //渲染器
    _renderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: false
      });
      this.renderer.setSize(this.widths, this.heights);
      this.renderer.setClearColor("#87ceeb");
      this.app.appendChild(this.renderer.domElement);
    },
    //几何体
    _mesh() {
      var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      
      this.loader = new THREE.TextureLoader();
      var _this = this;
      // this.mesh.position = new THREE.Vector3(0,0,0);
      this.loader.load(
        '../../static/images/plant.png',
        function(texture){
            var material = new THREE.MeshBasicMaterial({ map: texture });
            _this.mesh = new THREE.Mesh(geometry, material);
            _this.scene.add(_this.mesh);
        },
        function(error){
            console.log(error)
        })
      
    },
    //状态
    _state() {      
      this.state = new Stats();
      this.state.domElement.style.position = "absolute";
      this.state.domElement.style.left = "0px";
      this.state.domElement.style.top = "0px";
      app.appendChild(this.state.domElement);
    },
    //光
    _light() {
      var ParamObj = function() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
      };
      this.param = new ParamObj();
      var gui = new DAT.GUI();
      gui.add(this.param, "x", -10000, 10000).name("环境光X的位置");
      gui.add(this.param, "y", -10000, 10000).name("环境光Y的位置");
      gui.add(this.param, "z", -10000, 10000).name("环境光Z的位置");
      this.light = new THREE.AmbientLight(0x00ff00);
      this.light.position.set(this.param.x, this.param.y, this.param.z);
      this.scene.add(this.light);
    },
    init() {
      this._scene();
      this._camera();
      this._renderer();
      this._mesh();
      this._state();
      this._light();
      this.animate();
      //this.tween();
    },
    tween() {
      new TWEEN.Tween(this.camera.position)
        .to({ x: 1.8 }, 1000)
        .repeat(Infinity)
        .start();
    },
    animate() {
      this.state.begin();
      requestAnimationFrame(this.animate);
      //this.mesh.rotation.y += 0.01;
      //console.log(this.mesh.position.x)
      this.renderer.render(this.scene, this.camera);
      this.light.position.set(this.param.x, this.param.y, this.param.z);
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