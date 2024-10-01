class UStairPricing {
    constructor() {
        this.baseCost = 10000; // Base cost for U-shaped staircase (arbitrary example)
        this.treadCostPerUnit = 350; // Adjust this based on U-stair pricing logic
        this.stringerCosts = {
            14: 700.00,
            15: 700.00,
            16: 850.00,
            17: 850.00,
            18: 900.00,
            19: 900.00
        };

        this.widthCostMap = {
            "American Ash": {
                900: 800.00,
                1000: 850.00,
                1100: 900.00,
                1200: 950.00
            },
            "American Oak": {
                900: 850.00,
                1000: 900.00,
                1100: 950.00,
                1200: 1000.00
            }
        };
    }

    calculatePrice(options) {
        const { numTreads, width, material } = options;
        let totalPrice = this.baseCost + this.calculateTreadCost(numTreads) + this.calculateStringerCost(numTreads);
        totalPrice += this.calculateWidthCost(numTreads, width, material);
        return totalPrice;
    }

    calculateTreadCost(numTreads) {
        return numTreads * this.treadCostPerUnit;
    }

    calculateStringerCost(numTreads) {
        return this.stringerCosts[numTreads] || 0;
    }

    calculateWidthCost(numTreads, width, material) {
        if (!this.widthCostMap[material] || !this.widthCostMap[material][width]) {
            console.error('Invalid width or material selected');
            return 0;
        }
        return numTreads * this.widthCostMap[material][width];
    }
}

export default UStairPricing;
