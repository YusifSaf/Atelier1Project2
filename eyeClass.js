import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { sharedState, mapFunc } from './sharedState.js';

class eyeModel {
    constructor(scene, camera, options = {}) {
        this.scene = scene;
        this.camera = camera;
        this.position = options.position || { x: 0, y: 0, z: 0 };
        this.scale = options.scale || { x: 1, y: 1, z: 1 };
        this.rotation = options.rotation || { x: 0, y: 0, z: 0 };

        this.model = null;
        this.isLoaded = false;
        
        // Raycast Setup
        this.intersectionPoint = new THREE.Vector3();
        this.planeNormal = new THREE.Vector3();
        this.plane = new THREE.Plane();
        this.mousePosition = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.centroidX;
        this.centroidY;
        this.centroidZ;
        this.calibrationValue = 0;
        this.scrollPos = {
            x: 1920,
            y: 1080
        };

        // Camera coefficients for video cam position from screen center
        this.cameraCoefY = -0.145;
        this.cameraCoefZ = 0.0219;

        // Object coefficients for calibration based on object's position
        this.objectCoefX = 0.164 * this.position.x;
        this.objectCoefY = 0.255 * this.position.y;

        this.wheelListener();
        this.loadModel();
    }

    loadModel() {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('./models/humanEye/scene.gltf', (gltfModel) => {
            this.model = gltfModel.scene;
            this.model.position.set(this.position.x, this.position.y, this.position.z); 
            this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.targetScale = new THREE.Vector3(this.scale.x, this.scale.y, this.scale.z);
            this.scene.add(this.model);
            this.isLoaded = true;
            console.log('Eye model loaded at position:', this.position);
        }, undefined, (error) => {
            console.error('Error loading eye model:', error);
        });
    }

    wheelListener() {
        window.addEventListener('wheel', (e) => {
            this.objectCoefX += this.position.x * e.deltaX / 1000;
            this.objectCoefY += this.position.y * e.deltaY / 1000;
        });
    }

    update() {
        if (this.isLoaded && this.model) {
            this.centroidX = mapFunc(sharedState.facePosition.x, 0, 640, 0, 1920);
            this.centroidY = mapFunc(sharedState.facePosition.y, 0, 480, 0, 1080);

            this.mousePosition.x = (this.centroidX / 1920) * 2 - 1;
            this.mousePosition.y = -(this.centroidY / 1080) * 2 + 1;

            this.planeNormal.copy(this.camera.position).normalize();
            this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.scene.position);
            this.raycaster.setFromCamera(this.mousePosition, this.camera);
            this.raycaster.ray.intersectPlane(this.plane, this.intersectionPoint);
                
            if (this.model) {
                this.model.lookAt(this.intersectionPoint.x, this.intersectionPoint.y, 2);
            }
            // console.log(sharedState.fftData.size);
        }
    }

    dispose() {
        if (this.model) {
            this.scene.remove(this.model);
        }
    }
}

export default eyeModel;