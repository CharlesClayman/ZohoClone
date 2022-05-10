import { Component, OnDestroy, OnInit } from '@angular/core';
import * as currencies from '../../../_data/currencies.json';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/_services/category.service';
import { CustomersService } from 'src/app/_services/customers.service';
import { ExpenseService } from 'src/app/_services/expense.service';
import { TaxService } from 'src/app/_services/tax.service';
import { Tax } from 'src/app/_model/tax';
import { ActivatedRoute, Router } from '@angular/router';
import { Expenses } from 'src/app/_model/expenses';
import { DatePipe } from '@angular/common';
import { NewCategoryComponent } from '../../category/new-category/new-category.component';
import { NewTaxComponent } from '../../Tax/new-tax/new-tax.component';
import { NewCustomerComponent } from '../../customers/new-customer/new-customer.component';
import { ModalService } from 'src/app/_services/modal.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.css'],
})
export class ExpenseEditComponent implements OnInit, OnDestroy {
  expenseId = this.route.snapshot.params['id'];
  singleExpenseForm!: FormGroup;
  taxForm!: FormGroup;
  categoryForm!: FormGroup;
  taxes: any[] = [];
  categories: any[] = [];
  customers: any[] = [];
  getCategoriesSharedSubs: Subscription | undefined;
  getTaxesSharedSubs: Subscription | undefined;
  getCustomersSharedSubs: Subscription | undefined;
  getCategoriesSubs: Subscription | undefined;
  getTaxesSubs: Subscription | undefined;
  getCustomersSubs: Subscription | undefined;
  getExpenseSubs: Subscription | undefined;
  updateExpenseSubs: Subscription | undefined;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private taxService: TaxService,
    private toastr: ToastrService,
    private customerService: CustomersService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.singleExpenseForm = this.formBuilder.group({
      date: this.formBuilder.control('', [Validators.required]),
      categoryId: this.formBuilder.control('', [Validators.required]),
      currency: this.formBuilder.control(this.currencies[0], [
        Validators.required,
      ]),
      amount: this.formBuilder.control('', [Validators.required]),
      referenceNumber: this.formBuilder.control(null),
      notes: this.formBuilder.control(null),
      taxId: this.formBuilder.control(null),
      customerId: this.formBuilder.control(null),
    });

    this.taxForm = this.formBuilder.group({
      taxName: this.formBuilder.control('', [Validators.required]),
      taxRate: this.formBuilder.control(null, [Validators.required]),
      compoundTax: this.formBuilder.control(false),
    });

    this.categoryForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control(''),
    });

    this.getCategoriesSubs = this.sharedService
      .setGetCategories()
      .subscribe(() => this.getCategories());
    this.getCustomersSubs = this.sharedService
      .setGetCustomers()
      .subscribe(() => this.getCustomers());
    this.getTaxesSubs = this.sharedService
      .setGetTaxes()
      .subscribe(() => this.getTaxes());
  }

  public get currencies(): string[] {
    const itemsToRender: string[] = [];

    const list = Object.entries(currencies).forEach((currencyItems) => {
      itemsToRender.push(`${currencyItems[0]} - ${currencyItems[1]}`);
    });

    return itemsToRender;
  }

  ngOnInit(): void {
    this.getExpense();
    this.getCustomers();
    this.getTaxes();
    this.getCategories();
  }

  updateExpense() {
    if (this.expenseFormValid()) {
      this.updateExpenseSubs = this.expenseService
        .updateExpense(this.expenseId, this.singleExpenseForm.value)
        .subscribe(
          (response: any) => {
            this.toastr.success('Expense updated');
            this.router.navigateByUrl('/expenses');
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  getExpense() {
    this.getExpenseSubs = this.expenseService
      .getSingleExpense(this.expenseId)
      .subscribe(
        (response: any) => {
          const expense = response as Expenses;
          const tax = expense.tax;
          if (expense) {
            var expenseDate = new Date(expense?.date.toString());

            this.singleExpenseForm.patchValue({
              date: expenseDate,
              categoryId: expense?.category?.id,
              currency: expense?.currency,
              amount: expense?.amount,
              referenceNumber: expense?.referenceNumber,
              notes: expense?.notes,
              taxId: expense?.tax?.id,
              customerId: expense?.customer?.id,
            });
          }
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  expenseFormValid(): boolean {
    if (this.singleExpenseForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  openModal(event: any) {
    if (event === 'Configure Category') {
      this.modalService.openModal(NewCategoryComponent);
    } else if (event === 'Configure Tax') {
      this.modalService.openModal(NewTaxComponent);
    } else if (event === 'Configure Customer') {
      this.modalService.openModal(NewCustomerComponent).setClass('modal-lg');
    }
  }

  getTaxes() {
    this.taxes = [];
    this.getTaxesSubs = this.taxService.getTaxes().subscribe(
      (response: any) => {
        console.log(response);
        Object.values(response).map((val: any) => {
          this.taxes.push(val);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  getCategories() {
    this.getCategoriesSubs = this.categoryService.getCategories().subscribe(
      (response: any) => {
        Object.values(response).map((val: any) => {
          this.categories.push(val);
        });
        console.log(this.categories);
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  getCustomers() {
    this.getCustomersSubs = this.customerService.getAllCustomers().subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.customers.push(values);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.getCategoriesSharedSubs?.unsubscribe();
    this.getTaxesSharedSubs?.unsubscribe();
    this.getCustomersSharedSubs?.unsubscribe();
    this.getCategoriesSubs?.unsubscribe();
    this.getTaxesSubs?.unsubscribe();
    this.getCustomersSubs?.unsubscribe();
    this.getExpenseSubs?.unsubscribe();
    this.updateExpenseSubs?.unsubscribe();
  }
}
