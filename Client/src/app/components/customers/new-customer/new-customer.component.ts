import { JsonPipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Customer, CustomerType, Salutation } from 'src/app/_model';
import { CustomersService } from 'src/app/_services/customers.service';
import * as currencies from '../../../_data/currencies.json';
import * as countries from '../../../_data/countries.json';
import { TermsService } from 'src/app/_services/terms.service';
import { Term } from 'src/app/_model/term';
import { AddressType } from 'src/app/_model/address';
import { EnablePortal } from 'src/app/_model/customerOtherDetails';
import { TaxService } from 'src/app/_services/tax.service';
import { Tax } from 'src/app/_model/tax';
import { ToastrService } from 'ngx-toastr';
import { retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NewInvoiceComponent } from '../../invoice/new-invoice/new-invoice.component';
import { SharedService } from 'src/app/_services/shared.service';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/_services/modal.service';
import { NewTaxComponent } from '../../Tax/new-tax/new-tax.component';
import { NewTermComponent } from '../../Term/new-term/new-term.component';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
})
export class NewCustomerComponent implements OnInit, OnDestroy {
  terms: any[] = [];
  termsList: string[] = [];
  taxes: any[] = [];
  salutation: typeof Salutation = Salutation;
  customerType: typeof CustomerType = CustomerType;
  enablePortal: typeof EnablePortal = EnablePortal;
  path!: string;
  customerForm!: FormGroup;
  getTermsSubs: Subscription | undefined;
  getTaxesSubs: Subscription | undefined;
  getTermsSharedSubs: Subscription | undefined;
  getTaxesSharedSubs: Subscription | undefined;
  createCustomerSubs: Subscription | undefined;

  constructor(
    private customersService: CustomersService,
    private termsService: TermsService,
    private modalService: ModalService,
    private taxService: TaxService,
    private toastr: ToastrService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.customerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      companyName: new FormControl(),
      displayName: new FormControl('', [Validators.required]),
      email: new FormControl(),
      website: new FormControl(),
      workPhone: new FormControl(),
      mobile: new FormControl(),
      customerType: new FormControl(CustomerType.Business),
      salutation: new FormControl(this.salutation.Mr),
      otherDetails: new FormGroup({
        currency: new FormControl(this.currencies[0], [Validators.required]),
        taxId: new FormControl(null),
        termsId: new FormControl(null),
        enablePortal: new FormControl(this.enablePortal.No),
        facebook: new FormControl(),
        twitter: new FormControl(),
      }),
      address: new FormArray([
        new FormGroup({
          addressType: new FormControl(),
          attention: new FormControl(),
          countryOrRegion: new FormControl(),
          streetOneAddress: new FormControl(),
          streetTwoAddress: new FormControl(),
          city: new FormControl(),
          state: new FormControl(),
          zipCode: new FormControl(),
          phone: new FormControl(),
          fax: new FormControl(),
        }),
        new FormGroup({
          addressType: new FormControl(),
          attention: new FormControl(),
          countryOrRegion: new FormControl(),
          streetOneAddress: new FormControl(),
          streetTwoAddress: new FormControl(),
          city: new FormControl(),
          state: new FormControl(),
          zipCode: new FormControl(),
          phone: new FormControl(),
          fax: new FormControl(),
        }),
      ]),

      contactPersons: new FormArray([
        new FormGroup({
          salutation: new FormControl(this.salutation.Mr),
          firstName: new FormControl(),
          lastName: new FormControl(),
          email: new FormControl(),
          workPhone: new FormControl(),
          mobile: new FormControl(),
        }),
      ]),
      remarks: new FormControl(),
    });

    this.getTaxesSharedSubs = this.sharedService
      .setGetTaxes()
      .subscribe(() => this.getTaxes());
    this.getTermsSharedSubs = this.sharedService
      .setGetTerms()
      .subscribe(() => this.getTerms());
  }

  ngOnInit(): void {
    this.path = window.location.pathname;
    this.getTerms();
    this.getTaxes();
  }
  get customerFormControl() {
    return this.customerForm.controls;
  }
  openModal(event: any) {
    if (event === 'Configure Tax') {
      this.modalService.openModal(NewTaxComponent);
    } else if (event === 'Configure Term') {
      this.modalService.openModal(NewTermComponent);
    }
  }

  closeModal() {
    this.modalService.closeModal();
  }

  cancelNewCustomer() {
    if (this.path.includes('/customers')) {
      this.router.navigateByUrl('/customers');
    } else {
      this.closeModal();
    }
  }

  get contactPersons(): FormArray {
    return this.customerForm.get('contactPersons') as FormArray;
  }

  addContactPerson() {
    this.contactPersons.push(
      new FormGroup({
        salutation: new FormControl(),
        firstName: new FormControl(),
        lastName: new FormControl(),
        email: new FormControl(),
        workPhone: new FormControl(),
        mobile: new FormControl(),
      })
    );
  }

  removeContactPerson() {
    this.contactPersons.removeAt(this.contactPersons.length - 1);
  }

  get addresses(): FormArray {
    return this.customerForm.get('address') as FormArray;
  }

  addressType(index: number) {
    return (this.customerForm.get('address') as FormArray).at(
      index
    ) as FormGroup;
  }

  addressTypeName(index: number) {
    return index === 0 ? 'Billing Address' : 'Shipping Address';
  }

  public get currencies(): string[] {
    const itemsToRender: string[] = [];

    const list = Object.entries(currencies).forEach((currencyItems) => {
      itemsToRender.push(`${currencyItems[0]} - ${currencyItems[1]}`);
    });

    return itemsToRender;
  }
  public get countries(): string[] {
    const itemsToRender: string[] = [];

    const list = Object.entries(countries).forEach((currencyItems) => {
      itemsToRender.push(`${currencyItems[1]}`);
    });

    return itemsToRender;
  }

  public get enablePortalEnums(): { key: number; value: string }[] {
    const isNotNumber = (value: any) => isNaN(Number(value)) === true;
    const items = Object.keys(this.enablePortal)
      .filter(isNotNumber)
      .map((value, index) => ({ key: index, value }));

    return items;
  }
  enablePortalIdentifier(index: number, enablePortalEnums: any) {
    return enablePortalEnums.label;
  }

  public get salutationEnums(): { key: number; value: string }[] {
    const isNotNumber = (value: any) => isNaN(Number(value)) === true;
    const items = Object.keys(this.salutation)
      .filter(isNotNumber)
      .map((value, index) => ({ key: index, value }));
    return items;
  }

  salutationIdentifier(index: number, salutationEnums: any) {
    return salutationEnums.label;
  }
  getTaxes() {
    this.taxes = [];
    this.getTaxesSubs = this.taxService
      .getTaxes()
      .subscribe((response: any) => {
        console.log(response);
        Object.values(response).map((val: any) => {
          this.taxes.push(val);
        });
      });
  }

  getTerms() {
    this.terms = [];
    this.getTermsSubs = this.termsService
      .getTerms()
      .subscribe((response: any) => {
        Object.values(response).map((values: any) => this.terms.push(values));
      });
  }

  customerFormValid(): boolean {
    if (this.customerForm.valid) {
      return true;
    } else {
      return false;
    }
  }
  createCustomer() {
    const customerFormValue: Customer = this.customerForm.value;
    const billingAddress = customerFormValue.address[0];
    const shippingAddress = customerFormValue.address[1];

    billingAddress.addressType = AddressType.BillingAddress;
    shippingAddress.addressType = AddressType.ShippingAddress;
    if (this.customerForm.valid) {
      this.createCustomerSubs = this.customersService
        .createCustomer(customerFormValue)
        .subscribe(
          (response: any) => {
            if (this.path.includes('customers')) {
              this.toastr.success('New customer created');
              this.router.navigateByUrl('/customers');
            } else {
              this.toastr.success('New customer added');
              this.sharedService.getGetCustomers();
              this.closeModal();
            }
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.getTaxesSubs?.unsubscribe();
    this.getTermsSubs?.unsubscribe();
    this.createCustomerSubs?.unsubscribe();
    this.getTaxesSharedSubs?.unsubscribe();
    this.getTermsSharedSubs?.unsubscribe();
  }
}
