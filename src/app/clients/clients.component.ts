import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
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
    this.fetchUsers(); // Fetch users when component initializes
  }

  // Fetch users from backend
  fetchUsers(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>('http://localhost:3000/auth/users/clients', { headers }).subscribe(
      (data) => {
        this.users = data.map(user => ({
          ...user,
          success: user.status === 'success',
          failure: user.status === 'failure'
        }));
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.toastr.error('Error fetching users', 'error');
      }
    );
  }


  // Search users based on provided parameters
  searchUsers(): void {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });
  
    let queryParams: any = {};
  
    if (this.searchParams.username) {
        queryParams.username = this.searchParams.username;
    }
  
    if (this.searchParams.tel) {
        queryParams.tel = this.searchParams.tel;
    }
  
    if (this.searchParams.location) {
        queryParams.location = this.searchParams.location;
    }
  
    if (this.searchParams.cin) {
        queryParams.cin = this.searchParams.cin;
    }
  
    console.log('queryParams:', queryParams); // Log the queryParams object
  
    this.http.get<any>('http://localhost:3000/auth/search-Clients', {
      headers,
      params: queryParams // Pass search parameters as query params
    }).subscribe(
      (response) => {
          if (response.noClientsFound) {
              console.log('No clients found');
              this.noClientsFound = true;
              this.users = []; // Reset the users array
          } else {
              this.users = response.rows;
              console.log('Search results:', this.users); // Log the search results
          }
      },
      (error) => {
          console.error('Error searching users:', error);
          this.toastr.error('Error searching users', 'Error');
      }
    );
  }
  

  openModal(userId: string): void {
    this.fireUserId = userId; // Set the user ID to be fired
    this.modal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.modal.nativeElement.style.display = 'none';
  }

  fireUser(): void {
    const headers = new HttpHeaders({
      'Authorization': `${this.token}` // Include JWT token in request header
    });
  
    this.http.post(`http://localhost:3000/auth/ban/${this.fireUserId}`, {}, { headers }).subscribe(
      () => {
        this.toastr.success('User banned successfully', 'Success');
        // Optionally, you can update the user list after banning
        this.fetchUsers();
      },
      (error) => {
        console.error('Error banning user:', error);
        this.toastr.error('Error banning user', 'Error');
      }
    );
    // Close modal after banning
    this.closeModal();
  }
}
