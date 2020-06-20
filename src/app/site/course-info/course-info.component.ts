import { Component, OnInit, Input } from '@angular/core';
import { Course } from 'src/app/models/course';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {

  @Input('courseDetail') courseInfo : Course

  constructor() { }

  ngOnInit(): void {
  }

  openLink(url: string) {
    window.open(url, "_blank");
  }

}
