import { CylinderGeometry, MeshPhongMaterial, Mesh } from "three";

function createCylinder() {
    const geometry = new CylinderGeometry( 0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);
    const material = new MeshPhongMaterial( { color: 0xfffff * Math.random()});
    const mesh = new Mesh(geometry, material);
    return mesh;
}

export { createCylinder }; 