import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-angular-app';
  repairReports: any[] = [];
  token: string = ''; 

  constructor(private http: HttpClient, private renderer: Renderer2, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || ''; // Retrieve token from local storage or other storage method
    this.fetchRepairReports();

    // Poll for new notifications every 30 seconds
    setInterval(() => {
      this.fetchRepairReports();
    }, 30000);
  }

  fetchRepairReports(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Include JWT token in request header
    });

    this.http.get<any[]>('http://localhost:3001/repair-Reports', { headers }).subscribe(
      (data) => {
        const newReports = data.filter(report => !this.repairReports.some(existingReport => existingReport.id === report.id));
        newReports.forEach((report) => {
          this.fetchUsername(report.userId).then((username) => {
            report.username = username;
            this.repairReports.push(report);
            // Show toast notification for new report
            this.toastr.info(`New report from ${username}`, 'New Notification');
            // Play audio notification
            this.playAudioNotification();
          });
        });
      },
      (error) => {
        console.error('Error fetching repair reports:', error);
        // Handle error
      }
    );
  }

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

  playAudioNotification(): void {
    const audio = new Audio('assets/mixkit-correct-answer-tone-2870.wav'); // Change the path if necessary
    audio.play();
  }
}
