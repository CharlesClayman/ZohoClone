import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Expenses } from 'src/app/_model/expenses';
import { Tax } from 'src/app/_model/tax';
import { EventService } from 'src/app/_services/event.service';
import { ExpenseService } from 'src/app/_services/expense.service';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
  selector: 'app-expense-index',
  templateUrl: './expense-index.component.html',
  styleUrls: ['./expense-index.component.css'],
})
export class ExpenseIndexComponent implements OnInit, OnDestroy {
  expenses: any[] = [];
  selectedItem: Expenses = <Expenses>{};
  tax: Tax = <Tax>{};
  searchEventSubs: Subscription | undefined;

  constructor(
    private expenseService: ExpenseService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getAllExpenses();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getAllExpenses(value) : this.getAllExpenses()
    );
  }

  getAllExpenses(query: string | null = null) {
    this.expenses = [];
    this.expenseService.getAllExpenses(query).subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.expenses.push(values);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  deleteExpense() {
    this.expenseService.deleteExpense(this.selectedItem.id).subscribe(
      (response: any) => {
        this.toastr.success('Expense deleted');
        this.expenses = [];
        this.getAllExpenses();
        this.closeModal();
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  openModal(expense: any, template: TemplateRef<any>) {
    this.selectedItem = expense;
    this.modalService.openModal(template).setClass('modal-dialog-centered');
  }

  closeModal() {
    this.modalService.closeModal();
  }

  ngOnDestroy(): void {
    this.searchEventSubs?.unsubscribe();
  }
}
