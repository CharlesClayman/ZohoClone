import { Guid } from 'guid-typescript';
import { Customer } from './customer';
import { Income } from './income';
import { InvoiceItem } from './invoiceItem';
import { SalesPerson } from './salesPerson';
import { Tax } from './tax';
import { Term } from './term';

export interface Invoice {
  id: Guid;
  customer: Customer;
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: Date;
  terms: Term;
  dueDate: Date;
  salesPerson: SalesPerson;
  subject: string;
  currency: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  adjustments: number;
  customerNotes: string;
  termsAndConditions: string;
  attachFile: string;
  income: Income;
  paid: Boolean;
  total: number;
}
