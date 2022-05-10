import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Customer, ContactPersons, Salutation } from 'src/app/_model';
import { Address } from 'src/app/_model/address';
import { OtherDetails } from 'src/app/_model/customerOtherDetails';
import { Tax } from 'src/app/_model/tax';
import { Term } from 'src/app/_model/term';
import { CustomersService } from 'src/app/_services/customers.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  customer: any;
  otherDetails: OtherDetails = <OtherDetails>{};
  tax: Tax = <Tax>{};
  term: Term = <Term>{};
  billingAddress: Address = <Address>{};
  shippingAddress: Address = <Address>{ addressType: 1 };
  contactPersons: ContactPersons[] = [];
  salutation: typeof Salutation = Salutation;
  getCustomerSubs: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    return this.customerService
      .getSingleCustomer(this.route.snapshot.params['id'])
      .subscribe(
        (response: any) => {
          this.customer = response as Customer;
          if (this.customer) {
            console.log(this.customer);
            this.otherDetails = this.customer?.otherDetails;
            this.billingAddress = this.customer?.address[0];
            this.shippingAddress = this.customer?.address[1];
            this.contactPersons = this.customer?.contactPersons;
          }
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  ngOnDestroy(): void {
    this.getCustomerSubs?.unsubscribe();
  }
}
