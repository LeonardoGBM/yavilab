import { Component } from '@angular/core';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LaboratorioService } from '../../service/laboratorio.service';
import { ErrorService } from '../../service/error.service';
@Component({
  selector: 'app-errores',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule,],
  templateUrl: './errores.component.html',
  styleUrl: './errores.component.css'
})
export class ErroresComponent {
  //listar datos
  data: any[] = [];
  //aregar
  numero: string = '';
  horadano: string = '';
  fechadano: string = '';
  fechacambio: string = '';
  descripcion: string = '';
  estado: string = '';
  equipo: any = { id: 0 };
  dato: any;

  datoEditado: any = { numero_serie: '', hora_dano: '',fecha_dano: '', fecha_cambio: '', descripcion: '', estado: '', equipo: ''};
  modoEdicion: boolean = false;

  constructor(private traer: ErrorService) { }

  ngOnInit(): void {
    this.traer.traer().subscribe({
      next: (data: any[]) => {
        this.data = data;
        console.log('Datos recibidos:', this.data);
      },
      error: (error) => {
        console.error('Error al traer datos:', error);
      }
    });
  }

  //agregar datos
  agregarDato() {
    const data = {
      numero_serie: this.numero,
      hora_dano: this.horadano,
      fecha_dano: this.fechadano,
      fecha_cambio: this.fechacambio,
      descripcion: this.descripcion,
      estado: this.estado,
      equipo: { id: this.equipo.id }
    };
  
    console.log('Datos a enviar:', data); // Verifica los datos aquí
  
    this.traer.agregarDato(data).subscribe({
      next: (response) => {
        console.log('Dato agregado', response);
        this.numero = '';
        this.horadano = '';
        this.fechadano = '';
        this.fechacambio = '';
        this.descripcion = '';
        this.estado = '';
        this.equipo = { id: 0 };
        this.traer.traer().subscribe({
          next: (data: any[]) => {
            this.data = data;
            console.log('Datos actualizados:', this.data);
          },
          error: (error) => {
            console.error('Error al traer datos:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al agregar dato:', error);
      }
    });
  }
  // Condicional para numero de serie



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
      numero_serie: this.datoEditado.numero_serie,
      hora_dano: this.datoEditado.hora_dano,
      fecha_dano: this.datoEditado.fecha_dano,
      fecha_cambio: this.datoEditado.fecha_cambio,
      descripcion: this.datoEditado.descripcion,
      estado: this.datoEditado.estado,
      equipo: { id: this.equipo.laboratory}
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
