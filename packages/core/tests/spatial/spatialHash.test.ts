import { describe, it, expect, beforeEach } from 'vitest';
import { SpatialHash } from '@spatial/spatialHash';

// note: utilizing dirty array access here for coverage, and to test private internal state - please don't do this in production code
describe('SpatialHash', () => {
    interface Entity {
        id: number;
        name: string;
    }

    let grid: SpatialHash<Entity>;
    let a: Entity;
    let b: Entity;
    let c: Entity;

    beforeEach(() => {
        grid = new SpatialHash<Entity>(10);
        a = { id: 1, name: 'A' };
        b = { id: 2, name: 'B' };
        c = { id: 3, name: 'C' };
    });

    it('creates an empty grid with the given cell size', () => {
        const g = new SpatialHash<Entity>(5);
        expect(g['cellSize']).toBe(5);
        expect(g['grid'].size).toBe(0);
    });

    it('inserts a new item into an empty cell', () => {
        grid.insert(a, 5, 5);
        expect(grid['grid'].size).toBe(1);
        const values = Array.from(grid['grid'].values())[0];
        expect(values).toEqual([a]);
    });

    it('inserts multiple items into the same cell', () => {
        grid.insert(a, 5, 5);
        grid.insert(b, 6, 7); // still same cell
        const cell = Array.from(grid['grid'].values())[0];
        expect(cell).toContain(a);
        expect(cell).toContain(b);
    });

    it('inserts items into different cells', () => {
        grid.insert(a, 1, 1);
        grid.insert(b, 25, 25);
        expect(grid['grid'].size).toBe(2);
    });

    it('removes an item from the correct cell', () => {
        grid.insert(a, 5, 5);
        grid.insert(b, 20, 20);
        grid.remove(a);
        expect(grid['grid'].size).toBe(1);
        expect(Array.from(grid['grid'].values())[0]).toEqual([b]);
    });

    it('removes only the first matching item and deletes empty cell', () => {
        grid.insert(a, 5, 5);
        grid.insert(b, 5, 5);
        grid.remove(a);
        const cell = Array.from(grid['grid'].values())[0];
        expect(cell).toEqual([b]);
        grid.remove(b);
        expect(grid['grid'].size).toBe(0);
    });

    it('does nothing when removing a non-existent item', () => {
        grid.insert(a, 5, 5);
        grid.remove(b);
        expect(grid['grid'].size).toBe(1);
    });

    it('updates item position to new cell', () => {
        grid.insert(a, 1, 1);
        grid.update(a, 50, 50);
        const keys = Array.from(grid['grid'].keys());
        expect(keys.length).toBe(1);
        expect(keys[0]).toBe('5,5');
        const values = Array.from(grid['grid'].values())[0];
        expect(values).toEqual([a]);
    });

    it('returns all items in overlapping cells within query radius', () => {
        grid.insert(a, 0, 0);
        grid.insert(b, 15, 0);
        grid.insert(c, 100, 100);
        const result = grid.query(5, 5, 20);
        expect(result).toContain(a);
        expect(result).toContain(b);
        expect(result).not.toContain(c);
    });

    it('returns empty array when no cells overlap query', () => {
        grid.insert(a, 100, 100);
        const result = grid.query(0, 0, 5);
        expect(result).toEqual([]);
    });

    it('handles negative coordinates and fractional input', () => {
        grid.insert(a, -5.7, -9.1);
        const result = grid.query(-5, -5, 10);
        expect(result).toContain(a);
    });

    it('clears all items and cells', () => {
        grid.insert(a, 0, 0);
        grid.insert(b, 20, 20);
        grid.clear();
        expect(grid['grid'].size).toBe(0);
    });

    it('handles repeated insert of same item (duplicates allowed)', () => {
        grid.insert(a, 0, 0);
        grid.insert(a, 0, 0);
        const cell = Array.from(grid['grid'].values())[0];
        expect(cell.length).toBe(2);
        expect(cell[0]).toBe(a);
        expect(cell[1]).toBe(a);
    });

    it('hashes coordinates correctly', () => {
        expect(grid['hash'](9, 9)).toBe('0,0');
        expect(grid['hash'](10, 10)).toBe('1,1');
        expect(grid['hash'](-1, -1)).toBe('-1,-1');
    });

    it('query loops correctly over multiple cells', () => {
        grid.insert(a, 0, 0);
        grid.insert(b, 15, 15);
        const result = grid.query(5, 5, 15);
        expect(result).toContain(a);
        expect(result).toContain(b);
    });
});
