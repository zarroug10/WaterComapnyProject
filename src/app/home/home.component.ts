import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface AverageFeedbackPerIncident {
  incidentId: number;
  incidentTitle: string;
  teamName: string;
  averageValue: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Incident: any = {};
  locationAnalytics: any[] = [];
  Url = ' http://localhost:3001/analytics/area';
  baseUrl1 = 'http://localhost:3001/uploads/';
  incidents: any[] = [];
  baseUrl = 'http://localhost:3001/incidents';
  averageFeedbackPerIncident: AverageFeedbackPerIncident[] = [];
    url = ' http://localhost:3002/StatisticsperIncident';
  token: string = ''; // Variable to store JWT token
  @ViewChild('TimeModal') TimeModal!: ElementRef; // Add reference to the update modal


  constructor(private http: HttpClient,private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchIncidents(); // Fetch users when component initializes
    this.fetchLocationAnalytics();
    this.fetchAverageFeedbackPerIncident();
  }
  fetchAverageFeedbackPerIncident() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<{ averageFeedbackPerIncident: AverageFeedbackPerIncident[] }>(this.url, { headers }).subscribe(
      (data) => {
        this.averageFeedbackPerIncident = data.averageFeedbackPerIncident;
      },
      (error) => {
        console.error('Error fetching average feedback per incident:', error);
        // Handle error
      }
    );
  }



  fetchIncidents(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });
  
    this.http.get<any[]>('http://localhost:3001/incidents', { headers }).subscribe(
      (data) => {
        // Process the data to replace null team names with "Not yet assigned"
        this.incidents = data.map(incident => {
          if (!incident.team_name) {
            incident.team_name = 'Not yet assigned';
          }
          return incident;
        });
      },
      (error) => {
        console.error('Error fetching incidents:', error);
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
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return 'rgb(253, 253, 140)';
      case 'resolved':
        return ' rgb(183, 253, 183)';
      case 'reported':
        return 'rgb(247, 154, 154)';
        case 'assigned':
          return 'rgb(153, 206, 236)';
      default:
        return ''; 
    }
  }
  getStatustextColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return 'rgb(189, 186, 18)';
      case 'resolved':
        return 'rgb(34, 177, 34)';
      case 'reported':
        return 'rgb(218, 8, 8)';
        case 'assigned':
          return 'rgb(114, 87, 214)';
      default:
        return ''; 
    }
  }
  

  openTimeModal(incident: any): void {
    // Populate the modal with user details
    this.Incident = {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      location: incident.location,
      status: incident.status,
      media: incident.media,
      tel: incident.updated_at
    };

    // Open the update modal
    this.TimeModal.nativeElement.style.display = 'block';
  }

  closeTimeModal(): void {
    this.TimeModal.nativeElement.style.display = 'none';
  }
  getincidnetByid(): void {
    const headers = new HttpHeaders({
      'Authorization': `${this.token}` // Include JWT token in request header
    });

    this.http.put(`http://localhost:3001/incidents/${this.Incident.id}`, this.Incident, { headers }).subscribe(
      () => {
        this.toastr.success('User updated successfully', 'success');
        // Optionally, you can update the user list after updating
        this.fetchIncidents();
      },
      (error) => {
        console.error('Error updating user:', error); 
        this.toastr.error('Error updating user', 'error');
      }
    );
    // Close modal after update
    this.closeTimeModal();
  }
  // Check if media is an image
  isImage(media: string): boolean {
    return media.endsWith('.jpg') || media.endsWith('.jpeg') || media.endsWith('.png') || media.endsWith('.gif');
  }

  isVideo(media: string): boolean {
    return media.endsWith('.mp4') || media.endsWith('.avi') || media.endsWith('.mov') || media.endsWith('.wmv');
  }

  getMediaUrl(filename: string): string {
    return this.baseUrl1 + filename;
  }

  getCompletedStages(status: string): { completed: boolean[], currentStage: number } {
    let completedStages = [false, false, false, false];
    let currentStageIndex = -1;
    
    switch(status) {
      case 'reported':
        currentStageIndex = 0;
        break;
      case 'assigned':
        completedStages[0] = true;
        currentStageIndex = 1;
        break;
      case 'in_progress':
        completedStages[0] = true;
        completedStages[1] = true;
        currentStageIndex = 2;
        break;
      case 'resolved':
        completedStages = [true, true, true, true];
        currentStageIndex = 3;
        break;
      default:
        break;
    }
    
    return { completed: completedStages, currentStage: currentStageIndex };
  }
}
