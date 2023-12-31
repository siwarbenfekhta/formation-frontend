import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Subject } from 'rxjs';
import { Organisme } from '../models/organisme.model';
@Injectable({
    providedIn: 'root'
})
export class OrgansimeService {
    Organismes: Organisme[];

    constructor(private http: HttpClient) {
    }


    getAll() {
        return this.http.get<Organisme[]>(`${AppConfig.organismeUrl}/`);
    }
    getOrganismeById(id) {

        return this.http.get<Organisme>(`${AppConfig.organismeUrl}/${id}`);
    }
    createOrganisme(Organisme): any {
        return this.http.post<Organisme>(`${AppConfig.organismeUrl}/`, Organisme);
    }
    updateOrganisme(Organisme) {

        return this.http.put<Organisme>(`${AppConfig.organismeUrl}/`, Organisme);
    }

    deleteOrganisme(id) {
        return this.http.delete<Organisme>(`${AppConfig.organismeUrl}/${id}`);
    }
    deleteOrganismes(organisme) {
        console.log(organisme) ;
        const options = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}),
			responseType: 'text' as 'json'
		};
        return this.http.post<Organisme>(`${AppConfig.organismeUrl}/delete` , organisme , options);
        
    }



}

