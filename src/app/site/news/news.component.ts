import { Component, OnInit, Input } from '@angular/core';
import { News } from 'src/app/models/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @Input('newsDetail') newsInfo : News  
  title: string
  source: string
  tempArray: string[]

  constructor() { }

  ngOnInit(): void {
    this.tempArray = this.newsInfo.title.split(' - ');
    this.title = this.tempArray[0]
    this.source = this.tempArray[1]
  }
}
