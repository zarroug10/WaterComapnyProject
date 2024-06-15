import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CustomInterceptor } from './services/Intercepter/custom.interceptor';
import { ReportComponent } from './report/report.component';
import { TeamManagementComponent } from './team-management-component/team-management-component.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UsersComponent } from './users/users.component';
import { ChartsComponent } from './charts/charts.component';
import { MessagesComponent } from './messages/messages.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './services/AuthGuard/auth-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MyMapComponent } from './my-map/my-map.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LocationChartComponent } from './location-chart/location-chart.component';
import { ChartModule } from 'angular-highcharts';
import { ClientsComponent } from './clients/clients.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    ReportComponent,
    TeamManagementComponent,
    HomeComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    UsersComponent,
    ChartsComponent,
    MessagesComponent,
    SettingsComponent,
    MyMapComponent,
    LocationChartComponent,
    ClientsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass:'toast-top-right',
      toastClass: 'ngx-toastr',  }),
      ChartModule ,
  ],
  providers: [
    AuthGuard, // Provide the AuthGuard
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
