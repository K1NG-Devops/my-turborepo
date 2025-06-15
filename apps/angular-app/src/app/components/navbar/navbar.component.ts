import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToExternal(path: string): void {
    this.toggleMenu();
    // Navigate to the correct React app domain
    const baseUrl = 'https://youngeagles.org.za';
    window.location.href = `${baseUrl}${path}`;
  }
}
