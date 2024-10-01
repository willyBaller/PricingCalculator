class GeometryUtils {
    // Convert degrees to radians for angle calculations
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Compute the positions of stair treads based on number of treads, angle, and distance
    static computeTreadPositions(count, angleDegrees, distance) {
        const angle = GeometryUtils.degToRad(angleDegrees);
        let positions = [];

        for (let i = 0; i < count; i++) {
            const yOffset = distance * i * Math.sin(angle) * 0.5;
            const zOffset = -distance * i * Math.cos(angle);
            positions.push({ x: 0, y: yOffset, z: zOffset });
        }

        return positions;
    }

    // Calculate the side wall's height and length based on the position of the top tread
    static calculateSideWallDimensions(topTreadYOffset, topTreadZOffset) {
        const sideWallHeight = topTreadYOffset + 1.125;  // Adjust height based on top tread position
        const sideWallLength = Math.abs(topTreadZOffset) + 1;  // Adjust length as needed

        return { height: sideWallHeight, length: sideWallLength };
    }

    // Calculate the back wall dimensions and position based on top tread position, wall height, thickness, and offset
    static calculateBackWallDimensions(topTreadYOffset, topTreadZOffset, wallHeight, wallThickness, offset) {
        return {
            height: wallHeight,
            position: {
                x: 0,
                y: topTreadYOffset + wallHeight / 2,
                z: topTreadZOffset - wallThickness / 2 - offset
            }
        };
    }

    // Calculate the geometry scaling factor based on new width
    static rescaleTreadGeometry(originalWidth, newWidth, treadGeometry) {
        const scaleFactor = newWidth / originalWidth;
        treadGeometry.scale(scaleFactor, 1, 1);  // Scale width only
        return treadGeometry;
    }

    // Function to translate geometry (e.g., for moving walls or adjusting positions)
    static translateGeometry(geometry, x, y, z) {
        geometry.translate(x, y, z);
        return geometry;
    }

    // Clone geometry for creating multiple treads or other repeating components
    static cloneGeometry(geometry) {
        return geometry.clone();
    }
}

export default GeometryUtils;
