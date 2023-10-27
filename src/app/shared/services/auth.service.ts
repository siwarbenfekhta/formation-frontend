import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import {jwtRes} from '../models/jwtres.model'
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    users: User[];

    constructor(private http: HttpClient , private router : Router) {
    }

    onSignup(user){
        return this.http.post<jwtRes>(`${AppConfig.registerUrl}/`, user);
    }

    login(user): any {
        return this.http.post<jwtRes>(`${AppConfig.loginUrl}/`, user);

    }

    isAuthenticated(){
        return !!localStorage.getItem('token') ;
    }

    logout() {
        localStorage.clear();
        localStorage.removeItem('token');
        this.router.navigate(['login']);
    }





}

