import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { ChartsComponent } from './charts/charts.component';
import { SettingsComponent } from './settings/settings.component';
import { ReportComponent } from './report/report.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './services/AuthGuard/auth-guard.service'; // Import the AuthGuard
import { MyMapComponent } from './my-map/my-map.component'; // Import MyMapComponent
import { LocationChartComponent } from './location-chart/location-chart.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route redirects to login
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'report', component: ReportComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Add AuthGuard here
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, children: [
        { path: 'mymap', component: MyMapComponent } // Add MyMapComponent as a child route
      ] },
      { path: 'users', component: UsersComponent },
      { path: 'charts', component: LocationChartComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'submit', component: ReportComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
