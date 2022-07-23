import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createOrbitControls(camera, rendererdomElement) {
    const controls = new OrbitControls(camera, rendererdomElement);
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -0.2);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    return controls;
}

export { createOrbitControls };