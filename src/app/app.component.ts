import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'reidaSatWeb';
  form: FormGroup;
  numTentativi:number = 0;
  varStorageNumTentativi: string | null= "";
  success = false;
  constructor(public fb: FormBuilder) {
    this.form = this.fb.group({
      risposta: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if(isNaN(this.getNumTentativifromStorage())){  
      localStorage.setItem("numTentativi", "3")
    }
    this.success = (localStorage.getItem("success") === 'true')
    this.numTentativi = this.getNumTentativifromStorage();
  }

  onSubmit(form: FormGroup) {
    if(form.value.risposta){
      let risposta: string = form.value.risposta
      if(risposta.toLowerCase() == "reida"){
        localStorage.setItem("numTentativi", "0");
        this.numTentativi = 0;
        localStorage.setItem("success", "true");
        this.success = true;
        return;
      }
      
    }
    this.numTentativi--;
    this.setNumTentativiInStorage();
    this.numTentativi = this.getNumTentativifromStorage();
    form.reset();
    }

    getNumTentativifromStorage(){
      this.varStorageNumTentativi = localStorage.getItem("numTentativi");
      return parseInt(this.varStorageNumTentativi!);
    }
    setNumTentativiInStorage(){
      this.varStorageNumTentativi = this.numTentativi.toString();
      localStorage.setItem("numTentativi", this.varStorageNumTentativi);
    }
}
