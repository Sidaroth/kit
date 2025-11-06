import { Rect } from './Rect';
import { Circle } from './Circle';
import { Polygon } from './Polygon';
import { Line } from './Line';

export type Shape2d = Rect | Circle | Polygon | Line /* | Triangle | ... */;

/**
 * Checks if a given object is a shape2d.
 * @param shape - The object to check.
 * @returns True if the object is a shape2d, false otherwise.
 */
export function isShape2d(shape: unknown): shape is Shape2d {
    if (!shape) return false;

    return (
        shape instanceof Rect ||
        shape instanceof Circle ||
        shape instanceof Polygon ||
        shape instanceof Line
    );
}
