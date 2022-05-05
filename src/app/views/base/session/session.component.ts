import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { SessionService } from 'src/app/shared/services/session.service';
import { OrgansimeService } from 'src/app/shared/services/organisme.service';

import { Session } from 'src/app/shared/models/session.model';
import { Organisme } from 'src/app/shared/models/organisme.model';
import { Formation } from 'src/app/shared/models/formation.model';
import { Formateur } from 'src/app/shared/models/formateur.model';

import * as Leaflet from 'leaflet';
import { Geodecoded } from 'src/app/shared/models/geodecoded.model';

import { Loader } from '@googlemaps/js-api-loader';
import { HttpClient } from '@angular/common/http';
import { FormationService } from 'src/app/shared/services/formation.service';
import { FormateurService } from 'src/app/shared/services/formateur.service';
import * as moment from 'moment';
import { Participant } from 'src/app/shared/models/participant.model';
import { ParticipantService } from 'src/app/shared/services/participant.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})

export class SessionComponent implements OnInit, AfterViewInit, OnDestroy {
  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    center: new Leaflet.LatLng(36.86130790533751, 10.18887519836426)
  };
  public multiFilterCtrl: FormControl = new FormControl();

  selected: any;
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

isInvalidDate = (m: moment.Moment) =>  {
  return this.invalidDates.some(d => d.isSame(m, 'day') )
}
  selectedFW = new FormControl();
  sessions: Session[];
  modalRef: BsModalRef;
  form: FormGroup;
  myGroup: FormGroup;
  organismes: Organisme[];
  formations: Formation[];
  formatuers: Formateur[];

  map: google.maps.Map;


  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['id', 'lieu', 'date_fin', 'nb_participant', 'organisme', 'formateur', 'formation', 'date_debut', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<Session>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  formation: any;
  dropdownSettings: any = {};
  closeDropdownSelection = false;
  disabled = false;
  selectedLevel: any;
  selectedOrganisme: any;
  selectedFormateur: any;
  selectedFormation: any;
  selectdeParticipants: any[];
  start_date: string;
  end_date: string;
  selectedItem: string[];
  cities: string[];
  lieu: String;
  participants: Participant[];
  constructor(private sessionservice: SessionService,
    private modalService: BsModalService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private organismeService: OrgansimeService,
    private formationsService: FormationService,
    private formateursService: FormateurService,
    private participantService: ParticipantService,

    private http: HttpClient
    ) {
      this.alwaysShowCalendars = true;

  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  onLocationSelected(event) {

    this.http.get<Geodecoded>('https://nominatim.openstreetmap.org/reverse.php?lat='+event.latlng.lat+'&lon='+event.latlng.lng+'&zoom=18&format=jsonv2', {responseType: 'json'})
    .subscribe(res=> {
      this.lieu = res.display_name;
    });
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
    
    this.getAll();
    this.getOrganismes();
    this.getFormateurs();
    this.getFormations();
    this.getParticipans();
    this.myGroup = new FormGroup({
      firstName: new FormControl()
  });
  
  
    this.form = this._formBuilder.group({
      lieu: ['', Validators.required],
      nb_participant: ['', Validators.required],
    });

    console.log(this.form);
  }

  getParticipans() {
    this.participantService.getAll()
      .subscribe((sessions) => {
        this.participants = sessions.reverse();
        this.dataSource = new MatTableDataSource(this.sessions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(sessions);
        return sessions;

      });
  }
  getFormations() {
    this.formationsService.getAll()
      .subscribe((sessions) => {
        this.formations = sessions.reverse();
        this.dataSource = new MatTableDataSource(this.sessions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        return sessions;

      });
  }

  getFormateurs() {
    this.formateursService.getAll()
      .subscribe((sessions) => {
        this.formatuers = sessions.reverse();
        this.dataSource = new MatTableDataSource(this.sessions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        return sessions;

      });
  }

  getOrganismes() {
    this.organismeService.getAll()
      .subscribe((sessions) => {
        this.organismes = sessions.reverse();
        this.dataSource = new MatTableDataSource(this.sessions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(sessions);
        return sessions;

      });
  }
  getAll() {
    this.sessionservice.getAll()
      .subscribe((sessions) => {
        this.sessions = sessions.reverse();
        this.dataSource = new MatTableDataSource(this.sessions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        return sessions;

      });
  }
  

  deleteThisUser(id) {
    this.sessionservice.deleteSession(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("session deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    
    const nb_participant = this.form.get('nb_participant').value;
   


    const session = {
      lieu : this.lieu,
      date_debut : this.start_date,
      date_fin : this.end_date,
      nb_partcipant : nb_participant,
      organisme : this.selectedOrganisme,
      formateur : this.selectedFormateur,
      formation : this.selectedFormation,
      participants : this.selectdeParticipants
  };
  console.log(session);
    this.sessionservice.createSession(session).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("session added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    
    this.sessionservice.getSessionById(id).subscribe((data: any) => {
      console.log(data);
      this.formation = data;
      this.form.get('lieu').setValue(data.lieu);
      this.form.get('nb_participant').setValue(data.nb_partcipant);
      this.selectedFormation = data.formation;
      
    });
    
  }
  
  updateUser() {
    const id = localStorage.getItem('id');
    const nb_participant = this.form.get('nb_participant').value;

    const session = {
      id: id,
      lieu : this.lieu,
      date_debut : this.start_date,
      date_fin : this.end_date,
      nb_partcipant : nb_participant,
      organisme : this.selectedOrganisme,
      formateur : this.selectedFormateur,
      formation : this.selectedFormation,
      participants : this.selectdeParticipants
  };
    this.sessionservice.updateSession(session).subscribe(res => {
      this._snackBar.open("session updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }
  onSelectFormateur(value: any) {
    console.log(value.value);
    this.selectedFormateur = value.value;
  }

  onSelectFormation(value: any) {
    console.log(value.value);
    this.selectedFormation = value.value;
  }

  onSelectOrganisme(value: any) {
    this.selectedOrganisme = value.value;
  }

  onSelectParticipants(value: any) {
    this.selectdeParticipants = value.value;
  }

  dateRangeChange(value: any) {
    this.start_date = this.myDateFormatFunction(value[0]);
    this.end_date = this.myDateFormatFunction(value[0]);

  }

  myDateFormatFunction(inputDate) {
    let d = new Date(inputDate) // this might not be needed if the date is already a Date() object
    return  ('0' + d.getDate()).slice(-2)+ '/' + ('0' + (d.getMonth()+1)).slice(-2) + '/' + d.getFullYear(); // the zeroes and slice weirdness is to have nice padding, borrowed from https://stackoverflow.com/a/3605248/3158815
  }
}
export const getLayers = (): Leaflet.Layer[] => {
  return [
    new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    } as Leaflet.TileLayerOptions),
  ] as Leaflet.Layer[];
};


function takeUntil(_onDestroy: any): import("rxjs").OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.');
}

