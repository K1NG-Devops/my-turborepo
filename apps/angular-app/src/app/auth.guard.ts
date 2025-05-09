// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     const token = localStorage.getItem('token');
//     if (token) return true;

//     this.router.navigate(['/login']);
//     return false;
//   }
// }
// // This guard checks if a token exists in local storage. If it does, it allows access to the route; otherwise, it redirects to the login page.
// // This is a simple implementation. In a real-world application, you would also want to check if the token is valid and not expired.
// // You can use this guard in your routing module like this:
// // import { NgModule } from '@angular/core';
// // import { RouterModule, Routes } from '@angular/router';
// // import { AuthGuard } from './auth.guard';
// // import { ParentDashboardComponent } from './parent-dashboard/parent-dashboard.component';
// // import { ChildDashboardComponent } from './child-dashboard/child-dashboard.component';
// // import { LoginComponent } from './login/login.component';
// // import { RegisterComponent } from './register/register.component';
// //
// // const routes: Routes = [