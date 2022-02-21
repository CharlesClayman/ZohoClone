import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Customer, ContactPersons, Salutation } from 'src/app/_model';
import { Address } from 'src/app/_model/address';
import { OtherDetails } from 'src/app/_model/customerOtherDetails';
import { CustomersService } from 'src/app/_services/customers.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerDetailsComponent implements OnInit {
  customer: any;
  otherDetails: OtherDetails = <OtherDetails>{};
  billingAddress: Address = <Address>{};
  shippingAddress: Address = <Address>{ addressType: 1 };
  contactPersons: ContactPersons[] = [];
  salutation: typeof Salutation = Salutation;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomersService
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
            console.log('Other Details');
            console.log(this.otherDetails);

            this.billingAddress = this.customer?.address[0];
            this.shippingAddress = this.customer?.address[1];
            this.contactPersons = this.customer?.contactPersons;
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
}
