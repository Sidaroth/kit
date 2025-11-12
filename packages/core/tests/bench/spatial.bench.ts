import { bench, describe } from 'vitest';
import { SpatialHash } from '@spatial/spatialHash';

describe('SpatialHash performance', () => {
    const cellSize = 10;
    const grid = new SpatialHash<{ id: number }>(cellSize);

    // Preload the grid with 10,000 items
    const items = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
    for (const item of items) {
        grid.insert(item, Math.random() * 1000, Math.random() * 1000);
    }

    // Inserts a new item into the grid
    bench('SpatialHash.insert()', () => {
        const item = { id: Math.random() };
        grid.insert(item, Math.random() * 1000, Math.random() * 1000);
    });

    // Queries the grid for items within a radius of 50 units around the center (500, 500)
    bench('SpatialHash.query()', () => {
        grid.query(500, 500, 50);
    });

    // Updates a random item's position in the grid
    bench('SpatialHash.update()', () => {
        const item = items[Math.floor(Math.random() * items.length)];
        grid.update(item, Math.random() * 1000, Math.random() * 1000);
    });

    // Removes a random item from the grid
    bench('SpatialHash.remove()', () => {
        const item = items[Math.floor(Math.random() * items.length)];
        grid.remove(item);
    });

    // Clears a grid with 1000 items
    bench('SpatialHash.clear()', () => {
        const temp = new SpatialHash<{ id: number }>(cellSize);
        for (let i = 0; i < 1000; i++) {
            temp.insert({ id: i }, i * 2, i * 2);
        }
        temp.clear();
    });
});
