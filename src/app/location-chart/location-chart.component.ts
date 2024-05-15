import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Highcharts from 'highcharts';

// Define an interface for the response data
interface OverallAverageFeedbackResponse {
  overallAverageFeedback: {
    hourOfDay: number,
    averageValue: number
  }[];
}

@Component({
  selector: 'app-location-chart',
  templateUrl: './location-chart.component.html',
  styleUrls: ['./location-chart.component.css']
})
export class LocationChartComponent implements OnInit {
  chartData: any[] = [];
  overallAverageFeedbackData: { hourOfDay: number, averageValue: number }[] = [];
  baseUrl = 'http://localhost:3001/analytics/area'; // Update with your backend endpoint
  overallAverageFeedbackUrl = 'http://localhost:3002/Statistics'; // Update with overall average feedback URL
  token: string = '';
  colorScheme: any;
  highcharts = Highcharts;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchLocationAnalytics();
    this.fetchOverallAverageFeedback();
    this.setColorScheme();
  }

  fetchLocationAnalytics(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<any[]>(this.baseUrl, { headers }).subscribe(
      (data) => {
        this.chartData = data.map(location => {
          return {
            name: location.location,
            value: location.incidentCount
          };
        });
      },
      (error) => {
        console.error('Error fetching location analytics:', error);
      }
    );
  }

  fetchOverallAverageFeedback(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const filterBy = "day"; // Assuming you want to filter by day

    this.http.get<any>(`${this.overallAverageFeedbackUrl}?filterBy=${filterBy}`, { headers }).subscribe(
      (data: OverallAverageFeedbackResponse) => {
        if (data && data.overallAverageFeedback) { // Ensure data and overallAverageFeedback are not null
          this.overallAverageFeedbackData = data.overallAverageFeedback;
          this.renderHighcharts(); // Call function to render Highcharts
        } else {
          console.error('Invalid overall average feedback data received:', data);
        }
      },
      (error) => {
        console.error('Error fetching overall average feedback data:', error);
      }
    );
  }

  renderHighcharts(): void {
    const chartData = this.overallAverageFeedbackData.map(item => [item.hourOfDay, item.averageValue]);

    Highcharts.chart({
      chart: {
        type: 'line',
        renderTo: 'overallAverageFeedbackChart' // Specify the renderTo option here
      },
      title: {
        text: 'Overall Average Feedback'
      },
      xAxis: {
        title: {
          text: 'Hour of the Day'
        },
        categories: chartData.map(item => String(item[0])) // Ensure categories are cast as strings
      },
      yAxis: {
        title: {
          text: 'Average Value'
        }
      },
      series: [{
        type: 'line', // Specify the type as 'line' for the series
        name: 'Average Feedback',
        data: chartData.map(item => Number(item[1])) // Ensure data values are cast as numbers
      }]
    });
  }

  setColorScheme(): void {
    this.colorScheme = {
      domain: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
    };
  }
}
