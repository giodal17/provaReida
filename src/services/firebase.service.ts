import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AccessJson } from '../models/accessJson';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase) { }

  getAccess(): Observable<any> {
   return this.db.list('item').valueChanges() as Observable<any>; //ritorna un array con solo i valori in ordine access, id, nTentativi, success

  }
  updateAccess(newData: AccessJson) {
  return this.db.object('item').update(newData);
  }
}
