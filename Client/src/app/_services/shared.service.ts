import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _sidebarToggle = new ReplaySubject<boolean>(1);
  sidebarToggle$ = this._sidebarToggle.asObservable();
  private _customerSubject = new Subject<any>();
  private _itemSubject = new Subject<any>();
  private _termsSubject = new Subject<any>();
  private _taxSubject = new Subject<any>();
  private _categorySubject = new Subject<any>();
  private _salesPersonSubject = new Subject<any>();

  constructor() {}

  toggleSidebar(state: boolean) {
    this._sidebarToggle.next(state);
  }

  setGetCustomers() {
    return this._customerSubject.asObservable();
  }

  getGetCustomers() {
    this._customerSubject.next();
  }

  setGetItems() {
    return this._itemSubject.asObservable();
  }

  getGetItems() {
    this._itemSubject.next();
  }

  setGetTerms() {
    return this._termsSubject.asObservable();
  }
  getGetTerms() {
    this._termsSubject.next();
  }

  setGetTaxes() {
    return this._taxSubject.asObservable();
  }

  getGetTaxes() {
    this._taxSubject.next();
  }

  setGetCategories() {
    return this._categorySubject.asObservable();
  }

  getGetCategories() {
    this._categorySubject.next();
  }

  setGetSalespersons() {
    return this._salesPersonSubject.asObservable();
  }

  getGetSalespersons() {
    this._salesPersonSubject.next();
  }
}
