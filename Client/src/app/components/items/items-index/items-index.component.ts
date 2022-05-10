import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/_model/item';
import { ItemService } from 'src/app/_services/item.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Tax } from 'src/app/_model/tax';
import { Guid } from 'guid-typescript';
import { EventService } from 'src/app/_services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-items-index',
  templateUrl: './items-index.component.html',
  styleUrls: ['./items-index.component.css'],
})
export class ItemsIndexComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  delModalRef?: BsModalRef;
  selectedItem: Item = <Item>{};
  items: Item[] = [];
  searchEventSubs: Subscription | undefined;

  constructor(
    private itemService: ItemService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getItems();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getItems(value) : this.getItems()
    );
  }

  getItems(query: string | null = null) {
    this.items = [];
    this.itemService.getAllItems(query).subscribe(
      (response: any) => {
        Object.values(response as Item).map((values) => {
          this.items.push(values);
        });
      },
      (error: any) => {}
    );
  }

  deleteItem() {
    this.itemService.deleteItem(this.selectedItem.id).subscribe(
      (response: any) => {
        console.log('deleted');
        this.toastr.success('Item deleted');
        this.items = [];
        this.getItems();
        this.closeModal();
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  openModal(item: any, template: TemplateRef<any>) {
    console.log(item);
    this.selectedItem = item;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }
  closeModal() {
    this.modalRef?.hide();
  }

  ngOnDestroy(): void {
    this.searchEventSubs?.unsubscribe();
  }
}
