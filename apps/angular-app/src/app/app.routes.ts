import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { FormComponent } from './pages/form/form.component';
import { RegisterComponent } from './pages/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ParentComponent } from './pages/dashboard/parent/parent.component';
import { ChildComponent } from './pages/dashboard/child/child.component';
import { AdminComponent } from './pages/dashboard/admin/admin.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ConfirmedComponent } from './pages/confirmed/confirmed.component';

export const routes: Routes = [

{ path: '', component: LoginComponent},
{ path:'form', component: FormComponent},
{ path: 'register', component: RegisterComponent},
{ path: 'landing', component: LandingComponent},
{ path: 'projects', component: ProjectsComponent},
{ path: 'admin', component: AdminComponent },
{ path: 'parent', component: ParentComponent },
{ path: 'child', component: ChildComponent },
{ path: '', redirectTo: '/parent', pathMatch: 'full' }, 
{ path:'payment', component:PaymentComponent},
{ path:'confirmed', component: ConfirmedComponent},
  ];
  

