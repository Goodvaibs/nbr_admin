import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public catList() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}category-list`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public subcatList(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}subcategory-list/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public DeleteCat(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-category/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public DeletesubCat(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}delete-subcategory/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public AddCategory(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-category`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public AddSubCategory(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-subcategory`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public UpdateCategory(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-category`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public UpdateSubCategory(formData) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}add-subcategory`, formData,{
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public getCatById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}category-data/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getSubCatById(id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}subcategory-data/` + id,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

  public getCounts() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}get-counts`,
    {
      headers: headers
    })
      .pipe(map(users => {
        console.log(users);
        return users;
      }));
  }

}
