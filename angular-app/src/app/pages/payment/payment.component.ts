import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// import { NavbarComponent } from "../UI/shared--UI/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [  FormsModule, CommonModule ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  cardDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  };

  orderData: any;
  dashboardData: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.orderData = navigation?.extras.state?.['dashboardData'] || null;

  
  }

  processPayment(): void {
    if (!this.cardDetails.cardNumber || !this.cardDetails.expiryDate || !this.cardDetails.cvv || !this.cardDetails.cardHolderName) {
      alert('Please fill in all card details.');
      return;
    }

    console.log('Payment successful:', { ...this.dashboardData, paymentDetails: this.cardDetails });


    this.router.navigate(['/confirmed']);
  }
}