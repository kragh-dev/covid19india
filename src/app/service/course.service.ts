import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  coursesRef: Observable<any[]>;  

  constructor(private db: AngularFireDatabase) { } 

  getCourses():Observable<any[]> {
    return this.db.list('courseList').valueChanges()
  }
}
