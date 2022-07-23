import { WebGLRenderer } from "three";

function createRenderer() {
    const renderer = new WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    return renderer;
}

export { createRenderer };