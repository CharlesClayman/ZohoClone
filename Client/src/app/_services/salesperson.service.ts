import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SalespersonService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createSalesPerson(model: any) {
    return this.http.post(this.baseUrl + 'saleperson', model);
  }

  getSalesPersons(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'saleperson', { params });
  }

  getSalesperson(id: Guid) {
    return this.http.get(`${this.baseUrl}saleperson/${id}`);
  }
  updateSalesPerson(model: any, id: Guid) {
    return this.http.put(`${this.baseUrl}saleperson/${id}`, model);
  }

  deleteSalesperson(id: Guid) {
    return this.http.delete(`${this.baseUrl}saleperson/${id}`);
  }
}
