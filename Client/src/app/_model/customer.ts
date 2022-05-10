import { Guid } from 'guid-typescript';
import { Address } from './address';

import { ContactPersons } from './contactPerson';
import { OtherDetails } from './customerOtherDetails';
import { Expenses } from './expenses';

import { Income } from './income';

export interface Customer {
  id: Guid;
  customerType: CustomerType;
  salutation: Salutation;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  email: string;
  workPhone: string;
  mobilePhone: string;
  website: string;
  remarks: string;
  otherDetails: OtherDetails;
  address: Address[];
  contactPersons: ContactPersons[];
  expenses: Expenses[];
  incomes: Income[];
}

export enum CustomerType {
  Business,
  Individual,
}
export enum Salutation {
  Mr,
  Mrs,
  Ms,
  Miss,
  Dr,
}
