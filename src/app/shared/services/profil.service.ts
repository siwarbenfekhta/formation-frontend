import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Profil } from '../models/Profil.model';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ProfilService {
    Profils: Profil[];

    constructor(private http: HttpClient) {
    }


    getAll() {
        return this.http.get<Profil[]>(`${AppConfig.profilUrl}/`);
    }
    getProfilById(id) {

        return this.http.get<Profil>(`${AppConfig.profilUrl}/${id}`);
    }
    createProfil(Profil): any {
        return this.http.post<Profil>(`${AppConfig.profilUrl}/`, Profil);
    }
    updateProfil(Profil) {

        return this.http.put<Profil>(`${AppConfig.profilUrl}/`, Profil);
    }

    deleteProfil(id) {
        return this.http.delete<Profil>(`${AppConfig.profilUrl}/${id}`);
    }




}

