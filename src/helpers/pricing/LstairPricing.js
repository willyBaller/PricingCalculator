class LStairPricing {
    constructor() {
        this.baseCost = 9500.00;  // Base cost for L-shaped stair
        this.treadCostPerUnit = 350.00;
        this.stringerCosts = {
            2: 400.00,  // Minimum treads
            16: 1050.00  // Maximum treads
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
        const { bottomTreads, topTreads, width, material } = options;
        const numTreads = bottomTreads + topTreads;

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

export default LStairPricing;
