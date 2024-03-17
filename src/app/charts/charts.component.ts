import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  chartData: any; // Variable to store chart data
  token: string = ''; // Variable to store JWT token

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchAnalytics(); // Fetch analytics when component initializes
  }

  fetchAnalytics(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any>(' http://localhost:3001/analytics/status', { headers }).subscribe(
      (data) => {
        // Format data for histogram
        this.chartData = [
          { name: 'Resolved', value: data.total_resolved },
          { name: 'In Progress', value: data.total_in_progress }
        ];
      },
      (error) => {
        console.error('Error fetching analytics:', error);
        // Handle error
      }
    );
  }
}
