import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book/book.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-details',
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  book: any;
  feedbacks: any[] = [];
  selectedRating = 0;
  feedbackText = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    this.book = this.bookService.getBookById(bookId!);

    if (this.book) {
      this.getFeedback();
    }
  }

  getFeedback(): void {
    this.userService.getFeedback(this.book._id).subscribe({
      next: (res: any) => {
        this.feedbacks = res.result.map((fb: any) => ({
          userName: fb.user_id.fullName,
          comment: fb.comment,
          rating: fb.rating,
        }));
      },
      error: (err) => console.error('Failed to fetch feedback:', err),
    });
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitFeedback(): void {
    const payload = {
      rating: this.selectedRating,
      comment: this.feedbackText,
    };

    this.userService.postFeedback(this.book._id, payload).subscribe({
      next: () => {
        this.getFeedback();
        this.selectedRating = 0;
        this.feedbackText = '';
      },
      error: (err) => console.error('Failed to submit feedback:', err),
    });
  }
}
