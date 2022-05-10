import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TaxDeducted } from 'src/app/_model/income';
import { Invoice } from 'src/app/_model/invoice';
import { CustomersService } from 'src/app/_services/customers.service';
import { IncomeService } from 'src/app/_services/income.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import * as currencies from '../../../_data/currencies.json';
import { NewCustomerComponent } from '../../customers/new-customer/new-customer.component';

@Component({
  selector: 'app-new-income',
  templateUrl: './new-income.component.html',
  styleUrls: ['./new-income.component.css'],
})
export class NewIncomeComponent implements OnInit, OnDestroy {
  customers: any[] = [];
  incomeForm!: FormGroup;
  taxed: typeof TaxDeducted = TaxDeducted;
  getCustomersSubs: Subscription | undefined;
  getCustomersSharedSubs: Subscription | undefined;
  getInvoicesSubs: Subscription | undefined;
  createIncomeSubs: Subscription | undefined;

  modesOfPayment = [
    'Cash',
    'Bank Transfer',
    'Check',
    'Credit Card',
    ' Bank Remittance',
    'Debit Card',
    'Promissory Note',
    'Mobile Payment',
  ];

  constructor(
    private customerService: CustomersService,
    private formBuilder: FormBuilder,
    private incomeService: IncomeService,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: ModalService,
    private sharedService: SharedService
  ) {
    this.incomeForm = this.formBuilder.group({
      customerId: this.formBuilder.control('', [Validators.required]),
      currency: this.formBuilder.control('', [Validators.required]),
      amountReceived: this.formBuilder.control('', [Validators.required]),
      bankCharges: this.formBuilder.control(0),
      paymentDate: this.formBuilder.control(new Date(), [Validators.required]),
      paymentNumber: this.formBuilder.control('', [Validators.required]),
      paymentMode: this.formBuilder.control(this.modesOfPayment[0]),
      referenceNumber: this.formBuilder.control(null),
      taxDeducted: this.formBuilder.control(this.taxed.No),
    });

    this.getCustomersSharedSubs = this.sharedService
      .setGetCustomers()
      .subscribe(() => this.getCustomers());
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  public get currencies(): string[] {
    const itemsToRender: string[] = [];

    const list = Object.entries(currencies).forEach((currencyItems) => {
      itemsToRender.push(`${currencyItems[0]} - ${currencyItems[1]}`);
    });

    return itemsToRender;
  }

  openModal(event: any) {
    if (event === 'Configure Customer')
      this.modalService.openModal(NewCustomerComponent).setClass('modal-lg');
  }

  getCustomers() {
    this.customers = [];
    this.getCustomersSubs = this.customerService.getAllCustomers().subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.customers.push(values);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  incomeFormIsValid(): boolean {
    if (this.incomeForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  createIncome() {
    if (this.incomeFormIsValid()) {
      this.createIncomeSubs = this.incomeService
        .createIncome(this.incomeForm.value)
        .subscribe(
          (response) => {
            this.toastr.success('New income created');
            this.router.navigateByUrl('/incomes');
          },
          (error) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.getCustomersSubs?.unsubscribe();
    this.getInvoicesSubs?.unsubscribe();
    this.createIncomeSubs?.unsubscribe();
    this.getCustomersSharedSubs?.unsubscribe();
  }
}
