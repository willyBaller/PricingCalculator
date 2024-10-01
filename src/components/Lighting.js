import * as THREE from 'three';

export function addLighting(scene) {
    // Ambient Light for overall scene brightness (increase to lighten shadows)
    const ambientLight = new THREE.AmbientLight(0xfff7eb, 2.2);  // Increased intensity
    scene.add(ambientLight);

    // Directional Light for casting shadows (reduce intensity to reduce shadow darkness)
    const directionalLight = new THREE.DirectionalLight(0xfff7eb, 1.5);  // Lower intensity to soften shadow contrast
    directionalLight.position.set(5, 20, -5);
    directionalLight.castShadow = true;

    // Configure shadow map resolution for higher quality shadows
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;

    // Shadow radius to soften edges
    directionalLight.shadow.radius = 5;

    // Shadow bias to reduce artifacts at shadow borders
    directionalLight.shadow.bias = -0.0001;

    // Configure the shadow camera frustum (controls shadow casting area)
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;

    // Add the directional light to the scene
    scene.add(directionalLight);

    // Optional: Add a soft fill light to brighten shadow areas
    const fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);  // Low-intensity fill light
    scene.add(fillLight);

    // Optional: Visualize the shadow camera for debugging purposes
    // const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(shadowHelper);
}
