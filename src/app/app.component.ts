import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccessService } from '../services/access.service';
import { AccessJson } from '../models/accessJson';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  varPassAdmin = "17022001"
  title = 'reidaSatWeb';
  form: FormGroup;
  numTentativi: number = -1;
  varStorageNumTentativi: string | null = '';
  success = false;
  access = false;
  idAccesso = "";
  idOggettoDbRest = "";
  intruder = false;
  loading$ = this.loader.loading$;  //collegamento con la variabile del servizio
  constructor(public fb: FormBuilder, private service: AccessService, public loader: LoadingService) {
    this.form = this.fb.group({
      risposta: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    // this.success = localStorage.getItem("success") == "true";

    // if(this.success){
    //   this.numTentativi = 0;
    // }
    this.service.getAccess().subscribe((res) => {
      this.access = res[0].access;
      this.idAccesso = res[0].id;
      this.idOggettoDbRest = res[0]._id;
      this.numTentativi = res[0].nTentativi;
      this.success = res[0].success;

      if (!this.access && this.idAccesso === "") {
        this.updateFirstAccess();
        // this.checkTentativi();
        return;      
      }
      
      if(this.access && this.idAccesso != ""){
        //implementare quando deve controllare la sessione e intruder
      }

    
    // if (this.idAccesso === localStorage.getItem("idAccess")) {
    //     this.checkTentativi();
    //     return;
    // }

    if(this.idAccesso == "-1"){
      this.numTentativi = 0;
      this.intruder = true;
    }
    // localStorage.setItem("idAccess", "-1")
    // localStorage.setItem('numTentativi', '0');
    // localStorage.setItem('success', 'false');
    
    });
  }

  checkTentativi(){
    
    // if (isNaN(this.getNumTentativifromStorage())) {
    //       localStorage.setItem('numTentativi', '3');
    //     }
    //     this.success = localStorage.getItem('success') === 'true';
    //     this.numTentativi = this.getNumTentativifromStorage();
  }
  decreaseNumTentativi(){
    if(this.numTentativi != 0){
        this.numTentativi--;
      }
      const json: AccessJson = {
      access: true,
      id: this.idAccesso,
      nTentativi: this.numTentativi,
      success: false
    };
    return this.service.updateAccess(this.idOggettoDbRest, json);
    }

  onSubmit(form: FormGroup) {
    if (form.value.risposta) {
      let risposta: string = form.value.risposta;
      this.service.getAccess().subscribe(res => {
        this.access = res[0].access;
        this.idAccesso = res[0].id;
        this.idOggettoDbRest = res[0]._id;
        this.numTentativi = res[0].nTentativi;
        this.success = res[0].success;  
        this.numTentativi--;
        if(this.numTentativi < 0){
        this.intruder = true;
        return;
      }
      if (risposta.toLowerCase() == 'reida') {
        const json: AccessJson = {
          access: true,
          id: this.idAccesso,
          nTentativi: 0,
          success: true
        };
        this.service.updateAccess(this.idOggettoDbRest, json).subscribe({
          next: () =>{ this.ngOnInit() 
             return;}
        }
        );
      
      }
    })
      
    this.decreaseNumTentativi().subscribe({next: () => {
      form.reset()}})}
    }
  

  // getNumTentativifromStorage() {
  //   this.varStorageNumTentativi = localStorage.getItem('numTentativi');
  //   return parseInt(this.varStorageNumTentativi!);
  // }
  // setNumTentativiInStorage() {
  //   this.varStorageNumTentativi = this.numTentativi.toString();
  //   localStorage.setItem('numTentativi', this.varStorageNumTentativi);
  // }
  updateFirstAccess() {
    const json: AccessJson = {
      access: true,
      id: Math.round(Math.random() * 1000000) + '',
      nTentativi: 3,
      success: false
    };
    this.idAccesso = json.id + "";
    localStorage.setItem("idAccesso", this.idAccesso)
    this.service.updateAccess(this.idOggettoDbRest, json).subscribe(console.log);
  }

  resetAccess() {
    this.numTentativi = 3;
    this.success = false;
    // localStorage.setItem("success", "false");
    // localStorage.setItem("idAccess", "");
    this.form.controls['risposta'].reset();
    //this.setNumTentativiInStorage();
    const json: AccessJson = {
      access: false,
      id: "",
      nTentativi: 3,
      success: false
    };
    this.service.updateAccess(this.idOggettoDbRest,json).subscribe({ next: () => { 
      localStorage.clear();
      this.ngOnInit();
      this.intruder = false;
    }});
  }

}
