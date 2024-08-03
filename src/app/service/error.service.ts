import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private api = "/api/damage";  
  private equipoApi = "/api/equipo";  // Asume que esta es la URL para la API de equipos

  constructor(private http: HttpClient) { }

  // Traer datos
  traer(): Observable<any[]> {
    return this.http.get<any[]>(this.api).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar datos
  agregarDato(data: any): Observable<any> {
    return this.http.post<any>(this.api, data).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener laboratorio por número de serie
  obtenerLaboratorioPorNumeroSerie(numeroSerie: string): Observable<any> {
    const url = `${this.equipoApi}/laboratorio?numero_serie=${numeroSerie}`;

    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  

  // Eliminar datos
  eliminar(id: number): Observable<any> {
    const url = `${this.api}/${id}/`;
    console.log('URL de eliminación:', url);
    return this.http.delete(url)
      .pipe(
        catchError((error: any) => {
          console.error('Error al eliminar el laboratorio:', error);
          throw error;
        })
      );
  }

  // Editar datos
  public editarDato(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores genérico
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Ocurrió un error; por favor, intente nuevamente más tarde.'));
  }
}