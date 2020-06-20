import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import {  } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courses: Course[]
  filteredCourses: Course[]

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(
      data => {
        this.courses = data
        this.courses.sort((a,b)=> a.name.localeCompare(b.name))
        this.filteredCourses = this.courses
      }
    )
  }

  filterCourse(searchText: string) {
    let tempCourses = this.courses
    if(searchText !== "")
    {
      this.filteredCourses = tempCourses.filter(a => a.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
    }
    else
    {
      this.filteredCourses = tempCourses
    }
  }
}
