import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { Income, TaxDeducted } from 'src/app/_model/income';
import { CustomersService } from 'src/app/_services/customers.service';
import { IncomeService } from 'src/app/_services/income.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import * as currencies from '../../../_data/currencies.json';
import { NewCustomerComponent } from '../../customers/new-customer/new-customer.component';

@Component({
  selector: 'app-income-edit',
  templateUrl: './income-edit.component.html',
  styleUrls: ['./income-edit.component.css'],
})
export class IncomeEditComponent implements OnInit, OnDestroy {
  incomeId = this.route.snapshot.params['id'];
  taxed: typeof TaxDeducted = TaxDeducted;
  customers: any[] = [];
  incomeForm!: FormGroup;
  getCustomersSubs: Subscription | undefined;
  getCustomersSharedSubs: Subscription | undefined;
  getIncomeSubs: Subscription | undefined;
  updateIncomeSubs: Subscription | undefined;

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
    private formBuilder: FormBuilder,
    private incomeService: IncomeService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private customerService: CustomersService,
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
      taxDeducted: this.formBuilder.control(null),
    });

    this.getCustomersSharedSubs = this.sharedService
      .setGetCustomers()
      .subscribe(() => this.getCustomers());
  }

  ngOnInit(): void {
    this.getIncome();
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
    this.getCustomersSubs = this.customerService.getAllCustomers().subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.customers.push(values);
        });
        console.log(this.customers);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getIncome() {
    this.getIncomeSubs = this.incomeService
      .getSingleIncome(this.incomeId)
      .subscribe(
        (response: any) => {
          const income = response as Income;
          if (income) {
            var incomeDate = new Date(income?.paymentDate.toString());

            this.incomeForm.patchValue({
              customerId: income?.customer?.id,
              currency: income?.currency,
              amountReceived: income?.amountReceived,
              bankCharges: income?.bankCharges,
              paymentDate: incomeDate,
              paymentNumber: income?.paymentNumber,
              paymentMode: income?.paymentMode,
              referenceNumber: income?.referenceNumber,
              taxDeducted: income?.taxDeducted,
            });
          }
        },
        (error: any) => {
          this.toastr.error(error.message);
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

  updateIncome() {
    if (this.incomeFormIsValid()) {
      this.updateIncomeSubs = this.incomeService
        .updateIncome(this.incomeId, this.incomeForm.value)
        .subscribe(
          (response: any) => {
            this.toastr.success('Income updated');
            this.router.navigateByUrl('/incomes');
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.getCustomersSubs?.unsubscribe();
    this.getCustomersSharedSubs?.unsubscribe();
    this.getIncomeSubs?.unsubscribe();
    this.updateIncomeSubs?.unsubscribe();
  }
}
