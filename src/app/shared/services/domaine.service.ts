import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Domaine } from '../models/domaine.model';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class DomaineService {
    Domaines: Domaine[];
    jwt = localStorage.getItem('token');

    httpOptions = {
        headers: new HttpHeaders( {'Authorization': "Bearer "+ this.jwt})
        };
    constructor(private http: HttpClient) {
    }
    
    getAll() {

        return this.http.get<Domaine[]>(`${AppConfig.domaineUrl}/` );
    }
    getDomaineById(id) {

        return this.http.get<Domaine>(`${AppConfig.domaineUrl}/${id}`);
    }
    createDomaine(Domaine): any {
        return this.http.post<Domaine>(`${AppConfig.domaineUrl}/`, Domaine);
    }
    updateDomaine(Domaine) {

        return this.http.put<Domaine>(`${AppConfig.domaineUrl}/`, Domaine);
    }

    deleteDomaine(id) {
        return this.http.delete<Domaine>(`${AppConfig.domaineUrl}/${id}`);
    }

    deleteDomaines(Domaine) {
        console.log(Domaine) ;
        const options = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}),
			responseType: 'text' as 'json'
		};
        return this.http.post<Domaine>(`${AppConfig.domaineUrl}/delete` , Domaine , options);
        
    }




}

