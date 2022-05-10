import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCategory(model: any) {
    return this.http.post(this.baseUrl + 'category', model);
  }

  getCategories(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'category', { params });
  }

  getCategory(id: Guid) {
    return this.http.get(`${this.baseUrl}category/${id}`);
  }

  updateCategory(model: any, id: Guid) {
    return this.http.put(`${this.baseUrl}category/${id}`, model);
  }

  deleteCategory(id: Guid) {
    return this.http.delete(`${this.baseUrl}category/${id}`);
  }
}
