import { RingGeometry, Mesh, MeshBasicMaterial } from "three";

function createReticle() {
    const reticle = new Mesh(new RingGeometry( 0.15, 0.2, 32).rotateX( - Math.PI / 2), new MeshBasicMaterial());
    //reticle.visible = false;
    return reticle;
}

export { createReticle };