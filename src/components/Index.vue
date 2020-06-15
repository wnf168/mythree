<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from "three";
import Stats from "../../static/lib/stats";
import TWEEN from "@tweenjs/tween.js";
import DAT from "../../static/lib/dat.gui";
import * as OrbitControls from "three-orbitcontrols";
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
      this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    },
    //相机
    _camera() {
      var k = this.widths / this.heights;
      var s = 200;
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      this.camera.position.set(200, 300, 200);
      this.camera.lookAt(this.scene.position);
    },

    //渲染器
    _renderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: false
      });
      this.renderer.setSize(this.widths, this.heights);
      this.renderer.setClearColor(0xb9d3ff, 1);
      this.renderer.shadowMap.enabled = true;
      this.app.appendChild(this.renderer.domElement);
    },
    //控制器
    _controls() {
      var controls = new OrbitControls(this.camera, this.renderer.domElement);
      // console.log(controls)
      controls.addEventListener("change", this.renderer);
    },
    //模型
    _mesh() {
      // var geometry = new THREE.BoxGeometry(100,100,100);//长方体
      // console.log(geometry.faces)
      //   geometry.faces.forEach(face => {
      //   // 设置三角面face三个顶点的颜色
      //   face.vertexColors = [
      //     new THREE.Color(0xffff00),
      //     new THREE.Color(0xff00ff),
      //     new THREE.Color(0x00ffff),
      //   ]
      // });
      // geometry.translate(0, 0, 0);
      // geometry.center();
      // geometry.faces.pop();
      // geometry.faces.pop();
      // geometry.faces.shift();
      // geometry.faces.shift();
      // var geometry = new THREE.SphereGeometry(60,40,40);//球体
      // var geometry = new THREE.CylinderGeometry( 50, 50, 100, 25 );//圆柱体
      // var material = new THREE.MeshBasicMaterial({color: 0x0000ff});//普通
      // var material = new THREE.MeshLambertMaterial({color:0x0000ff,opacity:0.2,transparent:true});//透明
      // var material = new THREE.MeshPhongMaterial({color:0x0000ff,specular:0x4488ee,shininess:12});//高光
      // var geometry = new THREE.BufferGeometry();
      //   var vertices = new Float32Array([
      //     0,0,0,
      //     50,0,0,
      //     0,100,0,
      //     0,0,10,
      //     0,0,100,
      //     50,0,10
      //   ])
      //   var colors = new Float32Array([
      //       1, 0, 0, //顶点1颜色
      //       0, 1, 0, //顶点2颜色
      //       0, 0, 1, //顶点3颜色

      //       1, 1, 0, //顶点4颜色
      //       0, 1, 1, //顶点5颜色
      //       1, 0, 1, //顶点6颜色
      //     ]);
      //   var attribue = new THREE.BufferAttribute(vertices,3);
      //   geometry.attributes.position = attribue;
      //   geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
      // var material = new THREE.PointsMaterial({vertexColors: THREE.VertexColors,size: 10.0});
// var p1 = new THREE.Vector3(1.2, 2.6, 3.2);
      // var p2 = new THREE.Vector3(0.0, 0.0, 0.0);
      // p2.copy(p1);
      // // p2向量的xyz变为p1的xyz值
      // console.log(p2);
      // var mesh2 = this.mesh.clone();
      // mesh2.geometry.color="0xff0000"
      // console.log(mesh2.geometry)
      //  this.mesh.translateX(250);
      this.geometry = new THREE.SphereGeometry(100, 25, 25); //球体
      var material = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        // wireframe: true
      }); //普通
      this.mesh = new THREE.Mesh(this.geometry, material);
      var mesh2 = this.mesh.clone();
      mesh2.geometry.color="0xff0000"
      this.scene.add(this.mesh,mesh2);
      console.log(this.scene.children)
      

      var axisHelper = new THREE.AxisHelper(250);
      this.scene.add(axisHelper);
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
      this._controls();
      window.addEventListener("resize", this._handleWindowResize, false);
    },
    _handleWindowResize() {
      var HEIGHT = window.innerHeight;
      var WIDTH = window.innerWidth;
      this.renderer.setSize(WIDTH, HEIGHT);
      this.camera.aspect = WIDTH / HEIGHT;
      this.camera.updateProjectionMatrix();
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
      //  this.mesh.rotation.x += 0.01;
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
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(#e4e0ba, #f7d9aa);
}
</style>