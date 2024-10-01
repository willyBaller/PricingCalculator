class InputListeners {
    constructor(mainSceneSetup) {
        this.mainSceneSetup = mainSceneSetup;
        this.init();
    }

    init() {
        // Stair Slider (Number of Treads)
        document.getElementById('stair-slider').addEventListener('input', (event) => {
            const numTreads = parseInt(event.target.value, 10);
            document.getElementById('stair-input').value = numTreads;  // Sync the number input with slider
            this.mainSceneSetup.currentStaircase.updateStairTreads(numTreads);
            this.mainSceneSetup.calculatePrice();  // Recalculate price with current inputs
        });

        // Width Slider (Tread Width)
        document.getElementById('widthSlider').addEventListener('input', (event) => {
            const width = parseInt(event.target.value, 10);
            document.getElementById('widthInput').value = width;  // Sync width slider with input
            this.mainSceneSetup.currentStaircase.updateTreadWidth(width);
            this.mainSceneSetup.calculatePrice();  // Recalculate price with current inputs
        });

        // Material Radio Buttons
        document.querySelectorAll('input[name="materialRadio"]').forEach((radio) => {
            radio.addEventListener('change', () => {
                const selectedMaterial = document.querySelector('input[name="materialRadio"]:checked').value;
                this.mainSceneSetup.currentStaircase.updateMaterial(selectedMaterial);
                this.mainSceneSetup.calculatePrice();  // Recalculate price when material changes
            });
        });

        // Quote Form Submission
        document.getElementById('quote-form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmission();
        });
    }

    // Handles form submission (e.g., to send quote request via email)
    handleFormSubmission() {
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            projectType: document.getElementById('project-type').value,
            additionalDetails: document.getElementById('additional-details').value
        };
        console.log('Form submitted with:', formData);
        // Here you could integrate the actual sending of the form, such as with EmailJS or another service.
    }
}

export default InputListeners;
