import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EquipoService } from '../../service/equipo.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar el complemento para autoTable
import 'jspdf-autotable'; // Importar el complemento para autoTable
import * as XLSX from 'xlsx';
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
  datoEditado: any = { id: null, numero_serie: '', descripcion_equipo: '', marca: '', modelo: '', estado: '', laboratorio: ''};
  dato: any;
  formRegistro: FormGroup;

  constructor(private traer: EquipoService, private fb: FormBuilder) {
    // Inicialización del formulario con validaciones
    this.formRegistro = this.fb.group({
      numero_serie: ['', Validators.required],
      descripcion_equipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      estado: ['', Validators.required],
      laboratorio: ['', Validators.required]
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
        dato.laboratorio?.toLowerCase().includes(this.filtro.toLowerCase())
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
    this.formRegistro.patchValue(this.datoEditado);
    this.modoEdicion = true;
  }

  guardarEdicion() {
    const updatedData = {
      numero_serie: this.datoEditado.numero_serie,
      descripcion_equipo: this.datoEditado.descripcion_equipo,
      marca: this.datoEditado.marca,
      modelo: this.datoEditado.modelo,
      estado: this.datoEditado.estado,
      laboratorio: this.datoEditado.laboratorio,
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



  generarPDFcompleto() {
    const doc = new jsPDF();
    const logoUrl = './../assets/img/logoazul-removebg-preview.png';

    fetch(logoUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgData = reader.result as string;

          doc.addImage(imgData, 'PNG', 10, 10, 30, 20);
          doc.setFontSize(18);
          doc.text('Informe de Equipos', 70, 30);
          doc.setFontSize(12);
          doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

          (doc as any).autoTable({
            startY: 50,
            head: [['#', 'Número de serie', 'Descripción del equipo', 'Marca', 'Modelo', 'Estado', 'Laboratorio']],
            body: this.data.map((item, index) => [
              index + 1,
              item.numero_serie,
              item.descripcion_equipo,
              item.marca,
              item.modelo,
              item.estado,
              item.laboratorio
            ]),
          });

          doc.save('informe_completo_de_danos.pdf');
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
      });
  }

  seleccionarDato(dato: any) {
    this.dato = dato;

  }


  generarExcelCompleto() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data.map((item, index) => ({
      '#': index + 1,
      'Número de serie': item.numero_serie,
      'Descripción del equipo': item.descripcion_equipo,
      'Marca': item.marca,
      'Modelo': item.modelo,
      'Estado': item.estado,
      'Laboratorio': item.laboratorio
    })));
    const workbook: XLSX.WorkBook = { Sheets: { 'Informe de Daños': worksheet }, SheetNames: ['Informe de Daños'] };
    XLSX.writeFile(workbook, 'informe_completo_de_danos.xlsx');
  }
}