class TabSwitching {
    constructor(mainSceneSetup) {
        this.mainSceneSetup = mainSceneSetup;  // Reference to MainSceneSetup for loading different stair models
        this.activeTab = 'straight';  // Default active tab (e.g., straight staircase)
    }

    // Initialize tab switching logic
    init() {
        const tabs = document.querySelectorAll('.tab-button');  // Assuming tab buttons have the class 'tab-button'
        tabs.forEach((tab) => {
            tab.addEventListener('click', (event) => {
                const selectedTab = event.target.getAttribute('data-tab');  // Assume tab buttons have data-tab attribute
                this.switchTab(selectedTab);
            });
        });
    }

    // Handle tab switching logic
    switchTab(selectedTab) {
        // Update the active tab class for UI
        document.querySelectorAll('.tab-content').forEach((content) => {
            content.classList.remove('active');
        });
        document.getElementById(`${selectedTab}-content`).classList.add('active');

        // Switch the 3D model based on the selected tab (staircase type)
        if (selectedTab !== this.activeTab) {
            this.mainSceneSetup.loadStaircase(selectedTab);
            this.activeTab = selectedTab;  // Update the active tab tracker
        }
    }
}

export default TabSwitching;
