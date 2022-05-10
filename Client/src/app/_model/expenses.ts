import { Guid } from 'guid-typescript';
import { Category } from './category';
import { Customer } from './customer';
import { Tax } from './tax';

export interface Expenses {
  id: Guid;
  date: Date;
  category: Category;
  currency: string;
  amount: Number;
  tax: Tax;
  referenceNumber: string;
  notes: string;
  customer: Customer;
}
