/**
 * Clamps a numeric value between a minimum and maximum range.
 * @param value The input value to constrain.
 * @param min The lower bound.
 * @param max The upper bound.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;

    return value;
}
