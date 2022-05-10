import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Customer } from '../_model/customer';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCustomer(model: any) {
    return this.http.post(this.baseUrl + 'customer', model);
  }

  getAllCustomers(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'customer', { params });
  }

  getSingleCustomer(id: any) {
    return this.http.get(this.baseUrl + 'customer/' + id);
  }
  updateCustomer(id: Guid, model: any) {
    return this.http.put(this.baseUrl + 'customer/' + id, model);
  }

  deleteCustomer(id: Guid) {
    return this.http.delete(this.baseUrl + 'customer/' + id);
  }
}
