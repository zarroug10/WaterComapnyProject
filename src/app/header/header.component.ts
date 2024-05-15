import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) { }

  onLogout() {
    // Clear the token from local storage
    localStorage.removeItem('loginToken');
    // Redirect the user to the login page or any other appropriate page
    this.router.navigateByUrl('/login');
  }
}
