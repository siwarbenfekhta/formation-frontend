import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router : Router,private authService : AuthService ){} ; 

  canActivate()
  {
    let role = localStorage.getItem('role');
    if (this.authService.isAuthenticated() && role == 'ROLE_USER')
    {
      return true;
    }
    this.router.navigate(['login']);
    console.log("you don't have access rights");
    return false ;
  }
  
}
