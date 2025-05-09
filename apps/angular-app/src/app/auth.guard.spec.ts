// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { authGuard } from './auth.guard';
// import { AuthService } from './services/auth.service';
// import { Router } from '@angular/router';
// import { of } from 'rxjs';

// describe('authGuard', () => {
//   let mockAuthService: jasmine.SpyObj<AuthService>;
//   let mockRouter: jasmine.SpyObj<Router>;

//   const executeGuard: CanActivateFn = (...guardParameters) =>
//     TestBed.runInInjectionContext(() => authGuard(...guardParameters));

//   beforeEach(() => {
//     mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
//     mockRouter = jasmine.createSpyObj('Router', ['navigate']);

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: AuthService, useValue: mockAuthService },
//         { provide: Router, useValue: mockRouter },
//       ],
//     });
//   });

//   it('should allow access if user is logged in', () => {
//     mockAuthService.isLoggedIn.and.returnValue(true);

//     const mockRoute = {} as ActivatedRouteSnapshot;
//     const mockState = {} as RouterStateSnapshot;
//     const result = executeGuard(mockRoute, mockState);

//     expect(result).toBeTrue();
//   });

//   it('should deny access and navigate to login if user is not logged in', () => {
//     mockAuthService.isLoggedIn.and.returnValue(false);

//     const mockRoute = {} as ActivatedRouteSnapshot;
//     const mockState = {} as RouterStateSnapshot;
//     const result = executeGuard(mockRoute, mockState);

//     expect(result).toBeFalse();
//     expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
//   });
// });
