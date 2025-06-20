import { Routes } from '@angular/router';
import { AuthGuardService } from './services/user/auth-guard.service';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    redirectTo: '/login/',
    pathMatch: 'full',
  },
  {
    path: 'home',
    // canActivate: [AuthGuardService]
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
];
