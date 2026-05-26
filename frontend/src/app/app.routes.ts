import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';
import { roleGuard } from './core/guards/role.guard';

const ALL_ROLES = ['admin', 'receptionist', 'housekeeping', 'kitchen'];
const ADMIN_RECEP = ['admin', 'receptionist'];
const ADMIN_ONLY = ['admin'];
const ADMIN_HK = ['admin', 'housekeeping'];
const ADMIN_KITCHEN = ['admin', 'receptionist', 'kitchen'];

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [roleGuard(ALL_ROLES)],
        loadChildren: () =>
          import('./modules/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'rooms',
        canActivate: [roleGuard(['admin', 'receptionist', 'housekeeping'])],
        loadChildren: () => import('./modules/rooms/rooms.routes').then((m) => m.ROOM_ROUTES),
      },
      {
        path: 'customers',
        canActivate: [roleGuard(ADMIN_RECEP)],
        loadChildren: () =>
          import('./modules/customers/customers.routes').then((m) => m.CUSTOMER_ROUTES),
      },
      {
        path: 'reservations',
        canActivate: [roleGuard(ADMIN_RECEP)],
        loadChildren: () =>
          import('./modules/reservations/reservations.routes').then((m) => m.RESERVATION_ROUTES),
      },
      {
        path: 'billing',
        canActivate: [roleGuard(ADMIN_RECEP)],
        loadChildren: () =>
          import('./modules/billing/billing.routes').then((m) => m.BILLING_ROUTES),
      },
      {
        path: 'food',
        canActivate: [roleGuard(ADMIN_KITCHEN)],
        loadChildren: () => import('./modules/food/food.routes').then((m) => m.FOOD_ROUTES),
      },
      {
        path: 'housekeeping',
        canActivate: [roleGuard(ADMIN_HK)],
        loadChildren: () =>
          import('./modules/housekeeping/housekeeping.routes').then((m) => m.HOUSEKEEPING_ROUTES),
      },
      {
        path: 'reports',
        canActivate: [roleGuard(ADMIN_ONLY)],
        loadChildren: () => import('./modules/reports/reports.routes').then((m) => m.REPORT_ROUTES),
      },
      {
        path: 'access-denied',
        loadComponent: () =>
          import('./shared/components/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
