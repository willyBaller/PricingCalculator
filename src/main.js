import MainSceneSetup from './scenes/MainSceneSetup';
import UIHandlers from './controls/UIHandlers'; // Correct import path

// DOM fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const sceneSetup = new MainSceneSetup();  // Initialize MainSceneSetup instance
    sceneSetup.uiHandlers = new UIHandlers(sceneSetup);  // Initialize UIHandlers with MainSceneSetup instance
    sceneSetup.uiHandlers.init();  // Attach UI event listeners after the DOM is ready

    // Start the animation loop
    sceneSetup.animate();
});
