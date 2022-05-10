import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import * as currencies from '../../../_data/currencies.json';
import * as countries from '../../../_data/countries.json';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Customer, CustomerType, Salutation } from 'src/app/_model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EnablePortal,
  OtherDetails,
} from 'src/app/_model/customerOtherDetails';
import { Term } from 'src/app/_model/term';
import { CustomersService } from 'src/app/_services/customers.service';
import { TermsService } from 'src/app/_services/terms.service';
import { TaxService } from 'src/app/_services/tax.service';
import { ToastrService } from 'ngx-toastr';
import { AddressType } from 'src/app/_model/address';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/_services/modal.service';
import { NewTaxComponent } from '../../Tax/new-tax/new-tax.component';
import { NewTermComponent } from '../../Term/new-term/new-term.component';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
})
export class CustomerEditComponent implements OnInit, OnDestroy {
  customer: Customer = <Customer>{};
  otherDetail: OtherDetails = <OtherDetails>{};
  terms: any[] = [];
  termsList: string[] = [];
  taxes: any[] = [];
  salutation: typeof Salutation = Salutation;
  customerType: typeof CustomerType = CustomerType;
  enablePortal: typeof EnablePortal = EnablePortal;
  customerId: any;
  updateCustomerSubs: Subscription | undefined;
  getCustomerSubs: Subscription | undefined;
  getTaxesSubs: Subscription | undefined;
  getTermsSubs: Subscription | undefined;
  getTermsSharedSubs: Subscription | undefined;
  getTaxesSharedSubs: Subscription | undefined;
  customerForm!: FormGroup;

  constructor(
    private customersService: CustomersService,
    private termsService: TermsService,
    private modalService: ModalService,
    private taxService: TaxService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.customerId = this.route.snapshot.params['id'];

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
    this.getCustomerDetails();
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
        Object.values(response).map((value: any) => this.terms.push(value));
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
    this.getCustomerSubs = this.customersService
      .getSingleCustomer(this.customerId)
      .subscribe(
        (response: any) => {
          this.customer = response as Customer;
          this.otherDetail = this.customer.otherDetails as OtherDetails;
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
              otherDetails: {
                currency: this.otherDetail?.currency,
                taxId: this.otherDetail?.tax?.id,
                termsId: this.otherDetail?.terms?.id,
                enablePortal: this.otherDetail?.enablePortal,
                facebook: this.otherDetail?.facebook,
                twitter: this.otherDetail?.twitter,
              },
              address: this.customer?.address,
              contactPersons: this.customer?.contactPersons,
              remarks: this.customer?.remarks,
            });
          }
        },
        (error: any) => {
          this.toastr.error(error.message);
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
      this.updateCustomerSubs = this.customersService
        .updateCustomer(this.customerId, this.customerForm.value)
        .subscribe(
          (response: any) => {
            this.toastr.success('Update successful');
            this.router.navigateByUrl('/customers');
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.updateCustomerSubs?.unsubscribe();
    this.getCustomerSubs?.unsubscribe();
    this.getTaxesSubs?.unsubscribe();
    this.getTermsSubs?.unsubscribe();
    this.getTermsSharedSubs?.unsubscribe();
    this.getTaxesSharedSubs?.unsubscribe();
  }
}
