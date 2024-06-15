import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  messageForm: FormGroup;
  @ViewChild('messageModal') messageModal!: ElementRef;

  constructor(private http: HttpClient, private fb: FormBuilder, private renderer: Renderer2) { 
    this.messageForm = this.fb.group({
      messageContent: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

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

  // Show the modal
  showModal(): void {
    this.renderer.setStyle(this.messageModal.nativeElement, 'display', 'block');
    this.renderer.addClass(this.messageModal.nativeElement, 'show');
  }

  // Hide the modal
  hideModal(): void {
    this.renderer.setStyle(this.messageModal.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.messageModal.nativeElement, 'show');
  }

  // Send message to backend
  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`, // Include JWT token in request header
      'Content-Type': 'application/json'
    });

    const messageData = this.messageForm.value;

    this.http.post('http://localhost:3004/send', messageData, { headers }).subscribe(
      (response: any) => {
        console.log('Message sent successfully:', response);
        // Handle success (e.g., show a success message, clear the form, etc.)
        this.hideModal();
      },
      (error) => {
        console.error('Error sending message:', error);
        // Handle error
      }
    );
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
}
