import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ProfilService } from '../../../shared/services/profil.service';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { Profil } from 'src/app/shared/models/Profil.model';

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: 'success' });
}
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  profils: Profil[];
  modalRef: BsModalRef;
  form: FormGroup;

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['id', 'libelle', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<Profil>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  profil: any;
  constructor(private profilService: ProfilService,
    private modalService: BsModalService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router) {
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
    this.form = this._formBuilder.group({
      libelle: ['', Validators.required],
    });

    console.log(this.form);
  }
  getAll() {
    this.profilService.getAll()
      .subscribe((profils) => {
        this.profils = profils.reverse();
        this.dataSource = new MatTableDataSource(this.profils);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(profils);
        return profils;

      });
  }
  deleteThisUser(id) {
    console.log(id);
    this.profilService.deleteProfil(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("profil deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    const libelle = this.form.get('libelle').value;
    const profil = {
      libelle: libelle,
    };
    this.profilService.createProfil(profil).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("profil added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    console.log(id);
    console.log("got it");
    this.profilService.getProfilById(id).subscribe((data: any) => {
      this.profil = data;
      this.form.get('libelle').setValue(data.libelle);
    });

  }
  updateUser() {
    const id = localStorage.getItem('id');
    const profil = {
      id: id,
      libelle: this.form.value.libelle,
    }
    console.log(profil);
    this.profilService.updateProfil(profil).subscribe(res => {
      this._snackBar.open("profil updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }

}
