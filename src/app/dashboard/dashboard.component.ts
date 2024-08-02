import { Component } from '@angular/core';
import { SidebarComponent } from "../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LaboratorioService } from '../service/laboratorio.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  data: any[] = [];

  constructor(private traer: LaboratorioService) { }
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

}
