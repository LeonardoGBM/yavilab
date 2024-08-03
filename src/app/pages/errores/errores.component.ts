import { Component } from '@angular/core';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ErrorService } from '../../service/error.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar el complemento para autoTable
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-errores',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule,],
  templateUrl: './errores.component.html',
  styleUrl: './errores.component.css'
})
export class ErroresComponent {
  filtro: string = '';
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

  datoEditado: any = { numero_serie: '', hora_dano: '', fecha_dano: '', fecha_cambio: '', descripcion: '', estado: '', equipo: '' };
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

  //filtro
  aplicarFiltro() {
    if (this.filtro) {
      this.data = this.data.filter((dato: any) =>
        dato.numero_serie?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        dato.equipo.laboratory?.toLowerCase().includes(this.filtro.toLowerCase())

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
      equipo: { id: this.equipo.laboratory }
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

  //PDF

  generarPDF() {
    const doc = new jsPDF();

    // Añadir título
    doc.setFontSize(18);
    doc.text('Informe de Daños del Equipo', 14, 20);

    // Añadir fecha
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    // Añadir información de la fila seleccionada
    doc.setFontSize(12);

    if (this.dato) {
      // Definir el contenido del informe
      const texto = [
        `El equipo con número de serie: ${this.dato.numero_serie} sufrió un daño a las ${this.dato.hora_dano} horas de la fecha: ${this.dato.fecha_dano}, cuando se detectó ${this.dato.descripcion}.`,
        `La reparación se realizó en la fecha: ${this.dato.fecha_cambio} en el laboratorio ${this.dato.equipo.laboratory}, y el estado del equipo es "${this.dato.estado}".`,
        // `En resumen, el equipo ha tenido un total de daños registrados: ${this.data.length}.`
      ];

      // Ajustar el texto automáticamente en el PDF
      let y = 40; // Coordenada Y inicial
      texto.forEach(parrafo => {
        const lines = doc.splitTextToSize(parrafo, 180); // Ajustar el tamaño del texto al ancho de la página
        lines.forEach((line: string) => { // Especificar el tipo 'string' para 'line'
          doc.text(line, 14, y);
          y += 10; // Espaciado entre líneas
        });
        y += 10; // Espaciado entre párrafos
      });
    } else {
      const mensaje = 'No se ha seleccionado ningún dato para el informe.';
      const lines = doc.splitTextToSize(mensaje, 180);
      let y = 40; // Coordenada Y inicial
      lines.forEach((line: string) => { // Especificar el tipo 'string' para 'line'
        doc.text(line, 14, y);
        y += 10; // Espaciado entre líneas
      });
    }

    // Guardar el archivo PDF
    doc.save('informe_de_danos.pdf');
  }
  seleccionarDato(dato: any) {
    this.dato = dato;
  }

  // imprimir toda la tabla del pdf con todos loas datos
  generarPDFcompleto() {
    const doc = new jsPDF();

    // Añadir título
    doc.setFontSize(18);
    doc.text('Informe Completo de Daños', 14, 20);

    // Añadir fecha
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    // Añadir tabla con todos los datos de `this.data`
    (doc as any).autoTable({
        startY: 40,
        head: [['#', 'Número de serie', 'Hora daños', 'Fecha daños', 'Fecha cambio', 'Descripción', 'Estado', 'Laboratorio']],
        body: this.data.map((item, index) => [
            index + 1,
            item.numero_serie,
            item.hora_dano,
            item.fecha_dano,
            item.fecha_cambio,
            item.descripcion,
            item.estado,
            item.equipo.laboratory
        ]),
    });

    // Guardar el archivo PDF
    doc.save('informe_completo_de_danos.pdf');
}
}
