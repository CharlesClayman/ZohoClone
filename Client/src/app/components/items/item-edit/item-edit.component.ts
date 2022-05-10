import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/_services/item.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Item, ItemType } from 'src/app/_model/item';
import * as currencies from '../../../_data/currencies.json';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TaxService } from 'src/app/_services/tax.service';
import { Tax } from 'src/app/_model/tax';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css'],
})
export class ItemEditComponent implements OnInit {
  itemType: typeof ItemType = ItemType;
  taxes: any[] = [];
  modalRef?: BsModalRef;
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
    private route: ActivatedRoute,
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private taxService: TaxService,
    private toastr: ToastrService,
    private router: Router
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
    this.getItem();
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
    console.log(this.taxes);
  }
  taxFormValid(): boolean {
    if (this.taxForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  getItem() {
    const itemId = this.route.snapshot.params['id'];
    this.itemService.getSingleItem(itemId).subscribe(
      (response: any) => {
        const item = response as Item;
        if (item) {
          this.itemsForm.patchValue({
            name: item?.name,
            itemType: item?.itemType,
            unit: item?.unit,
            currency: item?.currency,
            sellingPrice: item?.sellingPrice,
            description: item?.description,
          });
        }
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  updateItem() {
    const item: Item = this.itemsForm.value;
    console.log(item);
    if (this.itemsForm.valid) {
      const itemId = this.route.snapshot.params['id'];
      this.itemService.updateItem(itemId, item).subscribe(
        (response: any) => {
          this.toastr.success('Update successful');
          this.router.navigateByUrl('/items');
        },
        (error: any) => {
          this.toastr.error(error.message);
          console.error(error);
        }
      );
    }
  }

  createTax() {
    const taxFormValue: Tax = this.taxForm.value;

    if (this.taxForm.valid) {
      this.taxService.createTax(taxFormValue).subscribe(
        (response) => {
          this.toastr.success('New tax added');
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

  itemFormValid(): boolean {
    if (this.itemsForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  openTaxModal(event: any, template: TemplateRef<any>) {
    if (event === 'configure') {
      this.modalRef = this.modalService.show(template);
    }
  }
  closeModal() {
    this.modalRef?.hide();
  }
}
