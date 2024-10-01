import * as THREE from 'three';

class MaterialUtils {
    // Create a wood material with the specified texture (or default texture)
    static createWoodMaterial(texturePath = '../textures/oak_veneer_01_diff_4k.jpg') {
        const textureLoader = new THREE.TextureLoader();
        const woodTexture = textureLoader.load(texturePath);

        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;

        return new THREE.MeshStandardMaterial({
            map: woodTexture,
            metalness: 0.0,  // Original value for wood material
            roughness: 1.0,  // Original value for wood material
        });
    }

    // Create a metal material for stringers or other metal parts
    static createMetalMaterial(color = 0x555555) {
        return new THREE.MeshStandardMaterial({
            color: color,
            metalness: 1.0,  // Full metallic look
            roughness: 0.2,  // Smooth surface for metal
        });
    }

    // Update the tread material based on the selected user input
    static updateTreadMaterial(selectedMaterial, geometry) {
        let material;

        switch (selectedMaterial) {
            case 'American Ash':
                material = MaterialUtils.createWoodMaterial('../textures/oak_veneer_01_diff_4k.jpg');
                break;
            case 'American Oak':
                material = MaterialUtils.createWoodMaterial('../textures/oak_veneer_01_diff_4k.jpg');
                break;
            case 'No Tread':
                material = new THREE.MeshBasicMaterial({ visible: false });
                break;
            default:
                material = MaterialUtils.createWoodMaterial();  // Default wood material
                break;
        }

        geometry.material = material;
        geometry.material.needsUpdate = true;
    }
}

export default MaterialUtils;
