import * as THREE from "three";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLight } from "./components/light";
import { createOrbitControls } from "./components/orbitcontrols";
import { Loop } from "./systems/Loop";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { createReticle } from "./components/reticle";
import { createLoader } from "./components/gltfloader";

import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

let camera, scene, renderer;
let controls;
let controller;
let loop;
let reticle;
let currentObject;
let hitTestSource = null;
let hitTestSourceRequested = false;
let touchDown, touchX, touchY, deltaX, deltaY;

class World {
    constructor(container) {

        // Create Scene, Camera, Renderer, and Lights
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.appendChild(renderer.domElement);

        //Create lights and controls
        const light = createLight();
        const light2 = new THREE.RectAreaLight("white", 1, 5, 5);
        light2.position.set(0, 0, 2);
        light.position.set(0.5, 1, 0.25);
        scene.add(light, light2);
        controls = createOrbitControls(camera, renderer.domElement)
        loop.updateables.push(controls);
        controls.addEventListener('change', this.render);

        //Resizer
        const resizer = new Resizer(container, camera, renderer);

        //Create ARButton and add to DOM
        let options = {
            requiredFeatures: ['hit-test'],
            optionalFeatures: ['dom-overlay'],
        }

        options.domOverlay = { root: document.getElementById('content')};

        document.body.appendChild( ARButton.createButton(renderer, options));

        //Controller
        controller = renderer.xr.getController(0);
        controller.addEventListener("select", this.onSelect);
        scene.add(controller);

        //Reticle 
        reticle = createReticle();
        reticle.visible = false;
        reticle.matrixAutoUpdate = false;
        scene.add(reticle);
        
        //Load models
        
        let models = document.getElementsByClassName("ar-object");

        for (const model of models) {
            model.addEventListener('click', () => {
                if (currentObject != undefined) {

                    scene.remove(currentObject);

                }
                
                // this.loadModel(model.getAttribute("id"), this.render);
                this.init(model.getAttribute("id"));
    
            });
        }

        //Hide object upon entering ARMode
        document.getElementById("ARButton").addEventListener("click", () => {
            console.log("ARObject hidden")
            currentObject.visible = false;
        });

        //TODO: Add rotation functionality to AR
    }

    async init(id) {
        const loader = createLoader();
        const modelData = await loader.loadAsync(`${id}` + ".glb");
        currentObject = modelData.scene;
        // this.onSelect;
        let box = new THREE.Box3().setFromObject(currentObject);
        let center = new THREE.Vector3();
        box.getCenter( center );
        currentObject.position.sub( center );
        scene.add(currentObject);
    }

    onSelect() {
        if ( reticle.visible ) {
            //Cylinder Test
            // const cylinder = createCylinder();
            // reticle.matrix.decompose(cylinder.position, cylinder.quaternion, cylinder.scale);
            // cylinder.scale.y = Math.random() * 2 + 1;
            // scene.add(cylinder);

            currentObject.position.setFromMatrixPosition(reticle.matrix);
            currentObject.visible = true;
        }
    }

    start() {
        loop.start(this.render);
    }

    stop() {
        loop.stop();
    }

    render( timestamp, frame ) {
        
        if ( frame ) {
            
            const referenceSpace = renderer.xr.getReferenceSpace();
            const session = renderer.xr.getSession();

            if ( hitTestSourceRequested === false ) {

                session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {

                    session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

                        hitTestSource = source;

                    } );

                } );

                session.addEventListener( 'end', function () {

                    hitTestSourceRequested = false;
                    hitTestSource = null;

                } );

                hitTestSourceRequested = true;

            }

            if ( hitTestSource ) {

                const hitTestResults = frame.getHitTestResults( hitTestSource );

                if ( hitTestResults.length ) {

                    const hit = hitTestResults[ 0 ];
                    
                    reticle.visible = true;
                    reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );

                } else {

                    reticle.visible = false;

                }

            }

        }

        renderer.render( scene, camera );
        
    }
}

export { World };
