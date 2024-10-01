import * as THREE from 'three';
import Walls from '../Walls';
import MaterialUtils from '../../helpers/MaterialUtils';

export default class UStair {
    constructor(scene, model) {
        this.scene = scene;
        this.model = model;
        this.treadGroup = new THREE.Group();
        this.scene.add(this.treadGroup);

        // Initialize walls
        this.walls = new Walls(this.scene, this.createWallMaterial());

        // Get initial values from sliders
        const widthSlider = document.getElementById('widthSlider');
        this.treadWidth = widthSlider ? parseInt(widthSlider.value, 10) : 1450;

        const bottomFlightSlider = document.getElementById('bottom-flight-slider');
        this.bottomFlightTreads = bottomFlightSlider ? parseInt(bottomFlightSlider.value, 10) : 8;

        const topFlightSlider = document.getElementById('top-flight-slider');
        this.topFlightTreads = topFlightSlider ? parseInt(topFlightSlider.value, 10) : 8;

        // Create the U-shaped staircase with default values
        this.createStaircase(this.bottomFlightTreads, this.topFlightTreads);
    }

    // Function to create the U-shaped staircase with dynamic back wall movement
    createStaircase(bottomTreads, topTreads) {
        console.log(`Creating U-shaped staircase with ${bottomTreads} bottom treads and ${topTreads} top treads`);
        this.clearTreads();

        const distance = 1.0;  // Distance between each tread
        const landingDepth = this.treadWidth / 800;  // Landing depth proportional to the tread width
        const sideWallThickness = 3;

        let topTreadYOffset = 0;
        let topTreadZOffset = 0;

        // --- Bottom Flight ---
        for (let i = 0; i < bottomTreads; i++) {
            const newTread = this.model.clone();
            const angle = THREE.MathUtils.degToRad(125);
            const yOffset = distance * i * Math.sin(angle) * 0.5;
            const zOffset = -distance * i * Math.cos(angle);

            newTread.position.set(0, yOffset, zOffset);
            newTread.castShadow = true;
            newTread.receiveShadow = true;
            this.treadGroup.add(newTread);

            if (i === bottomTreads - 1) {
                topTreadYOffset = yOffset;
                topTreadZOffset = zOffset;  // Track the last bottom tread's Z-offset
            }
        }

        // --- Landing ---
        const landing = new THREE.Mesh(
            new THREE.BoxGeometry(landingDepth, 0.35, landingDepth),
            MaterialUtils.createWoodMaterial()
        );
        landing.position.set(0, topTreadYOffset + 0.5, topTreadZOffset + landingDepth / 2);
        landing.castShadow = true;
        landing.receiveShadow = true;
        this.treadGroup.add(landing);

        // --- Top Flight ---
        for (let i = 0; i < topTreads; i++) {
            const newTread = this.model.clone();
            const yOffset = distance * (i + 1) * Math.sin(THREE.MathUtils.degToRad(125)) * 0.5;
            const zOffset = distance * (i + 1) * Math.cos(THREE.MathUtils.degToRad(125));

            newTread.position.set(
                this.treadWidth / 1600, 
                topTreadYOffset + yOffset + 0.3,
                topTreadZOffset + zOffset
            );
            newTread.rotation.y = THREE.MathUtils.degToRad(180);
            newTread.castShadow = true;
            newTread.receiveShadow = true;
            this.treadGroup.add(newTread);

            if (i === topTreads - 1) {
                topTreadYOffset += yOffset;
                topTreadZOffset += zOffset;
            }
        }

        // --- Update Walls for U-shaped Stairs ---
        const totalBackWallWidth = sideWallThickness + landingDepth + topTreads * distance;
        this.walls.updateWalls(
            topTreadYOffset, 
            topTreadZOffset, 
            'U-shaped', 
            totalBackWallWidth
        );
    }

    // Function to update stair treads (triggered by sliders)
    updateStairTreads(bottomTreads, topTreads) {
        this.bottomFlightTreads = bottomTreads;
        this.topFlightTreads = topTreads;

        // Recreate the staircase with updated values
        this.createStaircase(this.bottomFlightTreads, this.topFlightTreads);
    }

    // Function to update the tread width
    updateTreadWidth(width) {
        this.treadWidth = width;
        this.createStaircase(this.bottomFlightTreads, this.topFlightTreads);
    }

    // Function to update material (e.g., based on user input)
    updateMaterial(selectedMaterial) {
        this.treadGroup.children.forEach(tread => {
            MaterialUtils.updateTreadMaterial(selectedMaterial, tread);
        });
    }

    // Function to clear existing treads
    clearTreads() {
        while (this.treadGroup.children.length > 0) {
            const tread = this.treadGroup.children.pop();
            this.scene.remove(tread);
        }
    }

    // Function to create wall material
    createWallMaterial() {
        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load('../../textures/cross-laminated-timber-clt-fir-2000-mm-architextures.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        return new THREE.MeshStandardMaterial({ map: wallTexture });
    }
}
