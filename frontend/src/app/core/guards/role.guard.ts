import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { filter, map, take } from 'rxjs';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router      = inject(Router);

    // Wait until user is actually loaded before checking role
    // filter(Boolean) skips null values and only proceeds once user exists
    return authService.currentUser$.pipe(
      filter(user => user !== null),
      take(1),
      map(user => {
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }
        router.navigate(['/access-denied']);
        return false;
      })
    );
  };
}