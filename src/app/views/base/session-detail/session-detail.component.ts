import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Participant } from 'src/app/shared/models/participant.model';
import { ParticipantService } from '../../../shared/services/participant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { Organisme } from 'src/app/shared/models/organisme.model';
import { Pays } from 'src/app/shared/models/Pays.model';
import { Profil } from 'src/app/shared/models/Profil.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { Session } from 'src/app/shared/models/session.model';
@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit {
  selectedFW = new FormControl();
  participants: Participant[] = [];
  modalRef: BsModalRef;
  form: FormGroup;


  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'tel', 'type', 'organisme', 'pays', 'profil'];
  types: string[] = ['NATIONAL', 'INTERNATIONAL'];
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
  session: Session;
  constructor(private participantService: ParticipantService,
    private modalService: BsModalService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private sessionservice: SessionService) {
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
  }



  getAll() {
    this.route.params
      .subscribe(params => {
        this.sessionservice.getSessionById(params.id).subscribe((res) => {
          for (let i = 0; i < res.participants.length; i++) {
            if (res.participants[i].organisme == null) {
              res.participants[i].organisme = { id: 0, libelle: " " };
              this.participants.push(res.participants[i]);
            }
            else if (res.participants[i].pays == null) {
              res.participants[i].pays = { id: 0, libelle: " " };
              this.participants.push(res.participants[i]);
            }
            else {
              this.participants.push(res.participants[i]);
            }
          }
          this.dataSource = new MatTableDataSource(this.participants);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.participants);
          return this.participants;

        });

      });
  }



  openSnackBar() {
    this._snackBar.open("participant deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }




  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }



}
