import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  //apply
  public getApplyList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-apply-records`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public deleteApply(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-apply-rec/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getApplyById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-apply-rec/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  //priority
  public getPriorList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-priority-app`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public deletePrior(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-priority-app/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getPriorById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-priority-app-by-id/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  //invite
  public getInviteList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-umpire`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public deleteInvite(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-umpire/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getInviteById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-umpire/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  //report
  public getReportList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-report-record`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public deleteReport(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-report-record/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getReportById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-report-record-by-id/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

}
