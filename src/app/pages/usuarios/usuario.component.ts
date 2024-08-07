import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';
import { AccesoService } from '../../service/acceso.service';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/Usuario';
@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    nombre: ["", Validators.required],
    apellido: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    contrasena: ["", Validators.required],
    rol: ["", Validators.required]
  })

  registrarse(){
    if (this.formRegistro.invalid) return;

    const objeto : Usuario = {
      nombre: this.formRegistro.value.nombre,
      apellido: this.formRegistro.value.apellido,
      email: this.formRegistro.value.email,
      contrasena: this.formRegistro.value.contrasena,
      rol: this.formRegistro.value.rol
    }

    this.accesoService.registrarse(objeto).subscribe({
      next: (data) => {
        if (data) {
          alert("Usuario añadido")
        } else {
          alert("No se pudo registrar")
        }
      },
      error: (error) => {
        console.log("Error de registro:", error);
      }
    })
  }




  filtro: string = '';
  //listar datos
  data: any[] = [];
  //agregar
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  contrasena: string = '';
  rol: string = '';
  dato: any;

  datoEditado: any = { nombre: '', apellido: '', email: '', contrasena: '', rol: '' };
  modoEdicion: boolean = false;

  constructor(private traer: UsuarioService) { }

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

  ngOnInit(): void {
    this.traer.traer().subscribe({
      next: (data: any[]) => {
        this.data = data;
        this.aplicarFiltro(); // Aplica el filtro al cargar los datos
      },
      error: (error) => {
        console.error('Error al traer datos:', error);
      }
    });
  }

  // Método para aplicar el filtro
  aplicarFiltro() {
    if (this.filtro) {
      this.data = this.data.filter((dato: any) =>
        dato.nombre?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        dato.apellido?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        dato.email?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        dato.rol?.toLowerCase().includes(this.filtro.toLowerCase())
      );
    } else {
      this.traer.traer().subscribe({
        next: (data: any[]) => {
          this.data = data; // Recupera todos los datos si no hay filtro
        },
        error: (error) => {
          console.error('Error al traer datos:', error);
        }
      });
    }
  }
  /*agregar datos
  agregarDato() {
    const data = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      contrasena: this.contrasena,
      rol: this.rol,
    };

    this.traer.agregarDato(data).subscribe(response => {
      console.log('Dato agregado', response);
      this.nombre = '';
      this.apellido = '';
      this.email = '';
      this.contrasena = '';
      this.rol = '';
      this.traer.traer().subscribe({
        next: (data: any[]) => {
          this.data = data;
          console.log('Datos actualizados:', this.data);
        },
        error: (error) => {
          console.error('Error al traer datos:', error);
        }
      });
    });
  } */

  //eliminar datos

  eliminar(dato: any) {
    if (dato && dato.id && confirm('¿Estás seguro de eliminar este registro?')) {
      this.traer.eliminar(dato.id).subscribe({
        next: (response) => {
          console.log('Dato eliminado', response);
          this.data = this.data.filter(item => item.id !== dato.id); // Actualizar la lista después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar dato', err);
        }
      });
    } else {
      console.error('El dato no tiene un ID válido');
    }
  }

  //editar dato

  // Método para iniciar la edición de un dato
  editarDato(dato: any) {
    this.datoEditado = { ...dato };
    this.modoEdicion = true;
  }

  guardarEdicion() {
    const updatedData = {
      nombre: this.datoEditado.nombre,
      apellido: this.datoEditado.apellido,
      email: this.datoEditado.email,
      contrasena: this.datoEditado.contrasena,
      rol: this.datoEditado.rol
    };

    this.traer.editarDato(this.datoEditado.id, updatedData).subscribe({
      next: (response: any) => {
        console.log('Dato editado correctamente', response);
        this.traer.traer().subscribe({
          next: (data: any[]) => {
            this.data = data;
            console.log('Datos actualizados después de editar', this.data);
          },
          error: (error) => {
            console.error('Error al traer datos actualizados', error);
          }
        });
        this.modoEdicion = false; // Cerrar el formulario después de guardar
      },
      error: (error) => {
        console.error('Error al editar dato', error);
      }
    });
  }
}

