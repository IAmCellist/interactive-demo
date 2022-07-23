import { Clock } from "three";

class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updateables = [];
    }

    start() {
        this.renderer.setAnimationLoop(render);
    }

}