import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _sidebarToggle = new ReplaySubject<boolean>(1);
  sidebarToggle$ = this._sidebarToggle.asObservable();

  constructor() { }

  toggleSidebar(state:boolean){
    this._sidebarToggle.next(state);
  }
}
