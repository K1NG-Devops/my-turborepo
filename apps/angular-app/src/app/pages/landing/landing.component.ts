import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  redirectToReactApp() {
    window.location.href = 'http://localhost:5173/';
  }

}
