import * as THREE from 'three';

export function addBasePlate(scene) {
    const geometry = new THREE.BoxGeometry(0.6, 0.024, 0.4);  // Size in meters
    const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const basePlate = new THREE.Mesh(geometry, material);

    basePlate.position.set(0, -0.18, -0.25);  // This looks correct
    basePlate.receiveShadow = true;
    basePlate.castShadow = true;

    scene.add(basePlate);
}
