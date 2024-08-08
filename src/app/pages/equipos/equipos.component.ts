import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EquipoService } from '../../service/equipo.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})

export class EquiposComponent implements OnInit {
  filtro: string = '';
  data: any[] = [];
  modoEdicion: boolean = false;
  datoEditado: any = { id: null, numero_serie: '', descripcion_equipo: '', marca: '', modelo: '', estado: '', laboratorio: { id: 0 } };
  laboratorio: any = { id: 0 };
  
  formRegistro: FormGroup;

  constructor(private traer: EquipoService, private fb: FormBuilder) {
    // Inicialización del formulario con validaciones
    this.formRegistro = this.fb.group({
      numero_serie: ['', Validators.required],
      descripcion_equipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      estado: ['', Validators.required],
      laboratorio: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.traer.traer().subscribe({
      next: (data: any[]) => {
        this.data = data;
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error al traer datos:', error);
      }
    });
  }

  aplicarFiltro() {
    if (this.filtro) {
      this.data = this.data.filter((dato: any) =>
        dato.nombre_lab?.toLowerCase().includes(this.filtro.toLowerCase())
      );
    } else {
      this.traer.traer().subscribe({
        next: (data: any[]) => {
          this.data = data;
        },
        error: (error) => {
          console.error('Error al traer datos:', error);
        }
      });
    }
  }

  agregarDato() {
    if (this.formRegistro.invalid) {
      return; // Si el formulario es inválido, no enviar
    }

    const data = this.formRegistro.value;
    data.laboratorio = { id: data.laboratorio };

    this.traer.agregarDato(data).subscribe(response => {
      console.log('Dato agregado', response);
      this.formRegistro.reset(); // Limpiar el formulario después de agregar
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

  eliminar(dato: any) {
    if (dato && dato.id && confirm('¿Estás seguro de eliminar este registro?')) {
      this.traer.eliminar(dato.id).subscribe({
        next: (response) => {
          console.log('Dato eliminado', response);
          this.data = this.data.filter(item => item.id !== dato.id);
        },
        error: (err) => {
          console.error('Error al eliminar dato', err);
        }
      });
    } else {
      console.error('El dato no tiene un ID válido');
    }
  }

  editarDato(dato: any) {
    this.datoEditado = { ...dato };
    this.formRegistro.patchValue({
      numero_serie: dato.numero_serie,
      descripcion_equipo: dato.descripcion_equipo,
      marca: dato.marca,
      modelo: dato.modelo,
      estado: dato.estado,
      laboratorio: dato.laboratorio.id
    });
    this.modoEdicion = true;
  }

  guardarEdicion() {
    if (this.formRegistro.invalid) {
      return; // Si el formulario es inválido, no enviar
    }

    const updatedData = this.formRegistro.value;
    updatedData.laboratorio = { id: updatedData.laboratorio };

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
        this.modoEdicion = false;
        this.formRegistro.reset(); // Limpiar el formulario después de guardar
      },
      error: (error) => {
        console.error('Error al editar dato', error);
      }
    });
  }
}