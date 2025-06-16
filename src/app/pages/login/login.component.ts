import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatTabsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  selectedTabIndex = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (currentPath?.includes('register')) {
      this.selectedTabIndex = 1;
    }
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;

    if (index === 0) {
      this.router.navigate(['/bookstore_user/login']);
    } else if (index === 1) {
      this.router.navigate(['/bookstore_user/register']);
    }
  }
}
