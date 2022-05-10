import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/_model';
import { CustomersService } from 'src/app/_services/customers.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalService } from 'src/app/_services/modal.service';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-customer-index',
  templateUrl: './customer-index.component.html',
  styleUrls: ['./customer-index.component.css'],
})
export class CustomerIndexComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  selectedItem: Customer = <Customer>{};
  getCustomersSubs: Subscription | undefined;
  deleteCustomerSubs: Subscription | undefined;
  searchEventSubs: Subscription | undefined;

  constructor(
    private customerService: CustomersService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getAllCustomers(value) : this.getAllCustomers()
    );
  }

  getAllCustomers(query: string | null = null) {
    this.customers = [];
    this.getCustomersSubs = this.customerService
      .getAllCustomers(query)
      .subscribe(
        (response: any) => {
          Object.values(response as Customer).map((values) => {
            this.customers.push(values);
          });
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  deleteCustomer() {
    this.deleteCustomerSubs = this.customerService
      .deleteCustomer(this.selectedItem.id)
      .subscribe(
        (response: any) => {
          this.toastr.success('Customer deleted');
          this.customers = [];
          this.getAllCustomers();
          this.closeModal();
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  openModal(item: any, template: TemplateRef<any>) {
    this.selectedItem = item;
    this.modalService.openModal(template).setClass('modal-dialog-centered');
  }

  closeModal() {
    this.modalService.closeModal();
  }

  ngOnDestroy(): void {
    this.getCustomersSubs?.unsubscribe();
    this.deleteCustomerSubs?.unsubscribe();
    this.searchEventSubs?.unsubscribe();
  }
}
