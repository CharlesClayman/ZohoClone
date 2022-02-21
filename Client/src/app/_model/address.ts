import { Guid } from 'guid-typescript';
import { Customer } from './customer';

export interface Address {
  id: Guid;
  customerId: Guid;
  addressType: AddressType;
  customer: Customer;
  attention: string;
  countryOrRegion: string;
  streetOneAddress: string;
  streetTwoAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax: string;
}

export enum AddressType {
  BillingAddress,
  ShippingAddress,
}
