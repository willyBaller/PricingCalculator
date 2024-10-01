class StraightStairPricing {
    constructor() {
        this.baseCost = 8406.18; // Base cost for a straight staircase
        this.treadCostPerUnit = 329.80; // Cost per stair tread
        this.stringerCosts = {
            14: 600.00,
            15: 600.00,
            16: 735.00,
            17: 735.00,
            18: 735.00,
            19: 735.00
        };

        // Width cost per tread, based on wood type and stair width
        this.widthCostMap = {
            "American Ash": {
                900: 714.29,
                1000: 742.86,
                1100: 785.71,
                1200: 828.57
            },
            "American Oak": {
                900: 771.43,
                1000: 814.29,
                1100: 842.86,
                1200: 885.71
            }
        };
    }

    // Calculate the total price based on user inputs
    calculatePrice(options) {
        const { numTreads, width, material } = options;

        // Base cost plus tread and stringer costs
        let totalPrice = this.baseCost + this.calculateTreadCost(numTreads) + this.calculateStringerCost(numTreads);
        
        // Add the cost based on the selected width and material
        totalPrice += this.calculateWidthCost(numTreads, width, material);

        return totalPrice;
    }

    // Calculate the cost for treads
    calculateTreadCost(numTreads) {
        return numTreads * this.treadCostPerUnit;
    }

    // Calculate the cost for the stringer based on the number of treads
    calculateStringerCost(numTreads) {
        return this.stringerCosts[numTreads] || 0;
    }

    // Calculate the cost based on the selected width and material type
    calculateWidthCost(numTreads, width, material) {
        if (!this.widthCostMap[material] || !this.widthCostMap[material][width]) {
            console.error('Invalid width or material selected');
            return 0;
        }

        return numTreads * this.widthCostMap[material][width];
    }
}

export default StraightStairPricing;
