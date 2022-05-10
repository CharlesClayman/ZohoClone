import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from 'src/app/_model/invoice';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/internal/Subscription';
import { ModalService } from 'src/app/_services/modal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from 'src/app/_services/income.service';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-invoice-index',
  templateUrl: './invoice-index.component.html',
  styleUrls: ['./invoice-index.component.css'],
})
export class InvoiceIndexComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  selectedInvoice: Invoice = <Invoice>{};
  getInvoicesSubs: Subscription | undefined;
  deleteInvoiceSubs: Subscription | undefined;
  updateInvoiceSubs: Subscription | undefined;
  updateIncomeSubs: Subscription | undefined;
  searchEventSubs: Subscription | undefined;
  invoiceForm!: FormGroup;
  incomeForm!: FormGroup;

  constructor(
    private invoiceService: InvoiceService,
    private incomeService: IncomeService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private eventService: EventService,
    private formBuilder: FormBuilder
  ) {
    this.invoiceForm = this.formBuilder.group({
      customerId: this.formBuilder.control(null),
      invoiceNumber: this.formBuilder.control(null),
      orderNumber: this.formBuilder.control(null),
      invoiceDate: this.formBuilder.control(null),
      termsId: this.formBuilder.control(null),
      dueDate: this.formBuilder.control(null),
      salesPersonId: this.formBuilder.control(null),
      subject: this.formBuilder.control(null),
      currency: this.formBuilder.control(null),
      items: this.formBuilder.array([
        this.formBuilder.group({
          itemId: this.formBuilder.control(null),
          description: this.formBuilder.control(null),
          taxId: this.formBuilder.control(null),
          quantity: this.formBuilder.control(null),
        }),
      ]),
      subTotal: this.formBuilder.control(null),
      discount: this.formBuilder.control(null),
      adjustments: this.formBuilder.control(null),
      customerNotes: this.formBuilder.control(null),
      termsAndConditions: this.formBuilder.control(null),
      attachFile: this.formBuilder.control(null),
      total: this.formBuilder.control(null),
      paid: this.formBuilder.control(null),
    });

    this.incomeForm = this.formBuilder.group({
      customerId: this.formBuilder.control('', [Validators.required]),
      currency: this.formBuilder.control('', [Validators.required]),
      amountReceived: this.formBuilder.control('', [Validators.required]),
      paymentDate: this.formBuilder.control(new Date(), [Validators.required]),
      paymentNumber: this.formBuilder.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAllInvoices();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getAllInvoices(value) : this.getAllInvoices()
    );
  }

  public get itemsFromInvoice() {
    return this.invoiceForm.get('items') as FormArray;
  }

  getAllInvoices(query: string | null = null) {
    this.invoices = [];
    this.getInvoicesSubs = this.invoiceService.getAllInvoices(query).subscribe(
      (response: any) => {
        Object.values(response as Invoice).map((values) => {
          this.invoices.push(values);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  updatePaymentStatus(invoice: Invoice) {
    invoice.paid = true;

    this.invoiceForm?.patchValue({
      customerId: invoice?.customer?.id,
      invoiceNumber: invoice?.invoiceNumber,
      orderNumber: invoice?.orderNumber,
      invoiceDate: new Date(invoice?.invoiceDate),
      termsId: invoice?.terms.id,
      dueDate: invoice?.dueDate,
      salesPersonId: invoice?.salesPerson?.id,
      subject: invoice?.subject,
      currency: invoice?.currency,
      items: invoice?.items,
      subTotal: invoice?.subTotal,
      discount: invoice?.discount,
      adjustments: invoice?.adjustments,
      customerNotes: invoice?.customerNotes,
      termsAndConditions: invoice?.termsAndConditions,
      attachFile: invoice?.attachFile,
      total: invoice?.total,
      paid: invoice?.paid,
    });

    if (invoice?.items.length > 0) {
      this.itemsFromInvoice.clear();
      invoice?.items?.forEach((element: any) => {
        this.itemsFromInvoice.push(
          this.formBuilder.group({
            itemId: element?.item?.id,
            quantity: element?.quantity,
            description: element?.description,
            taxId: element?.tax?.id,
          })
        );
      });
    }

    this.updateInvoiceSubs = this.invoiceService
      .updateInvoice(this.invoiceForm.value, invoice.id)
      .subscribe(
        (response: any) => {
          this.toastr.success('Status update');
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
    //Updating Incomes list with newly paid invoice;
    this.updateIncome(invoice);
  }

  updateIncome(invoice: Invoice) {
    const paymentNum = this.generatePaymentNumber();

    this.incomeForm.patchValue({
      customerId: invoice.customer.id,
      currency: invoice.customer.otherDetails.currency,
      amountReceived: invoice.total,
      paymentDate: new Date(),
      paymentNumber: paymentNum,
    });

    this.updateIncomeSubs = this.incomeService
      .createIncome(this.incomeForm.value)
      .subscribe(
        (response: any) => {
          this.toastr.success('Income added');
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  generatePaymentNumber(): string {
    const numPart = Math.trunc(Math.random() * 10000);
    return String(numPart).padStart(8, 'pay-');
  }

  deleteInvoice() {
    this.deleteInvoiceSubs = this.invoiceService
      .deleteInvoice(this.selectedInvoice.id)
      .subscribe(
        (response: any) => {
          this.toastr.success('Invoice deleted');
          this.closeModal();
          this.getAllInvoices();
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  openModal(invoice: Invoice, template: TemplateRef<any>) {
    this.selectedInvoice = invoice;
    this.modalService.openModal(template).setClass('modal-dialog-centered');
  }

  closeModal() {
    this.modalService.closeModal();
  }

  ngOnDestroy(): void {
    this.getInvoicesSubs?.unsubscribe();
    this.deleteInvoiceSubs?.unsubscribe();
    this.updateInvoiceSubs?.unsubscribe();
    this.updateIncomeSubs?.unsubscribe();
    this.searchEventSubs?.unsubscribe();
  }
}
