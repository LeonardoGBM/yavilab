import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  private api = "/api/equipo";  

  constructor(private http: HttpClient) { }

  obtenerEquipoPorNumeroSerie(numero_serie: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${numero_serie}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Error en la solicitud. Intente nuevamente más tarde.'));
  }
}
