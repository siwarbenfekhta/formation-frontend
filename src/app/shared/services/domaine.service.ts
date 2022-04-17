import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Domaine } from '../models/domaine.model';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class DomaineService {
    Domaines: Domaine[];

    constructor(private http: HttpClient) {
    }


    getAll() {
        return this.http.get<Domaine[]>(`${AppConfig.domaineUrl}/`);
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




}

