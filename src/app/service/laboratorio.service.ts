import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  getDato() {
    throw new Error('Method not implemented.');
  }
  private api = "/api/laboratory";  

  constructor(private http: HttpClient) { }

  //traer datos
  traer(): Observable<any[]> {
    return this.http.get<any[]>(this.api).pipe(
      catchError(this.handleError)
    );
  }

  //agregar datos
  agregarDato(data: any): Observable<any> {
    return this.http.post<any>(this.api, data).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores genérico
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Ocurrió un error; por favor, intente nuevamente más tarde.'));
  }

  //eliminar datos
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

  //metodo editar
  public editarDato(id: number, data: any): Observable<any> {
    
    return this.http.put(`${this.api}/${id}`, data)
     
  }
  
}
