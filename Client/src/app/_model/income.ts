import { Guid } from 'guid-typescript';

export interface Incomes {
  id: Guid;
  customerId: Guid;
  amountRecieved: Number;
  bankCharges: Number;
  paymentDate: Date;
  paymentNumber: Number;
  paymentMode: string;
  referenceNumber: string;
  taxDeducted: TaxDeducted;
}

export enum TaxDeducted {
  Yes,
  No,
}
