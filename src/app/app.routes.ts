import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LaboratoriosComponent } from './pages/laboratorios/laboratorios.component';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { RegisterComponent } from './register/register.component';
import { ErroresComponent } from './pages/errores/errores.component';
import { LabXianComponent } from './pages/lab-xian/lab-xian.component';
import { LabGoriComponent } from './pages/lab-gori/lab-gori.component';
import { LabToolouseComponent } from './pages/lab-toolouse/lab-toolouse.component';
import { LabSarasotaComponent } from './pages/lab-sarasota/lab-sarasota.component';
import { LabCenepaComponent } from './pages/lab-cenepa/lab-cenepa.component';
import { UsuarioComponent } from './pages/usuarios/usuario.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate:[authGuard]},
    { path: 'lab', component: LaboratoriosComponent, canActivate:[authGuard]},
    { path: 'equipo', component: EquiposComponent, canActivate:[authGuard]},
    { path: 'register', component: RegisterComponent},
    { path: 'errores', component: ErroresComponent, canActivate:[authGuard]},
    { path: 'usuarios', component:UsuarioComponent, canActivate:[authGuard]}

];

