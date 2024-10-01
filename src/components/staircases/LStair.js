import * as THREE from 'three';
import Walls from '../Walls';
import MaterialUtils from '../../helpers/MaterialUtils';

export default class LStair {
    constructor(scene, model) {
        this.scene = scene;
        this.model = model;
        this.treadGroup = new THREE.Group();
        this.scene.add(this.treadGroup);

        // Initialize walls
        this.walls = new Walls(this.scene, this.createWallMaterial());

        // Default values for bottom and top flight treads
        this.bottomFlightTreads = 8;
        this.topFlightTreads = 8;
        this.treadWidth = 1450;  // Default tread width in mm

        // Create the L-shaped staircase with default values
        this.createStaircase(this.bottomFlightTreads, this.topFlightTreads);
    }

    // Function to create the L-shaped staircase with a landing
    createStaircase(bottomTreads, topTreads) {
        console.log(`Creating L-shaped staircase with ${bottomTreads} bottom treads and ${topTreads} top treads`);
        this.clearTreads();

        const distance = 1.0;  // Distance between each tread
        const landingDepth = this.treadWidth / 800;  // Landing depth based on tread width
        const sideWallThickness = 3;  // Thickness of the side wall
        const treadWidth = 1.0;  // Width per tread (you can adjust this based on your design)

        const treadRise = 0.25;  // Vertical rise per tread

        let topTreadYOffset = 0;
        let topTreadZOffset = 0;

        // --- Bottom Flight ---
        for (let i = 0; i < bottomTreads; i++) {
            const newTread = this.model.clone();
            const angle = THREE.MathUtils.degToRad(125);
            const yOffset = distance * i * Math.sin(angle) * 0.5;
            const zOffset = -distance * i * Math.cos(angle);

            newTread.position.set(0, yOffset, zOffset); // Bottom flight positions
            newTread.castShadow = true;
            newTread.receiveShadow = true;
            this.treadGroup.add(newTread);

            // Track the last bottom tread for positioning the landing and top flight
            if (i === bottomTreads - 1) {
                topTreadYOffset = yOffset;
                topTreadZOffset = zOffset;
            }
        }

        // --- Landing ---
        const landing = new THREE.Mesh(
            new THREE.BoxGeometry(this.treadWidth / 800, 0.35, this.treadWidth / 800),
            MaterialUtils.createWoodMaterial()
        );
        landing.position.set(0, topTreadYOffset + .5, topTreadZOffset + landingDepth / 2);
        landing.castShadow = true;
        landing.receiveShadow = true;
        this.treadGroup.add(landing);

        // --- Top Flight ---
        const halfLandingWidth = this.treadWidth / 1600;
        let dynamicTreadWidth = 0;

        for (let i = 0; i < topTreads; i++) {
            const newTread = this.model.clone();
            const angle = THREE.MathUtils.degToRad(125);
            const yOffset = distance * (i + 1) * Math.sin(angle) * 0.5;
            const xOffset = -distance * (i + 1) * Math.cos(angle);

            newTread.position.set(xOffset + halfLandingWidth - 0.1, topTreadYOffset + yOffset + 0.3, topTreadZOffset + halfLandingWidth);
            newTread.rotation.y = THREE.MathUtils.degToRad(90);
            newTread.castShadow = true;
            newTread.receiveShadow = true;
            this.treadGroup.add(newTread);

            // Calculate dynamic width for each tread based on xOffset
            dynamicTreadWidth = Math.abs(xOffset);

            // Update last tread position of the top flight
            if (i === topTreads - 1) {
                topTreadYOffset += yOffset;
                topTreadZOffset += halfLandingWidth;
            }
        }
        
        // Calculate the back wall width
        const totalBackWallWidth = sideWallThickness + landingDepth + dynamicTreadWidth + 3;
                const backWallWidth = Math.abs(topTreadZOffset) + 3; 
                console.log('totalBackWallWidth' + totalBackWallWidth, 'backWallWidth' + backWallWidth);
        // Update the walls after creating the staircase, passing 'L-shaped' as the stair type
        this.walls.updateWalls(topTreadYOffset, topTreadZOffset, 'L-shaped', totalBackWallWidth);
    }

    // Function to update the number of stair treads in both flights
    updateStairTreads(bottomTreads, topTreads) {
        this.bottomFlightTreads = bottomTreads;
        this.topFlightTreads = topTreads;
        this.createStaircase(bottomTreads, topTreads);
    }

    // Function to update the tread width and landing size dynamically
    updateTreadWidth(width) {
        this.treadWidth = width;

        this.treadGroup.children.forEach(tread => {
            tread.scale.set(width / 900, tread.scale.y, tread.scale.z);
        });

        const landing = this.treadGroup.children.find(obj => obj.geometry instanceof THREE.BoxGeometry);
        if (landing) {
            landing.geometry = new THREE.BoxGeometry(this.treadWidth / 800, 0.1, this.treadWidth / 800);
            landing.geometry.needsUpdate = true;
        }
    }

    // Function to update the material of treads and landing
    updateMaterial(selectedMaterial) {
        this.treadGroup.children.forEach(tread => {
            const treadElement = tread.getObjectByName('Tread');
            if (treadElement) {
                MaterialUtils.updateTreadMaterial(selectedMaterial, treadElement);
            }
        });

        const landing = this.treadGroup.children.find(obj => obj.geometry instanceof THREE.BoxGeometry);
        if (landing) {
            MaterialUtils.updateTreadMaterial(selectedMaterial, landing);
        }
    }

    // Function to clear existing treads
    clearTreads() {
        while (this.treadGroup.children.length > 0) {
            const tread = this.treadGroup.children.pop();
            this.scene.remove(tread);
        }
    }

    // Helper function to create wall material
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
