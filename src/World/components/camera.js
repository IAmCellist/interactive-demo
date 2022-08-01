import { PerspectiveCamera } from "three";

function createCamera() {
    const camera = new PerspectiveCamera(
        75,
        1,
        0.1,
        200
    );
    
    camera.position.set(0, 0, 1);
    return camera;
}

export { createCamera };