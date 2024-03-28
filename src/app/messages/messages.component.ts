import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements AfterViewInit {
  incidents: any[] = [];
  baseUrl = 'http://localhost:3001/uploads/';
  token: string = ''; // Variable to store JWT token
  assignee: number | null = null;
  repairReports: any[] = [];
  teams: {id:string, name: string, members: { username: string }[] }[] = [];
  selectedIncidentId: number | null = null; // Default value is null
incident: any = {
    title: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
    media: null // This will hold the selected media file
  };

  @ViewChild('myModal') modal!: ElementRef;

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.fetchIncidents();
    this.fetchRepairReports();
    this.getTeams();
  }

  ngAfterViewInit(): void {
    this.initAccordion();
  }

  // Fetch teams from backend
  getTeams(): void {
    this.http.get<{ teams: { id:string,name: string, members: { username: string }[] }[] }>('http://localhost:3003/auth/Teams').subscribe({
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

  private initAccordion(): void {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach((item) => {
      const button = item.querySelector('.accordion-button');
      const content = item.querySelector('.accordion-content');

      if (button && content) {
        button.addEventListener('click', () => {
          const expanded = button.getAttribute('aria-expanded') === 'true';

          this.renderer.setAttribute(button, 'aria-expanded', String(!expanded));
          this.renderer.setStyle(content, 'maxHeight', expanded ? null : `${content.scrollHeight}px`);
        });
      }
    });
  }

  toggleAccordion(event: Event): void {
    const button = event.target as HTMLElement;
    const content = button.nextElementSibling as HTMLElement;

    const expanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!expanded));
    content.classList.toggle('show');
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




}
