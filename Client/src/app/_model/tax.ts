import { Guid } from 'guid-typescript';

export interface Tax {
  id: Guid;
  taxName: string;
  taxRate: number;
  compoundTax: boolean;
}
