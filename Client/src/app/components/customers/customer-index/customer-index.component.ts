import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/_model';
import { CustomersService } from 'src/app/_services/customers.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-customer-index',
  templateUrl: './customer-index.component.html',
  styleUrls: ['./customer-index.component.css'],
})
export class CustomerIndexComponent implements OnInit {
  customers: any[] = [];
  modalRef?: BsModalRef;
  constructor(
    private customerService: CustomersService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.customers.push(values);
        });
        console.log('Customers here');
        console.log(this.customers);
      },
      (error: any) => {
        this.toastr.error(error.message);
        console.log(error);
      }
    );
  }

  openTaxModal(event: any, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    console.log(event);
  }

  closeModal() {
    this.modalRef?.hide();
  }
}
