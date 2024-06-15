import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  noClientsFound: boolean = false;
  token: string = ''; 
  searchParams: any = {}; 
  fireUserId: string = ''; 
  updatedUser: any = {}; 
  newUser: any = { userType: 'technician' }; 
  @ViewChild('addEmployeeModal') addEmployeeModal!: ElementRef;
  @ViewChild('myModal') modal!: ElementRef;
  @ViewChild('updateModal') updateModal!: ElementRef; 
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

    this.http.get<any[]>('http://localhost:3000/auth/users/technicians', { headers }).subscribe(
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
  
    this.http.get<any>('http://localhost:3000/auth/search-Tech', {
      headers,
      params: queryParams // Pass search parameters as query params
    }).subscribe(
      (response) => {
          if (response.noClientsFound) {
              console.log('No technicians found');
              this.noClientsFound = true;
              this.users = []; 
          } else {
              this.users = response.rows;
              console.log('Search results:', this.users); 
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

    this.http.delete(`http://localhost:3000/auth/users/${this.fireUserId}`, { headers }).subscribe(
      () => {
        this.toastr.success('User deleted successfully', 'success');
        this.fetchUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
        this.toastr.error('Error deleting user', 'error');
      }
    );
    // Close modal after deletion
    this.closeModal();
  }

  openUpdateModal(user: any): void {
    // Populate the modal with user details
    this.updatedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      location: user.location,
      cin: user.cin,
      tel: user.tel
    };

    // Open the update modal
    this.updateModal.nativeElement.style.display = 'block';
  }

  closeUpdateModal(): void {
    this.updateModal.nativeElement.style.display = 'none';
  }

  updateUser(): void {
    const headers = new HttpHeaders({
      'Authorization': `${this.token}` // Include JWT token in request header
    });

    this.http.put(`http://localhost:3000/auth/users/${this.updatedUser.id}`, this.updatedUser, { headers }).subscribe(
      () => {
        this.toastr.success('User updated successfully', 'success');
        this.fetchUsers();
      },
      (error) => {
        console.error('Error updating user:', error); 
        this.toastr.error('Error updating user', 'error');
      }
    );
    // Close modal after update
    this.closeUpdateModal();
  }

  openAddEmployeeModal(): void {
    // Clear the newUser object
    this.newUser = { userType: 'technician' }; // Reset userType to 'technician' when opening modal
    // Open the modal
    this.addEmployeeModal.nativeElement.style.display = 'block';
  }

  // Method to close add employee modal
  closeAddEmployeeModal(): void {
    // Close the modal
    this.addEmployeeModal.nativeElement.style.display = 'none';
  }

  // Method to add a new employee
  signup(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Set content type to JSON
    });

    this.http.post('http://localhost:3000/auth/signup', this.newUser, { headers }).subscribe(
      (data) => {
        this.toastr.success('Employee added successfully', 'success');
        // Optionally, you can update the user list after adding
        this.fetchUsers();
      },
      (error) => {
        console.error('Error adding employee:', error);
        this.toastr.error('Error adding employee', 'error');
      }
    );
    // Close modal after adding employee
    this.closeAddEmployeeModal();
  }

  showToast(message: string, type: string): void {
    let toastrClass: string = '';

    if (type === 'success') {
      toastrClass = 'toast-success'; // Define a CSS class for success messages
    } else if (type === 'error') {
      toastrClass = 'toast-error'; // Define a CSS class for error messages
    }

    this.toastr.show(message, '', {
      positionClass: 'toast-top-right',
      toastClass: toastrClass // Use the appropriate CSS class
    });
  }

}
