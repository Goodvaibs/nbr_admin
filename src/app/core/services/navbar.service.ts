import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(private http: HttpClient) { }

  public NavList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}navbar-list`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public DeleteNav(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-navbar/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public AddNavbar(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-navbar`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public getNavById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}navbar-data/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public updateNavbar(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-navbar`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public subNavList(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}subnavbar-list/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public deleteSubNav(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-subnavbar/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public AddSubNavbar(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-subnavbar`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public getsubNavById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}subnavbar-data/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public updatesubNavbar(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-subnavbar`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

}
