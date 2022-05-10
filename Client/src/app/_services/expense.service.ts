import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createSingleExpense(model: any) {
    return this.http.post(this.baseUrl + 'expenses', model);
  }

  createBulkExpense(model: any) {
    return this.http.post(this.baseUrl + 'expensecollections', model);
  }

  getSingleExpense(id: Guid) {
    return this.http.get(this.baseUrl + 'expenses/' + id);
  }

  getAllExpenses(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'expenses', { params });
  }

  deleteExpense(id: Guid) {
    return this.http.delete(this.baseUrl + 'expenses/' + id);
  }

  updateExpense(id: Guid, model: any) {
    return this.http.put(this.baseUrl + 'expenses/' + id, model);
  }
}
