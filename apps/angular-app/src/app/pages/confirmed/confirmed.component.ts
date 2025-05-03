


// import { NavbarComponent } from "../UI/shared--UI/navbar/navbar.component";
import { Router, RouterLink } from '@angular/router';
// import { authService } from '../../services/product.service'; // Removed as the module cannot be found
import { Component } from "@angular/core";
import { NgIf } from "@angular/common";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-order-confirmation',
  standalone:true,
  // providers: [authService], // Removed or commented out as authService is not defined

  
  templateUrl: './confirmed.component.html',
  styleUrls: ['./confirmed.component.css'],
  imports: [NgIf, LoaderComponent]
 
})
export class ConfirmedComponent {
quantity: any;
isLoading: any;
  authService: any;
  constructor(
  private router: Router
) {}


ngOnInit() {
  
  setTimeout(() => {
    this.isLoading = false;  
  }, 1000);  
}

proceedToLogin() {

  this.authService.clearPayment();
  
  this.router.navigate(['/login']);
  this.router.navigate(['/login'], { replaceUrl: true });
}


}

