import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createOrbitControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.maxDistance = 10;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.tick = () => controls.update();
    
    return controls;
}

export { createOrbitControls };