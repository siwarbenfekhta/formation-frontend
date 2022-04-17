import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { PaysService } from '../../../shared/services/pays.service';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { Pays } from 'src/app/shared/models/Pays.model';

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: 'success' });
}
@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.scss']
})
export class PaysComponent implements OnInit {

  payss: Pays[];
  modalRef: BsModalRef;
  form: FormGroup;

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['id', 'libelle', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<Pays>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  pays: any;
  constructor(private paysService: PaysService,
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
    this.paysService.getAll()
      .subscribe((payss) => {
        this.payss = payss.reverse();
        this.dataSource = new MatTableDataSource(this.payss);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(payss);
        return payss;

      });
  }
  deleteThisUser(id) {
    console.log(id);
    this.paysService.deletePays(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("pays deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    const libelle = this.form.get('libelle').value;
    const pays = {
      libelle: libelle,
    };
    this.paysService.createPays(pays).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("pays added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    console.log(id);
    console.log("got it");
    this.paysService.getPaysById(id).subscribe((data: any) => {
      this.pays = data;
      this.form.get('libelle').setValue(data.libelle);
    });

  }
  updateUser() {
    const id = localStorage.getItem('id');
    const pays = {
      id: id,
      libelle: this.form.value.libelle,
    }
    console.log(pays);
    this.paysService.updatePays(pays).subscribe(res => {
      this._snackBar.open("pays updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }

}
