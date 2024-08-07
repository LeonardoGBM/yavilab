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
        dato.equipo.laboratory?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        dato.estado?.toLowerCase().includes(this.filtro.toLowerCase())

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
    const logoUrl = './../assets/img/logoazul-removebg-preview.png'; // Ruta al logotipo

    fetch(logoUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgData = reader.result as string;

          // Añadir el logotipo
          doc.addImage(imgData, 'PNG', 10, 10, 30, 20); // Ajustar tamaño y posición

          // Añadir título
          doc.setFontSize(18);
          doc.text('Informe de Daños del Equipo', 70, 30); // Ajustar posición

          // Añadir fecha
          doc.setFontSize(12);
          doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

          // Añadir información de la fila seleccionada
          doc.setFontSize(12);

          if (this.dato) {
            // Definir el contenido del informe
            const texto = [
              `**Informe de Daño y Reparación de Equipos**`,
              `**Equipo:**`,
              `El equipo con número de serie **${this.dato.numero_serie}** sufrió un daño el día **${this.dato.fecha_dano}** a las **${this.dato.hora_dano}** horas. El incidente fue identificado cuando se detectó el siguiente problema: **${this.dato.descripcion}**.`,
              `**Reparación:**`,
              `La reparación del equipo se llevó a cabo el día **${this.dato.fecha_cambio}** en el laboratorio **${this.dato.equipo.laboratory}**. El proceso de reparación fue documentado cuidadosamente, y el equipo fue evaluado para asegurar que cumpla con los estándares operativos.`,
              `**Estado Actual:**`,
              `Después de la reparación, el equipo fue sometido a pruebas adicionales para confirmar su funcionalidad. Actualmente, el estado del equipo es: **"${this.dato.estado}"**. Este estado refleja tanto la operatividad del equipo como las medidas preventivas tomadas para evitar futuros incidentes.`,
              `**Resumen de Incidentes:**`,
              `Hasta la fecha, el equipo ha registrado un total de **${this.data.length}** incidentes de daño. Cada uno de estos ha sido atendido con las medidas correctivas necesarias, y se han documentado para futuras referencias.`,
              `**Conclusión:**`,
              `El equipo con número de serie **${this.dato.numero_serie}** ha sido completamente restaurado a su estado funcional y está listo para su uso en operaciones de laboratorio. Se recomienda continuar con el monitoreo regular y realizar mantenimiento preventivo para prolongar la vida útil del equipo.`,
              `**Responsable:**`,
              `El informe fue generado por **[Nombre del Responsable]** el día **[Fecha de Generación del Informe]**.`,
              `**Firma:**`,
              `_____________________
              [Nombre del Responsable]`
            ];

            // Ajustar el texto automáticamente en el PDF
            let y = 50; // Coordenada Y inicial después del logotipo y título
            texto.forEach(parrafo => {
              const lines = doc.splitTextToSize(parrafo, 180); // Ajustar el tamaño del texto al ancho de la página
              lines.forEach((line: string) => {
                doc.text(line, 14, y);
                y += 10; // Espaciado entre líneas
              });
              y += 10; // Espaciado entre párrafos
            });
          } else {
            const mensaje = 'No se ha seleccionado ningún dato para el informe.';
            const lines = doc.splitTextToSize(mensaje, 180);
            let y = 50; // Coordenada Y inicial
            lines.forEach((line: string) => {
              doc.text(line, 14, y);
              y += 10; // Espaciado entre líneas
            });
          }

          // Guardar el archivo PDF
          doc.save('informe_de_danos.pdf');
        };
        reader.readAsDataURL(blob); // Convertir blob a base64
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
      });
  }
  seleccionarDato(dato: any) {
    this.dato = dato;
  }

  // imprimir toda la tabla del pdf con todos loas datos
  generarPDFcompleto() {
    const doc = new jsPDF();
    const logoUrl = './../assets/img/logoazul-removebg-preview.png'; // Ruta al logotipo

    fetch(logoUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgData = reader.result as string;

          // Añadir el logotipo
          doc.addImage(imgData, 'PNG', 10, 10, 30, 20); // Ajustar tamaño y posición

          // Añadir título
          doc.setFontSize(18);
          doc.text('Informe de Daños del Equipo', 70, 30); // Ajustar posición

          // Añadir fecha
          doc.setFontSize(12);
          doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

          // Añadir tabla con todos los datos de `this.data`
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
              item.equipo.laboratory
            ]),
          });

          // Guardar el archivo PDF
          doc.save('informe_completo_de_danos.pdf');
        };
        reader.readAsDataURL(blob); // Convertir blob a base64
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
      });
  }
}
