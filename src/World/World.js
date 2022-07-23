import * as THREE from "three";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLight } from "./components/light";
import { createOrbitControls } from "./components/orbitcontrols";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createCylinder } from "./components/cylinder";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { createReticle } from "./components/reticle";
import { createLoader } from "./components/gltfloader";

import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";
import  _  from "lodash";

let camera, scene, renderer;
let controls;
let controller;
let reticle;
let currentObject;
let hitTestSource = null;
let hitTestSourceRequested = false;

class World {
    constructor(container) {

        // Create Scene, Camera, Renderer, and Lights
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.appendChild(renderer.domElement);

        const light = createLight();
        light.position.set(0.5, 1, 0.25);
        scene.add(light);

        //Create ARButton and add to DOM
        document.body.appendChild( ARButton.createButton(renderer, { requiredFeatures: [ 'hit-test' ] } ) );

        //Controller
        controller = renderer.xr.getController(0);
        controller.addEventListener("select", this.onSelect);
        scene.add(controller);

        //Resizer
        const resizer = new Resizer(container, camera, renderer);
        resizer.onResize = () => {
             this.render;
        }

        //Reticle 
        reticle = createReticle();
        reticle.visible = false;
        reticle.matrixAutoUpdate = false;
        scene.add(reticle);

        //OrbitControls
        controls = createOrbitControls(camera, renderer.domElement)
        controls.addEventListener('change', this.render);
        
        //Load models
        
        let models = document.getElementsByClassName("ar-object");

        for (const model of models) {
            model.addEventListener('click', () => {
                if (currentObject != null) {
                    scene.remove(currentObject);
                }
                this.loadModel(model.getAttribute("id"), this.render);
    
            });
        }

        //Hide object in ARMode
        document.getElementById("ARButton").addEventListener("click", () => {
            console.log("ARObject hidden")
            currentObject.visible = false;
        })

    }

    loadModel(model, render) {
        const loader = createLoader();
        loader.load(
            model + ".glb",
            function( glb ) {

                currentObject = glb.scene;
                scene.add(currentObject);
                const box = new THREE.Box3().setFromObject(currentObject);
                const center = new THREE.Vector3();
                box.getCenter(center);
                currentObject.position.sub(center);
                scene.add(currentObject);
                controls.update();
                render()
                
            }
        );
    }

    onSelect() {
        if ( reticle.visible ) {
            // const cylinder = createCylinder();
            // reticle.matrix.decompose(cylinder.position, cylinder.quaternion, cylinder.scale);
            // cylinder.scale.y = Math.random() * 2 + 1;
            // scene.add(cylinder);

            currentObject.position.setFromMatrixPosition(reticle.matrix);
            currentObject.visible = true;
        }
    }

    animate() {

        renderer.setAnimationLoop(this.render);

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
