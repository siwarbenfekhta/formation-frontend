import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Formateur } from 'src/app/shared/models/formateur.model';
import { FormateurService } from '../../../shared/services/formateur.service';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { OrgansimeService } from 'src/app/shared/services/organisme.service';
import { Organisme } from 'src/app/shared/models/organisme.model';
@Component({
  selector: 'app-formateur',
  templateUrl: './formateur.component.html',
  styleUrls: ['./formateur.component.scss']
})
export class FormateurComponent implements OnInit {
  selectedFW = new FormControl();
  types: string[] = ['NATIONAL', 'INTERNATIONAL'];
  formateurs: Formateur[];
  modalRef: BsModalRef;
  form: FormGroup;


  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'type', 'tel', 'organisme', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<Formateur>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  formateur: any;
  selectedOrganisme: any;
  organismes: Organisme[];
  constructor(private formateurService: FormateurService,
    private modalService: BsModalService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private organismeService: OrgansimeService,) {
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
    this.getAll();
    this.form = this._formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      type: ['', Validators.required],
      email: ['', Validators.required],
      tel: ['', Validators.required],
    });

    console.log(this.form);
  }



  getAll() {
    this.formateurService.getAll()
      .subscribe((formateurs) => {
        this.formateurs = formateurs.reverse();
        this.dataSource = new MatTableDataSource(this.formateurs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(formateurs);
        return formateurs;

      });
  }
  getOrganisme() {
    this.organismeService.getAll()
      .subscribe((organismes) => {
        this.organismes = organismes;
        return organismes;

      });
  }

  deleteThisUser(id) {
    console.log(id);
    this.formateurService.deleteformateur(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("formateur deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    const nom = this.form.get('nom').value;
    const prenom = this.form.get('prenom').value;
    const type = this.form.get('type').value;
    const email = this.form.get('email').value;
    const tel = this.form.get('tel').value;

    const formateur = {
      nom: nom,
      prenom: prenom,
      type: type,
      email: email,
      tel: tel,
      organisme: this.selectedOrganisme
    };
    this.formateurService.createformateur(formateur).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("formateur added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    console.log(id);
    console.log("got it");
    this.formateurService.getformateurById(id).subscribe((data: any) => {
      this.formateur = data;
      this.form.get('nom').setValue(data.nom);
      this.form.get('prenom').setValue(data.prenom);
      this.form.get('email').setValue(data.email);
      this.form.get('type').setValue(data.type);
      this.form.get('tel').setValue(data.tel);

    });

  }
  updateUser() {
    const id = localStorage.getItem('id');
    const formateur = {
      id: id,
      nom: this.form.value.nom,
      prenom: this.form.value.prenom,
      type: this.form.value.type,
      email: this.form.value.email,
      tel: this.form.value.tel,
      organisme: this.selectedOrganisme
    }
    console.log(formateur);
    this.formateurService.updateformateur(formateur).subscribe(res => {
      this._snackBar.open("formateur updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
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
    this.selectedOrganisme = value.value;
  }

}
