import { HttpClient } from '@angular/common/http';
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
    return this.http.post<Customer>(this.baseUrl + 'customer', model).pipe(
      map((response: Customer) => {
        const customer = response;
        if (customer) {
          console.log(customer);
        }
      })
    );
  }

  getAllCustomers() {
    return this.http.get(this.baseUrl + 'customer');
  }

  getSingleCustomer(model: any) {
    return this.http.get(this.baseUrl + 'customer/' + model);
  }
  updateCustomer(id: Guid, model: any) {
    return this.http.put(this.baseUrl + 'customer/' + id, model);
  }

  deleteCustomer() {}
}
