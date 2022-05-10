import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createInvoice(model: any) {
    return this.http.post(this.baseUrl + 'invoice', model);
  }

  getSingleInvoice(id: Guid) {
    return this.http.get(this.baseUrl + 'invoice/' + id);
  }

  getAllInvoices(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'invoice', { params });
  }

  deleteInvoice(id: Guid) {
    return this.http.delete(this.baseUrl + 'invoice/' + id);
  }

  updateInvoice(model: any, id: Guid) {
    return this.http.put(this.baseUrl + 'invoice/' + id, model);
  }
}
