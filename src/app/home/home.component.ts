import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  locationAnalytics: any[] = [];
  Url = ' http://localhost:3001/analytics/area';
  users: any[] = [];
  baseUrl = 'http://localhost:3000/auth/users';
  feedbacks: any[] = [];
  url = ' http://localhost:3002/feedbacks';
  token: string = ''; // Variable to store JWT token

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUsers(); // Fetch users when component initializes
    this.fetchLocationAnalytics();
    this.fetchFeedback();
  }
  fetchFeedback() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>(this.url, { headers }).subscribe(
      (data) => {
        this.feedbacks = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle error
      }
    );
  }


  // Fetch users from backend
  fetchUsers(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>(this.baseUrl, { headers }).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle error
      }
    );
  }

// Fetch location analytics from backend
  fetchLocationAnalytics(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>(this.Url, { headers }).subscribe(
      (data) => {
        this.locationAnalytics = data;
      },
      (error) => {
        console.error('Error fetching location analytics:', error);
        // Handle error
      }
    );
  }
}
