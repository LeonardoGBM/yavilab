import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from '../../service/error.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar el complemento para autoTable
import 'jspdf-autotable'; // Importar el complemento para autoTable
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-errores',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './errores.component.html',
  styleUrls: ['./errores.component.css']
})
export class ErroresComponent implements OnInit {
  filtro: string = '';
  data: any[] = [];
  form: FormGroup;
  datoEditado: any = { numero_serie: '', hora_dano: '', fecha_dano: '', fecha_cambio: '', descripcion: '', estado: '', laboratorio: '' };
  modoEdicion: boolean = false;
  dato: any;

  constructor(private fb: FormBuilder, private traer: ErrorService) {
    // Inicialización del formulario
    this.form = this.fb.group({
      numero_serie: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      hora_dano: ['', Validators.required],
      fecha_dano: ['', Validators.required],
      fecha_cambio: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required],
      laboratorio: ['', Validators.required]
    });
  }

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

  agregarDato() {
    if (this.form.invalid) {
      return; // Si el formulario es inválido, no enviar
    }

    const data = this.form.value;

    this.traer.agregarDato(data).subscribe(response => {
      console.log('Dato agregado', response);
      this.form.reset(); // Limpiar el formulario después de agregar
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

  aplicarFiltro() {
    if (this.filtro) {
      this.data = this.data.filter((dato: any) =>
        dato.numero_serie?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        dato.estado?.toLowerCase().includes(this.filtro.toLowerCase()) ||
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
      laboratorio: this.datoEditado.laboratorio
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
        this.modoEdicion = false;
      },
      error: (error) => {
        console.error('Error al editar dato', error);
      }
    });
  }

  generarPDF() {
    const doc = new jsPDF();
    const logoUrl = './../assets/img/logoazul-removebg-preview.png';
  
    fetch(logoUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgData = reader.result as string;
  
          // Agregar imagen y texto principal
          doc.addImage(imgData, 'PNG', 10, 10, 30, 20);
          doc.setFontSize(18);
          doc.text('Informe de Daños del Equipo', 70, 30);
          doc.setFontSize(10);
          doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);
  
          if (this.dato) {
            const texto = [
              'Informe de Daño y Reparación de Equipos',
              'Equipo:',
              `El equipo con número de serie "${this.dato.numero_serie}" sufrió un daño el día "${this.dato.fecha_dano}" a las "${this.dato.hora_dano}" horas. El incidente fue identificado cuando se detectó el siguiente problema: "${this.dato.descripcion}".`,
              'Reparación:',
              `La reparación del equipo se llevó a cabo el día "${this.dato.fecha_cambio}" en el laboratorio "${this.dato.laboratorio}". El proceso de reparación fue documentado cuidadosamente, y el equipo fue evaluado para asegurar que cumpla con los estándares operativos.`,
              'Estado Actual:',
              `Después de la reparación, el equipo fue sometido a pruebas adicionales para confirmar su funcionalidad. Actualmente, el estado del equipo es: "${this.dato.estado}". Este estado refleja tanto la operatividad del equipo como las medidas preventivas tomadas para evitar futuros incidentes.`,
              'Conclusión:',
              `El equipo con número de serie "${this.dato.numero_serie}" ha sido completamente restaurado a su estado funcional y está listo para su uso en operaciones de laboratorio. Se recomienda continuar con el monitoreo regular y realizar mantenimiento preventivo para prolongar la vida útil del equipo.`,
            ];
  
            let y = 50;
            texto.forEach(parrafo => {
              const lines = doc.splitTextToSize(parrafo, 180);
              lines.forEach((line: string) => {
                doc.text(line, 14, y);
                y += 10;
              });
              y += 10;
            });
          } else {
            const mensaje = 'No se ha seleccionado ningún dato para el informe.';
            const lines = doc.splitTextToSize(mensaje, 180);
            let y = 50;
            lines.forEach((line: string) => {
              doc.text(line, 14, y);
              y += 10;
            });
          }
  
          doc.save('informe_de_danos.pdf');
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
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
          doc.text('Informe de Daños del Equipo', 70, 30);
          doc.setFontSize(12);
          doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

          (doc as any).autoTable({
            startY: 50,
            head: [['#', 'Número de serie', 'Hora daños', 'Fecha daños', 'Fecha cambio', 'Descripción', 'Estado', 'Laboratorio']],
            body: this.data.map((item, index) => [
              index + 1,
              item.numero_serie,
              item.hora_dano,
              item.fecha_dano,
              item.fecha_cambio,
              item.descripcion,
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
      'Hora daños': item.hora_dano,
      'Fecha daños': item.fecha_dano,
      'Fecha cambio': item.fecha_cambio,
      'Descripción': item.descripcion,
      'Estado': item.estado,
      'Laboratorio': item.laboratorio
    })));
    const workbook: XLSX.WorkBook = { Sheets: { 'Informe de Daños': worksheet }, SheetNames: ['Informe de Daños'] };
    XLSX.writeFile(workbook, 'informe_completo_de_danos.xlsx');
  }


}
