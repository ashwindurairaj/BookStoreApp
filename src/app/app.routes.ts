import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bookstore_user/login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'bookstore_user/register',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
