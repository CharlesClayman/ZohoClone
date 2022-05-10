import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Term } from 'src/app/_model/term';
import { TermsService } from 'src/app/_services/terms.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-term',
  templateUrl: './new-term.component.html',
  styleUrls: ['./new-term.component.css'],
})
export class NewTermComponent implements OnInit, OnDestroy {
  termForm: FormGroup;
  termCreateSubscription: Subscription | undefined;

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

  ngOnInit(): void {}

  termFormValid(): boolean {
    if (this.termForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  createTerm() {
    if (this.termForm.valid) {
      this.termCreateSubscription = this.termsService
        .createTerm(this.termForm.value)
        .subscribe(
          (response: any) => {
            this.sharedService.getGetTerms();
            this.toastr.success('New term created');
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
    this.termCreateSubscription?.unsubscribe();
  }
}
