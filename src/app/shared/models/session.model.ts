import {Domaine} from "../models/domaine.model"
import {Organisme} from "../models/organisme.model"
import {Formateur} from "../models/formateur.model"
import {Formation} from "../models/formation.model"
import {Participant} from "../models/participant.model"
export class Session {
    id : number ;
    lieu : string ;
    date_fin : string ;
    nb_partcipant : number ;
    organisme : Organisme ;
    formateur : Formateur ;
    formation : Formation ;
    participants : Participant[];
    date_debut: string;
    checked?: boolean;

}