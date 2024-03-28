import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  teams: { name: string, members: { username: string }[] }[] = [];
  incident: any = {
    title: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
    media: null // This will hold the selected media file
  };

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.getTeams();
  }
  getTeams(): void {
    this.http.get<{ teams: { name: string, members: { username: string }[] }[] }>('http://localhost:3003/auth/Teams').subscribe({
      next: (response) => {
        this.teams = response.teams;
      },
      error: (error) => {
        console.error('Error fetching teams:', error);
      }
    });
  }

  async submitIncident(): Promise<void> {
    try {
      if (navigator && navigator.geolocation) {
        await this.getLocation(); // Wait for getLocation() to complete
      } else {
        console.error('Geolocation is not supported by this browser.');
        // Handle the case where geolocation is not supported
        return;
      }

      const formData = new FormData();
      formData.append('title', this.incident.title);
      formData.append('description', this.incident.description);
      formData.append('location', this.incident.location);
      formData.append('latitude', this.incident.latitude);
      formData.append('longitude', this.incident.longitude);
      formData.append('media', this.incident.media);

      console.log('Incident data being sent:', {
        title: this.incident.title,
        description: this.incident.description,
        location: this.incident.location,
        latitude: this.incident.latitude,
        longitude: this.incident.longitude,
        media: this.incident.media
      });

      this.http.post('http://localhost:3001/submit', formData).subscribe({
        next: (response: any) => {
          console.log('Incident reported successfully:', response);
          // Clear the form after successful submission
          this.incident = { title: '', description: '', latitude: null, longitude: null, media: null };
        },
        error: (error) => {
          console.error('Error reporting incident:', error);
          // Handle error
        }
      });
    } catch (error) {
      console.error('Error getting location:', error);
      // Handle error
    }
  }

  handleMediaUpload(event: any): void {
    const file = event.target.files[0];
    this.incident.media = file;
  }

  getLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.incident.latitude = position.coords.latitude;
          this.incident.longitude = position.coords.longitude;
          console.log('Location obtained:', this.incident.latitude, this.incident.longitude);
          resolve(); // Resolve the promise after obtaining the location
        },
        error => {
          console.error('Error getting location:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  }
}
