import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router) {}

  redirectToRegister() {
    this.router.navigate(['register']);
  }

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('contrasena') as HTMLInputElement;
    const toggleEye = document.getElementById('toggleEye') as HTMLElement;

    if (this.showPassword) {
      passwordInput.type = 'text';
      toggleEye.classList.remove('bi-eye');
      toggleEye.classList.add('bi-eye-slash');
    } else {
      passwordInput.type = 'password';
      toggleEye.classList.remove('bi-eye-slash');
      toggleEye.classList.add('bi-eye');
    }
  }

  login() {
    // Aquí puedes agregar la lógica de autenticación
    this.router.navigate(['dashboard']);
  }
}
