import { AuthC, PersonaC } from '../persona-profile/persona';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FunctionsService } from 'src/app/core/services/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  ventana;

  constructor(private fb: FormBuilder, private router: Router, private fun: FunctionsService) {}

  ngOnInit(): void {
    this.createForm();

    this.fun.getWindowSize.subscribe((res) => {
      if (res) this.ventana = res.innerWidth;
    });
  }

  createForm() {
    this.form = this.fb.group({
      usuario: 'admin',
      password: '1234567',
    });
  }

  login() {
    const obj_form = this.form.value;
    const extra = { afterPath: 'sign_in' };

    new AuthC().createOne(obj_form, extra).then(
      (res) => {
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        console.error(err);
      },
    );
  }
}
