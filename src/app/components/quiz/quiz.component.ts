import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccessJson } from '../../../models/accessJson';
import { AccessService } from '../../../services/access.service';
import { FirebaseService } from '../../../services/firebase.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  // firestore: Firestore = inject(Firestore);
  varPassAdmin = '17022001';
  title = 'reidaSatWeb';
  form: FormGroup;
  numTentativi: number = -1;
  varStorageNumTentativi: string | null = '';
  success = false;
  access = false;
  idAccesso = '';
  idOggettoDbRest = '';
  intruder = false;
  isVisible: boolean = false;
  loading$ = this.loader.loading$; //collegamento con la variabile del servizio
  rispostaSbagliata: boolean = false;
  constructor(
    public fb: FormBuilder,
    private service: AccessService,
    public loader: LoadingService,
    public firebaseDb: FirebaseService
  ) {
    this.form = this.fb.group({
      risposta: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.service.getAccess().subscribe((res) => {
      this.access = res[0].access;
      this.idAccesso = res[0].id;
      this.idOggettoDbRest = res[0]._id;
      this.numTentativi = res[0].nTentativi;
      this.success = res[0].success;

      if (!this.access && this.idAccesso === '') {
        this.updateFirstAccess();
        return;
      }

      if (this.access && this.idAccesso != '') {
        //implementare quando deve controllare la sessione e intruder
      }

      if (this.idAccesso == '-1') {
        this.numTentativi = 0;
        this.intruder = true;
        this.isVisible = true;
      }
    });
  }

  decreaseNumTentativi() {
    if (this.numTentativi != 0) {
      this.numTentativi--;
    }
    const json: AccessJson = {
      access: true,
      id: this.idAccesso,
      nTentativi: this.numTentativi,
      success: false,
    };
    return this.service.updateAccess(this.idOggettoDbRest, json);
  }

  onSubmit(form: FormGroup) {
    console.log(form.value);
    
    if (form.value.risposta) {
      let risposta: string = form.value.risposta;
      this.service.getAccess().subscribe((res) => {
        this.access = res[0].access;
        this.idAccesso = res[0].id;
        this.idOggettoDbRest = res[0]._id;
        this.numTentativi = res[0].nTentativi;
        this.success = res[0].success;
        if(this.numTentativi == 0){
          this.ngOnInit();
          return;
        }

        if (risposta.toLowerCase() == 'reida') {
          this.rispostaSbagliata = false;
          this.success = true;
          const json: AccessJson = {
            access: true,
            id: this.idAccesso,
            nTentativi: 0,
            success: true,
          };
          this.service.updateAccess(this.idOggettoDbRest, json).subscribe({
            next: () => {
              this.ngOnInit();
            },
          });
          return;
        }

        this.rispostaSbagliata = true;

        if (risposta.toLowerCase() != 'reida' && this.numTentativi <= 0) {
          this.isVisible = true;
        }

        this.decreaseNumTentativi().subscribe({
          next: () => {
            form.reset();
          }
        });
      });
    }
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
      success: false,
    };
    this.idAccesso = json.id + '';
    localStorage.setItem('idAccesso', this.idAccesso);
    this.service
      .updateAccess(this.idOggettoDbRest, json)
      .subscribe(console.log);
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
      id: '',
      nTentativi: 3,
      success: false,
    };
    this.service.updateAccess(this.idOggettoDbRest, json).subscribe({
      next: () => {
        localStorage.clear();
        // this.intruder = false;
        this.rispostaSbagliata = false;
        this.isVisible = false;
        this.ngOnInit();
      },
    });
  }
}

