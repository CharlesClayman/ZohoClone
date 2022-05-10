import { Guid } from 'guid-typescript';
import { Tax } from './tax';

export interface Item {
  id: Guid;
  itemType: ItemType;
  name: string;
  unit: string;
  currency: string;
  sellingPrice: number;
  quantity: number;
  description: string;
}

export enum ItemType {
  Goods,
  Service,
}
