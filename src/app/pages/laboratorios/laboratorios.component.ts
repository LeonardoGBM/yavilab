import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LaboratorioService } from '../../service/laboratorio.service';
@Component({
  selector: 'app-laboratorios',
  standalone: true,
  imports: [ SidebarComponent, CommonModule, HttpClientModule],
  templateUrl: './laboratorios.component.html',
  styleUrl: './laboratorios.component.css'
})
export class LaboratoriosComponent{
  data: any[] = [];

  constructor(private traer: LaboratorioService) { }

  ngOnInit(): void {
    this.traer.traer().subscribe({
            next: (data: any[]) => {
        this.data = data;
      },
    });
  }
}
