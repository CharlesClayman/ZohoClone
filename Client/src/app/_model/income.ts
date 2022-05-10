import { Guid } from 'guid-typescript';
import { Customer } from './customer';

export interface Income {
  id: Guid;
  customer: Customer;
  currency: string;
  amountReceived: Number;
  bankCharges: Number;
  paymentDate: Date;
  paymentNumber: string;
  paymentMode: string;
  referenceNumber: string;
  taxDeducted: TaxDeducted;
}

export enum TaxDeducted {
  Yes,
  No,
}
