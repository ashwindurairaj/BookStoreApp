import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bookstore_user/login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    redirectTo: 'bookstore_user/login/',
    pathMatch: 'full',
  },
];
