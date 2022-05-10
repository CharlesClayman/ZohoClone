import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../_model/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createItem(model: any) {
    return this.http.post(this.baseUrl + 'items', model);
  }

  getAllItems(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'items', { params });
  }

  getSingleItem(id: Guid) {
    return this.http.get(`${this.baseUrl}items/` + id);
  }

  updateItem(id: Guid, model: any) {
    return this.http.put(this.baseUrl + 'items/' + id, model);
  }

  deleteItem(id: Guid) {
    return this.http.delete(this.baseUrl + 'items/' + id);
  }
}
