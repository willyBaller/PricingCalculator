# 3D Staircase Pricing Calculator

This project is a **3D staircase pricing calculator** built with **Three.js** and designed to dynamically render staircases and calculate pricing based on user inputs. Users can interact with the 3D model viewer, customize staircase types, select material options, and submit a quote request.

## Features

- **3D Viewer**: Real-time rendering of staircase models (straight, L-shaped, U-shaped) using Three.js.
- **Dynamic Pricing Calculator**: Adjusts price based on user input for the number of treads, width, and material.
- **Interactive UI**: Sliders, dropdowns, and radio buttons for customizing staircase parameters.
- **Quote Submission Form**: Users can submit a form for a quote, with EmailJS integration for handling submissions.
- **Expandable Architecture**: Easy to add new staircase types, materials, or features.

## Project Structure

```plaintext
PricingCalculatorWDirectory/
│
├── dist/                            # Compiled output for production (Webpack bundle)
├── node_modules/                    # Project dependencies (installed via npm)
├── glTFModels/                      # GLTF models and textures for staircases
├── src/                             # Source code for components, controls, helpers, etc.
│   ├── components/                  # 3D components (stairs, base plate, walls, lighting)
│   ├── controls/                    # User input controls (camera, UI handlers, sliders)
│   ├── helpers/                     # Utility functions for materials, geometry, and pricing
│   ├── pricing/                     # Pricing logic for each staircase type
│   ├── scenes/                      # MainSceneSetup for managing the Three.js scene
│   ├── ui/                          # UI logic (event listeners, tab switching, form handling)
│   └── main.js                      # Entry point for initializing the project
├── index.html                       # Main HTML file with UI elements (sliders, form, etc.)
├── style.css                        # Custom styles for layout and UI
├── webpack.config.js                # Webpack configuration for bundling
└── README.md                        # Documentation (this file)

Getting Started
Prerequisites
Node.js and npm: You will need to have Node.js and npm installed. You can download it from here.
Installation
Clone this repository:
git clone https://github.com/yourusername/3D-staircase-pricing-calculator.git
cd 3D-staircase-pricing-calculator


Folder Structure
glTFModels/: Contains the 3D models (.gltf and .bin files) used to render different staircase types (Straight, L-shaped, U-shaped). You can add new staircase models here and update the code accordingly.

src/components/:

Contains 3D component logic, such as BasePlate, Lighting, and Walls, as well as individual staircase logic (StraightStair.js, LStair.js, UStair.js).
src/controls/:

Contains input and control handlers, including camera movement, slider inputs, and UI interaction logic.
src/helpers/:

Utility functions for managing geometry, materials, and dynamic pricing calculations.
src/pricing/:

Contains the pricing logic for each staircase type (StraightStairPricing.js, LStairPricing.js, etc.).
src/scenes/MainSceneSetup.js:

The core scene manager that sets up the Three.js environment, loads models, handles user inputs, and updates the UI.
src/ui/:

Handles UI interactions such as InputListeners.js for sliders and material selection, TabSwitching.js for switching between stair models, and QuoteForm.js for managing quote submissions.
How to Add New Stair Types
Add the GLTF Model: Place the new .gltf and .bin files for the staircase model in the glTFModels/ folder.

Create a New Component:

In the src/components/staircases/ folder, create a new file (e.g., SpiralStair.js) and define the logic for loading and interacting with the new staircase type.
Update Pricing:

In the src/pricing/ folder, create a new pricing module (e.g., SpiralStairPricing.js) to handle the pricing logic for the new staircase type.
Modify MainSceneSetup.js:

Update the loadStaircase() method in MainSceneSetup.js to load the new staircase type and apply the corresponding pricing logic.
How to Customize the UI
Sliders and Inputs: The HTML structure for sliders, radio buttons, and dropdowns can be found in index.html. You can add new controls and map them to corresponding logic in src/ui/InputListeners.js.
Styles: Update style.css or extend Tailwind classes to apply custom styles.
Dependencies
Three.js: Used for rendering the 3D scene and models.
EmailJS: Integrated for handling form submissions.
Webpack: Used for bundling the JavaScript files.
Tailwind CSS: Provides utility-first CSS for styling the UI.
Future Features (Optional)
Add More Stair Types: Expand the project to include spiral, cantilever, or other custom staircase types.
Material Customization: Allow users to select from more material types or customize components like handrails or stringers.
User Authentication: Integrate a backend for user login and quote history management.
Performance Optimization: Further optimize large models or add support for lazy loading textures


---

### **Explanation of the README.md**:

1. **Getting Started**:
   - Clear instructions on how to clone the repository, install dependencies, and start the development server.

2. **Folder Structure**:
   - A detailed explanation of the project file structure so users can easily navigate and understand where to make changes.

3. **How to Add New Stair Types**:
   - Simple steps for expanding the project to support new staircase types (adding models, components, and pricing logic).

4. **UI Customization**:
   - Instructions on how to modify or extend the UI for new input options or styling changes.

5. **Dependencies**:
   - Lists the key libraries used in the project and their purpose.

6. **Future Features**:
   - Outlines potential future improvements and expansions to the project, like more stair types, user authentication, and performance optimizations.

---

This **README.md** provides a comprehensive overview of the project, along with clear instructions for installation, development, and expansion. Let me know if you’d like to make any changes or add more details!
