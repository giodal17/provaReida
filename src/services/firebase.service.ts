import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AccessJson } from '../models/accessJson';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase) { }

  getAccess() {
    return this.db.list('item'); //ritorna un array con solo i valori in ordine access, id, nTentativi, success
  }
  updateAccess(newData: AccessJson) {
    // const newData = {
    //   nTentativi: 5
    // };
  return this.db.object('item').update(newData);
  }
}
