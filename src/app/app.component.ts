import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LaboratoriosComponent } from './pages/laboratorios/laboratorios.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LaboratoriosComponent, SidebarComponent, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'yavilab';
}
