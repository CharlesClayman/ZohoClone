import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Term } from '../_model/term';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTerms(query: string | null = null) {
    let params = new HttpParams();
    if (query) {
      params = params.append('searchQuery', query);
    }
    return this.http.get(this.baseUrl + 'term', { params });
  }

  getSingleTerm(id: Guid) {
    return this.http.get(this.baseUrl + 'term/' + id);
  }

  createTerm(model: any) {
    return this.http.post(this.baseUrl + 'term', model);
  }

  deleteTerm(id: Guid) {
    return this.http.delete(`${this.baseUrl}term/${id}`);
  }

  updateTerm(model: any, id: Guid) {
    return this.http.put(`${this.baseUrl}term/${id}`, model);
  }
}
