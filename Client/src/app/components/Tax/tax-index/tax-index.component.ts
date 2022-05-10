import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Tax } from 'src/app/_model/tax';
import { EventService } from 'src/app/_services/event.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import { TaxService } from 'src/app/_services/tax.service';
import { NewTaxComponent } from '../new-tax/new-tax.component';
import { TaxEditComponent } from '../tax-edit/tax-edit.component';

@Component({
  selector: 'app-tax-index',
  templateUrl: './tax-index.component.html',
  styleUrls: ['./tax-index.component.css'],
})
export class TaxIndexComponent implements OnInit, OnDestroy {
  taxes: Tax[] = [];
  selectedTaxId!: Guid;
  getAllTaxesSubs: Subscription | undefined;
  sharedServiceSubs: Subscription | undefined;
  deleteTaxSubs: Subscription | undefined;
  searchEventSubs: Subscription | undefined;

  constructor(
    private taxService: TaxService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private modalService: ModalService,
    private eventService: EventService
  ) {
    this.sharedServiceSubs = this.sharedService
      .setGetTaxes()
      .subscribe(() => this.getTaxes());
  }

  ngOnInit(): void {
    this.getTaxes();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getTaxes(value) : this.getTaxes()
    );
  }

  addNewTax() {
    this.modalService.openModal(NewTaxComponent);
  }

  editTax(id: Guid) {
    this.modalService.openModal(TaxEditComponent, id);
  }

  openDeleteModal(template: TemplateRef<any>, itemId: Guid) {
    this.selectedTaxId = itemId;
    this.modalService.openModal(template);
  }

  delete() {
    if (this.selectedTaxId) {
      this.deleteTaxSubs = this.taxService
        .deleteTax(this.selectedTaxId)
        .subscribe(
          (response: any) => {
            this.getTaxes();
            this.toastr.success('Tax deleted');
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

  getTaxes(query: string | null = null) {
    this.taxes = [];
    this.getAllTaxesSubs = this.taxService.getTaxes(query).subscribe(
      (response: any) => {
        Object.values(response as Tax).map((values) => {
          this.taxes.push(values);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.getAllTaxesSubs?.unsubscribe();
    this.deleteTaxSubs?.unsubscribe();
    this.sharedServiceSubs?.unsubscribe();
    this.searchEventSubs?.unsubscribe();
  }
}
