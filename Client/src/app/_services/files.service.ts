import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  upload(data: any) {
    return this.httpClient.post(this.baseUrl + 'files', data);
  }
}
