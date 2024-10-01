class PricingCalculator {
    constructor() {
        this.stairType = null; // Track the current stair type
        this.pricingModule = null; // Reference to the pricing module for the current stair type
    }

    // Function to set the current stair type and load the corresponding pricing module
    setStairType(stairType) {
        this.stairType = stairType;

        switch (stairType) {
            case 'straight':
                import('./pricing/StraightStairPricing.js').then(module => {
                    this.pricingModule = new module.default();
                });
                break;
            case 'L-shaped':
                import('./pricing/LStairPricing.js').then(module => {
                    this.pricingModule = new module.default();
                });
                break;
            case 'U-shaped':
                import('./pricing/UStairPricing.js').then(module => {
                    this.pricingModule = new module.default();
                });
                break;
            default:
                console.error('Unknown stair type:', stairType);
                this.pricingModule = null;
        }
    }

    // Function to calculate the total price based on the current pricing module
    calculateTotal(options) {
        if (!this.pricingModule) {
            console.error('No pricing module loaded for the current stair type.');
            return 0;
        }

        return this.pricingModule.calculatePrice(options);
    }
}

export default PricingCalculator;
