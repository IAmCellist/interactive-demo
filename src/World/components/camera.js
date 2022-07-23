import { PerspectiveCamera } from "three";

function createCamera() {
    const camera = new PerspectiveCamera(
        75,
        window.innerHeight / window.innerWidth,
        0.1,
        200
    );
    
    return camera;
}

export { createCamera };