import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { LaboratorioService } from '../../service/laboratorio.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})
export class EquiposComponent {
  
}
