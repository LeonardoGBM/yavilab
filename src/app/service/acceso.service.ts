import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../settings/appsettings';
import { Usuario } from '../interfaces/Usuario';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../interfaces/ResponseAcceso';
import { Login } from '../interfaces/Login';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl:string = appsettings.apiUrl;
  constructor() { }

  registrarse(objeto:Usuario) : Observable<ResponseAcceso>{
    return this.http.post<ResponseAcceso>(`${this.baseUrl}auth/registrar`,objeto)
  }

  login(objeto:Login) : Observable<ResponseAcceso>{
    return this.http.post<ResponseAcceso>(`${this.baseUrl}auth/login`,objeto)
  }
}
