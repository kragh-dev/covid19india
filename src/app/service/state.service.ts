import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  stateRef: AngularFireObject<State>

  constructor(private db: AngularFireDatabase) { }

  getStateData(stateCode: string):Observable<any> {
    return this.db.object('states').valueChanges()
  }
}
