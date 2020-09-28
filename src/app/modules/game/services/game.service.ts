import { Injectable } from '@angular/core';
import {Item} from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private size = 4;
  private availableCells: number[] = [];
  private  get emptyCells(): number[] {
    const notEmptyCells = this.notEmptyCells;
    return this.availableCells.filter(position => !notEmptyCells.includes(position));
  }
  private get notEmptyCells(): number[] {
    return this.items.map(item => item.row * 10 + item.col);
  }
  scores = 0;
  bestScore = 0;
  theEnd = false;
  items: Item[] = [];

  constructor() {
    this.generateAvailableCells();
    this.generateItems();
  }
  resetGame(): void {
    this.scores = 0;
    this.items = [];
    this.theEnd = false;
    this.generateItems();
  }

  up(): void {
    this.move('col', 'row', false);
  }
  down(): void {
    this.move('col', 'row', true);
  }
  right(): void {
    this.move('row', 'col', true);
  }
  left(): void {
    this.move('row', 'col', false);
  }

  private move(
    dimX: 'col' | 'row' = 'row',
    dimY: 'col' | 'row' = 'col',
    reverse = false
  ): void {
    if (this.theEnd || !this.canMove(dimX, false, reverse)) {
      return;
    }
    this.clearDeletedItems();
    const mergedItems: Item[] = [];

    for (let x = 1; x <= this.size; x++) {
      const  items: Item[] = this.items
        .filter(i => i[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);
      if (reverse) {
        items.reverse();
      }
      let y = reverse ? this.size : 1;
      let merged = false;
      let prevItem: Item = null;
      for (const item of items) {
        if (prevItem) {
          if (merged) {
            merged = false;
          } else if (item.value === prevItem.value) {
            reverse ? y++ : y--;
            prevItem.isOnDelete = true;
            item.isOnDelete = true;
            mergedItems.push(({
              value: item.value * 2,
              [dimY]: y,
              [dimX]: x
            } as any));
            merged = true;
          }
        }
        item[dimY] = y;
        reverse ? y-- : y++;
        prevItem = item;
      }
    }
    this.scores += mergedItems.reduce((acc, item) => acc + item.value, 0);
    this.isBestScore();
    this.items = [...this.items, ...mergedItems];
    this.generateItems();
    this.theEnd = this.isTheEnd();
  }
  private clearDeletedItems(): void {
    this.items = this.items.filter(i => !i.isOnDelete);
  }

  private generateItems(length: number = 2): void {
    const  positions: number[] = this.emptyCells
      .sort(() => Math.random() - 0.5)
      .slice(0, length);
    this.items = [
      ...this.items,
         ...positions.map<Item>(position => ({
        value: 2,
        col: position % 10,
        row: (position - position % 10) / 10
      }))
    ];
  }
  private isTheEnd(): boolean {
    return !this.canMove('row') && !this.canMove('col');
  }
  private canMove(dimX: 'row' | 'col', skipDir = true, forward = false): boolean {
    const dimY = dimX === 'row' ? 'col' : 'row';
    for (let x = 1; x <= this.size; x++) {
      const items = this.items
        .filter(i => !i.isOnDelete && i[dimX] === x)
        .sort((a, b) => a[dimY] - b[dimY]);
      if (items.length !== this.size) {
        if (skipDir) {
          return true;
        }
        const length = items.length;
        const positions: number[] = [];
        const start = forward ? this.size - length + 1 : 1;
        const end = forward ? this.size : length;
        for (let i = start; i <= end; i++) {
            positions.push(i);
        }
        if (items.find(i => positions.includes(i[dimY]))) {
          return true;
        }
      }
      let prevValue = 0;
      for (const item of items) {
        if (item.value === prevValue) {
          return true;
        }
        prevValue = item.value;
      }
    }
    return false;
  }
  private generateAvailableCells(): void {
    for (let row = 1; row <= this.size; row++) {
      for (let col = 1; col <= this.size; col++) {
        this.availableCells.push(row * 10 + col);
      }
    }
  }
  private isBestScore(): void {
    this.bestScore = this.bestScore > this.scores ? this.bestScore : this.scores;
  }
}
