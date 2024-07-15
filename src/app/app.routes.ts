import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LaboratoriosComponent } from './pages/laboratorios/laboratorios.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path:'dashboard', component: DashboardComponent},
    { path: 'laboratorios', component: LaboratoriosComponent}
];