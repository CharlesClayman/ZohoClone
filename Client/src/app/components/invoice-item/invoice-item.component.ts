import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/_model/item';
import { Tax } from 'src/app/_model/tax';
import { ItemService } from 'src/app/_services/item.service';
import { TaxService } from 'src/app/_services/tax.service';
import { NewItemComponent } from '../items/new-item/new-item.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { SharedService } from 'src/app/_services/shared.service';
import { NewTaxComponent } from '../Tax/new-tax/new-tax.component';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.css'],
})
export class InvoiceItemComponent implements OnInit, OnDestroy, AfterViewInit {
  itemQuantity = 1.0;
  itemTax: string = '';
  itemRate: number = 0.0;
  itemAmount: number = 0;
  itemDescription: string = '';
  items: Item[] = [];
  selectedValue: string = '';
  listOfTaxes: Tax[] = [];
  taxForm!: FormGroup;
  @Input() parentForm!: FormGroup;
  @Input() item!: AbstractControl;
  @Input() index: number = 0;
  @Output() amountEmitter = new EventEmitter<number>();
  @Output() itemEmitter = new EventEmitter<Item>();
  @Output() quantityEmitter = new EventEmitter<number>();
  @Output() itemTaxValueEmitter = new EventEmitter<{
    tax: string;
    value: number;
  }>();

  @ViewChild('template') invoiceItemTemplate: any;

  taxRate: number = 0;
  taxName: string = '';
  form!: FormGroup;
  itemChangeSubs: Subscription | undefined;
  itemQuantityChangeSubs: Subscription | undefined;
  taxChangeSubs: Subscription | undefined;
  getItemSubs: Subscription | undefined;
  getTaxSubs: Subscription | undefined;
  getItemsSubs: Subscription | undefined;
  getTaxesSubs: Subscription | undefined;
  getTaxesSharedSubs: Subscription | undefined;
  getItemsSharedSubs: Subscription | undefined;

  constructor(
    private rootFormGroup: FormGroupDirective,
    private viewContainerRef: ViewContainerRef,
    private itemService: ItemService,
    private taxService: TaxService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private sharedService: SharedService
  ) {
    this.getItemsSharedSubs = this.sharedService
      .setGetItems()
      .subscribe(() => this.getItems());

    this.getTaxesSharedSubs = this.sharedService
      .setGetTaxes()
      .subscribe(() => this.getTaxes());

    this.form = new FormGroup({
      itemId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      taxId: new FormControl(''),
    });

    this.taxForm = this.formBuilder.group({
      taxName: this.formBuilder.control('', [Validators.required]),
      taxRate: this.formBuilder.control(null, [Validators.required]),
      compoundTax: this.formBuilder.control(false),
    });
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.viewContainerRef?.createEmbeddedView(this.invoiceItemTemplate);
      this.getTaxes();
      this.getItems();

      if (this.item?.get('itemId')?.value) {
        this.getItem(this.item?.get('itemId')?.value);
      }
    });

    this.itemChangeSubs = (
      this.form.get('itemId') as FormControl
    ).valueChanges.subscribe((value: any) => {
      if (value && value !== 'configure') {
        this.getItem(value);
        this.form.get('quantity')?.setValue(1);
      } else if (value && value === 'configure') {
        this.modalService.openModal(NewItemComponent);
      }
    });

    this.taxChangeSubs = (
      this.form.get('taxId') as FormControl
    ).valueChanges.subscribe((tax: any) => {
      if (tax && tax != 'configure') {
        this.getTax(tax);
      } else if (tax && tax === 'configure') {
        this.modalService.openModal(NewTaxComponent);
      }
    });
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control
      .get('items')
      ?.get(this.index.toString()) as FormGroup;

    this.itemQuantityChangeSubs = (
      this.form.get('quantity') as FormControl
    ).valueChanges.subscribe((quantity: number) => {
      if (quantity) {
        this.itemAmount = this.itemRate * quantity;
        this.calculateAndEmitTax();
        this.amountEmitter.emit(this.itemAmount);
      }
    });
  }

  calculateAndEmitTax() {
    if (this.taxRate) {
      let calculatedValue = (this.taxRate / 100) * this.itemAmount;
      this.itemTaxValueEmitter.emit({
        tax: this.taxName,
        value: calculatedValue,
      });
    }
  }

  getTax(id: Guid) {
    if (id) {
      this.getTaxSubs = this.taxService.getSingleTax(id).subscribe(
        (response: any) => {
          this.taxRate = (response as Tax).taxRate;
          const name = (response as Tax).taxName;
          this.taxName = name + '[' + this.taxRate.toString() + '%]';
          this.calculateAndEmitTax();
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
    }
  }

  getItem(id: Guid) {
    if (id) {
      this.getItemSubs = this.itemService.getSingleItem(id).subscribe(
        (response: any) => {
          const item = response as Item;
          if (item) {
            this.itemRate = item?.sellingPrice;
            this.form.get('description')?.setValue(item?.description);
          }
          this.itemAmount = this.itemRate * this.itemQuantity;
          this.amountEmitter.emit(this.itemAmount);
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
    }
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
    this.listOfTaxes = [];
    this.getTaxesSubs = this.taxService.getTaxes().subscribe(
      (response: any) => {
        Object.values(response).map((values) => {
          this.listOfTaxes.push(values as Tax);
        });
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.itemChangeSubs?.unsubscribe();
    this.itemQuantityChangeSubs?.unsubscribe();
    this.taxChangeSubs?.unsubscribe();
    this.getItemSubs?.unsubscribe();
    this.getTaxSubs?.unsubscribe();
    this.getItemsSubs?.unsubscribe();
    this.getTaxesSubs?.unsubscribe();
    this.getItemsSharedSubs?.unsubscribe();
    this.getTaxesSharedSubs?.unsubscribe();
  }
}
