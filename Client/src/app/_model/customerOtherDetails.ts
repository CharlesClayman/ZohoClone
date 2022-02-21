import { Guid } from 'guid-typescript';

export interface OtherDetails {
  id: Guid;
  customerId: Guid;
  currency: string;
  taxRate: number;
  paymentTerms: string;
  enablePortal: EnablePortal;
  facebook: string;
  twitter: string;
}

export enum EnablePortal {
  Yes,
  No,
}
