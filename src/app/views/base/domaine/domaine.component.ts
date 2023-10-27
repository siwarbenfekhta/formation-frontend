import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Domaine } from 'src/app/shared/models/domaine.model';
import { DomaineService } from '../../../shared/services/domaine.service';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "../tableUtil";

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: 'success' });
}
@Component({
  selector: 'app-domaine',
  templateUrl: './domaine.component.html',
  styleUrls: ['./domaine.component.scss']
})
export class DomaineComponent implements OnInit {

  domaines: Domaine[];
  modalRef: BsModalRef;
  form: FormGroup;

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['select','id', 'libelle', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<Domaine>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checked: string;
  domaine: any;
  list: any=[];
  res: Domaine;
  constructor(private domaineService: DomaineService,
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
    this.domaineService.getAll()
      .subscribe((domaines) => {
        this.domaines = domaines.reverse();
        this.dataSource = new MatTableDataSource(this.domaines);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(domaines);
        return domaines;

      });
  }
  deleteThisUser(id) {
    console.log(id);
    this.domaineService.deleteDomaine(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("Domaine deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
    const libelle = this.form.get('libelle').value;
    const domaine = {
      libelle: libelle,
    };
    this.domaineService.createDomaine(domaine).subscribe(res => {
      console.log("ok");
      this.getAll();
      this._snackBar.open("Domaine added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.modalRef.hide();
      this.form.reset();
    })
  }

  editThisUser(id) {
    localStorage.setItem('id', id);
    console.log(id);
    console.log("got it");
    this.domaineService.getDomaineById(id).subscribe((data: any) => {
      this.domaine = data;
      this.form.get('libelle').setValue(data.libelle);
    });

  }
  updateUser() {
    const id = localStorage.getItem('id');
    const domaine = {
      id: id,
      libelle: this.form.value.libelle,
    }
    console.log(domaine);
    this.domaineService.updateDomaine(domaine).subscribe(res => {
      this._snackBar.open("Domaine updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }

  checkAllCheckBox(ev: any) { // Angular 13
		this.domaines.forEach(x => x.checked = ev.target.checked)
	}

	isAllCheckBoxChecked() {
		return this.domaines.every(p => p.checked);
	}

  deleteProducts(): void {
		const selectedProducts = this.domaines.filter(domaine => domaine.checked).map(p => p.id);
    if (selectedProducts.length == 0){
      this._snackBar.open("Select a least one domaine", 'x', { duration: 2000, panelClass: ["snack-style"] });

    }
		console.log (selectedProducts);
		for (let i=0 ; i<selectedProducts.length ; i++){
      this.domaineService.getDomaineById(selectedProducts[i]).subscribe(res => {
        this.list.push(res) ;
        this.domaineService.deleteDomaines(this.list).subscribe(res =>{
          console.log(res);
          this._snackBar.open("Domaines deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
          this.getAll();
        })
        
      })

      
      
    }
		
	}
}
