import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  redirectToReactApp(path: string = 'home'): void {
    window.location.href = `https://youngeagles.org.za/${path}`;
  }

}
