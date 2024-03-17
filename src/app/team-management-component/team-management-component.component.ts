import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management-component.component.html',
  styleUrls: ['./team-management-component.component.css']
})
export class TeamManagementComponent implements OnInit {
  technicians: any[] = [];
  token: string = '';
  teamName: string = '';
  selectedTechnicians: number[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Make an HTTP GET request to fetch the technicians
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });
    this.http.get<any[]>('http://localhost:3000/auth/users/technicians', { headers }).subscribe(
      (data) => {
        this.technicians = data;
      },
      (error) => {
        console.error('Error fetching technicians:', error);
      }
    );
  }

  onSubmit(): void {
    // Make an HTTP POST request to add technicians to the team
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`, // Include JWT token in request header
      'Content-Type': 'application/json'
    });
    const body = {
      teamName: this.teamName,
      technicians: this.selectedTechnicians
    };
    this.http.post<any>('http://localhost:3000/auth/Tech-Team', body, { headers }).subscribe(
      (response) => {
        console.log('Technicians added to team:', response);
        // Optionally, update the list of technicians displayed in the component
      },
      (error) => {
        console.error('Error adding technicians to team:', error);
      }
    );
  }
}
