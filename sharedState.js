// Shared state for communication between face tracking and Three.js
export const sharedState = {
    facePosition: { x: 320, y: 240, z: 0 },

    // For fft analyzing
    fftData: {size: 1, fftRangeMin: Infinity, fftRangeMax: -Infinity,}
};

// Utility mapping function
export function mapFunc(value, start1, end1, start2, end2) {
    let proportion = (value - start1) / (end1 - start1);
    let mappedValue = start2 + (end2 - start2) * proportion;
    return mappedValue;
}