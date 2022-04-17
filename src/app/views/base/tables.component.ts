import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableUtil } from "./tableUtil";

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: 'success' });
}
@Component({
  templateUrl: 'tables.component.html',
  styleUrls: ['tables.component.css'],
})

export class TablesComponent implements OnInit {
  users: User[];
  modalRef: BsModalRef;
  form: FormGroup;

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  displayedColumns: string[] = ['Code','login', 'role', 'modifier', 'supprimer'];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user: any;
  roles: string[] = ['SIMPLEUSER', 'ADMIN'];
  checked : string;
  constructor(private userService: UserService,
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
      login: ['', Validators.required],
      password: ['', Validators.required],
      role: ['']
    });

    console.log(this.form);
  }
  getAll() {
    this.userService.getAll()
      .subscribe((users) => {
        this.users = users.reverse();
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(users);
        return users;

      });
  }
  deleteThisUser(id) {
    console.log(id);
    this.userService.deleteUser(id).subscribe({
      next: (res) => {
        this.getAll();
        this.openSnackBar();

      },
    });

  }
  openSnackBar() {
    this._snackBar.open("User deleted successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }
  OnCreateUser(): any {
      const login = this.form.get('login').value;
      const password = this.form.get('password').value;
      const role = localStorage.getItem('role');
      const user = {
        login: login,
        password: password,
        role: role
      };
      this.userService.createUser(user).subscribe(res => {
        console.log("ok");
        this.getAll();
        this._snackBar.open("User added successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
        this.modalRef.hide();
        this.form.reset();
      })
    }

  
  radioChange(role) {
    localStorage.setItem('role', role);
    console.log(role);
  }
  editThisUser(id) {
    localStorage.setItem('id', id);
    this.userService.getUserById(id).subscribe((data: any) => {
      this.user = data;
      this.form.get('login').setValue(data.login);
      this.form.get('password').setValue(data.password);
      this.form.get('role').setValue(data.role);
      this.checked = data.role ;
      console.log(this.checked);


    });

  }
  updateUser() {
    const code = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const user = {
      code: code,
      login: this.form.value.login,
      password: this.form.value.password,
      role : role
    }
    this.userService.updateUser(user).subscribe(res => {
      this._snackBar.open("User updated successfuly", 'x', { duration: 2000, panelClass: ["snack-style"] });
      this.form.reset();
      this.modalRef.hide();
      this.getAll();

    })

  }
  exportTable() {
    TableUtil.exportTableToExcel("ExampleMaterialTable");
  }
}






