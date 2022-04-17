import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Participant } from '../models/participant.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  participants: Participant[];

  constructor(private http: HttpClient) {
  }


  getAll() {
    return this.http.get<Participant[]>(`${AppConfig.participantUrl}/`);
  }
  getparticipantById(id) {

    return this.http.get<Participant>(`${AppConfig.participantUrl}/${id}`);
  }
  createparticipant(participant): any {
    return this.http.post<Participant>(`${AppConfig.participantUrl}/`, participant);
  }
  updateparticipant(participant) {

    return this.http.put<Participant>(`${AppConfig.participantUrl}/`, participant);
  }

  deleteparticipant(id) {
    return this.http.delete<Participant>(`${AppConfig.participantUrl}/${id}`);
  }




}

