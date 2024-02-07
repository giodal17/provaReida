import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccessService } from '../services/access.service';
import { AccessJson } from '../models/accessJson';
import { LoadingService } from '../services/loading.service';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'reidaSatWeb';
  form: FormGroup;
  numTentativi: number = -1;
  varStorageNumTentativi: string | null = '';
  success = false;
  access = false;
  idAccesso = "";
  intruder = false;
    
  constructor(public fb: FormBuilder, public loader: LoadingService, public firebaseDb: FirebaseService) {
    this.form = this.fb.group({
      risposta: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    this.firebaseDb.getAccess().subscribe((res) => {
      this.access = res[0]
      this.idAccesso = res[1]
      this.numTentativi = res[2]
      this.success = res[3]

      if (!this.access && this.idAccesso === "") {
        console.log("primo accesso");
        this.updateFirstAccess();
        return;      
      }
      
      if(this.access && this.idAccesso != ""){
        //implementare quando deve controllare la sessione e intruder
      }

    if(this.idAccesso == "-1"){
      this.numTentativi = 0;
      this.intruder = true;
    }
 
    });
  }

  decreaseNumTentativi(){
    if(this.numTentativi != 0){
      }
      const json: AccessJson = {
      access: true,
      id: this.idAccesso,
      nTentativi: this.numTentativi,
      success: false
    };
    return this.firebaseDb.updateAccess(json);
   
    }

  onSubmit(form: FormGroup) {
    if (form.value.risposta) {
      let risposta: string = form.value.risposta;
      this.firebaseDb.getAccess().subscribe(res => {
        this.access = res[0]
        this.idAccesso = res[1]
        this.numTentativi = res[2]
        this.success = res[3]  
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
        this.firebaseDb.updateAccess(json).then(()=> {
          this.ngOnInit() 
             return;
        })      
      }
      this.decreaseNumTentativi().then(() => {
      form.reset()})
    })
      
    }
    }
  

  updateFirstAccess() {
    const json: AccessJson = {
      access: true,
      id: Math.round(Math.random() * 1000000) + '',
      nTentativi: 3,
      success: false
    };
    this.idAccesso = json.id + "";
    localStorage.setItem("idAccesso", this.idAccesso);
    this.firebaseDb.updateAccess(json).then(res => console.log(res))
  }

  resetAccess() {
    this.numTentativi = 3;
    this.success = false;
    this.form.controls['risposta'].reset();
    const json: AccessJson = {
      access: false,
      id: "",
      nTentativi: 3,
      success: false
    };
    this.firebaseDb.updateAccess(json).then(() => { 
      localStorage.clear();
      this.ngOnInit();
      this.intruder = false;
    });
  }

}
