import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Tax } from 'src/app/_model/tax';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import { TaxService } from 'src/app/_services/tax.service';

@Component({
  selector: 'app-tax-edit',
  templateUrl: './tax-edit.component.html',
  styleUrls: ['./tax-edit.component.css'],
})
export class TaxEditComponent implements OnInit, OnDestroy {
  selectedItemId: any;
  taxForm!: FormGroup;
  getTaxSubscription: Subscription | undefined;
  taxUpdateSubscription: Subscription | undefined;

  constructor(
    private taxService: TaxService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private sharedService: SharedService
  ) {
    this.taxForm = new FormGroup({
      taxName: new FormControl('', [Validators.required]),
      taxRate: new FormControl(null, [Validators.required]),
      compoundTax: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.getTax(this.selectedItemId);
  }

  getTax(id: Guid) {
    if (id) {
      this.getTaxSubscription = this.taxService.getSingleTax(id).subscribe(
        (response: any) => {
          this.taxForm?.patchValue({
            taxName: (response as Tax).taxName,
            taxRate: (response as Tax).taxRate,
            compoundTax: (response as Tax).compoundTax,
          });
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
    }
  }
  taxFormValid(): boolean {
    if (this.taxForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  updateTax() {
    if (this.taxForm.valid) {
      this.taxUpdateSubscription = this.taxService
        .updateTax(this.selectedItemId, this.taxForm.value)
        .subscribe(
          (response) => {
            this.sharedService.getGetTaxes();
            this.toastr.success('Tax updated');
            this.close();
          },
          (error) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  close() {
    this.modalService.closeModal();
  }

  ngOnDestroy(): void {
    this.getTaxSubscription?.unsubscribe();
    this.taxUpdateSubscription?.unsubscribe();
  }
}
