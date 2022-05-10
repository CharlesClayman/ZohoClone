import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createIncome(model: any) {
    return this.http.post(this.baseUrl + 'income', model);
  }
  getSingleIncome(Id: Guid) {
    return this.http.get(this.baseUrl + 'income/' + Id);
  }
  getAllIncome(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }

    return this.http.get(this.baseUrl + 'income', { params });
  }
  deleteIncome(Id: Guid) {
    return this.http.delete(this.baseUrl + 'income/' + Id);
  }
  updateIncome(Id: Guid, Model: any) {
    return this.http.put(this.baseUrl + 'income/' + Id, Model);
  }
}
