import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { BookCardComponent } from '../book-card/book-card.component';
import { FooterComponent } from '../footer/footer.component';
import { NotesService } from '../../services/note/notes.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    MatDividerModule,
    MatMenuModule,
    BookCardComponent,
    FooterComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isLoggedIn = false;
  userName = 'User';

  books: any[] = [];

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.notesService.getBooks().subscribe({
      next: (res: any) => {
        this.books = res.result || [];
      },
      error: (err) => console.error('Error fetching books:', err),
    });
  }
}
