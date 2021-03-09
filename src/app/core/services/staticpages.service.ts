import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StaticpagesService {

  constructor(private http: HttpClient) { }

  public AddStaticPage(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-static-page`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public getStaticList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}static-page-list`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public deleteStaticPage(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-static-page/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getStaticPageById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}static-page-data/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getMasterPagesDesign() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-html-design-list`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

}
