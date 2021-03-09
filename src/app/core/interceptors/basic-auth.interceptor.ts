import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const currentUser = this.authenticationService.currentUserValue;
        const currentAdminUser = this.authenticationService.currentAdminValue;
        // if (currentUser && currentUser.access_token) {
        //     request = request.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${currentUser.access_token}`
        //         }
        //     });
        //     return next.handle(request);
        // }
        console.log("start base auth");
        console.log(currentAdminUser);
        if(currentAdminUser && currentAdminUser['data'].token){
            console.log("inside base auth");
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentAdminUser['data'].token}`
                }
            });
            return next.handle(request);
        }

        return next.handle(request);
    }
}
