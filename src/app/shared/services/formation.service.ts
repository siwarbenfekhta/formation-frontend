import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Subject } from 'rxjs';
import { Formation } from "../models/formation.model"
@Injectable({
    providedIn: 'root'
})
export class FormationService {
    formations: Formation[];

    constructor(private http: HttpClient) {
    }


    getAll() {
        return this.http.get<Formation[]>(`${AppConfig.formationUrl}/`);
    }
    getformationById(id) {

        return this.http.get<Formation>(`${AppConfig.formationUrl}/${id}`);
    }
    createformation(formation): any {
        return this.http.post<Formation>(`${AppConfig.formationUrl}/`, formation);
    }
    updateformation(formation) {

        return this.http.put<Formation>(`${AppConfig.formationUrl}/`, formation);
    }
    deleteformation(id) {
        return this.http.delete<Formation>(`${AppConfig.formationUrl}/${id}`);
    }

    getnbNat() {
        return this.http.get<number>(`${AppConfig.formationUrl}/nat`);
    }
    getnbIntern() {
        return this.http.get<number>(`${AppConfig.formationUrl}/intern`);
    }

    getVisit() {
        return this.http.get<[]>(`${AppConfig.formationUrl}/date`);
    }


}
