import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'
// import { User } from '@app/_models';
import { User } from 'src/app/core/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private currentAdminSubject: BehaviorSubject<User>;
  public currentAdmin: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentAdminSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentAdmin')));
    this.currentAdmin = this.currentAdminSubject.asObservable();
   }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentAdminValue(): User {
    console.log(this.currentAdminSubject.value);
    return this.currentAdminSubject.value;
  }

  public login(username: string, password: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    // headers = headers.append('mode', 'no-cors')
    return this.http.post<any>(`${environment.apiUrl}api/konk-login`, {
      username,
      password,
      'grant_type': environment.grant_type,
      'client_id': environment.client_id,
      'client_secret': environment.client_secret,
      'scope': '*',
    }, {
      headers: headers
    })
      .pipe(map(user => {
        //console.log(user);
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        // user.authdata = window.btoa(username + ':' + password);
        console.log(user);
        user.authdata = user.access_token;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
        /*this.checkReadTermsConditions()
          .subscribe(
            response => {
              termsCondtionsStatus = response.terms;
              if (termsCondtionsStatus) {
              } else {
                console.log('Terms and Conditions not read');
              }
          });*/
      }));
  }

  /* Admin Login */
  public adminLogin(username: string, password: string) {
    console.log(username+' '+password);
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('mode', 'no-cors');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}login-user`, {
      'email':username,
      'password':password,
      'grant_type': environment.grant_type,
      'client_id': environment.client_id,
      'client_secret': environment.client_secret,
      'scope': '*',
    }, {
      headers: headers
    })
      .pipe(map(user => {
        console.log(user);
        user.access_token = user.access_token;
        localStorage.setItem('currentAdmin', JSON.stringify(user));
        this.currentAdminSubject.next(user);
        return user;
      }));
  }

  /**
   * checkReadTermsConditions
   */
  public checkReadTermsConditions(username) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(`${environment.apiUrl}/api/check-terms?username=${username}`, {
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  /**
   * updateReadTermsConsitions
   */
  public updateReadTermsConditions() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}/api/update-terms`, {
      headers: headers
    })
      .pipe(map(terms => {
        return terms;
      }));
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return true;
  }

  public adminLogout() {
    // remove admin from local storage to log user out
    localStorage.removeItem('currentAdmin');
    this.currentAdminSubject.next(null);
    return true;
  }

  // Forgot Password
  forgotPassword(emailid: string, usertype: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}/api/password/create`, {
      'email': emailid
    }, {
      headers: headers
    })
      .pipe(map(user => {
        //   console.log(user);
        // this.currentUserSubject.next(user);
        return user;
      }));
  }

  // Reset Password
  resetPassword(emailid: string, password: string, password_c: string, token: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(`${environment.apiUrl}/api/password/reset`, {
      'email': emailid,
      'password': password,
      'password_confirmation': password_c,
      'token': token
    }, {
      headers: headers
    })
      .pipe(map(result => {
        return result;
      }));
  }
}
