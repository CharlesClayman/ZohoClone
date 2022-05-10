import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SalesPerson } from 'src/app/_model/salesPerson';
import { ModalService } from 'src/app/_services/modal.service';
import { SalespersonService } from 'src/app/_services/salesperson.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-salesperson-edit',
  templateUrl: './salesperson-edit.component.html',
  styleUrls: ['./salesperson-edit.component.css'],
})
export class SalespersonEditComponent implements OnInit, OnDestroy {
  selectedItemId: any;
  salespersonForm!: FormGroup;
  getSalespersonSubscription: Subscription | undefined;
  updateSalespSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private salespersonService: SalespersonService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private modalService: ModalService
  ) {
    this.salespersonForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getSalesperson(this.selectedItemId);
  }

  getSalesperson(id: Guid) {
    if (id) {
      this.getSalespersonSubscription = this.salespersonService
        .getSalesperson(id)
        .subscribe(
          (response: any) => {
            this.salespersonForm.patchValue({
              name: (response as SalesPerson)?.name,
              email: (response as SalesPerson)?.email,
            });
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  salesPersonFormValid(): boolean {
    if (this.salespersonForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  updateSalesPerson() {
    if (this.salesPersonFormValid()) {
      this.updateSalespSubscription = this.salespersonService
        .updateSalesPerson(this.salespersonForm.value, this.selectedItemId)
        .subscribe(
          (response: any) => {
            this.sharedService.getGetSalespersons();
            this.toastr.success('Salesperson updated');
            this.close();
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  close() {
    this.modalService.closeModal();
  }

  ngOnDestroy(): void {
    this.getSalespersonSubscription?.unsubscribe();
    this.updateSalespSubscription?.unsubscribe();
  }
}
