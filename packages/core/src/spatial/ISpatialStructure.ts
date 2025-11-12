/**
 * Generic interface for 2D spatial partitioning structures.
 *
 * Defines a minimal contract for inserting, updating, removing,
 * and querying spatially located items. This abstraction allows
 * algorithms (like flocking, collision detection, or particle systems)
 * to operate on any spatial structure interchangeably.
 *
 * @template T - The type of object stored in the structure.
 */
export interface ISpatialStructure<T> {
    insert(item: T, x: number, y: number): void;
    remove(item: T): void;
    update(item: T, x: number, y: number): void;
    query(x: number, y: number, radius: number): readonly T[];
    clear(): void;
}
