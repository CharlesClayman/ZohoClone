import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDetailsComponent } from './components/customers/customer-details/customer-details.component';
import { CustomerEditComponent } from './components/customers/customer-edit/customer-edit.component';
import { CustomerIndexComponent } from './components/customers/customer-index/customer-index.component';
import { NewCustomerComponent } from './components/customers/new-customer/new-customer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NewItemComponent } from './components/items/new-item/new-item.component';
import { AuthGuard } from './_guards/auth.guard';
import { ItemsIndexComponent } from './components/items/items-index/items-index.component';
import { ItemEditComponent } from './components/items/item-edit/item-edit.component';
import { ExpenseIndexComponent } from './components/expenses/expense-index/expense-index.component';
import { NewExpenseComponent } from './components/expenses/new-expense/new-expense.component';
import { ExpenseEditComponent } from './components/expenses/expense-edit/expense-edit.component';
import { IncomeIndexComponent } from './components/income/income-index/income-index.component';
import { NewIncomeComponent } from './components/income/new-income/new-income.component';
import { IncomeEditComponent } from './components/income/income-edit/income-edit.component';
import { InvoiceIndexComponent } from './components/invoice/invoice-index/invoice-index.component';
import { NewInvoiceComponent } from './components/invoice/new-invoice/new-invoice.component';
import { InvoiceEditComponent } from './components/invoice/invoice-edit/invoice-edit.component';
import { InvoicePreviewComponent } from './components/invoice/invoice-preview/invoice-preview.component';
import { NewTaxComponent } from './components/Tax/new-tax/new-tax.component';
import { TaxIndexComponent } from './components/Tax/tax-index/tax-index.component';
import { TaxEditComponent } from './components/Tax/tax-edit/tax-edit.component';
import { TermIndexComponent } from './components/Term/term-index/term-index.component';
import { NewTermComponent } from './components/Term/new-term/new-term.component';
import { TermEditComponent } from './components/Term/term-edit/term-edit.component';
import { SalespersonIndexComponent } from './components/Salesperson/salesperson-index/salesperson-index.component';
import { NewSalespersonComponent } from './components/Salesperson/new-salesperson/new-salesperson.component';
import { SalespersonEditComponent } from './components/Salesperson/salesperson-edit/salesperson-edit.component';
import { CategoryIndexComponent } from './components/category/category-index/category-index.component';
import { NewCategoryComponent } from './components/category/new-category/new-category.component';
import { CategoryEditComponent } from './components/category/category-edit/category-edit.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'customers/new', component: NewCustomerComponent },
      { path: 'customers', component: CustomerIndexComponent },
      { path: 'customers/:id', component: CustomerDetailsComponent },
      { path: 'customers/:id/edit', component: CustomerEditComponent },
      { path: 'items', component: ItemsIndexComponent },
      { path: 'items/new', component: NewItemComponent },
      { path: 'items/:id/edit', component: ItemEditComponent },
      { path: 'expenses', component: ExpenseIndexComponent },
      { path: 'expenses/new', component: NewExpenseComponent },
      { path: 'expenses/:id/edit', component: ExpenseEditComponent },
      { path: 'incomes', component: IncomeIndexComponent },
      { path: 'incomes/new', component: NewIncomeComponent },
      { path: 'incomes/:id/edit', component: IncomeEditComponent },
      { path: 'invoices', component: InvoiceIndexComponent },
      { path: 'invoices/new', component: NewInvoiceComponent },
      { path: 'invoices/:id/edit', component: InvoiceEditComponent },
      { path: 'invoices/:id/preview', component: InvoicePreviewComponent },
      { path: 'taxes', component: TaxIndexComponent },
      { path: 'terms', component: TermIndexComponent },
      { path: 'salespersons', component: SalespersonIndexComponent },
      { path: 'categories', component: CategoryIndexComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
