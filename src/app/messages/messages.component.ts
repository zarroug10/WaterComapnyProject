import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent{
  incidents: any[] = [];
  baseUrl = 'http://localhost:3001/uploads/';
  token: string = ''; // Variable to store JWT token
  assignee: number | null = null;
  repairReports: any[] = [];
  teams: {id:string, name: string, members: { username: string }[],status:string }[] = [];
  selectedIncidentId: number | null = null; // Default value is null
  selectedNotification: any = {};
incident: any = {
    title: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
    media: null // This will hold the selected media file
  };

  @ViewChild('myModal') modal!: ElementRef;
  @ViewChild('Notification') Notification!: ElementRef;
  @ViewChild('toastContainer') toastContainer!: ElementRef;

  constructor(private http: HttpClient, private renderer: Renderer2, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchIncidents();
    this.fetchRepairReports();
    this.getTeams();
  }


  // Fetch teams from backend
  getTeams(): void {
    this.http.get<{ teams: { id:string,name: string, members: { username: string }[],status:string }[] }>('http://localhost:3003/auth/Teams').subscribe({
      next: (response) => {
        this.teams = response.teams;
      },
      error: (error) => {
        console.error('Error fetching teams:', error);
      }
    });
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

  fetchRepairReports(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>('http://localhost:3001/repair-Reports', { headers }).subscribe(
      (data) => {
        this.repairReports = data;
        // Now fetch the usernames associated with userIds
        this.repairReports.forEach((report) => {
          this.fetchUsername(report.userId).then((username) => {
            report.username = username;
          });
        });
      },
      (error) => {
        console.error('Error fetching repair reports:', error);
        // Handle error
      }
    );
  }

  
  openMessage(report: any): void {
    // Populate the modal with notification details
    this.selectedNotification = {
      id: report.id,
      username: report.username,
      Date: report.created_at,
      description: report.description,
      duration: report.duration,
    };

    // Open the notification modal
    this.Notification.nativeElement.style.display = 'block';
  }

  closeMessage(): void {
    this.Notification.nativeElement.style.display = 'none';
  }

  // Fetch username associated with userId
  fetchUsername(userId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`http://localhost:3000/auth/users/user/${userId}`).subscribe(
        (data) => {
          resolve(data.username);
        },
        (error) => {
          console.error(`Error fetching username for userId ${userId}:`, error);
          reject('Unknown User');
        }
      );
    });
  }

  getStatustextColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'available':
        return 'rgb(34, 177, 34)';
      case 'busy':
        return 'rgb(218, 8, 8)';
      default:
        return ''; 
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'available':
        return 'rgb(183, 253, 183)';
      case 'busy':
        return 'rgb(247, 154, 154)';
      default:
        return ''; 
    }
  }

  openModal(incidentId: number): void {
    // Assign the selected incident ID
    this.selectedIncidentId = incidentId;

    // Now, open the modal
    this.modal.nativeElement.style.display = 'block';
    console.log("incidentId:",incidentId)
}

  closeModal(): void {
    this.modal.nativeElement.style.display = 'none';
  }
  fetchIncidentById(incidentId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<any>(`http://localhost:3001/incidents/${incidentId}`, { headers });
  }

  assignTask(): void {
    if (!this.assignee || this.selectedIncidentId === null) {
        console.error('No team selected for assignment or no incident selected');
        return;
    }

    const teamId = this.assignee;

    console.log('Assigning task to team:', teamId, 'for incident ID:', this.selectedIncidentId);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
    });

    const body = { teamId };

    this.http.post<any>('http://localhost:3001/assign-incident-to-team', body, { headers }).subscribe(
        () => {
            console.log('Incident assigned to team successfully');
            // Optionally, display a success message or trigger any other action
        },
        (error) => {
            console.error('Error assigning incident to team:', error);
            // Handle error, display error message, etc.
        }
    );

    // Close modal after assignment
    this.closeModal();
}

fetchTeamById(teamId: number): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  return this.http.get<any>(`http://localhost:3003/auth/Teams/${teamId}`, { headers });
}

formatDate(date: string): string {
  const formattedDate = new Date(date);
  const currentDate = new Date();
  const diffInMs = Math.abs(currentDate.getTime() - formattedDate.getTime());
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}


onTeamSelectionChange(event: any): void {
  const teamId = event.target.value;
  if (teamId) {
    const parsedTeamId = parseInt(teamId, 10);
    if (!isNaN(parsedTeamId)) {
      this.fetchTeamById(parsedTeamId).subscribe(
        (data) => {
          console.log('Team details:', data);
        },
        (error) => {
          console.error('Error fetching team details:', error);
        }
      );
    } else {
      console.error('Invalid team ID:', teamId);
    }
  }
}
deleteRepairReport(reportId: number): void {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  this.http.delete<any>(`http://localhost:3001/repair-reports/${reportId}`, { headers }).subscribe(
    () => {
      this.toastr.success('Repair report deleted successfully', 'success');
      console.log('Repair report deleted successfully');
      // Remove the deleted report from the repairReports array
      this.repairReports = this.repairReports.filter(report => report.id !== reportId);
    },
    (error) => {
      console.error('Error deleting repair report:', error);
      // Handle error, display error message, etc.
    }
  );
}

}
