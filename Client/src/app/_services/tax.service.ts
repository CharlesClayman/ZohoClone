import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tax } from '../_model/tax';
import { map } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTaxes(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'tax', { params });
  }

  getSingleTax(id: Guid) {
    return this.http.get(this.baseUrl + 'tax/' + id);
  }

  createTax(model: any) {
    return this.http.post(this.baseUrl + 'tax', model);
  }

  updateTax(id: Guid, model: any) {
    return this.http.put(`${this.baseUrl}tax/${id}`, model);
  }

  deleteTax(id: Guid) {
    return this.http.delete(`${this.baseUrl}tax/${id}`);
  }
}
