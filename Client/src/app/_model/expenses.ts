import { Guid } from 'guid-typescript';

export interface Expenses {
  id: Guid;
  dateTime: Date;
  categoryId: Guid;
  amount: Number;
  tax: Number;
  referenceNumber: Number;
  notes: string;
  customerId: Guid;
}
