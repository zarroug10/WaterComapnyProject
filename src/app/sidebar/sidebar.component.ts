import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router: Router) { }

  onLogout() {
    // Clear the token from local storage
    localStorage.removeItem('loginToken');
    // Redirect the user to the login page or any other appropriate page
    this.router.navigateByUrl('/login');
  }
}
