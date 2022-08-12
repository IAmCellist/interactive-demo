import { HemisphereLight } from "three";

function createLight() {
    const light = new HemisphereLight(0xffffff, 0xbbbbff, 2);
    return light;
}

export { createLight };