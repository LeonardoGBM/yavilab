import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  public api = "http://localhost:3000/"
  constructor(private http: HttpClient) { }

  traer(): Observable<any[]> {
    return this.http.get<any>(`${this.api}laboratory`)
  }

}
