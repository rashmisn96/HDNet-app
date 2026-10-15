import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const route = inject(Router);
  return auth.hasTokenAndRoles()?true:route.createUrlTree(['/login'])
};
