import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const TOKEN_HEADER_KEY = "Authorization"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let interceptRequest = true;
        let authReq = request;
        let token = localStorage.getItem('token');
        if (token != null) {
            authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, "Bearer " + token) });
        }
        return next.handle(authReq);
    }
}
export const AuthInterceptorPorviders = [
    {
        provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true 
    }
]


