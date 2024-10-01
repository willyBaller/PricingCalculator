import * as THREE from 'three';

export default class Walls {
    constructor(scene, wallMaterial) {
        this.scene = scene;
        this.wallMaterial = wallMaterial;

        // Create walls initially
        this.createWalls();
    }

    // Method to create the walls
    createWalls() {
        this.removeExistingWalls();

        // Create the back wall
        this.backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.2), this.wallMaterial);
        this.backWall.receiveShadow = true;
        this.backWall.castShadow = true;
        this.backWall.name = 'BackWall';
        this.scene.add(this.backWall);

        // Create the side wall
        this.sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 10), this.wallMaterial);
        this.sideWall.receiveShadow = true;
        this.sideWall.castShadow = true;
        this.sideWall.name = 'SideWall';
        this.scene.add(this.sideWall);

        // Create the additional wall (but keep it invisible for now)
        this.additionalWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 8), this.wallMaterial);  // Same height as back wall
        this.additionalWall.receiveShadow = true;
        this.additionalWall.castShadow = true;
        this.additionalWall.name = 'AdditionalWall';
        this.additionalWall.visible = false;  // Initially hidden
        this.scene.add(this.additionalWall);
    }

    // Remove any existing walls to avoid duplicates
    removeExistingWalls() {
        const backWall = this.scene.getObjectByName('BackWall');
        const sideWall = this.scene.getObjectByName('SideWall');
        const additionalWall = this.scene.getObjectByName('AdditionalWall');

        if (backWall) {
            this.scene.remove(backWall);
        }
        if (sideWall) {
            this.scene.remove(sideWall);
        }
        if (additionalWall) {
            this.scene.remove(additionalWall);
        }
    }

    // Method to update the wall dimensions and positioning based on the top tread
    updateWalls(topTreadYOffset, topTreadZOffset, stairType, totalBackWallWidth = 8.4) {
        const wallHeight = 0.75;  // Height of the back wall
        const wallThickness = 5;  // Thickness of the wall
        const sideWallThickness = 3;  // Side wall thickness
        
        // Adjust back wall width and position
        const newBackWallWidth = totalBackWallWidth;
        this.backWall.geometry.dispose();  // Dispose of the old geometry
        this.backWall.geometry = new THREE.BoxGeometry(newBackWallWidth, wallHeight, wallThickness);  // Update width
    
        let zPosition;
        
        if (stairType === 'U-shaped') {
            // Adjust the back wall position independently using a custom offset
            const backWallInitialPosition = -3;  // You can fine-tune this value
            zPosition = topTreadZOffset + backWallInitialPosition;  // This offset controls only the back wall's Z-position
        } else {
            // Default positioning for all other stair types (Straight, L-shaped, etc.)
            const backWallOffset = stairType === 'L-shaped' ? -5.8 : -5.2;  // Offset for L-shaped stairs, else default
            zPosition = topTreadZOffset - wallThickness / 2 - backWallOffset;
        }
    
        // Set back wall position (this should now only affect the back wall, not the side wall)
        this.backWall.position.set(
            sideWallThickness + (newBackWallWidth / 2) - (sideWallThickness * 2.4),  // Shift to the left by half the new width
            topTreadYOffset + wallHeight / 2,
            zPosition  // Z-position changes based on stair type
        );
    
        // Adjust the side wall length based on stair type
        let sideWallLength;
    
        if (stairType === 'U-shaped') {
            // Special side wall length for U-shaped stairs
            const customSideWallLength = 12;  // You can adjust this value to set the Z-axis length for the side wall in U-shaped stairs
            sideWallLength = customSideWallLength;
        } else {
            // Default length for other stair types
            sideWallLength = Math.abs(topTreadZOffset) + 3;
        }
    
        // Update side wall dimensions and position
        const sideWallHeight = topTreadYOffset + 1.125;  // Adjusted based on top tread position
        this.sideWall.geometry.dispose();
        this.sideWall.geometry = new THREE.BoxGeometry(sideWallThickness, sideWallHeight, sideWallLength);
        this.sideWall.position.set(
            -2.7, 
            sideWallHeight / 2 - 0.75 / 2, 
            topTreadZOffset / 2  // This still uses topTreadZOffset to maintain side wall behavior
        );
    
        // Show/hide the additional wall for L-shaped stairs
        if (stairType === 'L-shaped') {
            this.additionalWall.visible = true;
            this.additionalWall.geometry.dispose();
            this.additionalWall.geometry = new THREE.BoxGeometry(sideWallThickness - 0.2, wallHeight, 3);  // Adjusted for L-shaped stairs
            this.additionalWall.position.set(
                totalBackWallWidth - (sideWallThickness * 1.865),
                topTreadYOffset + wallHeight / 2,
                topTreadZOffset  // Align with back wall
            );
        } else {
            this.additionalWall.visible = false;
        }
    }                
}
