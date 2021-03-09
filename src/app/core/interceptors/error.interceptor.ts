import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authenticationService.logout();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: err.error.message,
                    timer: 3000,
                    // onClose: () => {
                    //     // auto logout if 401 response returned from api
                    //     location.reload(true);
                    // }
                });
            } else if (err.status === 422 || err.status === 400) {
                let messages = '<ul class="list-group">';
                if(typeof err.error.message === 'string'){
                    messages = messages +'<li class="text-left list-group-item list-group-item-danger"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + err.error.message + '</li>';
                }else{
                    for (let [key, value] of Object.entries(err.error.message)) {
                        if (Array.isArray(value)) {
                            for (let [key1, message] of Object.entries(value)) {
                                messages = messages +'<li class="text-left list-group-item list-group-item-danger"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + message + '</li>';
                            }
                        } /*else{
                            messages = value;
                        }*/
                    }
                }
                
                Swal.fire({
                    position: 'top-end',
                    toast: true,
                    padding: 0,
                    html: messages + '</ul>',
                    showConfirmButton: false,
                    timer: 5000
                  });
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}