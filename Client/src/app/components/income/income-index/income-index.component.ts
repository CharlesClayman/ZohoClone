import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Income } from 'src/app/_model/income';
import { EventService } from 'src/app/_services/event.service';
import { IncomeService } from 'src/app/_services/income.service';

@Component({
  selector: 'app-income-index',
  templateUrl: './income-index.component.html',
  styleUrls: ['./income-index.component.css'],
})
export class IncomeIndexComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  incomes: any[] = [];
  selectedItem: Income = <Income>{};
  searchTerm: string = '';
  searchEventSubs: Subscription | undefined;

  constructor(
    private incomeService: IncomeService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getAllIncomes();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) => {
      value ? this.getAllIncomes(value) : this.getAllIncomes();
    });
  }

  getAllIncomes(searchWord: string | null = null) {
    this.incomes = [];
    this.incomeService.getAllIncome(searchWord).subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.incomes.push(values);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  deleteIncome() {
    this.incomeService.deleteIncome(this.selectedItem.id).subscribe(
      (response: any) => {
        this.toastr.success('Income deleted');
        this.incomes = [];
        this.getAllIncomes();
        this.closeModal();
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  openModal(income: any, template: TemplateRef<any>) {
    this.selectedItem = income;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
    console.log(this.selectedItem);
  }

  closeModal() {
    this.modalRef?.hide();
  }

  ngOnDestroy(): void {
    this.searchEventSubs?.unsubscribe();
  }
}
