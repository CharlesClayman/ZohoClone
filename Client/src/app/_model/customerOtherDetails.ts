import { Guid } from 'guid-typescript';
import { Tax } from './tax';
import { Term } from './term';

export interface OtherDetails {
  id: Guid;
  customerId: Guid;
  currency: string;
  tax: Tax;
  terms: Term;
  enablePortal: EnablePortal;
  facebook: string;
  twitter: string;
}

export enum EnablePortal {
  Yes,
  No,
}
