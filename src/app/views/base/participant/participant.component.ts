import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Participant } from 'src/app/shared/models/participant.model';
import { ParticipantService } from '../../../shared/services/participant.service';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { OrgansimeService } from 'src/app/shared/services/organisme.service';
import { Organisme } from 'src/app/shared/models/organisme.model';
import { PaysService } from 'src/app/shared/services/pays.service';
import { ProfilService } from 'src/app/shared/services/profil.service';
import { Pays } from 'src/app/shared/models/Pays.model';
import { Profil } from 'src/app/shared/models/Profil.model';
@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit {
  selectedFW = new FormControl();
  participants: Participant[] = [];
  modalRef: BsModalRef;
  form: FormGroup;


  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'tel','type', 'organisme', 'pays', 'profil', 'modifier', 'supprimer'];
  types : string[] = ['NATIONAL' , 'INTERNATIONAL'] ;
  dataSource: MatTableDataSource<Participant>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  participant: any;
  selectedOrganisme: any = null;
  organismes: Organisme[];
  pays: Pays[];
  profils: Profil[];
  selectedProfil: any;
  selectedPays: any = null;
  selectedType: any;
  showOrg: boolean = false;
  showPays: boolean = false;
  org: any;
  payss: any;
  profil: any;
  constructor(private participantService: ParticipantService,
    private modalService: BsModalService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private organismeService: OrgansimeService,
    private paysService: PaysService,
    private profilService: ProfilService) {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.getOrganisme();
    this.getPays();
    this.getProfil();
    this.getAll();
    this.form = this._formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      tel: ['', Validators.required],
      type: [''],
      organisme: [''],
      pays: [''],
      profil: [''],
    });
  }



  getAll() {
    this.participantService.getAll()
      .subscribe((participants) => {
        for (let i=0 ; i< participants.length ; i++){
          if (participants[i].organisme == null)
          {participants[i].organisme = {id : 0 , libelle : " "} ;
          this.participants.push(participants[i]) ;}
        
        else if (participants[i].pays == null)
        {participants[i].pays = {id : 0 , libelle : " "} ;
        this.participants.push(participants[i]) ;}
        else {
          this.participants.push(participants[i]);
        }
      }
        this.participants = this.participants.reverse();
        this.dataSource = new MatTableDataSource(this.participants);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.participants);
        return this.participants;

      });
  }
  getOrganisme() {
    this.organismeService.getAll()
      .subscribe((organismes) => {
        this.organismes = organismes;
        return organismes;

      });
  }
  getPays() {
    this.paysService.getAll()
      .subscribe((pays) => {
        this.pays = pays;
        return pays;

      });
  }
  getProfil() {
    this.profilService.getAll()
      .subscribe((profils) => {
        this.profils = profils;
        return profils;

      });
  }

  deleteThisUser(id) {
    console.log(id);
    this.participantService.deleteparticipant(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("participant deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    const nom = this.form.get('nom').value;
    const prenom = this.form.get('prenom').value;
    const email = this.form.get('email').value;
    const tel = this.form.get('tel').value;
    
    const participant = {
      nom: nom,
      prenom: prenom,
      email: email,
      tel: tel,
      type: this.selectedType,
      organisme: this.selectedOrganisme,
      pays: this.selectedPays,
      profil: this.selectedProfil,
    };
    this.participantService.createparticipant(participant).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("participant added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
      this.selectedOrganisme = null ;
      this.selectedPays = null ;
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    
    this.participantService.getparticipantById(id).subscribe((data: any) => {
      this.participant = data;
        this.form.get('nom').setValue(data.nom);
        this.form.get('prenom').setValue(data.prenom);
        this.form.get('email').setValue(data.email);
        this.form.get('tel').setValue(data.tel);
        this.form.get('type').setValue(data.type);
        this.form.get('organisme').setValue(data.organisme);
        this.form.get('pays').setValue(data.pays);
        this.form.get('profil').setValue(data.profil);


    });
    console.log(this.form);

  }
  updateUser() {
    const id = localStorage.getItem('id');
    if(this.selectedOrganisme == null){
      this.selectedOrganisme = this.form.value.organisme
    }
    if(this.selectedPays == null){
      this.selectedPays = this.form.value.pays;
    }
    if(this.selectedProfil == null){
      this.selectedProfil = this.form.value.profil
    }
    console.log(this.form);
    const participant = {
      id: id,
      nom: this.form.value.nom,
      prenom: this.form.value.prenom,
      email: this.form.value.email,
      tel: this.form.value.tel,
      organisme: this.selectedOrganisme,
      pays: this.selectedPays,
      profil: this.selectedProfil,
      type : this.form.value.type 
    }
    console.log(participant);
    this.participantService.updateparticipant(participant).subscribe(res => {
      this._snackBar.open("participant updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.selectedOrganisme = null ;
      this.selectedPays = null ;
      this.selectedProfil = null;
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }
  onSelectEvent0(value: any) {
    console.log(value.value);
    this.selectedType = value.value;
    if(this.selectedType == 'NATIONAL'){
      this.showPays = false ;
      this.showOrg = true ;
    }
    else {
      this.showOrg = false ;
      this.showPays = true ;
    }
  }
  onSelectEvent(value: any) {
    console.log(value.value);
    this.selectedOrganisme = value.value;
  }
  onSelectEvent2(value: any) {
    console.log(value.value);
    this.selectedProfil = value.value;
  }
  onSelectEvent3(value: any) {
    console.log(value.value);
    this.selectedPays = value.value;
  }

  clear(){
    this.showPays = false ;
    this.showOrg = false ;
  }
}
