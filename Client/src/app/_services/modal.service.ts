import { Injectable } from '@angular/core';
import { Component, TemplateRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalRef?: BsModalRef;

  constructor(private modalService: BsModalService) {}

  openModal(component: any, id: any = null) {
    const initialState = {
      selectedItemId: id,
    };
    this.modalRef = this.modalService.show(component, { initialState });

    return this.modalRef;
  }

  closeModal() {
    this.modalRef?.hide();
  }
}
