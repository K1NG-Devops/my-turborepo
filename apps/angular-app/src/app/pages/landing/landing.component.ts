import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  redirectToReactApp() {
    window.location.href = 'https://react-app-two-olive.vercel.app/';
  }

}
