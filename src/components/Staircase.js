import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Staircase {
    constructor(scene) {
        console.log("Received scene in Staircase:", scene);
        this.scene = scene;
        this.treadGroup = new THREE.Group();
        this.scene.add(this.treadGroup);
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('StairTreadTexture.gltf', (gltf) => {
            this.model = gltf.scene;
            console.log('Model loaded:', this.model);
            this.initialSetup();
        }, undefined, (error) => {
            console.error("Error loading model:", error);
        });
    }

    initialSetup() {
        const roughnessMap = new THREE.TextureLoader().load('oak_veneer_01_diff_4k_bw.jpg');
        this.model.traverse((child) => {
            if (child.isMesh && child.name === 'Tread') {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.roughnessMap = roughnessMap;
                child.material.roughness = 1.0;
                child.material.metalness = 0.0;
                child.material.needsUpdate = true;
            }
        });
        this.updateStairTreads(5); // Example initial count
    }

    updateStairTreads(count) {
        while (this.treadGroup.children.length > 1) {
            this.treadGroup.remove(this.treadGroup.children[this.treadGroup.children.length - 1]);
        }
        const angle = THREE.MathUtils.degToRad(125);
        const distance = 1.0;

        for (let i = 1; i < count; i++) {
            const newTread = this.model.clone();
            const yOffset = distance * i * Math.sin(angle) * 0.5;
            const zOffset = -distance * i * Math.cos(angle);

            newTread.position.set(0, yOffset, zOffset);
            this.treadGroup.add(newTread);
        }
    }

    updateTreadWidth(value) {
        const widthScale = value / 800;
        this.treadGroup.children.forEach(tread => {
            tread.scale.x = widthScale;
        });
    }
}
