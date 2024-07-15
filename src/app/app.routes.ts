import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LaboratoriosComponent } from './pages/laboratorios/laboratorios.component';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { ErroresComponent } from './pages/errores/errores.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'lab', component: LaboratoriosComponent},
    { path: 'equipo', component: EquiposComponent},
    { path: 'error', component: ErroresComponent}
];

