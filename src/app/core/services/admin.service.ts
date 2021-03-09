import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) { }

  getAdminDetails() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(`${environment.apiUrl}api/user`,
      {
        headers: headers
      })
      .pipe(map(user => {
        console.log(user);
        return user
      }));
  }

  addSuperAdmin(payload) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/konk-register`, 
    payload,
    {
      headers: headers
    })
      .pipe(map(response => {
        console.log(response);
        return response;
      }));
  }

  addAdmin(payload) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/admin/konk-admin`, 
    payload,
    {
      headers: headers
    })
      .pipe(map(response => {
        console.log(response);
        return response;
      }));
  }

  updateAdmin(admin_id, payload) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/admin/konk-admin/`+admin_id, 
    payload,
    {
      headers: headers
    })
      .pipe(map(response => {
        console.log(response);
        return response;
      }));
  }
}
