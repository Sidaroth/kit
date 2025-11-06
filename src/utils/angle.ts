/**
 * Pre-calculated constants for angle conversion.
 * @constant TWO_PI - 2π.
 */
export const TWO_PI = 2 * Math.PI;

/**
 * Pre-calculated constant for degrees to radians conversion.
 * @constant DEG2RAD - π/180.
 */
export const DEG2RAD = Math.PI / 180;

/**
 * Pre-calculated constant for radians to degrees conversion.
 * @constant RAD2DEG - 180/π.
 */
export const RAD2DEG = 180 / Math.PI;

/**
 * Converts a value from degrees to radians.
 * @param degrees The value in degrees.
 * @returns The value in radians.
 */
export function degreesToRadians(degrees: number): number {
    return degrees * DEG2RAD;
}

/**
 * Converts a value from radians to degrees.
 * @param radians The value in radians.
 * @returns The value in degrees.
 */
export function radiansToDegrees(radians: number): number {
    return radians * RAD2DEG;
}

/**
 * Normalizes an angle to the range [0, 2π).
 * @param angle - The angle to normalize in radians.
 * @returns The normalized angle in radians.
 */
export function normalizeAngle(angle: number): number {
    return angle % TWO_PI;
}
