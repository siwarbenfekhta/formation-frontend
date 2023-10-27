import {Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { navItemsAdmin } from '../../_nav';
import { navItemsUser } from '../../_nav';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {

  public sidebarMinimized = false;
  public navItems  ;
  public role = localStorage.getItem('role');
  constructor(private authService : AuthService){}
  ngOnInit() {
    if (this.role == 'ROLE_ADMIN'){
      this.navItems = navItemsAdmin
    }
    else{
      this.navItems = navItemsUser ;
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logout(){
    this.authService.logout();

  }
}
