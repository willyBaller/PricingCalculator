import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Controls {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;

        // Initialize the OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Enable damping for smooth movement
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;

        // Set limits for zooming and panning
        this.controls.minDistance = 5;  // Minimum zoom
        this.controls.maxDistance = 100; // Maximum zoom
        this.controls.maxPolarAngle = Math.PI / 2; // Prevent camera from flipping below the ground

        // Enable zooming
        this.controls.enableZoom = true;

        // Enable panning
        this.controls.enablePan = true;
    }

    // Update controls on every frame
    update() {
        this.controls.update();
    }

    // Method to set a new camera target dynamically
    setTarget(target) {
        this.controls.target.copy(target);
        this.controls.update();
    }
}
