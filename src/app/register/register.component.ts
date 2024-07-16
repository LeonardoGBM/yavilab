import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private router: Router) { }

  redirectToLogin() {
    this.router.navigate(['']);
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
}
