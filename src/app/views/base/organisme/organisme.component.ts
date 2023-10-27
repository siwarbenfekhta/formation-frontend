import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";
import { OrgansimeService } from "../../../shared/services/organisme.service";
import { Organisme } from '../../../shared/models/organisme.model';
export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: 'success' });
}
@Component({
  selector: 'app-organisme',
  templateUrl: './organisme.component.html',
  styleUrls: ['./organisme.component.scss']
})
export class OrganismeComponent implements OnInit {

  organismes: Organisme[];
  modalRef: BsModalRef;
  form: FormGroup;

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['select','id', 'libelle', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<Organisme>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  organisme: any;
  list: any[]=[];
  constructor(private organismeService: OrgansimeService,
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
    this.organismeService.getAll()
      .subscribe((organismes) => {
        this.organismes = organismes.reverse();
        this.dataSource = new MatTableDataSource(this.organismes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(organismes);
        return organismes;

      });
  }
  deleteThisUser(id) {
    console.log(id);
    this.organismeService.deleteOrganisme(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("organisme deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    const libelle = this.form.get('libelle').value;
    const organisme = {
      libelle: libelle,
    };
    this.organismeService.createOrganisme(organisme).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("organisme added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    console.log(id);
    console.log("got it");
    this.organismeService.getOrganismeById(id).subscribe((data: any) => {
      this.organisme = data;
      this.form.get('libelle').setValue(data.libelle);
    });

  }
  updateUser() {
    const id = localStorage.getItem('id');
    const organisme = {
      id: id,
      libelle: this.form.value.libelle,
    }
    console.log(organisme);
    this.organismeService.updateOrganisme(organisme).subscribe(res => {
      this._snackBar.open("organisme updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }
  checkAllCheckBox(ev: any) { // Angular 13
		this.organismes.forEach(x => x.checked = ev.target.checked)
	}

	isAllCheckBoxChecked() {
		return this.organismes.every(p => p.checked);
	}
  deleteProducts(): void {
		const selectedProducts = this.organismes.filter(organisme =>organisme.checked).map(p => p.id);
    if (selectedProducts.length == 0){
      this._snackBar.open("Select a least one organisme", 'x', { duration: 2000, panelClass: ["snack-style"] });

    }
		console.log (selectedProducts);
		for (let i=0 ; i<selectedProducts.length ; i++){
      this.organismeService.getOrganismeById(selectedProducts[i]).subscribe(res => {
        this.list.push(res) ;
        this.organismeService.deleteOrganismes(this.list).subscribe(res =>{
          console.log(res);
          this._snackBar.open("Organismes deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
          this.getAll();
        })
        
      })

      
      
    }
		
	}

}
