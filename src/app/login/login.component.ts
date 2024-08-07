import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from '../service/acceso.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../interfaces/Login';
import { CommonModule } from '@angular/common'; 

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    email: ["", [Validators.required, Validators.email]],
    contrasena: ["", Validators.required]
  });

  public showAlert: boolean = false; // Propiedad para mostrar la alerta

  iniciarSesion() {
    this.showAlert = false; // Ocultar la alerta antes de la validación

    if (this.formLogin.invalid) {
      this.showAlert = true; // Mostrar alerta si el formulario es inválido
      return;
    }

    const objeto: Login = {
      email: this.formLogin.value.email,
      contrasena: this.formLogin.value.contrasena
    };

    this.accesoService.login(objeto).subscribe({
      next: (data) => {
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          this.router.navigate(['dashboard']);
        } else {
          this.showAlert = true; // Muestra la alerta si las credenciales son incorrectas
        }
      },
      error: (error) => {
        console.log("Error de autenticación:", error);
        this.showAlert = true; // Muestra la alerta en caso de error
      }
    });
  }

  //constructor(private router: Router) {}

  //redirectToRegister() {
    //this.router.navigate(['register']);
  //}

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

  //login() {
    // Aquí puedes agregar la lógica de autenticación
    //this.router.navigate(['dashboard']);
  //}
}
