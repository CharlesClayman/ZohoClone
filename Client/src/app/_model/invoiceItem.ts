import { Guid } from 'guid-typescript';
import { Item } from './item';
import { Tax } from './tax';

export interface InvoiceItem {
  itemId: Guid;
  item: Item;
  quantity: number;
  description: string;
  tax: Tax;
}
