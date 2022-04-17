import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class UserService {
    users: User[];

    constructor(private http: HttpClient) {
    }


    getAll() {
        return this.http.get<User[]>(`${AppConfig.baseUrl}/`);
    }
    getUserById(id) {

        return this.http.get<User>(`${AppConfig.baseUrl}/${id}`);
    }
    createUser(user): any {
        return this.http.post<User>(`${AppConfig.baseUrl}/`, user);
    }
    updateUser(user) {

        return this.http.put<User>(`${AppConfig.baseUrl}/`, user);
    }
    deleteUser(id) {
        return this.http.delete<User>(`${AppConfig.baseUrl}/${id}`);
    }




}

