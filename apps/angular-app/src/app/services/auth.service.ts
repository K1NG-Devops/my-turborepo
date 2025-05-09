// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private API_URL = 'http://y.e.youngeagles.org.za/api'; 

//   constructor(private http: HttpClient) {}

//   login(email: string, password: string): Observable<any> {
//     return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
//       catchError((error) => {
//         console.error('Login error:', error);
//         return throwError(() => error);
//       })
//     );
//   }

//   register(data: any): Observable<any> {
//     return this.http.post(`${this.API_URL}/register`, data).pipe(
//       catchError((error) => {
//         console.error('Registration error:', error);
//         return throwError(() => error);
//       })
//     );
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//   }

//   isLoggedIn(): boolean {
//     const token = this.getToken();
//     // Add additional validation logic if needed (e.g., token expiration check)
//     return !!token;
//   }
// }
