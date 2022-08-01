import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let currentObject;

function createLoader(){
    const loader = new GLTFLoader().setPath("../../assets/models/");
    return loader;
}


export { createLoader };