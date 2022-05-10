import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SidebarModule } from 'ng-sidebar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NewCustomerComponent } from './components/customers/new-customer/new-customer.component';
import { CustomerIndexComponent } from './components/customers/customer-index/customer-index.component';
import { CustomerDetailsComponent } from './components/customers/customer-details/customer-details.component';
import { CustomerEditComponent } from './components/customers/customer-edit/customer-edit.component';
import { ItemsIndexComponent } from './components/items/items-index/items-index.component';
import { NewItemComponent } from './components/items/new-item/new-item.component';
import { ItemEditComponent } from './components/items/item-edit/item-edit.component';
import { ExpenseIndexComponent } from './components/expenses/expense-index/expense-index.component';
import { ExpenseEditComponent } from './components/expenses/expense-edit/expense-edit.component';
import { NewExpenseComponent } from './components/expenses/new-expense/new-expense.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NewIncomeComponent } from './components/income/new-income/new-income.component';
import { IncomeIndexComponent } from './components/income/income-index/income-index.component';
import { IncomeEditComponent } from './components/income/income-edit/income-edit.component';
import { InvoiceIndexComponent } from './components/invoice/invoice-index/invoice-index.component';
import { InvoiceEditComponent } from './components/invoice/invoice-edit/invoice-edit.component';
import { NewInvoiceComponent } from './components/invoice/new-invoice/new-invoice.component';
import { InvoiceItemComponent } from './components/invoice-item/invoice-item.component';
import { NgxPrintModule } from 'ngx-print';
import { InvoicePreviewComponent } from './components/invoice/invoice-preview/invoice-preview.component';
import { JwtInterceptor } from './_interceptor/jwt.interceptor';
import { NewTaxComponent } from './components/Tax/new-tax/new-tax.component';
import { TaxEditComponent } from './components/Tax/tax-edit/tax-edit.component';
import { TaxIndexComponent } from './components/Tax/tax-index/tax-index.component';
import { NewTermComponent } from './components/Term/new-term/new-term.component';
import { TermEditComponent } from './components/Term/term-edit/term-edit.component';
import { TermIndexComponent } from './components/Term/term-index/term-index.component';
import { SalespersonIndexComponent } from './components/Salesperson/salesperson-index/salesperson-index.component';
import { SalespersonEditComponent } from './components/Salesperson/salesperson-edit/salesperson-edit.component';
import { NewSalespersonComponent } from './components/Salesperson/new-salesperson/new-salesperson.component';
import { NewCategoryComponent } from './components/category/new-category/new-category.component';
import { CategoryIndexComponent } from './components/category/category-index/category-index.component';
import { CategoryEditComponent } from './components/category/category-edit/category-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NewCustomerComponent,
    CustomerIndexComponent,
    CustomerDetailsComponent,
    CustomerEditComponent,
    ItemsIndexComponent,
    NewItemComponent,
    ItemEditComponent,
    ExpenseIndexComponent,
    ExpenseEditComponent,
    NewExpenseComponent,
    IncomeIndexComponent,
    NewIncomeComponent,
    IncomeEditComponent,
    InvoiceIndexComponent,
    InvoiceEditComponent,
    NewInvoiceComponent,
    InvoiceItemComponent,
    InvoicePreviewComponent,
    NewTaxComponent,
    TaxEditComponent,
    TaxIndexComponent,
    NewTermComponent,
    TermEditComponent,
    TermIndexComponent,
    SalespersonIndexComponent,
    SalespersonEditComponent,
    NewSalespersonComponent,
    NewCategoryComponent,
    CategoryIndexComponent,
    CategoryEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    SidebarModule.forRoot(),
    TabsModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxPrintModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    BsModalRef,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
