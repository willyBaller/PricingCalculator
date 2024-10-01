import * as THREE from 'three';
import Walls from '../Walls';
import MaterialUtils from '../../helpers/MaterialUtils';

export default class StraightStair {
    constructor(scene, model) {
        this.scene = scene;
        this.model = model;
        this.treadGroup = new THREE.Group();
        this.scene.add(this.treadGroup);

        // Initialize the Walls instance ONCE to handle the side and back walls
        this.walls = new Walls(this.scene, this.createWallMaterial());

        // Default number of treads and width
        this.numTreads = 14;
        this.treadWidth = 900;

        // Create the staircase with default values (without creating new walls)
        this.createStaircase(this.numTreads);
    }

    // Function to create the staircase with a given number of treads
    createStaircase(numTreads) {
        console.log(`Creating staircase with ${numTreads} treads`);

        // Clear the previous treads (if any)
        this.clearTreads();

        const angle = THREE.MathUtils.degToRad(125); // Angle of the staircase
        const distance = 1.0; // Distance between treads

        let topTreadZOffset = 0;
        let topTreadYOffset = 0;

        for (let i = 0; i < numTreads; i++) {
            const newTread = this.model.clone(); // Clone the GLTF model for each tread
            const yOffset = distance * i * Math.sin(angle) * 0.5;
            const zOffset = -distance * i * Math.cos(angle);

            newTread.position.set(0, yOffset, zOffset);

            // Ensure the tread casts and receives shadows
            newTread.castShadow = true;
            newTread.receiveShadow = true;

            this.treadGroup.add(newTread);

            // Track the position of the last (top) tread to update the walls
            if (i === numTreads - 1) {
                topTreadYOffset = yOffset;
                topTreadZOffset = zOffset;
            }
        }

        // Update the walls after the staircase is created, passing 'straight' as the stair type
        this.walls.updateWalls(topTreadYOffset, topTreadZOffset, 'straight');
    }

    // Function to update the number of stair treads
    updateStairTreads(numTreads) {
        this.numTreads = numTreads;
        this.createStaircase(numTreads);
    }

    // Function to update the tread width
    updateTreadWidth(width) {
        const widthScale = width / 800;  // Adjust the scaling factor based on the width
        this.treadGroup.children.forEach(tread => {
            const treadElement = tread.getObjectByName('Tread');
            if (treadElement) {
                treadElement.scale.x = widthScale;  // Scale only the 'Tread' part
            }
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
        wallTexture.repeat.set(4, 4);

        return new THREE.MeshStandardMaterial({
            map: wallTexture,
            side: THREE.DoubleSide,
        });
    }
}
