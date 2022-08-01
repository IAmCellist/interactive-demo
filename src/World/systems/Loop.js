import { Clock } from "three";

const clock = new Clock();

class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updateables = [];
    }

    start(customRender) {
        this.renderer.setAnimationLoop((timestamp, frame) => {
            this.tick();
            customRender(timestamp, frame);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {

        const delta = clock.getDelta()

        for (const object of this.updateables) {
            object.tick(delta);
        }
    }

}

export { Loop };