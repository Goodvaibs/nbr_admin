import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(
    private http: HttpClient
  ) { }

  getPageContentList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/pages/konk-page-content-list/`, 
    {},
    {
      headers: headers
    })
      .pipe(map(page => {
        console.log(page);
        return page;
      }));
  }

  getPageContent(page_content_id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/pages/konk-page-content/`+page_content_id, 
    {},
    {
      headers: headers
    })
      .pipe(map(page => {
        console.log(page);
        return page;
      }));
  }

  //same for add and edit ... send id for update
  addPageContent(payload) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/pages/konk-add-page-content`, 
    payload,
    {
      headers: headers
    })
      .pipe(map(page => {
        console.log(page);
        return page;
      }));
  }

  deletePageContent(content_id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/pages/konk-delete-page-content/`+content_id, 
    {},
    {
      headers: headers
    })
      .pipe(map(page => {
        console.log(page);
        return page;
      }));
  }

  getPageNavTypes() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(`${environment.apiUrl}api/master/konk-master-list/nav-types`,
      {
        headers: headers
      })
      .pipe(map(pageTypes => {
        console.log(pageTypes);
        return pageTypes
      }));
  }

  getPageType() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(`${environment.apiUrl}api/master/konk-master-list/page-types`,
      {
        headers: headers
      })
      .pipe(map(pageTypes => {
        console.log(pageTypes);
        return pageTypes
      }));
  }

  addPageSection(payload) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}api/admin/konk-page-sections`, 
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
