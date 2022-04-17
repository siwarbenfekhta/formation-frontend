import {Organisme} from "../models/organisme.model"
import { Pays } from "./Pays.model";
import { Profil } from "./Profil.model";


export class Participant {
    nom : string ;
    prenom : string ;
    email : string ;
    tel : number ;
    organisme : Organisme ;
    pays : Pays ;
    profil : Profil ;
}