import { ISpatialStructure } from './ISpatialStructure';

/**
 * A simple **uniform spatial hash grid** for 2D space partitioning.
 *
 * Splits the world into fixed-size square cells of `cellSize` units
 * allowing efficient queries for nearby items. Each item belongs to exactly one cell, determined by its coordinates.
 *
 * This structure is useful for broad-phase queries in physics or any situation where objects only interact
 * with nearby neighbors.
 *
 * Depending on the number of items you need to track - you may want to consider moving to a different version of spatial hash. It will come down to your use-case.
 * For example:
 * - If you need to track >10.000 items - you should consider using a SIMD optimized implementation (WASM) for CPU.
 * - If you need to track >100.000 items - you should consider using a WebGPU compute shader - it's essentially the only way to get good enough performance for the frame budget.
 *
 * @note Do not use this class for items that rarely move or are stationary. It is intended for high churn rate items that move frequently (i.e every frame).
 * If you need to track stationary items, use a different spatial structure such as a {@link QuadTree}.
 *
 * @template T - The type of objects being tracked.
 *
 * @param cellSize - The width/height of a single grid cell, in world units.
 * Choose this based on your expected interaction radius - smaller cells are more precise but use more memory.
 *
 * @example
 * const grid = new SpatialHash<Entity>(50);
 *
 * grid.insert(player, 120, 80);
 * grid.insert(enemy, 180, 95);
 *
 * // Get all entities within 100 units of the player
 * const nearby = grid.query(120, 80, 100);
 *
 * // Update positions as entities move
 * grid.update(player, 160, 100);
 *
 * // Clear all cells (e.g., between frames)
 * grid.clear();
 */
export class SpatialHash<T> implements ISpatialStructure<T> {
    /** Size (in world units) of one cell in the uniform grid. */
    private readonly cellSize: number;

    /** The hash grid: maps cell coordinates `"x,y"` → list of items in that cell. */
    private readonly grid: Map<string, T[]> = new Map();

    constructor(cellSize: number) {
        this.cellSize = cellSize;
    }

    /**
     * Convert a 2D coordinate into a cell key string.
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @returns The cell key string in the format `"x,y"`.
     */
    private hash(x: number, y: number): string {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }

    /**
     * Inserts an item into the grid based on its (x, y) position.
     *
     * @param item - The object to insert.
     * @param x - The X coordinate in world space.
     * @param y - The Y coordinate in world space.
     *
     * @note The same item should not be inserted twice without removal or update. If you need to update an item's position, use `update()` instead.
     */
    insert(item: T, x: number, y: number): void {
        const key = this.hash(x, y);
        const cell = this.grid.get(key) ?? [];
        cell.push(item);
        this.grid.set(key, cell);
    }

    /**
     * Removes an item from whichever cell currently contains it.
     * This performs a linear search across all cells (O(n_cells * avg_items)).
     *
     * @param item - The item to remove.
     */
    remove(item: T): void {
        for (const [key, arr] of this.grid) {
            const i = arr.indexOf(item);
            if (i !== -1) {
                arr.splice(i, 1);
                if (!arr.length) this.grid.delete(key);
                return;
            }
        }
    }

    /**
     * Updates an item’s position by removing it from its old cell
     * and re-inserting it into the correct new one.
     *
     * @param item - The item to move.
     * @param x - The new X coordinate in world space.
     * @param y - The new Y coordinate in world space.
     */
    update(item: T, x: number, y: number): void {
        this.remove(item);
        this.insert(item, x, y);
    }

    /**
     * Queries all items within a circular area centered on (x, y) with the given radius.
     *
     * @param x - Center X coordinate in world space.
     * @param y - Center Y coordinate in world space.
     * @param radius - Search radius in world units.
     * @returns A readonly array of all items that lie in cells overlapping the radius.
     *
     * @note This returns all items in the overlapping cells; it does not do fine-grained distance checks (e.g. Euclidean distance) — that’s left to the caller.
     * For many real-time systems (boids, particles, physics broad-phase), that coarse approximation is good enough and performance-critical.
     */
    query(x: number, y: number, radius: number): readonly T[] {
        const minX = Math.floor((x - radius) / this.cellSize);
        const maxX = Math.floor((x + radius) / this.cellSize);
        const minY = Math.floor((y - radius) / this.cellSize);
        const maxY = Math.floor((y + radius) / this.cellSize);
        const result: T[] = [];

        // In essence - check every cell that overlaps the radius around the center point.
        // If radius is similar to cell size - it will check the 3x3 grid around the center point.
        for (let cy = minY; cy <= maxY; cy += 1) {
            for (let cx = minX; cx <= maxX; cx += 1) {
                const cell = this.grid.get(`${cx},${cy}`);
                if (cell) {
                    result.push(...cell);
                }
            }
        }
        return result;
    }

    /**
     * Clears the grid of all items. This is useful for resetting the spatial structure between frames.
     *
     * @note This does not free any memory allocated for items - it simply removes all **internal** references to them readying them for garbage collection.
     */
    clear(): void {
        this.grid.clear();
    }
}
