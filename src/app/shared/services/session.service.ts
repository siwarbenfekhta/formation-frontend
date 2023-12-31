import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Session } from '../models/session.model';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SessionService {
    Domaines: Session[];

    constructor(private http: HttpClient) {
    }


    getAll() {
        return this.http.get<Session[]>(`${AppConfig.sessionurl}/`);
    }
    getSessionById(id) {

        return this.http.get<Session>(`${AppConfig.sessionurl}/${id}`);
    }
    createSession(Session): any {
        return this.http.post<Session>(`${AppConfig.sessionurl}/`, Session);
    }
    updateSession(Session) {

        return this.http.put<Session>(`${AppConfig.sessionurl}/`, Session);
    }

    deleteSession(id) {
        return this.http.delete<Session>(`${AppConfig.sessionurl}/${id}`);
    }
    deleteSessions(session) {
        console.log(session) ;
        const options = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}),
			responseType: 'text' as 'json'
		};
        return this.http.post<Session>(`${AppConfig.sessionUrl}/delete` , session , options);
        
    }




}

