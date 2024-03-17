import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ColorHelper } from '@swimlane/ngx-charts'; // Import ColorHelper

@Component({
  selector: 'app-location-chart',
  templateUrl: './location-chart.component.html',
  styleUrls: ['./location-chart.component.css']
})
export class LocationChartComponent implements OnInit {
  chartData: any[] = [];
  baseUrl = 'http://localhost:3001/analytics/area'; // Update with your backend endpoint
  token: string = ''; // Variable to store JWT token

  colorScheme: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchLocationAnalytics();
    this.setColorScheme();
  }

  // Fetch location analytics from backend
  fetchLocationAnalytics(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>(this.baseUrl, { headers }).subscribe(
      (data) => {
        this.chartData = data.map(location => {
          return {
            name: location.location,
            value: location.incidentCount // Assuming you want to show incident count on y-axis
          };
        });
      },
      (error) => {
        console.error('Error fetching location analytics:', error);
        // Handle error
      }
    );
  }

  // Define custom color scheme
  setColorScheme(): void {
    this.colorScheme = {
      domain: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'] // Specify custom colors here
    };
  }
}
