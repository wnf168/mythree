<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../../static/lib/stats";
import TWEEN from "@tweenjs/tween.js";
import DAT from "../../static/lib/dat.gui";
import {OBJLoader} from 'three-obj-mtl-loader'
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
        100,
        this.widths / this.heights,
        1,
        2000
      );
      // this.camera.position.x = 0;
      // this.camera.position.y = 0;
      // this.camera.position.z = 600;
      // this.camera.up.x = 0;
      // this.camera.up.y = 1;
      this.camera.position.z = 100;
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
      this.loader = new OBJLoader();  
      this.texture = new THREE.Texture();
      var manager = new THREE.LoadingManager();
      var imgloader = new THREE.ImageLoader( manager );      
      imgloader.load( '../../static/images/UV_Grid_Sm.jpg', this.imgfn );    
      this.loader.load("../../static/images/male02.obj", this.objfn);
    },
    imgfn(image){
      console.log(image)
      this.texture.image = image;
      this.texture.needsUpdate = true;
    },
    //obj格式成功回调方法
    objfn(object){
      var _this = this;
      object.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							child.material.map = _this.texture;
						}
          } );
          object.position.y = - 80;
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
      this.light = new THREE.DirectionalLight(0xffeedd);
      this.light.position.set( 0, 0, 1);
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
  height: 100%;
}
</style>