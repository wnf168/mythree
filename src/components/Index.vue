<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../../static/lib/stats";
import TWEEN from "@tweenjs/tween.js";
import DAT from "../../static/lib/dat.gui";
import { OBJLoader } from "three-obj-mtl-loader";
import Sea from "../utils/Sea";
import Sky from "../utils/Sky";
import AirPlane from "../utils/AirPlane";
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
      heights: document.body.clientHeight,
      sea: null,
      sky: null,
      airplane: null,
      mousePos: {
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    //场景
    _scene() {
      this.app = document.querySelector("#container");
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    },
    //相机
    _camera() {
      this.camera = new THREE.PerspectiveCamera(
        60,
        this.widths / this.heights,
        1,
        10000
      );
      this.camera.position.x = 0;
      this.camera.position.y = 200;
      this.camera.position.z = 100;
      // this.camera.up.x = 0;
      // this.camera.up.y = 1;
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

      this.renderer.shadowMap.enabled = true;
      // this.renderer.setClearColor("#87ceeb");
      this.app.appendChild(this.renderer.domElement);
    },
    //模型
    _mesh() {
      this.sea = new Sea();
      this.sea.mesh.position.y = -600;
      this.scene.add(this.sea.mesh);

      this.sky = new Sky();
      this.sky.mesh.position.y = -600;
      this.scene.add(this.sky.mesh);

      this.airplane = new AirPlane();
      this.airplane.mesh.scale.set(0.25, 0.25, 0.25);
      this.airplane.mesh.position.y = 100;
      this.scene.add(this.airplane.mesh);
    },
    imgfn(image) {
      console.log(image);
      this.texture.image = image;
      this.texture.needsUpdate = true;
    },
    //obj格式成功回调方法
    objfn(object) {
      var _this = this;
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.map = _this.texture;
        }
      });
      object.position.y = -80;
      this.scene.add(object);
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
      gui
        .add(this.param, "offsetX", -1.0, 1.0)
        .name("纹理X偏移")
        .step(1);
      gui
        .add(this.param, "offsetY", -1.0, 1.0)
        .name("纹理Y偏移")
        .step(1);
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
      var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
      this.light = new THREE.DirectionalLight(0xffeedd);
      this.light.position.set(150, 350, 350);
      this.light.shadow.camera.left = -400;
      this.light.shadow.camera.right = 400;
      this.light.shadow.camera.top = 400;
      this.light.shadow.camera.bottom = -400;
      this.light.shadow.camera.near = 1;
      this.light.shadow.camera.far = 1000;
      this.light.shadow.mapSize.width = 2048;
      this.light.shadow.mapSize.height = 2048;
      this.light.castShadow = true;
      this.scene.add(hemisphereLight);
      this.scene.add(this.light);
    },
    init() {
      this._scene();
      this._camera();
      this._renderer();
      this._mesh();
      this._state();
      //this._gui();
      this._light();
      this.animate();
      //this.tween();

      window.addEventListener("resize", this._handleWindowResize, false);
      document.addEventListener("mousemove", this._handleMouseMove, false);
    },
    _handleMouseMove(event) {
      var tx = -1 + (event.clientX / this.widths) * 2;
      var ty = 1 - (event.clientY / this.heights) * 2;
      this.mousePos = {
        x: tx,
        y: ty
      };
    },
    _handleWindowResize() {
      var HEIGHT = window.innerHeight;
      var WIDTH = window.innerWidth;
      this.renderer.setSize(WIDTH, HEIGHT);
      this.camera.aspect = WIDTH / HEIGHT;
      this.camera.updateProjectionMatrix();
    },
    updatePlane() {
      var targetX = this.normalize(this.mousePos.x, -1, 1, -100, 100);
      var targetY = this.normalize(this.mousePos.y, -1, 1, 25, 175);
      this.airplane.mesh.position.y = targetY;
      this.airplane.mesh.position.x = targetX;
      this.airplane.propeller.rotation.x += 0.3;
    },
    normalize(v, vmin, vmax, tmin, tmax) {
      var nv = Math.max(Math.min(v, vmax), vmin);
      var dv = vmax - vmin;
      var pc = (nv - vmin) / dv;
      var dt = tmax - tmin;
      var tv = tmin + pc * dt;
      return tv;
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
      this.airplane.propeller.rotation.x += 0.3;
      this.sea.mesh.rotation.z += 0.005;
      this.sky.mesh.rotation.z += 0.01;
      // this.mesh.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
      this.updatePlane();
      // this._guichang();
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
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(#e4e0ba, #f7d9aa);
}
</style>