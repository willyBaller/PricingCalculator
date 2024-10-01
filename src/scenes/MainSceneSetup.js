import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { addBasePlate } from '../components/BasePlate';
import { addLighting } from '../components/Lighting';
import Walls from '../components/Walls';
import StraightStair from '../components/staircases/StraightStair';
import LStair from '../components/staircases/LStair';
import UStair from '../components/staircases/UStair';
import Controls from '../controls/Controls';
import UIHandlers from '../controls/UIHandlers';
import PricingCalculator from '../helpers/PricingCalculator';
import InputListeners from '../ui/InputListeners';
import TabSwitching from '../ui/TabSwitching';

class MainSceneSetup {
    constructor() {
        // Setup Three.js scene, camera, renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Set the initial camera position (adjusted to show the entire staircase)
        this.camera.position.set(10, 10, 15);  // Set initial position to view the whole staircase
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Set the background color (based on the original project)
        this.scene.background = new THREE.Color(0xdae3e4);  // Soft light blue background

        // Initialize common components (lighting, baseplate, etc.)
        addBasePlate(this.scene);
        addLighting(this.scene);

        // Initialize walls
        this.walls = new Walls(this.scene, this.createWallMaterial());

        // Initialize the ground plane
        const groundGeometry = new THREE.PlaneGeometry(50, 50);  // 50x50 size
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xe6e5e1 });  // Light grey
        const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
        groundPlane.rotation.x = -Math.PI / 2;  // Rotate to lie flat
        groundPlane.position.y = -0.2;  // Slightly lower the ground to avoid clipping
        groundPlane.receiveShadow = true;
        this.scene.add(groundPlane);

        // Initialize camera controls
        this.controls = new Controls(this.camera, this.renderer);

        // Pricing system initialization
        this.pricingCalculator = new PricingCalculator();

        // Loader for GLTF models
        this.loader = new GLTFLoader();

        // Track current staircase type
        this.currentStaircase = null;

        // UI Handlers
        this.uiHandlers = null;

        // Default stair type
        this.currentStairType = 'straight';

        // Initialize InputListeners and TabSwitching (pass this MainSceneSetup instance)
        this.inputListeners = new InputListeners(this);
        this.inputListeners.init();  // Initialize input listeners

        this.tabSwitching = new TabSwitching(this);
        this.tabSwitching.init();  // Initialize tab switching

        // Initialize the scene with the default staircase
        this.loadStaircase(this.currentStairType);

        // Start the animation loop
        this.animate();
    }

    // Helper function to create wall material
    createWallMaterial() {
        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load('../textures/cross-laminated-timber-clt-fir-2000-mm-architextures.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 4);

        return new THREE.MeshStandardMaterial({
            map: wallTexture,
            side: THREE.DoubleSide
        });
    }

    // Function to dynamically load and switch staircases
    loadStaircase(type) {
        console.log('Loading staircase of type:', type);
        // Set the stair type in the pricing calculator
        this.pricingCalculator.setStairType(type);

        // Clear the current staircase from the scene (if any)
        if (this.currentStaircase && this.currentStaircase.treadGroup) {
            this.currentStaircase.treadGroup.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
            this.scene.remove(this.currentStaircase.treadGroup);
        }

        // Load the appropriate GLTF model and pass it to the staircase class
        const modelPath = this.getModelPathForStaircase(type);
        console.log('Model path:', modelPath);
        this.loader.load(modelPath, (gltf) => {
            const model = gltf.scene;

            // Ensure all meshes within the model cast and receive shadows
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Instantiate the appropriate staircase class
            switch (type) {
                case 'straight':
                    this.currentStaircase = new StraightStair(this.scene, model);
                    break;
                case 'L-shaped':  // New case for L-stair
                    this.currentStaircase = new LStair(this.scene, model);
                    break;
                case 'U-shaped':
                    this.currentStaircase = new UStair(this.scene, model);
                    break;
                // Additional stair types can be added here
                default:
                    console.error('Unknown staircase type:', type);
                    return;
            }

            // Ensure staircase is fully built, then update controls target
            if (this.currentStaircase && this.currentStaircase.treadGroup.children.length > 0) {
                this.updateControlsTarget();  // Update camera and controls based on the staircase center
            } else {
                console.error("Error: treadGroup is empty or undefined.");
            }

            // Initialize or update UI Handlers after the staircase is loaded
            if (!this.uiHandlers) {
                this.uiHandlers = new UIHandlers(this);
                this.uiHandlers.init();
            } else {
                this.uiHandlers.staircase = this.currentStaircase;  // Update the reference to the new staircase
            }

            // Recalculate price after loading the new staircase
            this.calculatePrice();
        }, undefined, (error) => {
            console.error("Error loading GLTF model:", error);
        });
    }

    // Helper function to update the camera's target and fit staircase into view
    updateControlsTarget() {
        if (!this.currentStaircase || !this.currentStaircase.treadGroup) {
            console.error("Error: treadGroup is undefined.");
            return;
        }

        const boundingBox = new THREE.Box3().setFromObject(this.currentStaircase.treadGroup);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        // Set camera target to the center of the staircase
        this.controls.target.copy(center);

        // Adjust camera position based on the size of the staircase
        this.camera.position.set(size.x * 1.5, size.y * 1.5, size.z * 1.5);

        // Ensure the camera looks at the center of the staircase
        this.camera.lookAt(center);

        // Update controls to ensure the new target is used
        this.controls.update();
    }

    // Helper function to get the GLTF model path based on the staircase type
    getModelPathForStaircase(type) {
        switch (type) {
            case 'straight':
            case 'U-shaped':
            case 'L-shaped':
                return './glTFModels/StairTreadTexture.gltf';  // Keep original relative path
            default:
                console.error('Invalid staircase type for model loading:', type);
                return '';
        }
    }

    // Calculate total price based on current options
    calculatePrice() {
        const options = {
            numTreads: parseInt(document.getElementById('stair-slider').value, 10),
            width: parseInt(document.getElementById('widthSlider').value, 10),
            material: document.querySelector('input[name="materialRadio"]:checked').value
        };

        const totalPrice = this.pricingCalculator.calculateTotal(options);

        // Update the UI with the calculated price
        const priceElement = document.getElementById('price');
        if (priceElement) {
            priceElement.textContent = `$${totalPrice.toFixed(2)}`;
        } else {
            console.error('Price element not found!');
        }
    }

    // Start rendering the scene
    animate() {
        const animateCallback = () => {
            requestAnimationFrame(animateCallback);
            this.controls.update(); // Update camera controls
            this.renderer.render(this.scene, this.camera); // Render the scene
        };
        animateCallback();
    }

    // Function to update controls, interact with UI, and recalculate price on input change
    setupControls() {
        document.getElementById('stair-slider').addEventListener('input', (event) => {
            const numTreads = parseInt(event.target.value, 10);
            if (this.currentStaircase) {
                this.currentStaircase.updateStairTreads(numTreads);
            }
            this.updateControlsTarget(); // Update controls when the staircase changes
            this.calculatePrice();  // Recalculate the price whenever the user changes treads
        });

        document.getElementById('widthSlider').addEventListener('input', (event) => {
            const width = parseInt(event.target.value, 10);
            if (this.currentStaircase) {
                this.currentStaircase.updateTreadWidth(width);
            }
            this.updateControlsTarget(); // Update controls when the width changes
            this.calculatePrice();  // Recalculate the price when the width is changed
        });

        document.querySelectorAll('input[name="materialRadio"]').forEach((radio) => {
            radio.addEventListener('change', () => {
                const selectedMaterial = document.querySelector('input[name="materialRadio"]:checked').value;
                this.currentStaircase.updateMaterial(selectedMaterial);
                this.calculatePrice();  // Recalculate the price when the material is changed
            });
        });
    }
}

export default MainSceneSetup;
