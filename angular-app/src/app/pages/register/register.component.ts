// import { Component, NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms'; // Import FormsModule
// // Removed redundant import of RegisterComponent
// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {
//   email: string = '';
//   username: string = '';
//   password: string = '';
//   confirmPassword: string = '';
//   errorMessage: string = '';
//   successMessage: string = '';

//   onRegister(): void {
//     if (this.password !== this.confirmPassword) {
//       this.errorMessage = "Passwords do not match!";
//       return;
//     }

//     // Simulate successful registration
//     console.log("Registered:", {
//       email: this.email,
//       username: this.username,
//       password: this.password
//     });

//     this.successMessage = "Registration successful!";
//     this.errorMessage = '';
//   }
// }


import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf], // Merged imports here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Fixed typo: styleUrl -> styleUrls
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match!";
      this.successMessage = '';
      return;
    }

    console.log("Registered:", {
      email: this.email,
      username: this.username,
      password: this.password
    });

    this.successMessage = "Registration successful!";
    this.errorMessage = '';
  }
}
