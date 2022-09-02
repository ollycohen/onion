import {
  AmbientLight,
  Box3,
  DirectionalLight,
  LoadingManager,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";

import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/RGBELoader.js";

const MANAGER = new LoadingManager();

export class Viewer {
  constructor(el) {
    this.el = el;
    this.lights = [];
    this.content = null;
    this.object = null;
    this.scene = new Scene();

    const fov = 60;
    this.camera = new PerspectiveCamera(
      fov,
      el.clientWidth / el.clientHeight,
      0.01,
      1000
    );
    this.scene.add(this.camera);

    this.renderer = window.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.physicallyCorrectLights = true;

    //set background color
    this.renderer.setClearColor(0x2E5D12);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(el.clientWidth, el.clientHeight);

    this.pmremGenerator = new PMREMGenerator(this.renderer);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.el.appendChild(this.renderer.domElement);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
    window.addEventListener("resize", this.resize.bind(this), false);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    if (this.object) this.object.rotation.y += 0.01;
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const { clientHeight, clientWidth } = this.el.parentElement;

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  load() {
    //change 3D asset (use .glb)
    const url = "./assets/onion.glb";
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader(MANAGER);

      loader.load(
        url,
        (gltf) => {
          const scene = gltf.scene;
          this.setContent(scene);
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }

  setContent(object) {
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());

    this.controls.reset();

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

    this.controls.maxDistance = size * 10;
    this.camera.near = size / 100;
    this.camera.far = size * 100;
    this.camera.updateProjectionMatrix();

    this.camera.position.copy(center);
    this.camera.position.x += size / 2.0;
    this.camera.position.y += size / 10.0;
    this.camera.position.z += size / 2.0;
    this.camera.lookAt(center);

    this.controls.saveState();
    this.object = object;
    this.scene.add(this.object);
    this.content = this.object;

    this.addLights();
    this.updateEnvironment();
    window.content = this.content;
  }

  addLights() {
    const light1 = new AmbientLight(0xbd9f67, 0.3);
    light1.name = "ambient_light";
    this.camera.add(light1);
    light1.intensity = 0.3;
    light1.color.setHex(0xbd9f67);

    const light2 = new DirectionalLight(0xbd9f67, 0.8 * Math.PI);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = "main_light";
    light2.intensity = 0.8 * Math.PI;
    light2.color.setHex(0xbd9f67);
    this.camera.add(light2);

    this.lights.push(light1, light2);
  }

  updateEnvironment() {
    this.getCubeMapTexture().then(({ envMap }) => {
      this.scene.environment = envMap;
    });
  }

  getCubeMapTexture() {
    const path = "assets/env.hdr";

    return new Promise((resolve, reject) => {
      new RGBELoader().load(
        path,
        (texture) => {
          const envMap =
            this.pmremGenerator.fromEquirectangular(texture).texture;
          this.pmremGenerator.dispose();

          resolve({ envMap });
        },
        undefined,
        reject
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const viewerDOM = document.body.querySelector(".viewer");
  var viewer = new Viewer(viewerDOM);
  viewer.load();
});
