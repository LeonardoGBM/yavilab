import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ErroresComponent } from './pages/errores/errores.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    ErroresComponent
  ]
  
})
export class AppModule {
  
 }
