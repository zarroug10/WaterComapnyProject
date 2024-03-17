import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements AfterViewInit {
  incidents: any[] = [];
  baseUrl = 'http://localhost:3001/uploads/';
  token: string = ''; // Variable to store JWT token
  assignee: string = ''; // Assignee input value
  repairReports: any[] = [];

  @ViewChild('myModal') modal!: ElementRef;

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.fetchIncidents();
    this.fetchRepairReports();
  }

  ngAfterViewInit(): void {
    this.initAccordion();
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

  openModal(): void {
    this.modal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.modal.nativeElement.style.display = 'none';
  }

  assignTask(): void {
    // Perform assignment logic here
    console.log('Assigning task to:', this.assignee);

    // Close modal after assignment
    this.closeModal();
  }
}
