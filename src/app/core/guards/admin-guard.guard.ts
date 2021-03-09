import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentAdmin = this.authService.currentAdminValue;
    if (currentAdmin) {
      console.log('logged in');
      // logged in so return true
      return true;
    }
    console.log("gasdgh");
    console.log(state);

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
