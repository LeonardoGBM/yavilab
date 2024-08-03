import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LaboratorioService } from '../../service/laboratorio.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-laboratorios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule,],
  templateUrl: './laboratorios.component.html',
  styleUrl: './laboratorios.component.css'
})
export class LaboratoriosComponent {
  filtro: string = '';
  //listar datos
  data: any[] = [];
  //aregar
  nombre: string = '';
  monitores: string = '';
  cpu: string = '';
  teclado: string = '';
  audifonos: string = '';
  infocus: string = '';
  mouse: string = '';
  sillas: string = '';
  mesas: string = '';
  observaciones: string = '';
  dato: any;

  datoEditado: any = { nombre_lab: '', monitores: '', cpu: '', teclado: '', audifonos: '', infocus: '', mouse: '', sillas: '', mesas: '', observaciones: '' };
  modoEdicion: boolean = false;

  constructor(private traer: LaboratorioService) { }


  //traer datos
  /*ngOnInit(): void {
    this.traer.traer().subscribe({
            next: (data: any[]) => {
        this.data = data;
      },
    });
  }*/
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
          dato.nombre_lab?.toLowerCase().includes(this.filtro.toLowerCase())
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
  //agregar datos
  agregarDato() {
    const data = {
      nombre_lab: this.nombre,
      monitores: this.monitores,
      cpu: this.cpu,
      teclado: this.teclado,
      audifonos: this.audifonos,
      infocus: this.infocus,
      mouse: this.mouse,
      sillas: this.sillas,
      mesas: this.mesas,
      observaciones: this.observaciones

    };

    this.traer.agregarDato(data).subscribe(response => {
      console.log('Dato agregado', response);
      this.nombre = '';
      this.monitores = '';
      this.cpu = '';
      this.teclado = '';
      this.audifonos = '';
      this.infocus = '';
      this.mouse = '';
      this.sillas = '';
      this.mesas = '';
      this.observaciones = '';
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
  }

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
      nombre_lab: this.datoEditado.nombre_lab,
      monitores: this.datoEditado.monitores,
      cpu: this.datoEditado.cpu,
      teclado: this.datoEditado.teclado,
      audifonos: this.datoEditado.audifonos,
      infocus: this.datoEditado.infocus,
      mouse: this.datoEditado.mouse,
      sillas: this.datoEditado.sillas,
      mesas: this.datoEditado.mesas,
      observaciones: this.datoEditado.observaciones
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
