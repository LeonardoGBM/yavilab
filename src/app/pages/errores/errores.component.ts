import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl  } from '@angular/forms';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from '../../service/error.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar el complemento para autoTable
import * as XLSX from 'xlsx';

// Función de validador personalizado


export function fechaDanioAntesDeFechaCambio(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup; // Cast a FormGroup
    const fechaDanio = formGroup.get('fecha_dano')?.value;
    const fechaCambio = formGroup.get('fecha_cambio')?.value;

    if (fechaDanio && fechaCambio && fechaDanio > fechaCambio) {
      return { fechaDanioPosterior: true };
    }
    return null;
  };
}

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
  numero: string = '';
  horadano: string = '';
  fechadano: string = '';
  fechacambio: string = '';
  descripcion: string = '';
  estado: string = '';
  lab: string = '';
  datoEditado: any = { numero_serie: '', hora_dano: '', fecha_dano: '', fecha_cambio: '', descripcion: '', equipo:'', estado: '', lab_nombre:'' };
  modoEdicion: boolean = false;
  dato: any;
  equipo: any = { id: 0 };
  equipos: any[] = [];
  maxFechaDanio: string = '';
  maxDataCount: number = 200;
  constructor(private traer: ErrorService) { }

  ngOnInit(): void {
    this.cargarLaboratorios(); // Cargar laboratorios al iniciar el componente
    this.traer.traer().subscribe({
      next: (data: any[]) => {
        this.data = data.slice(0, 200);
        this.data = data;
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error al traer datos:', error);
      }
    });
  }

  cargarLaboratorios() {
    this.traer.traerLaboratorios().subscribe({
      next: (equipo: any[]) => {
        this.equipos = equipo;
      },
      error: (error) => {
        console.error('Error al cargar laboratorios:', error);
      }
    });
  }
  
  actualizarNombreLab(event: any) {
    const numeroId = event.target.value;
    const labSeleccionado = this.equipos.find(numero => numero.id == numeroId);
    if (labSeleccionado) {
      this.lab = labSeleccionado.lab;
    }
  }
  actualizarMaxFechaDanio() {
    const fechaCambioInput = document.getElementById('fechacambio') as HTMLInputElement;
    this.maxFechaDanio = fechaCambioInput.value;
  }

  isFechaDanioInvalida(): boolean {
    return new Date(this.fechadano) > new Date(this.fechacambio);
  }

  aplicarFiltro() {
    if (this.filtro) {
      this.data = this.data.filter((dato: any) =>
        dato.lab_nombre?.toLowerCase().includes(this.filtro.toLowerCase())
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
    // Verifica el número de registros antes de agregar uno nuevo
    if (this.data.length >= this.maxDataCount) {
      alert('No se pueden agregar más de 200 datos.');
      return;
    }
  
    const data = {
      numero_serie: this.numero,
      hora_dano: this.horadano,
      fecha_dano: this.fechadano,
      fecha_cambio: this.fechacambio,
      descripcion: this.descripcion,
      estado: this.estado,
      lab_nombre: this.lab,
      equipo: { id: this.equipo.id }
    };
  
    console.log('Datos a enviar:', data); // Verifica los datos aquí
  
    this.traer.agregarDato(data).subscribe({
      next: (response) => {
        console.log('Dato agregado', response);
  
        // Limpiar los valores del formulario después de agregar
        this.numero = '';
        this.horadano = '';
        this.fechadano = '';
        this.fechacambio = '';
        this.descripcion = '';
        this.estado = '';
        this.lab = '';
        this.equipo = { id: 0 };
  
        // Traer los datos actualizados después de agregar
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
      lab_nombre: this.datoEditado.lab_nombre
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
              `La reparación del equipo se llevó a cabo el día "${this.dato.fecha_cambio}" en el laboratorio "${this.dato.equipo.lab}". El proceso de reparación fue documentado cuidadosamente, y el equipo fue evaluado para asegurar que cumpla con los estándares operativos.`,
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
              item.equipo.lab
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
      'Laboratorio': item.equipo.lab
    })));
    const workbook: XLSX.WorkBook = { Sheets: { 'Informe de Daños': worksheet }, SheetNames: ['Informe de Daños'] };
    XLSX.writeFile(workbook, 'informe_completo_de_danos.xlsx');
  }

}
