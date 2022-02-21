import { Guid } from 'guid-typescript';
import { Salutation } from '.';

export interface ContactPersons {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  email: string;
  workPhone: string;
  mobile: string;
}
