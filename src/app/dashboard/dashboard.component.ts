import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  incidents: any[] = [];
  users: any[] = [];
  baseUrl = 'http://localhost:3001/uploads/';
  token: string = ''; // Variable to store JWT token
  searchParams: any = {}; // Object to store search parameters

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchIncidents();
    this.fetchUsers(); // Fetch users when component initializes
  }

  // Fetch incidents from backend
  fetchIncidents(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>('http://localhost:3001/incidents', { headers }).subscribe(
      (data) => {
        this.incidents = data;
      },
      (error) => {
        console.error('Error fetching incidents:', error);
        // Handle error
      }
    );
  }

  // Fetch users from backend
  fetchUsers(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>('http://localhost:3000/auth/users', { headers }).subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle error
      }
    );
  }

  // // Search users based on provided parameters
  // searchUsers(): void {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.token}` // Include JWT token in request header
  //   });

  //   let queryParams: any = {};

  //   if (this.searchParams.username) {
  //     queryParams.username = this.searchParams.username;
  //   }

  //   if (this.searchParams.tel) {
  //     queryParams.tel = this.searchParams.tel;
  //   }

  //   if (this.searchParams.location) {
  //     queryParams.location = this.searchParams.location;
  //   }

  //   this.http.get<any[]>('http://localhost:3000/auth/search', {
  //     headers,
  //     params: queryParams // Pass search parameters as query params
  //   }).subscribe(
  //     (data) => {
  //       this.users = data;
  //     },
  //     (error) => {
  //       console.error('Error searching users:', error);
  //       // Handle error
  //     }
  //   );
  // }

  // Check if media is an image
  isImage(media: string): boolean {
    return media.endsWith('.jpg') || media.endsWith('.jpeg') || media.endsWith('.png') || media.endsWith('.gif');
  }

  isVideo(media: string): boolean {
    return media.endsWith('.mp4') || media.endsWith('.avi') || media.endsWith('.mov') || media.endsWith('.wmv');
  }

  getMediaUrl(filename: string): string {
    return this.baseUrl + filename;
  }
}
