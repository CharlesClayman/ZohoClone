import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Item, ItemType } from 'src/app/_model/item';
import { Tax } from 'src/app/_model/tax';
import { ItemService } from 'src/app/_services/item.service';
import { TaxService } from 'src/app/_services/tax.service';
import * as currencies from '../../../_data/currencies.json';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css'],
})
export class NewItemComponent implements OnInit {
  taxes: any[] = [];
  openModal: boolean = false;
  itemType: typeof ItemType = ItemType;
  path!: string;
  units = [
    'box',
    'sachet',
    'cm',
    'dz',
    'ft',
    'g',
    'in',
    'kg',
    'km',
    'ib',
    'mg',
    'ml',
    'm',
    'pcs',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private taxService: TaxService,
    private itemService: ItemService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private sharedService: SharedService,
    private modalRef?: BsModalRef
  ) {}

  itemsForm = this.formBuilder.group({
    itemType: this.formBuilder.control(this.itemType.Goods),
    name: this.formBuilder.control('', [Validators.required]),
    unit: this.formBuilder.control(this.units[0]),
    currency: this.formBuilder.control(this.currencies[0], [
      Validators.required,
    ]),
    sellingPrice: this.formBuilder.control('', [Validators.required]),
    description: this.formBuilder.control(''),
  });

  taxForm = this.formBuilder.group({
    taxName: this.formBuilder.control('', [Validators.required]),
    taxRate: this.formBuilder.control(null, [Validators.required]),
    compoundTax: this.formBuilder.control(false),
  });
  public get currencies(): string[] {
    const itemsToRender: string[] = [];

    const list = Object.entries(currencies).forEach((currencyItems) => {
      itemsToRender.push(`${currencyItems[0]} - ${currencyItems[1]}`);
    });

    return itemsToRender;
  }

  ngOnInit(): void {
    this.path = window.location.pathname;
    this.loadTaxes();
  }

  loadTaxes() {
    this.taxes = [];
    this.taxService.getTaxes().subscribe((response: any) => {
      console.log(response);
      Object.values(response).map((val: any) => {
        this.taxes.push(val);
      });
    });
  }

  itemFormValid(): boolean {
    if (this.itemsForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  cancelItemCreation() {
    if (this.path.includes('/items')) {
      this.router.navigateByUrl('/items');
    } else {
      this.closeModal();
    }
  }
  createItem() {
    if (this.itemsForm.valid) {
      this.itemService.createItem(this.itemsForm.value).subscribe(
        (response: any) => {
          if (this.path.includes('/items')) {
            this.toastr.success('New item created');
            this.router.navigateByUrl('/items');
          } else {
            this.toastr.success('New item added');
            this.sharedService.getGetItems();
            this.closeModal();
          }
        },
        (error: any) => {
          this.toastr.error(error.message);
          console.error(error);
        }
      );
    }
  }

  taxFormValid(): boolean {
    if (this.taxForm.valid) {
      return true;
    } else {
      return false;
    }
  }
  createTax() {
    const taxFormValue: Tax = this.taxForm.value;

    if (this.taxForm.valid) {
      this.taxService.createTax(taxFormValue).subscribe(
        (response) => {
          this.toastr.success('New tax created');
          this.closeModal();
          this.loadTaxes();
          console.log(response);
        },
        (error) => {
          this.toastr.error(error.message);
          console.log(error);
        }
      );
    }
  }

  openTaxModal(event: any, template: TemplateRef<any>) {
    if (event === 'configure') {
      console.log('opening modal');
      this.modalRef = this.modalService.show(template);
    }
  }

  closeModal() {
    this.modalRef?.hide();
  }
}
