import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Formation } from 'src/app/shared/models/formation.model';
import { FormationService } from '../../../shared/services/formation.service';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { DomaineService } from 'src/app/shared/services/domaine.service';
@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss']
})
export class FormationComponent implements OnInit {
  selectedFW = new FormControl();
  types: string[] = ['NATIONAL', 'INTERNATIONAL'];
  formations: Formation[];
  modalRef: BsModalRef;
  form: FormGroup;


  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['id', 'titre', 'type', 'budget', 'nb_session', 'domaine', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<Formation>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  formation: any;
  dropdownSettings: any = {};
  closeDropdownSelection = false;
  disabled = false;
  domaines: import("src/app/shared/models/domaine.model").Domaine[];
  selectedLevel: any;
  selectedDomaine: any;
  selectedType: any;
  selectedItem: string[];
  cities: string[];
  constructor(private formationService: FormationService,
    private modalService: BsModalService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private domaineService: DomaineService,) {
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
    this.getDomaines();
    this.getAll();
    this.form = this._formBuilder.group({
      titre: ['', Validators.required],
      budget: ['', Validators.required],
      nb_session: ['', Validators.required],
    });

    console.log(this.form);
  }



  getAll() {
    this.formationService.getAll()
      .subscribe((formations) => {
        this.formations = formations.reverse();
        this.dataSource = new MatTableDataSource(this.formations);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(formations);
        return formations;

      });
  }
  getDomaines() {
    this.domaineService.getAll()
      .subscribe((domaines) => {
        this.domaines = domaines;
        return domaines;

      });
  }

  deleteThisUser(id) {
    console.log(id);
    this.formationService.deleteformation(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("formation deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    const titre = this.form.get('titre').value;
    const budget = this.form.get('budget').value;
    const nb_session = this.form.get('nb_session').value;


    const formation = {
      titre: titre,
      budget: budget,
      nb_session: nb_session,
      domaine: this.selectedDomaine,
      type_formation: this.selectedType
    };
    this.formationService.createformation(formation).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("formation added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    console.log(id);
    console.log("got it");
    this.formationService.getformationById(id).subscribe((data: any) => {
      this.formation = data;
      this.form.get('titre').setValue(data.titre);
      this.form.get('budget').setValue(data.budget);
      this.form.get('nb_session').setValue(data.nb_session);
    });

  }
  updateUser() {
    const id = localStorage.getItem('id');
    const formation = {
      id: id,
      titre: this.form.value.titre,
      budget: this.form.value.budget,
      nb_session: this.form.value.nb_session,
      type_formation: this.selectedType,
      domaine: this.selectedDomaine
    }
    console.log(formation);
    this.formationService.updateformation(formation).subscribe(res => {
      this._snackBar.open("formation updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }
  onSelectEvent(value: any) {
    console.log(value.value);
    this.selectedDomaine = value.value;
  }
  onSelectEvent2(value: any) {
    console.log(value.value);
    this.selectedType = value.value;
  }
}
