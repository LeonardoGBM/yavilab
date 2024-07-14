import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'sidebar', component: SidebarComponent},
    { path: 'dashboard', component: DashboardComponent}
];
