import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/_services/modal.service';
import { SalespersonService } from 'src/app/_services/salesperson.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-new-salesperson',
  templateUrl: './new-salesperson.component.html',
  styleUrls: ['./new-salesperson.component.css'],
})
export class NewSalespersonComponent implements OnInit {
  salespersonForm!: FormGroup;
  sharedServiceSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private salespersonService: SalespersonService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private sharedService: SharedService
  ) {
    this.salespersonForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  salesPersonFormValid(): boolean {
    if (this.salespersonForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  createSalesPerson() {
    if (this.salesPersonFormValid()) {
      this.salespersonService
        .createSalesPerson(this.salespersonForm.value)
        .subscribe(
          (response: any) => {
            this.sharedService.getGetSalespersons();
            this.toastr.success('New salesperson created');
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
}
