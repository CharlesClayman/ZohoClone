import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDetailsComponent } from './components/customers/customer-details/customer-details.component';
import { CustomerEditComponent } from './components/customers/customer-edit/customer-edit.component';
import { CustomerIndexComponent } from './components/customers/customer-index/customer-index.component';
import { NewCustomerComponent } from './components/customers/new-customer/new-customer.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { HomeComponent } from './components/home/home.component';
import { IncomeComponent } from './components/income/income.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { ItemsComponent } from './components/items/items.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'incomes', component: IncomeComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'customers/new', component: NewCustomerComponent },
      { path: 'customers', component: CustomerIndexComponent },
      { path: 'customers/:id', component: CustomerDetailsComponent },
      { path: 'customers/:id/edit', component: CustomerEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
