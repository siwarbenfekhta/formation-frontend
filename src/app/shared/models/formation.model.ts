import {Domaine} from "../models/domaine.model"
export class Formation {
    titre : string ;
    annee : number ;
    nb_session : number ;
    duree : number ;
    budget : number ;
    type_formation : string ;
    domaine : Domaine ;
}