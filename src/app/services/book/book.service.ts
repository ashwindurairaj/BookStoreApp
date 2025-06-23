import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: any[] = [];

  constructor(private http: HttpService) {}

  getBooks() {
    return this.http.getApi('bookstore_user/get/book', this.http.getHeader());
  }

  setBooks(books: any[]) {
    this.books = books;
  }

  getBookById(id: string) {
    return this.books.find((book) => book._id === id);
  }
}
