import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupObj: any = {
    username: '',
    email: '',
    password: '',
    location: '',
    userType: '',
    tel: '',
    cin: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  onSignup() {
    this.http.post('http://localhost:3000/auth/signup', this.signupObj).subscribe({
      next: (res: any) => {
        alert('Signup Success');
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.error('Signup Error:', error);
        alert('Signup Failed. Please try again.');
      }
    });
  }
}
