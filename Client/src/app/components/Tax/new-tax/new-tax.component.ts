import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Tax } from 'src/app/_model/tax';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import { TaxService } from 'src/app/_services/tax.service';

@Component({
  selector: 'app-new-tax',
  templateUrl: './new-tax.component.html',
  styleUrls: ['./new-tax.component.css'],
})
export class NewTaxComponent implements OnInit, OnDestroy {
  taxForm!: FormGroup;
  taxCreateSubscription: Subscription | undefined;

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

  ngOnInit(): void {}

  taxFormValid(): boolean {
    if (this.taxForm.valid) {
      return true;
    } else {
      return false;
    }
  }
  createTax() {
    const taxFormValue: Tax = this.taxForm.value;

    if (this.taxForm.valid) {
      this.taxCreateSubscription = this.taxService
        .createTax(taxFormValue)
        .subscribe(
          (response) => {
            this.sharedService.getGetTaxes();
            this.toastr.success('New tax created');
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
    this.taxCreateSubscription?.unsubscribe();
  }
}
