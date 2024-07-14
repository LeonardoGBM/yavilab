import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LaboratoriosComponent } from './pages/laboratorios/laboratorios.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginComponent,
    DashboardComponent,
    LaboratoriosComponent
  ]
  
})
export class AppModule {
  
 }
