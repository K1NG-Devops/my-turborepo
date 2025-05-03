import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { RegisterComponent } from '../register/register.component';
// import { RegisterComponent } from '../../components/register/register.component'; // adjust the path if needed

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // ✅ Add FormsModule to imports
    RegisterComponent // ✅ Import standalone component
  ]
})
export class AuthModule { }
