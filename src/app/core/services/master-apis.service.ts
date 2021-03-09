import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MasterApisService {

  constructor(
    private http: HttpClient
  ) { }

  getFrontEndUserRoles() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(`${environment.apiUrl}api/master/konk-master-list/user-roles`,
      {
        headers: headers
      })
      .pipe(map(roles => {
        console.log(roles);
        return roles
      }));
  }

  getLanguages() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(`${environment.apiUrl}api/master/konk-master-list/languages`,
      {
        headers: headers
      })
      .pipe(map(languages => {
        console.log(languages);
        return languages;
      }));
  }

  getPageStatus() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(`${environment.apiUrl}api/master/konk-master-list/page-status`,
      {
        headers: headers
      })
      .pipe(map(pageStatus => {
        console.log(pageStatus);
        return pageStatus
      }));
  }

  getCountries(payload) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/master/get-world-list`, 
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
