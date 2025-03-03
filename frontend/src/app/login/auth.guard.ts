import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/http/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.token) {
    router.navigateByUrl('/login');
    return false;
  }

  const refreshed = authService.refreshToken();

  return true;
};
