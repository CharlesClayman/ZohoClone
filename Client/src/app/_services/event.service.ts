import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  searchEvent = new EventEmitter();
  constructor() {}
}
