import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EquipoService } from '../../service/equipo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})
export class EquiposComponent {
  filtro: string = '';
  //listar datos
  data: any[] = [];
  //aregar
  numero: string = '';
  descripcion: string = '';
  marca: string = '';
  modelo: string = '';
  estado: string = '';
  lab: string = '';
  laboratorio: any = { id: 0 };
  dato: any;

  datoEditado: any = { numero_serie: '', descrpcion_equipo: '', marca: '', modelo: '', estado: '', laboratory: '', laboratorio:''};
  modoEdicion: boolean = false;

  constructor(private traer: EquipoService) { }


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
      numero_serie: this.numero,
      descripcion_equipo: this.descripcion,
      marca: this.marca,
      modelo: this.modelo,
      estado: this.estado,
      laboratory: this.lab,
      laboratorio: { id: this.laboratorio.id }
    };

    this.traer.agregarDato(data).subscribe(response => {
      console.log('Dato agregado', response);
      this.numero= '';
      this.descripcion = '';
      this.marca = '';
      this.modelo = '';
      this.estado = '';
      this.lab = '';
      this.laboratorio = { id: 0 };
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
      numero_serie: this.datoEditado.numero,
      descripcion_equipo: this.datoEditado.descripcion,
      marca: this.datoEditado.marca,
      modelo: this.datoEditado.modelo,
      estado: this.datoEditado.estado,
      laboratory: this.datoEditado.lab,
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
