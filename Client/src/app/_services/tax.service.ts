import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tax } from '../_model/tax';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTaxes() {
    return this.http.get(this.baseUrl + 'tax');
  }

  createTax(model: any) {
    return this.http.post<Tax>(this.baseUrl + 'tax', model).pipe(
      map((response: Tax) => {
        const term = response;
        console.log(term);
      })
    );
  }
}
