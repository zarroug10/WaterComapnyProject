import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginObj: any = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  onLogin() {
    this.http.post('http://localhost:3000/auth/login', this.loginObj).subscribe({
      next: (res: any) => {
        console.log('Token retrieved:', res.token);

        const decodedToken: any = jwtDecode(res.token);
        if (decodedToken.userType !== 'chief') {
          // Access denied for non-chief users
          alert('Access denied. Only chief users are allowed.');
          return;
        }
        localStorage.setItem('loginToken', res.token);

        // Redirect to dashboard after a delay
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard');
        }, 2000);
      },
      error: (error) => {
        console.error('Login Error:', error);
        alert('Login Failed. Please check your credentials.');
      }
    });
  }
}
