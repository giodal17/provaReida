import { Component } from '@angular/core';
import { AccessJson } from '../../../models/accessJson';
import { AccessService } from '../../../services/access.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  idOggettoDbRest: string = '';
  constructor(private service: AccessService, private router: Router) {
    service.getAccess().subscribe((res) => {
      this.idOggettoDbRest = res[0]._id;
      console.log(res);
    });
  }
  resetAccess() {
    const json: AccessJson = {
      access: false,
      id: '',
      nTentativi: 3,
      success: false,
      _id: this.idOggettoDbRest,
    };
    this.service
      .updateAccess(this.idOggettoDbRest, json)
      .subscribe({next: () => this.router.navigateByUrl('')});
  }
}
