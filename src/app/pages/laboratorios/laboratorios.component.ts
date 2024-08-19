import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LaboratorioService } from '../../service/laboratorio.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-laboratorios',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './laboratorios.component.html',
  styleUrl: './laboratorios.component.css'
})
export class LaboratoriosComponent implements OnInit {
  filtro: string = '';
  data: any[] = [];
  modoEdicion: boolean = false;
  datoEditado: any = { id: null, nombre_lab: '', monitores: '', cpu: '', teclado: '', audifonos: '', infocus: '', mouse: '', sillas: '', mesas: '', observaciones: '' };
  maxDataCount: number = 5;
  // Definición del formulario
  formRegistro: FormGroup;

  constructor(private traer: LaboratorioService, private fb: FormBuilder) {
    // Inicialización del formulario con validaciones
    this.formRegistro = this.fb.group({
      nombre_lab: ['', Validators.required],
      monitores: ['', Validators.required],
      cpu: ['', Validators.required],
      teclado: ['', Validators.required],
      audifonos: ['', Validators.required],
      infocus: ['', Validators.required],
      mouse: ['', Validators.required],
      sillas: ['', Validators.required],
      mesas: ['', Validators.required],
      observaciones: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.traer.traer().subscribe({
      next: (data: any[]) => {
        this.data = data.slice(0, 5);
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

    if (this.data.length >= this.maxDataCount) {
      alert('No se pueden agregar más de 5 laboratorios.');
      return;
    }

    const data = this.formRegistro.value;

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


  editarDato(dato: any) {
    this.datoEditado = { ...dato };
    this.formRegistro.patchValue(this.datoEditado);
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
}
