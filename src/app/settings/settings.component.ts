import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ThemeService } from '../services/theme/theme.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  users: any[] = [];
  noClientsFound: boolean = false;
  token: string = ''; 
  searchParams: any = {}; 
  fireUserId: string = '';
  @ViewChild('myModal') modal!: ElementRef;
  @ViewChild('toastContainer') toastContainer!: ElementRef;
  
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getBlackList(); // Fetch users when component initializes
  }
  getBlackList(): void {
    const headers = new HttpHeaders({
      'Authorization': `${this.token}` // Include JWT token in request header
    });
  
    this.http.get<any[]>('http://localhost:3000/auth/Blacklist', { headers }).subscribe(
      (data) => {
        this.users = data;
        console.log('Blacklist:', this.users);
      },
      (error) => {
        console.error('Error retrieving blacklist:', error);
        this.toastr.error('Error retrieving blacklist', 'Error');
      }
    );
  }
  
  // Function to unban a user
  unbanUser(userId: string): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });
  
    this.http.put(`http://localhost:3000/auth/unban/${userId}`, {}, { headers }).subscribe(
      () => {
        this.toastr.success('User unbanned successfully', 'Success');
        // Optionally, you can update the blacklist after unbanning
        this.getBlackList();
      },
      (error) => {
        console.error('Error unbanning user:', error);
        this.toastr.error('Error unbanning user', 'Error');
      }
    );
}
}
