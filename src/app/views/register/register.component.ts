import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) { }

  onSignup() {
    const username = this.registerForm.get('username').value;
    const password = this.registerForm.get('password').value;
    const user = {
      username : username ,
      password : password
    }
    this.authService.onSignup(user).subscribe(res => {
      console.log(res);
      this.openSnackBar();
      this.router.navigate(['/login']);
    })

  }
  openSnackBar() {
    this._snackBar.open("Vous etes inscris avec succès", 'x', { duration: 2000, panelClass: ["snack-style"] });
  }

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.pattern('^(?=.*[*.!@$%()&#])(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9*.!@$%()&#]+$'), Validators.required, Validators.minLength(5)])],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
    });

  }

}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { 'passwordsNotMatching': true };



};
