import { Component, OnInit, TemplateRef } from '@angular/core';
import * as currencies from '../../../_data/currencies.json';
import * as countries from '../../../_data/countries.json';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Customer, CustomerType, Salutation } from 'src/app/_model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnablePortal } from 'src/app/_model/customerOtherDetails';
import { Terms } from 'src/app/_model/terms';
import { CustomersService } from 'src/app/_services/customers.service';
import { TermsService } from 'src/app/_services/terms.service';
import { TaxService } from 'src/app/_services/tax.service';
import { ToastrService } from 'ngx-toastr';
import { AddressType } from 'src/app/_model/address';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
})
export class CustomerEditComponent implements OnInit {
  customer: Customer = <Customer>{};
  modalRef?: BsModalRef;
  terms: Terms[] = [];
  termsList: string[] = [];
  taxes: any[] = [];
  salutation: typeof Salutation = Salutation;
  customerType: typeof CustomerType = CustomerType;
  enablePortal: typeof EnablePortal = EnablePortal;

  customerForm = new FormGroup({
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
      taxRate: new FormControl(0),
      website: new FormControl(),
      paymentTerms: new FormControl(''),
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

  taxForm = new FormGroup({
    taxName: new FormControl('', [Validators.required]),
    taxRate: new FormControl(null, [Validators.required]),
    compoundTax: new FormControl(false),
  });

  termForm = new FormGroup({
    termName: new FormControl('', [Validators.required]),
    termDays: new FormControl(null, [Validators.required]),
    customized: new FormControl(true),
  });

  constructor(
    private customersService: CustomersService,
    private termsService: TermsService,
    private modalService: BsModalService,
    private taxService: TaxService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCustomerDetails();
    this.loadTerms();
    this.loadTaxes();
  }
  get customerFormControl() {
    return this.customerForm.controls;
  }
  openTaxModal(event: any, template: TemplateRef<any>) {
    if (event === 'configure') {
      this.modalRef = this.modalService.show(template);
    }
  }

  taxFormValid(): boolean {
    if (this.taxForm.valid) {
      return true;
    } else {
      return false;
    }
  }
  createTax() {
    const taxFormValue: Terms = this.taxForm.value;

    if (this.taxForm.valid) {
      this.taxService.createTax(taxFormValue).subscribe(
        (response) => {
          this.closeModal();
          this.loadTaxes();
          console.log(response);
        },
        (error) => {
          this.toastr.error(error.message);
          console.log(error);
        }
      );
    }
  }

  openTermModal(event: any, template: TemplateRef<any>) {
    if (event === 'configure') {
      this.modalRef = this.modalService.show(template);
    }
  }
  createTerm() {
    const termFormValue: Terms = this.termForm.value;

    if (this.termForm.valid) {
      this.termsService.createTerm(termFormValue).subscribe(
        (response) => {
          this.closeModal();
          this.loadTerms();
          console.log(response);
        },
        (error) => {
          this.toastr.error(error.message);
          console.log(error);
        }
      );
    }
  }

  termFormValid(): boolean {
    if (this.termForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  closeModal() {
    this.modalRef?.hide();
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
  loadTaxes() {
    this.taxService.getTaxes().subscribe((response: any) => {
      console.log(response);
      Object.values(response).map((val: any) => {
        this.taxes.push(val);
      });
    });
  }

  loadTerms() {
    this.termsService.getTerms().subscribe((response: any) => {
      this.terms = response;
      Object.values(this.terms).map((values) =>
        this.termsList.push(values.termName)
      );
      return this.termsList;
    });
  }

  customerFormValid(): boolean {
    if (this.customerForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  getCustomerDetails() {
    return this.customersService
      .getSingleCustomer(this.route.snapshot.params['id'])
      .subscribe(
        (response: any) => {
          this.customer = response as Customer;
          if (this.customer) {
            this.customerForm.patchValue({
              customerType: this.customer?.customerType,
              salutation: this.customer?.salutation,
              firstName: this.customer?.firstName,
              lastName: this.customer?.lastName,
              displayName: this.customer?.displayName,
              companyName: this.customer?.companyName,
              email: this.customer?.email,
              workPhone: this.customer?.workPhone,
              mobile: this.customer?.mobilePhone,
              website: this.customer?.website,
              otherDetails: this.customer?.otherDetails,
              address: this.customer?.address,
              contactPersons: this.customer?.contactPersons,
              remarks: this.customer?.remarks,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  updateCustomer() {
    const customerFormValue: Customer = this.customerForm.value;
    const billingAddress = customerFormValue.address[0];
    const shippingAddress = customerFormValue.address[1];

    billingAddress.addressType = AddressType.BillingAddress;
    shippingAddress.addressType = AddressType.ShippingAddress;
    if (this.customerForm.valid) {
      console.log('valid');
      const customerId = this.route.snapshot.params['id'];
      this.customersService
        .updateCustomer(customerId, customerFormValue)
        .subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            this.toastr.error(error.message);
            console.error(error);
          }
        );
    }
  }
}
