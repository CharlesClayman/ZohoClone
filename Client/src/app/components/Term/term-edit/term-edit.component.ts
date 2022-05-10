import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscriber, Subscription } from 'rxjs';
import { Term } from 'src/app/_model/term';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import { TermsService } from 'src/app/_services/terms.service';

@Component({
  selector: 'app-term-edit',
  templateUrl: './term-edit.component.html',
  styleUrls: ['./term-edit.component.css'],
})
export class TermEditComponent implements OnInit, OnDestroy {
  selectedItemId: any;
  termForm: FormGroup;
  getTermSubscription: Subscription | undefined;
  termUpdateSubscription: Subscription | undefined;

  constructor(
    private termsService: TermsService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private sharedService: SharedService
  ) {
    this.termForm = new FormGroup({
      termName: new FormControl('', [Validators.required]),
      termDays: new FormControl(null, [Validators.required]),
      customized: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.getTerm(this.selectedItemId);
  }

  getTerm(id: Guid) {
    if (id) {
      this.getTermSubscription = this.termsService.getSingleTerm(id).subscribe(
        (response: any) => {
          this.termForm.patchValue({
            termName: (response as Term).termName,
            termDays: (response as Term).termDays,
            customized: (response as Term).customized,
          });
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
    }
  }

  termFormValid(): boolean {
    if (this.termForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  updateTerm() {
    if (this.termForm.valid) {
      this.termUpdateSubscription = this.termsService
        .updateTerm(this.termForm.value, this.selectedItemId)
        .subscribe(
          (response: any) => {
            this.sharedService.getGetTerms();
            this.toastr.success('Term updated');
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
    this.getTermSubscription?.unsubscribe();
    this.termUpdateSubscription?.unsubscribe();
  }
}
