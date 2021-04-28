import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access-token');

    if (token === null) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
