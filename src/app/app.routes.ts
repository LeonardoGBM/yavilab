import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LaboratoriosComponent } from './pages/laboratorios/laboratorios.component';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { RegisterComponent } from './register/register.component';
import { ErroresComponent } from './pages/errores/errores.component';
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

