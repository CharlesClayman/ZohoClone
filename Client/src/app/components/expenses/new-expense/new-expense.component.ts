import { Component, OnDestroy, OnInit } from '@angular/core';
import * as currencies from '../../../_data/currencies.json';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxService } from 'src/app/_services/tax.service';
import { ToastrService } from 'ngx-toastr';
import { CustomersService } from 'src/app/_services/customers.service';
import { ExpenseService } from 'src/app/_services/expense.service';
import { CategoryService } from 'src/app/_services/category.service';
import { Router } from '@angular/router';
import { NewCategoryComponent } from '../../category/new-category/new-category.component';
import { ModalService } from 'src/app/_services/modal.service';
import { NewTaxComponent } from '../../Tax/new-tax/new-tax.component';
import { SharedService } from 'src/app/_services/shared.service';
import { Subscription } from 'rxjs';
import { NewCustomerComponent } from '../../customers/new-customer/new-customer.component';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.css'],
})
export class NewExpenseComponent implements OnInit, OnDestroy {
  taxes: any[] = [];
  categories: any[] = [];
  customers: any[] = [];
  singleExpenseForm!: FormGroup;
  bulkExpenseForm!: FormArray;
  BEForm!: FormGroup;
  taxForm!: FormGroup;
  categoryForm!: FormGroup;
  getCategoriesSharedSubs: Subscription | undefined;
  getTaxesSharedSubs: Subscription | undefined;
  getCustomersSharedSubs: Subscription | undefined;
  getCategoriesSubs: Subscription | undefined;
  getTaxesSubs: Subscription | undefined;
  getCustomersSubs: Subscription | undefined;
  createBulkExpenseSubs: Subscription | undefined;
  createExpenseSubs: Subscription | undefined;

  constructor(
    private sharedService: SharedService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private taxService: TaxService,
    private toastr: ToastrService,
    private customerService: CustomersService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.singleExpenseForm = this.formBuilder.group({
      date: this.formBuilder.control(new Date(), [Validators.required]),
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

    this.BEForm = this.formBuilder.group({
      expenseForm: this.formBuilder.array([
        this.formBuilder.group({
          date: this.formBuilder.control(new Date(), [Validators.required]),
          categoryId: this.formBuilder.control('', [Validators.required]),
          currency: this.formBuilder.control(this.currencies[0], [
            Validators.required,
          ]),
          amount: this.formBuilder.control('', [Validators.required]),
          referenceNumber: this.formBuilder.control(null),
          notes: this.formBuilder.control(null),
          taxId: this.formBuilder.control(null),
          customerId: this.formBuilder.control(null),
        }),
      ]),
    });

    this.getCategoriesSharedSubs = this.sharedService
      .setGetCategories()
      .subscribe(() => this.getCategories());
    this.getCustomersSharedSubs = this.sharedService
      .setGetCustomers()
      .subscribe(() => this.getCustomers());
    this.getTaxesSharedSubs = this.sharedService
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

  get expenses() {
    return this.BEForm.get('expenseForm') as FormArray;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getTaxes();
    this.getCustomers();
  }

  addExpense() {
    this.expenses.push(this.singleExpenseForm);
  }

  CreateBulkExpense() {
    var listOfExpenses = this.BEForm.get('expenseForm')?.value;
    if (this.bulkExpenseFormValid()) {
      this.createBulkExpenseSubs = this.expenseService
        .createBulkExpense(listOfExpenses)
        .subscribe(
          (response: any) => {
            this.toastr.success('Expenses created');
            this.router.navigateByUrl('/expenses');
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  bulkExpenseFormValid(): boolean {
    var validForm = this.BEForm.get('expenseForm')?.valid;
    if (validForm) {
      return true;
    } else {
      return false;
    }
  }

  createSingleExpense() {
    if (this.expenseFormValid()) {
      this.createExpenseSubs = this.expenseService
        .createSingleExpense(this.singleExpenseForm.value)
        .subscribe(
          (response: any) => {
            this.toastr.success('Expense created');
            this.router.navigateByUrl('/expenses');
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  expenseFormValid(): boolean {
    if (this.singleExpenseForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  getCategories() {
    this.categories = [];
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

  getCustomers() {
    this.customers = [];
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

  openModal(event: any) {
    if (event === 'Configure Category') {
      this.modalService.openModal(NewCategoryComponent);
    } else if (event === 'Configure Tax') {
      this.modalService.openModal(NewTaxComponent);
    } else if (event === 'Configure Customer') {
      this.modalService.openModal(NewCustomerComponent).setClass('modal-lg');
    }
  }

  ngOnDestroy(): void {
    this.getCategoriesSharedSubs?.unsubscribe();
    this.getTaxesSharedSubs?.unsubscribe();
    this.getCustomersSharedSubs?.unsubscribe();
    this.getCategoriesSubs?.unsubscribe();
    this.getTaxesSubs?.unsubscribe();
    this.getCustomersSubs?.unsubscribe();
    this.createBulkExpenseSubs?.unsubscribe();
    this.createExpenseSubs?.unsubscribe();
  }
}
