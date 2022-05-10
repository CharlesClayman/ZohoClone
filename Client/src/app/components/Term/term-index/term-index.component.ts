import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Term } from 'src/app/_model/term';
import { EventService } from 'src/app/_services/event.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import { TermsService } from 'src/app/_services/terms.service';
import { NewTermComponent } from '../new-term/new-term.component';
import { TermEditComponent } from '../term-edit/term-edit.component';

@Component({
  selector: 'app-term-index',
  templateUrl: './term-index.component.html',
  styleUrls: ['./term-index.component.css'],
})
export class TermIndexComponent implements OnInit, OnDestroy {
  getSingleTermSubs: Subscription | undefined;
  getAllTermsSubs: Subscription | undefined;
  deleteTermSubs: Subscription | undefined;
  sharedServiceSubs: Subscription | undefined;
  searchEventSubs: Subscription | undefined;
  term!: Term;
  termsList: Term[] = [];
  selectedTermId!: Guid;

  constructor(
    private modalService: ModalService,
    private termsService: TermsService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private eventService: EventService
  ) {
    this.sharedServiceSubs = this.sharedService
      .setGetTerms()
      .subscribe(() => this.getAllTerms());
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getAllTerms(value) : this.getAllTerms()
    );
  }

  ngOnInit(): void {
    this.getAllTerms();
  }

  addNewTerm() {
    this.modalService.openModal(NewTermComponent);
  }

  editTerm(id: Guid) {
    this.modalService.openModal(TermEditComponent, id);
  }
  getTerm(id: Guid) {
    this.getSingleTermSubs = this.termsService.getSingleTerm(id).subscribe(
      (response: any) => {
        this.term = response as Term;
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  getAllTerms(query: string | null = null) {
    this.termsList = [];
    this.getAllTermsSubs = this.termsService.getTerms(query).subscribe(
      (response: any) => {
        Object.values(response as Term[]).map((values) => {
          this.termsList.push(values);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  openDeleteModal(template: TemplateRef<any>, itemId: Guid) {
    this.selectedTermId = itemId;
    this.modalService.openModal(template);
  }

  delete() {
    if (this.selectedTermId) {
      this.deleteTermSubs = this.termsService
        .deleteTerm(this.selectedTermId)
        .subscribe(
          (response: any) => {
            this.getAllTerms();
            this.toastr.success('Term deleted');
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
    this.getSingleTermSubs?.unsubscribe();
    this.getAllTermsSubs?.unsubscribe();
    this.deleteTermSubs?.unsubscribe();
    this.sharedServiceSubs?.unsubscribe();
    this.searchEventSubs?.unsubscribe();
  }
}
