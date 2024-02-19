import { Component } from '@angular/core';
import { AccessJson } from '../../../models/accessJson';
import { AccessService } from '../../../services/access.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  idOggettoDbRest: string = '';
  form: FormGroup;
  constructor(private service: AccessService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      risposta: ['', [Validators.required]],
      nTentativi: ['', [Validators.required]],

    });
    service.getAccess().subscribe((res) => {
      this.idOggettoDbRest = res[0]._id;
      console.log(res);
    });
  }
  resetAccess(form:any) {
    console.log(form.value.risposta);
    
    const json: AccessJson = {
      access: false,
      id: '',
      nTentativi: form.value.nTentativi,
      success: false,
      _id: this.idOggettoDbRest,
      risposta: form.value.risposta
    };
    this.service
      .updateAccess(this.idOggettoDbRest, json)
      .subscribe({next: () => this.router.navigateByUrl('')});
  }
}
