import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Pays } from '../models/Pays.model';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class PaysService {
    Payss: Pays[];

    constructor(private http: HttpClient) {
    }


    getAll() {
        return this.http.get<Pays[]>(`${AppConfig.paysUrl}/`);
    }
    getPaysById(id) {

        return this.http.get<Pays>(`${AppConfig.paysUrl}/${id}`);
    }
    createPays(Pays): any {
        return this.http.post<Pays>(`${AppConfig.paysUrl}/`, Pays);
    }
    updatePays(Pays) {

        return this.http.put<Pays>(`${AppConfig.paysUrl}/`, Pays);
    }
    deletePays(id) {
        return this.http.delete<Pays>(`${AppConfig.paysUrl}/${id}`);
    }




}

