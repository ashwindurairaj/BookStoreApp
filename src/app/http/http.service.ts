import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseUrl = 'https://bookstore.incubation.bridgelabz.com/';

  constructor(private http: HttpClient) {}

  getHeader() {
    const header = new HttpHeaders({
      Authorization: localStorage.getItem('token') || '',
    });
    return header;
  }

  getApi(endpoint: string, headers: HttpHeaders = new HttpHeaders()) {
    return this.http.get(this.baseUrl + endpoint, { headers });
  }

  postApi(
    endpoint: string,
    payload: any,
    headers: HttpHeaders = new HttpHeaders()
  ) {
    return this.http.post(this.baseUrl + endpoint, payload, { headers });
  }
}
