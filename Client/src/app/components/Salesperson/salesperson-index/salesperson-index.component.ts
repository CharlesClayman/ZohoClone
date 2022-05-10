import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SalesPerson } from 'src/app/_model/salesPerson';
import { EventService } from 'src/app/_services/event.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SalespersonService } from 'src/app/_services/salesperson.service';
import { SharedService } from 'src/app/_services/shared.service';
import { NewSalespersonComponent } from '../new-salesperson/new-salesperson.component';
import { SalespersonEditComponent } from '../salesperson-edit/salesperson-edit.component';

@Component({
  selector: 'app-salesperson-index',
  templateUrl: './salesperson-index.component.html',
  styleUrls: ['./salesperson-index.component.css'],
})
export class SalespersonIndexComponent implements OnInit, OnDestroy {
  salespersons: SalesPerson[] = [];
  getAllSalesPSubs: Subscription | undefined;
  sharedServiceSubs: Subscription | undefined;
  deleteSalespSubs: Subscription | undefined;
  searchEventSubs: Subscription | undefined;
  selectedSalespId!: Guid;

  constructor(
    private modalService: ModalService,
    private salespersonService: SalespersonService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private eventService: EventService
  ) {
    this.sharedServiceSubs = this.sharedService
      .setGetSalespersons()
      .subscribe(() => this.getSalespersons());
  }

  ngOnInit(): void {
    this.getSalespersons();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getSalespersons(value) : this.getSalespersons()
    );
  }

  addNewSalesperson() {
    this.modalService.openModal(NewSalespersonComponent);
  }

  editSalesperson(id: Guid) {
    this.modalService.openModal(SalespersonEditComponent, id);
  }

  openDeleteModal(template: TemplateRef<any>, itemId: Guid) {
    this.selectedSalespId = itemId;
    this.modalService.openModal(template);
  }

  delete() {
    if (this.selectedSalespId) {
      this.deleteSalespSubs = this.salespersonService
        .deleteSalesperson(this.selectedSalespId)
        .subscribe(
          (response: any) => {
            this.getSalespersons();
            this.toastr.success('Salesperson deleted');
            this.close();
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  getSalespersons(query: string | null = null) {
    this.salespersons = [];
    this.getAllSalesPSubs = this.salespersonService
      .getSalesPersons(query)
      .subscribe(
        (response: any) => {
          Object.values(response as SalesPerson).map((values) =>
            this.salespersons.push(values)
          );
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  close() {
    this.modalService.closeModal();
  }

  ngOnDestroy(): void {
    this.getAllSalesPSubs?.unsubscribe();
    this.sharedServiceSubs?.unsubscribe();
    this.deleteSalespSubs?.unsubscribe();
    this.searchEventSubs?.unsubscribe();
  }
}
