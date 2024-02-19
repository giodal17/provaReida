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
  risposta: string = "";
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
      console.log(res);
      
      this.access = res[0].access;
      this.idAccesso = res[0].id;
      this.idOggettoDbRest = res[0]._id;
      this.numTentativi = res[0].nTentativi;
      this.success = res[0].success;
      this.risposta = res[0].risposta;

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
      _id: this.idOggettoDbRest,
      risposta: this.risposta
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

        if (risposta.toLowerCase() == this.risposta) {
          this.rispostaSbagliata = false;
          this.success = true;
          const json: AccessJson = {
            access: true,
            id: this.idAccesso,
            nTentativi: 0,
            success: true,
            _id: this.idOggettoDbRest,
            risposta: this.risposta
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

  updateFirstAccess() {
    const json: AccessJson = {
      access: true,
      id: Math.round(Math.random() * 1000000) + '',
      nTentativi: 3,
      success: false,
      _id: this.idOggettoDbRest,
      risposta: this.risposta
    };
    this.idAccesso = json.id + '';
    localStorage.setItem('idAccesso', this.idAccesso);
    this.service
      .updateAccess(this.idOggettoDbRest, json)
      .subscribe(console.log);
  }

  
}

