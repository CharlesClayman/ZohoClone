import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/_model/item';
import { SalesPerson } from 'src/app/_model/salesPerson';
import { Tax } from 'src/app/_model/tax';
import { Term } from 'src/app/_model/term';
import { CustomersService } from 'src/app/_services/customers.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { ItemService } from 'src/app/_services/item.service';
import { SalespersonService } from 'src/app/_services/salesperson.service';
import { TaxService } from 'src/app/_services/tax.service';
import { TermsService } from 'src/app/_services/terms.service';
import { NewCustomerComponent } from '../../customers/new-customer/new-customer.component';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { Invoice } from 'src/app/_model/invoice';
import { InvoiceCalculatorService } from 'src/app/_services/invoice-calculator.service';
import { ModalService } from 'src/app/_services/modal.service';
import { NewTermComponent } from '../../Term/new-term/new-term.component';
import { NewSalespersonComponent } from '../../Salesperson/new-salesperson/new-salesperson.component';

interface TaxAndCalculatedValues {
  tax: string;
  value: number;
}

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css'],
})
export class InvoiceEditComponent implements OnInit, OnDestroy {
  invoiceId = this.route.snapshot.params['id'];
  customers: any[] = [];
  terms: Term[] = [];
  singleTerm: Term = <Term>{};
  termForm!: FormGroup;
  salespersonForm!: FormGroup;
  invoiceForm!: FormGroup;
  items: Item[] = [];
  taxes: any[] = [];
  taxForm!: FormGroup;
  salesPersons: SalesPerson[] = [];
  itemAmount: number = 0.0;
  subTotal: number = 0.0;
  discount: number = 0.0;
  adjustment: number = 0.0;
  total: number = 0.0;
  listOfAmount: number[] = [];
  listOfTaxesAndCalculatedValues: TaxAndCalculatedValues[] = [];
  patchedTaxesAndCalculatedValues: TaxAndCalculatedValues[] = [];
  filteredTaxes: TaxAndCalculatedValues[] = [];
  customerChangesSubs: Subscription | undefined;
  discountChangesSubs: Subscription | undefined;
  adjustmentChangesSubs: Subscription | undefined;
  termsChangesSubs: Subscription | undefined;
  salesPersonChangesSubs: Subscription | undefined;
  getTermsSharedSubs: Subscription | undefined;
  getSalesSharedSubs: Subscription | undefined;
  getTaxesSharedSubs: Subscription | undefined;
  getCustomersSharedSubs: Subscription | undefined;
  getItemsSharedSubs: Subscription | undefined;
  getTermsSubs: Subscription | undefined;
  getSalespersonsSubs: Subscription | undefined;
  getTaxesSubs: Subscription | undefined;
  getCustomersSubs: Subscription | undefined;
  getItemsSubs: Subscription | undefined;
  getSingleTermSubs: Subscription | undefined;
  getInvoiceSubs: Subscription | undefined;
  updateInvoiceSubs: Subscription | undefined;

  constructor(
    private customerService: CustomersService,
    private modalService: ModalService,
    private termsService: TermsService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private taxService: TaxService,
    private salesPersonService: SalespersonService,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private invoiceCalculator: InvoiceCalculatorService
  ) {
    this.invoiceForm = this.formBuilder.group({
      customerId: this.formBuilder.control('', [Validators.required]),
      invoiceNumber: this.formBuilder.control('', [Validators.required]),
      orderNumber: this.formBuilder.control(null),
      invoiceDate: this.formBuilder.control(new Date()),
      termsId: this.formBuilder.control(null),
      dueDate: this.formBuilder.control(null),
      salesPersonId: this.formBuilder.control(null),
      subject: this.formBuilder.control(null),
      currency: this.formBuilder.control(null),
      items: this.formBuilder.array([
        this.formBuilder.group({
          itemId: this.formBuilder.control(null, [Validators.required]),
          description: this.formBuilder.control(null),
          taxId: this.formBuilder.control(null),
          quantity: this.formBuilder.control(null, [Validators.required]),
        }),
      ]),
      subTotal: this.formBuilder.control(0),
      discount: this.formBuilder.control(0),
      adjustments: this.formBuilder.control(0),
      customerNotes: this.formBuilder.control('Thanks for your business'),
      termsAndConditions: this.formBuilder.control(null),
      attachFile: this.formBuilder.control(null),
      total: this.formBuilder.control(null),
    });

    this.getCustomersSharedSubs = this.sharedService
      .setGetCustomers()
      .subscribe(() => this.getCustomers());
    this.getTermsSharedSubs = this.sharedService
      .setGetTerms()
      .subscribe(() => this.getTerms());
    this.getTaxesSharedSubs = this.sharedService
      .setGetTaxes()
      .subscribe(() => this.getTaxes());
    this.getSalesSharedSubs = this.sharedService
      .setGetSalespersons()
      .subscribe(() => this.getSalesPersons());
    this.getItemsSharedSubs = this.sharedService
      .setGetItems()
      .subscribe(() => this.getItems());
  }

  ngOnInit(): void {
    this.getInvoice();
    this.getCustomers();
    this.getTerms();
    this.getItems();
    this.getTaxes();
    this.getSalesPersons();

    this.discountChangesSubs = (
      this.invoiceForm.get('discount') as FormControl
    ).valueChanges.subscribe((value: number) => {
      this.calculateDiscount(value);
    });

    this.adjustmentChangesSubs = (
      this.invoiceForm.get('adjustments') as FormControl
    ).valueChanges.subscribe((value: number) => {
      this.onAdjustmentChange(value);
    });

    this.customerChangesSubs = (
      this.invoiceForm.get('customerId') as FormControl
    ).valueChanges.subscribe((value) => {
      if (value === 'configure') {
        this.modalService.openModal(NewCustomerComponent).setClass('modal-lg');
      }
    });

    this.termsChangesSubs = (
      this.invoiceForm.get('termsId') as FormControl
    ).valueChanges.subscribe((value) => {
      if (value === 'configure') {
        this.modalService.openModal(NewTermComponent);
      } else {
        let selectedTermId = value;
        this.getSingleTerm(selectedTermId);
      }
    });

    this.salesPersonChangesSubs = (
      this.invoiceForm.get('salesPersonId') as FormControl
    ).valueChanges.subscribe((value) => {
      if (value === 'configure') {
        this.modalService.openModal(NewSalespersonComponent);
      }
    });
  }

  public get itemsFromInvoice() {
    return this.invoiceForm.get('items') as FormArray;
  }

  getInvoice() {
    this.getInvoiceSubs = this.invoiceService
      .getSingleInvoice(this.invoiceId)
      .subscribe(
        (response: any) => {
          const invoice = response as Invoice;
          const invoiceDate = new Date(invoice?.invoiceDate);
          this.invoiceForm.patchValue({
            customerId: invoice?.customer?.id,
            invoiceNumber: invoice?.invoiceNumber,
            orderNumber: invoice?.orderNumber,
            invoiceDate: invoiceDate,
            termsId: invoice?.terms.id,
            dueDate: invoice?.dueDate,
            salesPersonId: invoice?.salesPerson?.id,
            subject: invoice?.subject,
            currency: invoice?.currency,
            subTotal: invoice?.subTotal,
            discount: invoice?.discount,
            adjustments: invoice?.adjustments,
            customerNotes: invoice?.customerNotes,
            termsAndConditions: invoice?.termsAndConditions,
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

            const results = invoice?.items.map((item) => {
              const calculatedValue =
                (item.tax?.taxRate / 100) *
                item.item?.sellingPrice *
                item?.quantity;
              const taxName = `${item?.tax?.taxName}[${item?.tax?.taxRate}%]`;

              return {
                tax: taxName,
                value: calculatedValue,
              };
            });

            this.filteredTaxes = this.invoiceCalculator.calculateItemTax(
              results,
              true
            );
          }
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  onReceivingItemTaxAndValue(taxAndValue: any, itemIndex: number) {
    this.filteredTaxes = this.invoiceCalculator.calculateSingleItemTax(
      taxAndValue,
      itemIndex
    );
    this.calculateTotal();
  }

  calculateDiscount(discount: number) {
    if (discount) {
      const results = (discount / 100) * this.subTotal;
      this.discount = -results.toFixed(2);
      this.calculateTotal();
    } else {
      this.discount = 0;
      this.calculateTotal();
    }
  }

  onAdjustmentChange(value: number) {
    if (value) {
      this.adjustment = value;
      this.calculateTotal();
    } else {
      this.adjustment = 0;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.total = 0;
    const sumOfAllTaxes = this.filteredTaxes.reduce(
      (previousValue, currentValue) => {
        if (currentValue.value) return previousValue + currentValue.value;
        return previousValue;
      },
      0
    );
    const results =
      this.subTotal + this.discount + +this.adjustment + +sumOfAllTaxes;
    this.total = results;
  }

  calculateInvoiceDueDate(termDays: number): Date {
    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + termDays);
    return dueDate;
  }

  setInvoiceDueDate(dueDate: Date) {
    this.invoiceForm.get('dueDate')?.setValue(dueDate);
  }

  getSingleTerm(id: Guid) {
    this.getSingleTermSubs = this.termsService
      .getSingleTerm(id)
      .subscribe((response: any) => {
        //setting invoice due date based on the term days of the term returned in the response
        let termDays = (response as Term).termDays;
        let dueDate = this.calculateInvoiceDueDate(termDays);
        this.setInvoiceDueDate(dueDate);
      });
  }

  calculateSubTotal(amount: number, index: number): number {
    this.listOfAmount[index] = amount;
    var totalAmount = 0;
    this.listOfAmount.forEach((amount: any) => {
      totalAmount = totalAmount + amount;
    });
    return totalAmount;
  }

  onAmountChanged(amount: number, index: number) {
    //Recalculating subTotal based on which item amount changes
    if (amount) {
      this.subTotal = this.calculateSubTotal(amount, index);
      const discountValue = this.invoiceForm.get('discount')?.value;
      this.calculateDiscount(discountValue);
      this.calculateTotal();
    }
  }

  addItem() {
    this.itemsFromInvoice.push(
      this.formBuilder.group({
        itemId: this.formBuilder.control('', [Validators.required]),
        description: this.formBuilder.control(null),
        quantity: this.formBuilder.control(null, [Validators.required]),
        taxId: this.formBuilder.control(null),
      })
    );
  }

  getCustomers() {
    this.customers = [];
    this.getCustomersSubs = this.customerService.getAllCustomers().subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.customers.push(values);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getSalesPersons() {
    this.salesPersons = [];
    this.getSalespersonsSubs = this.salesPersonService
      .getSalesPersons()
      .subscribe(
        (response: any) => {
          Object.values(response).map((values) => {
            this.salesPersons.push(values as SalesPerson);
          });
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  getTerms() {
    this.terms = [];
    this.getTermsSubs = this.termsService.getTerms().subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.terms.push(values as Term);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getItems() {
    this.items = [];
    this.getItemsSubs = this.itemService.getAllItems().subscribe(
      (response: any) => {
        Object.values(response as Item).map((values) => {
          this.items.push(values);
        });
      },
      (error: any) => {}
    );
  }

  getTaxes() {
    this.taxes = [];
    this.getTaxesSubs = this.taxService
      .getTaxes()
      .subscribe((response: any) => {
        Object.values(response).map((val: any) => {
          this.taxes.push(val);
        });
      });
  }

  invoiceFormIsValid(): boolean {
    if (this.invoiceForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  updateInvoice() {
    // Setting values for subtotal and total which are both calculated values
    this.invoiceForm.get('subTotal')?.setValue(this.subTotal);
    this.invoiceForm.get('total')?.setValue(this.total);

    console.log(this.invoiceForm.value);
    if (this.invoiceFormIsValid()) {
      this.updateInvoiceSubs = this.invoiceService
        .updateInvoice(this.invoiceForm.value, this.invoiceId)
        .subscribe(
          (response: any) => {
            this.toastr.success('Invoice created');
            this.router.navigateByUrl('/invoices');
          },
          (error: any) => {
            this.toastr.error(error.message);
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.discountChangesSubs?.unsubscribe();
    this.adjustmentChangesSubs?.unsubscribe();
    this.termsChangesSubs?.unsubscribe();
    this.salesPersonChangesSubs?.unsubscribe();
    this.getCustomersSharedSubs?.unsubscribe();
    this.getTermsSharedSubs?.unsubscribe();
    this.getTaxesSharedSubs?.unsubscribe();
    this.getSalesSharedSubs?.unsubscribe();
    this.getItemsSharedSubs?.unsubscribe();
    this.getTermsSubs?.unsubscribe();
    this.getSalespersonsSubs?.unsubscribe();
    this.getTaxesSubs?.unsubscribe();
    this.getCustomersSubs?.unsubscribe();
    this.getItemsSubs?.unsubscribe();
    this.getSingleTermSubs?.unsubscribe();
    this.updateInvoiceSubs?.unsubscribe();
    this.getInvoiceSubs?.unsubscribe();
  }
}
