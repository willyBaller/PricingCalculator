export default class UIHandlers {
    constructor(mainSceneSetup) {
        this.mainSceneSetup = mainSceneSetup; // Reference to MainSceneSetup to control staircase loading
    }

    // Attach all the UI event listeners
    init() {
        // Event listener for switching between different stair types
        document.getElementById('stair-type-selector').addEventListener('change', (event) => {
            const stairType = event.target.value;
            console.log('Stair type changed to:', stairType);  // Add this line to debug
            this.mainSceneSetup.loadStaircase(stairType); // Trigger the staircase load based on type
        
            // Debug whether specific controls are being targeted
            console.log('Bottom flight slider:', document.getElementById('bottom-flight-slider'));
            console.log('Top flight slider:', document.getElementById('top-flight-slider'));
            console.log('Stair slider:', document.getElementById('stair-slider'));
            
            // Separate handling for L-shaped and U-shaped stairs
            if (stairType === 'L-shaped') {
                console.log('Displaying L-shaped controls');
                document.getElementById('bottom-flight-slider').style.display = 'block';
                document.getElementById('top-flight-slider').style.display = 'block';
                document.getElementById('stair-slider').style.display = 'none';
            } else if (stairType === 'U-shaped') {  // Explicit check for U-shaped stairs
                console.log('Displaying U-shaped controls');
                document.getElementById('bottom-flight-slider').style.display = 'block';  // Same as L-shaped
                document.getElementById('top-flight-slider').style.display = 'block';
                document.getElementById('stair-slider').style.display = 'none';
            } else {
                console.log('Displaying Straight controls');
                document.getElementById('bottom-flight-slider').style.display = 'none';
                document.getElementById('top-flight-slider').style.display = 'none';
                document.getElementById('stair-slider').style.display = 'block';
            }
        });

        // Bottom Flight Slider (for L-shaped and U-shaped stairs)
        const bottomFlightSlider = document.getElementById('bottom-flight-slider');
        const bottomFlightInput = document.getElementById('bottom-flight-input');
        bottomFlightSlider.addEventListener('input', (event) => {
            const bottomTreads = parseInt(event.target.value, 10);
            bottomFlightInput.value = bottomTreads; // Sync input with slider
            const topTreads = parseInt(document.getElementById('top-flight-slider').value, 10);
            this.mainSceneSetup.currentStaircase.updateStairTreads(bottomTreads, topTreads);  // Update both flights
        });
        bottomFlightInput.addEventListener('input', (event) => {
            const bottomTreads = parseInt(event.target.value, 10);
            bottomFlightSlider.value = bottomTreads; // Sync slider with input
            const topTreads = parseInt(document.getElementById('top-flight-slider').value, 10);
            this.mainSceneSetup.currentStaircase.updateStairTreads(bottomTreads, topTreads);  // Update both flights
        });

        // Top Flight Slider (for L-shaped and U-shaped stairs)
        const topFlightSlider = document.getElementById('top-flight-slider');
        const topFlightInput = document.getElementById('top-flight-input');
        topFlightSlider.addEventListener('input', (event) => {
            const topTreads = parseInt(event.target.value, 10);
            topFlightInput.value = topTreads; // Sync input with slider
            const bottomTreads = parseInt(document.getElementById('bottom-flight-slider').value, 10);
            this.mainSceneSetup.currentStaircase.updateStairTreads(bottomTreads, topTreads);  // Update both flights
        });
        topFlightInput.addEventListener('input', (event) => {
            const topTreads = parseInt(event.target.value, 10);
            topFlightSlider.value = topTreads; // Sync slider with input
            const bottomTreads = parseInt(document.getElementById('bottom-flight-slider').value, 10);
            this.mainSceneSetup.currentStaircase.updateStairTreads(bottomTreads, topTreads);  // Update both flights
        });

        // Width Slider
        document.getElementById('widthSlider').addEventListener('input', (event) => {
            const width = parseInt(event.target.value, 10);
            this.mainSceneSetup.currentStaircase.updateTreadWidth(width);
            document.getElementById('widthInput').value = width; // Sync with number input
        });

        // Width Number Input
        document.getElementById('widthInput').addEventListener('input', (event) => {
            const width = parseInt(event.target.value, 10);
            this.mainSceneSetup.currentStaircase.updateTreadWidth(width);
            document.getElementById('widthSlider').value = width; // Sync with slider
        });

        // Radio buttons to control the material of the stair treads
        document.querySelectorAll('input[name="materialRadio"]').forEach((radio) => {
            radio.addEventListener('change', () => {
                const selectedMaterial = document.querySelector('input[name="materialRadio"]:checked').value;
                if (selectedMaterial === "No Tread") {
                    this.mainSceneSetup.currentStaircase.updateMaterial("none");
                } else if (selectedMaterial === "American Ash") {
                    this.mainSceneSetup.currentStaircase.updateMaterial('ash_texture.jpg');
                } else if (selectedMaterial === "American Oak") {
                    this.mainSceneSetup.currentStaircase.updateMaterial('oak_texture.jpg');
                }
            });
        });
    }
}
