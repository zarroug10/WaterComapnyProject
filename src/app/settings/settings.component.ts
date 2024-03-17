import { Component } from '@angular/core';
import { ThemeService } from '../services/theme/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  dashboardSettings: any = {
    theme: 'light', // Default theme
    notifications: true, // Whether notifications are enabled
    displayOptions: {
      showGrid: true, // Whether to display a grid layout
      showSidebar: true // Whether to display a sidebar
    }
  };

  constructor(private themeService: ThemeService) {}

  updateTheme(event: any): void {
    const theme = event.target.value;
    this.dashboardSettings.theme = theme;
    this.themeService.setTheme(theme);
  }

  toggleNotifications(): void {
    this.dashboardSettings.notifications = !this.dashboardSettings.notifications;
    // You can add logic to handle notifications here
  }

  toggleGrid(): void {
    this.dashboardSettings.displayOptions.showGrid = !this.dashboardSettings.displayOptions.showGrid;
    // You can add logic to handle grid visibility here
  }

  toggleSidebar(): void {
    this.dashboardSettings.displayOptions.showSidebar = !this.dashboardSettings.displayOptions.showSidebar;
    // You can add logic to handle sidebar visibility here
  }
}
