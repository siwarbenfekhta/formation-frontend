import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent  implements OnInit{
  form: FormGroup;
  constructor(private authService: AuthService , private _formBuilder: FormBuilder,
    private router : Router ){}
    ngOnInit() {
      this.form = this._formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
  
      console.log(this.form);
    }

  onSubmit(){
    const user = {
      username: this.form.value.username,
      password: this.form.value.password,
    }
    this.authService.login(user).subscribe(
      res => {
      console.log(res) ;
      localStorage.setItem('token' , res.accessToken);
      localStorage.setItem('role' , res.roles[0]);
      this.router.navigateByUrl('/dashboard')
      },
      error => {
        console.log(error);
      })
  }
 }
