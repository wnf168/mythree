<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../../static/lib/stats";
import TWEEN from "@tweenjs/tween.js";
import DAT from "../../static/lib/dat.gui";
import {VTKLoader} from "../../static/lib/VTKLoader"
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
      light: null,
      param: null,
      loader: null, //图片加载器
      texture: null, //存图片
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
        60,
        this.widths / this.heights,
        0.01,
        1e10
      );
      // this.camera.position.x = 0;
      // this.camera.position.y = 0;
      // this.camera.position.z = 600;
      // this.camera.up.x = 0;
      // this.camera.up.y = 1;
      this.camera.position.z = 0.2;
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
      // var geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      // var geometry = new THREE.PlaneGeometry(500, 300, 1, 1);
      // this.loader = new THREE.TextureLoader();
      this.loader = new VTKLoader();
      // this.mesh.position = new THREE.Vector3(0,0,0);
      var _this = this;
      this.texture = this.loader.load("../../static/images/bunny.vtk", function(
        texture
      ) {
        var material = new THREE.MeshLambertMaterial( { color:0xffffff, side: THREE.DoubleSide } );
        texture.computeVertexNormals();
        _this.mesh = new THREE.Mesh(texture, material);
        _this.mesh.position.setY(-0.09);
        _this.scene.add(_this.mesh);
      });
      
      // var material = new THREE.MeshLambertMaterial( { color:0xffffff, side: THREE.DoubleSide } );
      // this.mesh = new THREE.Mesh(this.texture, material);
      // this.scene.add(this.mesh);
    },
    //状态
    _state() {
      this.state = new Stats();
      this.state.domElement.style.position = "absolute";
      this.state.domElement.style.left = "0px";
      this.state.domElement.style.top = "0px";
      app.appendChild(this.state.domElement);
    },
    //调试器
    _gui() {
      var ParamObj = function() {
        this.repeat = 1;
        this.wrap = 1;
        this.offsetX = 0;
        this.offsetY = 0;
      };
      this.param = new ParamObj();
      var gui = new DAT.GUI();
      gui.add(this.param, "repeat", 1, 5).name("纹理重复");
      gui
        .add(this.param, "wrap", 1, 3)
        .name("纹理环绕")
        .step(1);
        gui.add(this.param, "offsetX", -1.0, 1.0).name("纹理X偏移").step(1);
        gui.add(this.param, "offsetY", -1.0, 1.0).name("纹理Y偏移").step(1);
    },
    //图片更改之时刷新
    _guichang() {
      if (this.texture != null) {
        this.texture.repeat.x = this.texture.repeat.y = this.param.repeat;
        // this.texture.offset.x = this.param.offsetX;
        // this.texture.offset.y = this.param.offsetY;
        this.texture.offset.x += 0.001;
        if (this.param.wrap == 1) {
          this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        } else if (this.param.wrap == 2) {
          this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping;
        } else if (this.param.wrap == 3) {
          this.texture.wrapS = this.texture.wrapT =
            THREE.MirroredRepeatWrapping;
        }
        this.texture.needsUpdate = true;
      }
    },
    //光
    _light() {
      this.light = new THREE.DirectionalLight(0xffffff);
      this.light.position.set(200, 200, 1000).normalize();
      this.camera.add(this.light);
      this.camera.add(this.light.target);
    },
    init() {
      this._scene();
      this._camera();
      this._renderer();
      this._mesh();
      this._state();
      this._gui();
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
      this._guichang();
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