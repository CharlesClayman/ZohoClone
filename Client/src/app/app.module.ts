import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SidebarModule } from 'ng-sidebar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';

import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ItemsComponent } from './components/items/items.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { IncomeComponent } from './components/income/income.component';
import { NewCustomerComponent } from './components/customers/new-customer/new-customer.component';
import { CustomerIndexComponent } from './components/customers/customer-index/customer-index.component';
import { CustomerDetailsComponent } from './components/customers/customer-details/customer-details.component';
import { CustomerEditComponent } from './components/customers/customer-edit/customer-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ItemsComponent,
    InvoicesComponent,
    ExpensesComponent,
    IncomeComponent,
    NewCustomerComponent,
    CustomerIndexComponent,
    CustomerDetailsComponent,
    CustomerEditComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
