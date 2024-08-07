import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private router: Router) {}

  cerrarSesion() {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');

    // Redirigir al usuario al login
    this.router.navigate(['/login']);
  }

}
