import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;  // Not logged in — can see login page
  }

  // Already logged in — send them to dashboard
  router.navigate(['/dashboard']);
  return false;
};