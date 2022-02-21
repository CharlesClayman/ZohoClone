import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Terms } from '../_model/terms';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTerms() {
    return this.http.get(this.baseUrl + 'term');
  }

  createTerm(model: any) {
    return this.http.post<Terms>(this.baseUrl + 'term', model).pipe(
      map((response: Terms) => {
        const term = response;
        console.log(term);
      })
    );
  }
}
