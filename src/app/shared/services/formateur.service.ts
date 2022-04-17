import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Formateur } from '../models/formateur.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  formateurs: Formateur[];

  constructor(private http: HttpClient) {
  }


  getAll() {
    return this.http.get<Formateur[]>(`${AppConfig.formateurUrl}/`);
  }
  getformateurById(id) {

    return this.http.get<Formateur>(`${AppConfig.formateurUrl}/${id}`);
  }
  createformateur(formateur): any {
    return this.http.post<Formateur>(`${AppConfig.formateurUrl}/`, formateur);
  }
  updateformateur(formateur) {

    return this.http.put<Formateur>(`${AppConfig.formateurUrl}/`, formateur);
  }

  deleteformateur(id) {
    return this.http.delete<Formateur>(`${AppConfig.formateurUrl}/${id}`);
  }




}

