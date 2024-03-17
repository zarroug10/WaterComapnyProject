// theme.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: string = 'light'; // Default theme

  constructor() {
    this.applyTheme(this.currentTheme);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    this.applyTheme(theme);
  }

  private applyTheme(theme: string): void {
    const themeClass = theme === 'dark' ? 'theme-dark' : '';
    document.body.className = themeClass;
  }
}
