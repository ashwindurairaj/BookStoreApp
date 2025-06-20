import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpService) {}

  getBooks() {
    return this.http.getApi('/bookstore_user/get/book', this.http.getHeader());
  }
}
